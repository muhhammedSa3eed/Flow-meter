'use client';
import { useState, useEffect, useTransition } from 'react';
import { DashboardGridComponent } from './dashboard-grid';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { Pencil, Save } from 'lucide-react';
import { redirect, useSearchParams } from 'next/navigation';
import { Chart, ChartItem, VisualizationTypes } from '@/types';
import Loading from '@/app/loading';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
export interface DashboardItem {
  visualizationType: any;
  type: any;
  // id: string;
  chartId: number;
  // type: 'BigData' | 'Chart';
  name: string;
  description: string;
  width: string;
  backgroundColor: string;
  textColor: string;
  data?: any;
  customizeOptions: any;
  metrics: any;
  dimensions: any;
  pieChartData?: any;
}

interface DashboardProps {
  ProjectId?: number | null;
  charts: any;
  dashboardId: number | null;
  dashboardName: string;
}

export const DashboardWrapper = ({
  ProjectId,
  charts,
  dashboardId,
  dashboardName,
}: DashboardProps) => {
  console.log({ charts });
  const [dataChart, setDataCharts] = useState<ChartItem[]>([]);
  const [cards, setCards] = useState<DashboardItem[]>([]);
  const [globalBackground, setGlobalBackGround] = useState('');
  const [isEditMode, setIsEditMode] = useState(true);
  const [isChartDialogOpen, setIsChartDialogOpen] = useState(false);
  const searchParams = useSearchParams();
  const edit = searchParams.get('edit');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const usedChartsIds = cards.map((card) => Number(card.chartId));

  if (!edit) {
    redirect(`/Projects/${ProjectId}/dashboard/${dashboardId}?edit=false`);
  }
  const availableCharts = dataChart.filter(
    (chart) => !usedChartsIds.includes(chart.id)
  );
  const addChart = (chartId: number) => {
    const selectedChart = dataChart.find((chart) => chart?.id === chartId);
    console.log('xxxx=>', { selectedChart });
    if (!selectedChart) return;

    const newChart = {
      chartId: selectedChart.id,
      name: selectedChart.name,
      description: selectedChart.description ?? 'description',
      width: selectedChart.width ?? 'col-span-2',
      backgroundColor: selectedChart.backgroundColor ?? '#ffffff',
      textColor: selectedChart.textColor ?? '#ffffff',
      type: selectedChart.visualizationType?.type ?? 'test',
      pieChartData: selectedChart.data,
      ChartName: selectedChart.name,
      customizeOptions: selectedChart.customizeOptions,
      metrics: selectedChart.metrics,
      data: selectedChart.data,
      visualizationType: selectedChart.visualizationType,
      dimensions: selectedChart.dimensions,
    };
    console.log({ newChart });

    setCards((prev) => [...prev, newChart]);
    console.log('[...cards, newChart]', [...cards, newChart]);
    Cookies.set('dashboardState', JSON.stringify([...cards, newChart]));
    setIsChartDialogOpen(false);
  };

  // Check if the "Add" buttons should be disabled
  const isAddChartDisabled = availableCharts.length === 0;

  // Load from localStorage
  // useEffect(() => {
  //   const loadState = () => {
  //     try {
  //       const saved = Cookies.get('dashboardState');
  //       const parsedSaved: DashboardItem[] = saved ? JSON.parse(saved) : [];
  //       console.log({ parsedSaved });
  //       if (parsedSaved.length > 0) {
  //         setCards(parsedSaved);
  //       } else {
  //         setCards([]); // اجعلها فارغة إذا لم يكن هناك بيانات محفوظة
  //       }
  //     } catch (error) {
  //       console.error('Failed to load state:', error);
  //       setCards([]); // تأكد من أنها تبقى فارغة في حالة الخطأ
  //     }
  //   };
  //   loadState();
  // }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/projects/${ProjectId}/dashboards/${dashboardId}`
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        // console.log('xxxx=>', { result });
        // console.log('result', result.dashboardCharts);
        // setCards(result.dashboardCharts);
        setCards(
          result.dashboardCharts.map((item: any) => ({
            index: item.index,
            chartId: item.chartId.toString(),
            name: item.name,
            description: item.description,
            width: item.width,
            backgroundColor: item.backgroundColor,
            textColor: item.textColor,
            visualizationType: item.chart.visualizationType,
            type: item.chart.visualizationType?.type,
            pieChartData: item.chart.data,
            customizeOptions: item.chart.customizeOptions,
            metrics: item.chart.metrics[0],
            xAxis: item.xAxis ?? null,
            data: item.chart.data,
            dimensions: item.dimensions,
          }))
        );
        setGlobalBackGround(result.background);

        // setData(result);
      } catch (error) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Save to localStorage
  // useEffect(() => {
  //   console.log('12345566');
  //   Cookies.set('dashboardState', JSON.stringify(cards));
  // }, [cards]);
  // console.log({ dataChart });
  console.log('xxxx77777', { cards });
  useEffect(() => {
    setDataCharts(charts);
  }, [charts]);

  useEffect(() => {
    if (edit == 'true') {
      setIsEditMode(true);
    } else {
      setIsEditMode(false);
    }
  }, [edit]);

  // Handle reordering of cards
  const handleReorder = (newCards: DashboardItem[]) => {
    setCards(newCards);
  };
  const handleSaveCard = () => {
    const saved = Cookies.get('dashboardState');
    const parsedData: DashboardItem[] = saved ? JSON.parse(saved) : [];
    console.log({ parsedData });
    const transformedData = cards.map((item, index) => ({
      index,
      chartId: item.chartId,
      name: item.name,
      description: item.description,
      width: item.width,
      backgroundColor: item.backgroundColor,

      visualizationType: item.type,
      pieChartData: item.data,
      customizeOptions: item.customizeOptions,
    }));
    console.log({ transformedData });
    // console.log(JSON.stringify(transformedData));
    const parsedValues = {
      id: Number(dashboardId),
      name: dashboardName,
      projectId: Number(ProjectId),
      background: globalBackground,
      charts: transformedData,
    };
    // console.log('parsedValues', { parsedValues });
    // console.log(JSON.stringify(parsedValues));
    startTransition(async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/projects/${ProjectId}/dashboards/${dashboardId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify(parsedValues),
          }
        );
        if (!response.ok) {
          toast.error('An error occurred while saving the data.');
        }
        const result = await response.json();
        toast.success('The dashboard has been updated successfully.');
        console.log({ result });
      } catch (error) {
        console.error(error);
        toast.error(
          'An error occurred while saving the data. Please try again.'
        );
      }
    });
  };

  const getAllCharts = async () => {
    setIsChartDialogOpen(true);
    setDataCharts(charts);
    // try {
    //   const response = await fetch(
    //     `${process.env.NEXT_PUBLIC_API_BASE_URL}/Charts/dashboards/GetAllChart`,
    //     {
    //       method: 'GET',
    //     }
    //   );
    //   const result = await response.json();
    //   setDataCharts(result);
    //   // console.log({ result });
    // } catch (error) {
    //   console.error(error);
    // }
  };

  if (loading) return <Loading />;
  // if (error) return <p>{error}</p>;
  return (
    <section className="p-4 bg-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-800">
            Analytics Dashboard
          </h1>
          <div className="flex gap-2">
            {isEditMode && (
              <>
                <Button
                  onClick={getAllCharts}
                  disabled={isAddChartDisabled}
                  className={`bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-sm transition-colors flex items-center ${
                    isAddChartDisabled ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <span>Choose Chart</span> <Pencil className="!w-4 !h-4" />
                </Button>

                <Button
                  className="px-3 py-1.5 bg-custom-green gap-1 hover:bg-custom-green disabled:bg-gray-500 text-white"
                  disabled={isPending}
                  onClick={handleSaveCard}
                >
                  <Save size={14} className=" text-[10px]" /> Save
                </Button>
              </>
            )}
          </div>
        </header>

        <DashboardGridComponent
          cards={cards}
          onReorder={handleReorder}
          isEditMode={isEditMode}
        />

        {/* Popup Dialog */}
        <Dialog open={isChartDialogOpen} onOpenChange={setIsChartDialogOpen}>
          <DialogContent>
            <DialogTitle className="">Select a Chart</DialogTitle>
            <DialogDescription className={cn('mb-0 pb-0')}></DialogDescription>
            <div className="space-y-2.5 h-[550px] overflow-y-auto">
              {availableCharts.map((chart) => (
                <Button
                  key={chart.id}
                  onClick={() => addChart(chart.id)}
                  className="w-full bg-gray-100 rounded py-6 text-lg text-gray-800 hover:bg-gray-700 hover:text-white duration-200 transition-colors"
                >
                  {chart.name}
                </Button>
              ))}
            </div>
            <DialogClose asChild>
              <div className="flex items-center justify-center">
                <Button
                  variant="destructive"
                  className="rounded flex items-center justify-center"
                >
                  Cancel
                </Button>
              </div>
            </DialogClose>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

// useEffect(() => {
//   const loadState = () => {
//     try {
//       const saved = localStorage.getItem('dashboardState');
//       const parsedSaved = saved ? JSON.parse(saved) : [];
//       console.log({ parsedSaved });
//       if (parsedSaved && parsedSaved.length > 0) {
//         console.log('xxxxx');
//         setCards(parsedSaved);
//       } else {
//         // setCards(
//         //   dataChart.map((chart) => ({
//         //     id: chart.id.toString(),
//         //     type: 'Chart',
//         //     name: chart.name,
//         //     description: 'Loading visualization...',
//         //     width: 'col-span-2',
//         //     backgroundColor: 'rgb(255,255,255)',
//         //   }))
//         // );
//       }
//     } catch (error) {
//       console.error('Failed to load state:', error);
//     }
//   };
//   loadState();
// }, []);
