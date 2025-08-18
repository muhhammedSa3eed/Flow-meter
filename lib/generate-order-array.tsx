import { Option } from "@/components/ui/multiselect";

export const generateAscDescArray = (data: Option[]): Option[] => {
  return data.flatMap((item) => {
    // حذف النص بين الأقواس من الـ label
    const cleanLabel = item.label.split(' (')[0];

    return [
      {
        value: `${item.value} [asc]`,
        label: `${cleanLabel} [asc]`,
      },
      {
        value: `${item.value} [desc]`,
        label: `${cleanLabel} [desc]`,
      },
    ];
  });
};
