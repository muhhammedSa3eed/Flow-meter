'use server';
import { revalidatePath } from 'next/cache';

interface DeleteChartParams {
  chartId: string | number;
}

interface DeleteChartResult {
  success: boolean;
  message: string;
}

export async function deleteChartAction({
  chartId,
}: DeleteChartParams): Promise<DeleteChartResult> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Charts/${chartId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || 'Failed to delete the chart.',
      };
    }

    // إعادة تحميل البيانات
    revalidatePath('/');

    return {
      success: true,
      message: 'The chart has been deleted successfully.',
    };
  } catch (err) {
    if (err instanceof Error) {
      return {
        success: false,
        message: `Failed to delete the chart: ${err.message}`,
      };
    }

    return {
      success: false,
      message: 'An unknown error occurred while deleting the chart.',
    };
  }
}
