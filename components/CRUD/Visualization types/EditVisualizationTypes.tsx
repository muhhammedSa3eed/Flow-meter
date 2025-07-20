import React, { useEffect, useId } from "react";
import MultipleSelector, { Option } from "@/components/ui/multiselect";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SheetClose, SheetFooter } from "@/components/ui/sheet";
import { VisualizationTypesSchema } from "@/schemas";
import { VisualizationTypes } from "@/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AreaChart,
  BarChart,
  FolderCheck,
  LineChart,
  PieChart,
  SquareAsterisk,
  Table,
} from "lucide-react";
import { useRouter } from "next/navigation";

const DisplayOptions: Option[] = [
  { value: "Dimensions", label: "Dimensions" },
  { value: "Filters", label: "Filters" },
  { value: "RowLimit", label: "Row limit" },
  { value: "SortBy", label: "Sort by" },
  { value: "Subheader", label: "Subheader" },
  { value: "X-axis", label: "X-axis" },
  { value: "X-AxisSortBy", label: "X-Axis Sort By" },
  { value: "ContributionMode", label: "Contribution Mode" },
  { value: "Series limit", label: "Series limit" },
  { value: "SortQueryBy", label: "Sort query by" },
  { value: "TruncateMetric", label: "Truncate Metric" },
  { value: "ShowEmptyColumns", label: "Show empty columns" },
];

const CustomizationOptions: Option[] = [
  { value: "textStyle", label: "Text Style" },
  { value: "aria", label: "Aria" },
  { value: "color", label: "color" },
  { value: "gradientColor", label: "Gradient Color" },
  { value: "stateAnimation", label: "State Animation" },
  { value: "animation", label: "Animation" },
  { value: "animationDuration", label: "Animation Duration" },
  { value: "animationDurationUpdate", label: "Animation Duration Update" },
  { value: "animationEasing", label: "Animation Easing" },
  { value: "animationEasingUpdate", label: "Animation Easing Update:" },
  { value: "animationThreshold", label: "Animation Threshold" },
  { value: "progressiveThreshold", label: "Progressive Threshold" },
  { value: "progressive", label: "Progressive" },
  { value: "hoverLayerThreshold", label: "hover Layer Threshold" },
  { value: "useUTC", label: "Use UTC" },
  { value: "title", label: "Title" },
  { value: "axisPointer", label: "Axis Pointer" },
  { value: "tooltip", label: "Tooltipr" },
  { value: "legend", label: "Legend" },
  { value: "yAxis", label: "Y Axis" },
  { value: "xAxis", label: " X Axis" },
  { value: "grid", label: "Grid" },
  // { value: "BigNumberFontSize", label: "Big Number Font Size" },
  // { value: "SubheaderFontSize", label: "Subheader Font Size" },
  // { value: "NumberFormat", label: "Number format" },
  // { value: "CurrencyFormat", label: "Currency format" },
  // { value: "Currency", label: "Currency" },
  // { value: "DateFormat", label: "Date format" },
  // { value: "ForceDateFormat", label: "Force date format" },
  // { value: "ColorScheme", label: "Color Scheme" },
  // { value: "PercentageThreshold", label: "Percentage threshold" },
  // { value: "RoseType", label: "Rose Type" },
  // { value: "Legend", label: "Legend" },
  // { value: "Type", label: "Type" },
  // { value: "Orientation", label: "Orientation" },
  // { value: "Margin", label: "Margin" },
  // { value: "LabelType", label: "Label Type" },
  // { value: "ShowLabels", label: "Show Labels" },
  // { value: "PutLabelsOutside", label: "Put labels outside" },
  // { value: "LabelLine", label: "Label Line" },
  // { value: "ShowTotal", label: "Show Total" },
  // { value: "OuterRadius", label: "Outer Radius" },
  // { value: "Donut", label: "Donut" },
  // { value: "Subtitle", label: "Subtitle" },
  // { value: "BarOrientation", label: "Bar orientation" },
  // { value: "AxisTitle", label: "Axis Title" },
  // { value: "AXISTITLEMARGIN", label: "AXIS TITLE MARGIN" },
  // { value: "AXISTITLEPOSITION", label: "AXIS TITLE POSITION" },
  // { value: "SortSeriesBy", label: "Sort Series By" },
  // { value: "SortSeriesAscending", label: "Sort Series Ascending" },
  // { value: "Show Value", label: "Show Value" },
  // { value: "StackedStyle", label: "Stacked Style" },
  // { value: "Minorticks", label: "Minor ticks" },
  // { value: "DataZoom", label: "Data Zoom" },
  // { value: "ShowLegend", label: "Show legend" },
  // { value: "TimeFormat", label: "Time format" },
  // { value: "RotateXaxisLabel", label: "Rotate x axis label" },
  // { value: "TruncateXAxis", label: "Truncate X Axis" },
  // { value: "RichTooltip", label: "Rich tooltip" },
  // { value: "ShowPercentage", label: "Show percentage" },
  // { value: "TooltipSortByMetric", label: "Tooltip sort by metric" },
  // { value: "TooltipTimeFormat", label: "Tooltip time format" },
  // { value: "AxisFormat", label: "Axis Format" },
  // { value: "LogarithmicAxis", label: "Logarithmic axis" },
  // { value: "MinorSplitLine", label: "Minor Split Line" },
  // { value: "TruncateAxis", label: "Truncate Axis" },
];

const IconOptions = [
  { id: 1, value: "bar", label: "Bar Chart", icon: <BarChart size={20} /> },
  { id: 2, value: "pie", label: "Pie Chart", icon: <PieChart size={20} /> },
  { id: 3, value: "line", label: "Line Chart", icon: <LineChart size={20} /> },
  { id: 4, value: "area", label: "Area Chart", icon: <AreaChart size={20} /> },
  { id: 5, value: "table", label: "Table", icon: <Table size={20} /> },
  { id: 6, value: "bignumber", label: "Big number", icon: <SquareAsterisk size={20} /> },
];

export default function EditVisualizationTypes({ VisualizationTypes: initial }: { VisualizationTypes: VisualizationTypes }) {
  const id = useId();
  const router = useRouter()
  const form = useForm<z.infer<typeof VisualizationTypesSchema>>({
    resolver: zodResolver(VisualizationTypesSchema),
    defaultValues: {
      id: initial.id,
      name: initial.name,
      type: initial.type,
      iconId: initial.iconId,
      displayFields: initial.displayFields || [],
      optionsFields: initial.optionsFields || [],
    },
  });

  const optionsToArray = (options: Option[]) => options.map((opt) => opt.value);
  const arrayToOptions = (values: string[], list: Option[]) => values.map(v => list.find(o => o.value === v) || { value: v, label: v });

  async function onSubmit(values: z.infer<typeof VisualizationTypesSchema>) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/VisualizationTypes/${values.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "An error occurred.");
        return;
      }

      toast.success("Visualization type updated successfully.");
      // window.location.reload();
      router.refresh()
    } catch (err: any) {
      toast.error("Failed to update visualization type");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <Card>
          <CardHeader>
            <CardTitle>Basic Info</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="iconId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mt-3 text-lg font-semibold mb-2">
                    Choose Icon
                  </FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-2 gap-2">
                      {IconOptions.map((option) => (
                        <Button
                          key={option.id}
                          type="button"
                          variant={
                            field.value === option.id ? "custom" : "outline"
                          }
                          onClick={() => {
                            field.onChange(option.id);
                            form.setValue("type", option.value);
                          }}
                          className="flex items-center gap-2 justify-start"
                        >
                          {option.icon}
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Visibility Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="displayFields"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Fields</FormLabel>
                  <FormControl>
                    <MultipleSelector
                      value={arrayToOptions(field.value, DisplayOptions)}
                      onChange={(options) =>
                        field.onChange(optionsToArray(options))
                      }
                      creatable
                      options={DisplayOptions}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customization Options</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="optionsFields"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customization Options</FormLabel>
                  <FormControl>
                    <MultipleSelector
                      value={arrayToOptions(field.value, CustomizationOptions)}
                      onChange={(options) =>
                        field.onChange(optionsToArray(options))
                      }
                      creatable
                      options={CustomizationOptions}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <SheetFooter>
          <SheetClose asChild>
            <Button type="button" variant="destructive" className="mr-auto">
              Cancel
            </Button>
          </SheetClose>
          <Button type="submit" variant="edit">
            Update
          </Button>
        </SheetFooter>
      </form>
    </Form>
  );
}
