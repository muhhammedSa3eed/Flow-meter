"use client";

import { useState, useEffect } from "react";
import { format } from "sql-formatter";
import CodeMirror, { EditorState } from "@uiw/react-codemirror";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { githubLight } from "@uiw/codemirror-theme-github";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import { useTheme } from "next-themes";
import { sql } from "@codemirror/lang-sql";
import { autocompletion, CompletionContext } from "@codemirror/autocomplete";
import { placeholder } from "@codemirror/view";
import toast from "react-hot-toast";

import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DynamicTable from "../Data-Tables/DynamicTable";

import type { TableDataResponse } from "@/types";
import { LabQuerySaveSchema } from "@/schemas";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";

/** ====== Helpers ====== */

async function parseJSONSafe(res: Response) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    const snippet = text.slice(0, 300);
    throw new Error(`Invalid JSON response: ${snippet}`);
  }
}
async function fetchJSON(url: string, init?: RequestInit) {
  const res = await fetch(url, init);
  let data: any = null;
  try {
    data = await parseJSONSafe(res);
  } catch (e) {
    throw new Error(
      `Request failed to parse JSON. Status ${res.status}. ${
        (e as Error).message
      }`
    );
  }
  if (!res.ok) {
    const msg =
      (data && (data.error || data.message)) ||
      `HTTP ${res.status} ${res.statusText}`;
    throw new Error(msg);
  }
  return data;
}

function extractSchemaTable(sql: string): { schema?: string; table?: string } {
  const s = sql.replace(/\s+/g, " ");
  // FROM "schema"."table" | FROM schema.table | FROM "table" | FROM table
  const re = /from\s+((?:"?([\w]+)"?\.)?"?([\w]+)"?)/i;
  const m = s.match(re);
  if (!m) return {};
  const schema = m[2];
  const table = m[3];
  return { schema, table };
}

// هروب الأسماء المقتبسة
const qi = (s: string) => `"${String(s).replace(/"/g, '""')}"`;

/** ====== Component ====== */

type SqlEditorProps = {
  tables?: string[]; 
  selectedTables: string[]; 
  value: string; 
  ProjectId: number;
  selectedDatabase: number | null;
  selectedSchema: string | null;
  onRunResult?: (res: TableDataResponse | null) => void;
  onChange?: (code: string) => void;
};

export default function SqlEditor({
  tables = [],
  selectedTables,
  selectedDatabase,
  selectedSchema,
  value,
  ProjectId,
  onRunResult,
  onChange,
}: SqlEditorProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = resolvedTheme === "dark";

  const [error, setError] = useState<string | null>(null);
  const [height, setHeight] = useState(240);
  const [activeTab, setActiveTab] = useState<string>("result");

  const [code, setCode] = useState<string>(value ?? "");
  useEffect(() => setCode(value ?? ""), [value]);

  const [queryResult, setQueryResult] = useState<TableDataResponse | null>(
    null
  );

  const [tableDataByTable, setTableDataByTable] = useState<
    Record<string, TableDataResponse | "loading" | "error" | undefined>
  >({});

  const [lastRunMeta, setLastRunMeta] = useState<{
    query?: string;
    columnTypes?: Record<string, string>;
  } | null>(null);

  const tableCompletion = (context: CompletionContext) => {
    const word = context.matchBefore(/\w*/);
    if (!word || (word.from === word.to && !context.explicit)) return null;
    const options = (tables ?? []).map((t) => ({
      label: t,
      type: "keyword",
      info: "table",
    }));
    return { from: word.from, options };
  };
  const tableCompletionLangData = EditorState.languageData.of(() => [
    { autocomplete: tableCompletion },
  ]);

  /** ========= Preview Fetch ========= */
  useEffect(() => {
    if (!selectedDatabase || !selectedSchema || selectedTables.length === 0)
      return;

    selectedTables.forEach((table) => {
      if (tableDataByTable[table] === undefined) {
        setTableDataByTable((prev) => ({ ...prev, [table]: "loading" }));

        fetchJSON(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/DS/table-data?connectionId=${selectedDatabase}&schemaName=${selectedSchema}&tableName=${table}&limit=100&offset=0`
        )
          .then((data) => {
            const out: TableDataResponse = {
              fields:
                data?.fields ??
                data?.columns ??
                Object.keys(data?.data?.[0] || {}),
              data: data?.data ?? [],
              totalCount:
                data?.totalRows ?? data?.totalCount ?? data?.data?.length ?? 0,
              fieldsAndTypes: data?.fieldsAndTypes ?? data?.columnTypes ?? {},
              query:
                data?.query ??
                `SELECT * FROM ${qi(selectedSchema!)}.${qi(table)} LIMIT 100;`,
            } as any;

            setTableDataByTable((prev) => ({ ...prev, [table]: out }));
          })
          .catch((err) => {
            setTableDataByTable((prev) => ({ ...prev, [table]: "error" }));
            toast.error(`Failed to load preview for ${table}: ${err.message}`);
          });
      }
    });
  }, [selectedDatabase, selectedSchema, JSON.stringify(selectedTables)]);

  /** ========= Run ========= */
  const handleRun = async () => {
    if (!code.trim()) return toast.error("Write a SQL query first!");
    if (!selectedDatabase) return toast.error("Select a database first!");

    const payload = {
      query: code,
      dbConnectionId: selectedDatabase,
      limit: 100,
    };

    console.log("➡️ Request to API:", {
      url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/LabQuery/execute`,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
    });

    try {
      const data = await fetchJSON(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/LabQuery/execute`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      console.log("⬅️ Response from API:", data);

      const out: TableDataResponse = {
        fields: data?.columns ?? Object.keys(data?.data?.[0] || {}),
        data: data?.data ?? [],
        totalCount: data?.totalRows ?? data?.data?.length ?? 0,
        fieldsAndTypes: data?.columnTypes ?? {},
        query: data?.query ?? code,
      } as any;

      setQueryResult(out);
      setLastRunMeta({
        query: data?.query ?? code,
        columnTypes: data?.columnTypes ?? {},
      });
      onRunResult?.(out);
      toast.success("Query executed!");
      setActiveTab("result");
    } catch (err: any) {
      toast.error(err?.message || "Error running query");
      setQueryResult(null);
      onRunResult?.(null);
    }
  };

  /** ========= Save Dataset ========= */
  const handleSaveDataset = async () => {
    if (!selectedDatabase) return toast.error("Select a database first!");
    if (!selectedSchema) return toast.error("Select a schema first!");
    if (!lastRunMeta?.query || !lastRunMeta?.columnTypes) {
      return toast.error("Run a query first to get column types.");
    }
  
    const fromQ = extractSchemaTable(lastRunMeta.query);
    const tableName = fromQ.table || selectedTables?.[0];
    const schemaName = fromQ.schema || selectedSchema;
  
    if (!tableName) {
      return toast.error(
        "Could not detect table name. Please select a table or include FROM in query."
      );
    }
  
    const payload = {
      labQueryId: 0,
      datasetName: String(selectedDatabase),
      schemaName,
      tableName,
      projectId: Number(ProjectId),
      fieldsAndTypes: lastRunMeta.columnTypes,
    };
  
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/LabQuery/save-as-dataset`;
    console.log("➡️ SaveDataset Request:", { apiUrl, payload });
  
    const parsed = LabQuerySaveSchema.safeParse(payload);
    if (!parsed.success) {
      const firstErr = parsed.error.issues?.[0]?.message ?? "Validation failed";
      toast.error(firstErr);
      return;
    }
  
    try {
      const data = await fetchJSON(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      console.log("✅ SaveDataset Response:", data);
      toast.success("Dataset saved successfully!");
    } catch (e: any) {
      console.error("❌ SaveDataset Error:", e);
      toast.error(e?.message || "Failed to save dataset");
    }
  };

  /** ========= Beautify & Clear ========= */
  const beautify = () => {
    try {
      const formatted = format(code, { language: "sql" });
      setCode(formatted);
      onChange?.(formatted);
    } catch {
      setError("❌ Failed to beautify SQL");
      toast.error("Failed to beautify SQL");
    }
  };
  const clearEditor = () => {
    setError(null);
    setCode("");
    onChange?.("");
    setQueryResult(null);
    onRunResult?.(null);
  };

  if (!mounted) return null;

  return (
    <div className="w-full h-full flex flex-col">
      {/* Controls */}
      <div className="mb-2 flex flex-wrap items-center gap-3">
        <Button
          variant={"edit"}
          onClick={handleRun}
          disabled={!code.trim() || !selectedDatabase}
        >
          Run
        </Button>

        <Button onClick={beautify} disabled={!code.trim()} variant="secondary">
          Beautify
        </Button>

        <Button
          onClick={clearEditor}
          disabled={!code.trim()}
          variant="destructive"
        >
          Clear
        </Button>

        <Button
          className="ml-auto bg-custom-green2"
          onClick={handleSaveDataset}
          disabled={
            !selectedDatabase ||
            !selectedSchema ||
            !lastRunMeta?.columnTypes ||
            !lastRunMeta?.query
          }
        >
          Save Dataset
        </Button>
      </div>
      <div className="h-full w-full">
        <ResizablePanelGroup
          direction="vertical"
          className="h-full w-full rounded-lg border"
        >
          <ResizablePanel defaultSize={50} minSize={20}>
            <div className="flex flex-col h-full w-full p-2 gap-2">
              <div className="flex-1">
                {/* Editor */}
                <ResizableBox
                  width={Infinity}
                  height={height}
                  minConstraints={[500, 120]}
                  maxConstraints={[Infinity, 600]}
                  resizeHandles={["s"]}
                  onResizeStop={(_, data) => setHeight(data.size.height)}
                  className="border rounded shadow"
                >
                  <div
                    style={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CodeMirror
                      value={code}
                      onChange={(val) => {
                        setCode(val);
                        onChange?.(val);
                      }}
                      extensions={[
                        sql(),
                        autocompletion(),
                        placeholder("SELECT * FROM your_table;"),
                        EditorState.languageData.of(() => [
                          { autocomplete: tableCompletion },
                        ]),
                      ]}
                      height="100%"
                      theme={isDark ? dracula : githubLight}
                      basicSetup={{
                        lineNumbers: true,
                        highlightActiveLine: true,
                        highlightSelectionMatches: true,
                      }}
                      style={{ flexGrow: 1 }}
                    />
                  </div>
                </ResizableBox>
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel
            defaultSize={50}
            minSize={20}
            className="min-h-0 min-w-0 overflow-hidden" // 👈 مهم
          >
            <div className="flex flex-col h-full min-h-0 min-w-0">
              <Tabs
                defaultValue="tab-1"
                className="flex-1 min-h-0 min-w-0 flex flex-col"
              >
                <TabsList className="h-auto rounded-none border-b bg-transparent p-0 justify-start">
                  <TabsTrigger
                    value="result"
                    className="data-[state=active]:after:bg-primary relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none font-semibold"
                  >
                    Result
                  </TabsTrigger>
                  {selectedTables.map((table) => (
                    <TabsTrigger
                      key={table}
                      value={`preview:${table}`}
                      className="data-[state=active]:after:bg-primary relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none font-semibold"
                      title={`Preview: ${table}`}
                    >
                      Preview:&nbsp;
                      <span className="truncate max-w-[180px]">{`'${table}'`}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>

                {/* Result tab */}
                <TabsContent
                  value="result"
                  className="flex-1 overflow-auto max-w-7xl p-3"
                >
                  {queryResult?.fields && queryResult?.data ? (
                    <DynamicTable response={queryResult} />
                  ) : (
                    <p className="text-muted-foreground font-semibold">
                      No data available.
                    </p>
                  )}
                </TabsContent>

                {/* Preview tabs */}
                {selectedTables.map((table) => {
                  const resp = tableDataByTable[table];
                  return (
                    <TabsContent
                      key={table}
                      value={`preview:${table}`}
                      className="flex-1 overflow-auto p-3 max-w-7xl"
                    >
                      {resp === "loading" && (
                        <p className="text-muted-foreground">Loading…</p>
                      )}
                      {resp === "error" && (
                        <p className="text-red-500">Failed to load preview.</p>
                      )}
                      {resp && resp !== "loading" && resp !== "error" ? (
                        <DynamicTable response={resp as TableDataResponse} />
                      ) : null}
                    </TabsContent>
                  );
                })}
              </Tabs>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
