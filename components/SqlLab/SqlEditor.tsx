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
import { TableDataResponse } from "@/types";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import { placeholder } from "@codemirror/view";
type SqlEditorProps = {
  tables?: string[];
  value: string;
  onChange: (val: string) => void;
  onRunResult?: (res: TableDataResponse | null) => void;
};

export default function SqlEditor({
  tables = [],
  value,
  onChange,
  onRunResult,
}: SqlEditorProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = resolvedTheme === "dark";

  const [error, setError] = useState<string | null>(null);
  const [height, setHeight] = useState(200);

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

  const handleRun = async () => {
    try {
      const res = await fetch("/api/query", {
        method: "POST",
        body: JSON.stringify({ sql: value }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Unknown error");
        onRunResult?.(null);
      } else {
        setError(null);
        onRunResult?.({
          fields: Object.keys(data.result[0] || {}),
          data: data.result,
        });
      }
    } catch {
      setError("❌ Failed to execute query");
      toast.error(" Failed to execute query");
      onRunResult?.(null);
    }
  };

  const beautify = () => {
    try {
      const formatted = format(value, { language: "sql" });
      onChange(formatted);
    } catch {
      setError("❌ Failed to beautify SQL");
      toast.error(" Failed to beautify SQL");
    }
  };

  const clearEditor = () => {
    onChange("");
    setError(null);
    onRunResult?.(null);
  };

  if (!mounted) return null;

  return (
    <div className="w-full">
      <div className="mb-2 flex flex-wrap items-center gap-4">
        <Button
          onClick={handleRun}
          disabled={!value.trim()}
          className={`px-4 py-2 rounded text-white transition ${
            value.trim()
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Run
        </Button>

        <Button
          onClick={beautify}
          disabled={!value.trim()}
          className={`px-4 py-2 rounded bg-gray-300 text-gray-900 hover:bg-gray-400 transition ${
            !value.trim() ? "cursor-not-allowed opacity-50" : ""
          }`}
        >
          Beautify
        </Button>

        <Button
          onClick={clearEditor}
          disabled={!value.trim()}
          className={`px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition ${
            !value.trim() ? "cursor-not-allowed opacity-50" : ""
          }`}
        >
          Clear
        </Button>
      </div>

      <ResizableBox
        width={Infinity}
        height={height}
        minConstraints={[500, 100]}
        maxConstraints={[Infinity, 600]}
        resizeHandles={["s"]}
        onResizeStop={(_, data) => setHeight(data.size.height)}
        className="border rounded shadow"
      >
        <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <CodeMirror
            value={value}
            extensions={[sql(), autocompletion(), placeholder("SELECT * FROM your_table;"), tableCompletionLangData]}
            height="100%"
            theme={isDark ? dracula : githubLight}
            onChange={(val) => onChange(val)}
            basicSetup={{
              lineNumbers: true,
              highlightActiveLine: true,
              highlightSelectionMatches: true,
            }}
            style={{ flexGrow: 1 }}
          />
        </div>
      </ResizableBox>

      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
}
