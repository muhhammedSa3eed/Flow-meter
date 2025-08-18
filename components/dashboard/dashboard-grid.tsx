'use client';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimation,
} from '@dnd-kit/core';
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, Pencil, Grip } from 'lucide-react';
import { useCallback, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import ChartDisplay from '../Chart/ChartDisplay';
import { palettes } from '@/lib/chart-assets';
import { DashboardItem } from './dashboard-wrapper';
import { useTheme } from 'next-themes';
// interface DashboardItem {
//   data: any;
//   metrics: any;
//   customizeOptions: any;
//   chartId: number;
//   backgroundColor: string;
//   textColor: string;
//   name: string;
//   description: string;
//   width: string;
//   type?: string;
//   pieChartData?: any;
//   dimensions?: any;
// }

interface DashboardGridProps {
  cards: DashboardItem[];
  onReorder: any;
  isEditMode: boolean;
}

export const DashboardGridComponent = ({
  cards,
  onReorder,
  isEditMode,
}: DashboardGridProps) => {
  const [activeItem, setActiveItem] = useState<DashboardItem | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ({ active }: any) => {
      const item = cards.find((i) => i.chartId === active.id);
      if (item) setActiveItem(item);
    },
    [cards]
  );

  const handleDragEnd = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ({ active, over }: any) => {
      setActiveItem(null);
      if (over && active.id !== over.id) {
        const oldIndex = cards.findIndex((i) => i.chartId === active.id);
        const newIndex = cards.findIndex((i) => i.chartId === over.id);
        const reordered = arrayMove(cards, oldIndex, newIndex);
        onReorder(reordered);
      }
    },
    [cards, onReorder]
  );

  const deleteCard = (cardId: string) => {
    onReorder(cards.filter((card) => card.chartId.toString() !== cardId));
  };

  const updateCard = (cardId: string, updatedProps: Partial<DashboardItem>) => {
    const updatedCards = cards.map((card) =>
      card.chartId.toString() === cardId ? { ...card, ...updatedProps } : card
    );
    onReorder(updatedCards);
  };

  // Custom drop animation
  const customDropAnimation = {
    ...defaultDropAnimation, // Start with default settings
    duration: 300, // Increase duration for a slower animation
    easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)', // Custom easing function
  };

  return (
    <div className="space-y-4">
      {isEditMode ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={cards.map((card) => card.chartId)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-4">
              {cards.map((card) => (
                <SortableCard
                  key={`${card.chartId}-${Math.random()}`}
                  card={card}
                  onDelete={deleteCard}
                  onUpdate={updateCard}
                  isEditMode={isEditMode}
                />
              ))}
            </div>
          </SortableContext>

          {/* Drag Overlay with custom drop animation */}
          <DragOverlay dropAnimation={customDropAnimation}>
            {activeItem ? (
              <div className="bg-white p-4 rounded-xl shadow-lg w-full">
                <h3 className="font-medium text-slate-800">
                  {activeItem.name}
                </h3>
                <p className="text-sm text-slate-500">
                  {activeItem.description}
                </p>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      ) : (
        // Render cards without DnD functionality when edit mode is disabled
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-4">
          {cards.map((card) => (
            <SortableCard
              key={card.chartId}
              card={card}
              onDelete={deleteCard}
              onUpdate={updateCard}
              isEditMode={isEditMode}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const SortableCard = ({
  card,
  onDelete,
  onUpdate,
  isEditMode,
}: {
  card: DashboardItem;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updatedProps: Partial<DashboardItem>) => void;
  isEditMode: boolean;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.chartId });

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(card.name);
  const [description, setDescription] = useState(card.description);
  const [width, setWidth] = useState(card.width);
  const [backgroundColor, setBackgroundColor] = useState(card.backgroundColor);
  const [textColor, setTextColor] = useState(card.textColor);
  const [chartType, setChartType] = useState(card.type);

  const handleSave = () => {
    onUpdate(card.chartId.toString(), {
      name,
      description,
      width,
      backgroundColor,
      textColor,
    });
    setIsEditing(false);
  };
  const { theme } = useTheme(); // "light" | "dark" | "system"
  console.log({ theme });
  const defaultBackground =
    backgroundColor ?? (theme === 'dark' ? '#1e1e1e' : '#ffffff');

  const defaultTextColor =
    textColor ?? (theme === 'dark' ? '#000000' : '#000000');
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : transition,
    zIndex: isDragging ? 100 : 'auto',
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: defaultBackground,
    color: defaultTextColor,
  };
  console.log({ defaultBackground });
  console.log({ defaultTextColor });

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative ${card.width}  py-3 px-0 rounded-md shadow-sm hover:shadow-md transition-all`}
    >
      {isEditMode && (
        <div
          className="absolute top-2 left-2 cursor-grab active:cursor-grabbing"
          {...listeners}
          {...attributes}
        >
          <Grip className="w-4 h-4 text-slate-400" />
        </div>
      )}

      {isEditMode && (
        <button
          onClick={() => onDelete(card.chartId.toString())}
          className="absolute bottom-1.5 right-1.5 p-1 hover:bg-slate-100 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}

      <div className="space-y-2 p-4">
        {isEditMode && isEditing ? (
          <>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-1 border rounded text-sm"
            />

            <select
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              className="w-full p-1 border rounded text-sm h-[40px]"
            >
              <option value={'col-span-2'} className="text-sm">
                {' '}
                1 Column
              </option>
              <option value={'col-span-4'} className="text-sm">
                {' '}
                2 Columns
              </option>
              <option value={'col-span-6'} className="text-sm">
                {' '}
                3 Columns
              </option>
              <option value={'col-span-8'} className="text-sm">
                {' '}
                4 Columns
              </option>
              <option value={'col-span-10'} className="text-sm">
                5 Columns
              </option>
              <option value={'col-span-12'} className="text-sm">
                6 Columns
              </option>
            </select>

            <div className="flex gap-2 items-end">
              {/* Color Picker */}
              <div className="basis-1/2 w-1/2">
                <label className="block text-sm font-medium text-gray-700">
                  Background Color
                </label>
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-full h-10 p-1 border rounded cursor-pointer"
                />
              </div>
              <div className="basis-1/2 w-1/2">
                <label className="block text-sm font-medium text-gray-700">
                  Text Color
                </label>
                <input
                  type="color"
                  value={textColor ?? '#ffff'}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-full h-10 p-1 border rounded cursor-pointer"
                />
              </div>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-1 border rounded text-sm"
            />
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-3 py-1.5 rounded"
            >
              Save
            </button>
          </>
        ) : (
          <>
            <h3 className="font-medium" style={{ color: card.textColor }}>
              {card.name}
            </h3>
            <p className="text-sm" style={{ color: card.textColor }}>
              {card.description}
            </p>

            {isEditMode && (
              <button
                onClick={() => setIsEditing(true)}
                className=" text-blue-700 px-1.5 py-1 text-sm  flex items-center gap-2 absolute right-1 top-0"
              >
                <Pencil size={16} />
                {/* <span>Edit</span> <Pencil size={16} /> */}
              </button>
            )}
          </>
        )}
        <ChartDisplay chartData={card} isDashboard={true} />
        {/* {isPieChart && (
          <ReactECharts
            option={{
              title: {
                text: card.name || 'Chart',
                subtext: card.visualizationType?.type || 'Pie',
                bottom: 'left',
              },
              tooltip: { trigger: 'item' },
              color: colors,
              legend: {
                orient: card.customizeOptions?.Orientation || 'horizontal',
                left: 'center',
                top: card.customizeOptions?.Margin || 'top',
                selector: true,
                type: card.customizeOptions?.type,
              },
              series: [
                {
                  name: card.metrics?.[0]?.columnName || 'Value',
                  type: 'pie',
                  radius: card.customizeOptions?.Donut ? ['40%', '70%'] : '50%',
                  roseType: card.customizeOptions?.RoseType || false,
                  data: pieChartData,
                  emphasis: {
                    itemStyle: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)',
                    },
                  },
                },
              ],
            }}
            style={{ height: 400, width: '100%' }}
          />
        )}
        {isBigNumber && (
          <div className="text-center space-y-2 flex items-center justify-center h-[250px]">
            <div
              className={`font-bold ${
                card.customizeOptions?.BigNumberFontSize || 'text-8xl'
              }`}
            >
              {card?.customizeOptions?.CurrencyFormat === 'Prefix'
                ? card.customizeOptions?.Currency || ''
                : ''}
              {card?.pieChartData?.length > 0
                ? Object.values(card.pieChartData[0] || {})[0]
                : null}
              
              {card.customizeOptions?.CurrencyFormat === 'Suffix'
                ? card.customizeOptions?.Currency || ''
                : ''}
            </div>
            {card.customizeOptions?.Subtitle && (
              <div className="text-muted-foreground text-sm">
                {card.customizeOptions.Subtitle}
              </div>
            )}
          </div>
        )}

        {isBarChart &&
          xAxisData?.length > 0 &&
          seriesData?.some((v: any) => v !== undefined) && (
            <ReactECharts
              option={{
                title: {
                  text: card.name || 'Bar Chart',
                  subtext: card.visualizationType?.type || 'Bar',
                  // bottom: 'left',
                },
                tooltip: { trigger: 'axis' },
                xAxis: {
                  type: 'category',
                  data: xAxisData,
                  axisLabel: {
                    rotate: card.customizeOptions?.RotateXaxisLabel ?? 0,
                  },
                },

                legend: {
                  data: legandTitle,
                },

                yAxis: {
                  type: 'value',
                },
                series: [
                  {
                    data: barSeriesData,
                    type: 'bar',
                    itemStyle: {
                      borderRadius: 4,
                      color: function (params: any) {
                        return selectedPalette[
                          params.dataIndex % selectedPalette.length
                        ];
                      },
                    },
                  },
                ],
              }}
              style={{ height: 400, width: '100%' }}
            />
          )}

        {isLineChart &&
          xAxisData?.length > 0 &&
          seriesData?.some((v: any) => v !== undefined) && (
            <ReactECharts
              option={{
                title: {
                  text: card.name || 'Line Chart',
                },
                tooltip: {
                  trigger: 'axis',
                },
                legend: {
                  data: legandTitle,
                },
                grid: {
                  left: '3%',
                  right: '4%',
                  bottom: '3%',
                  containLabel: true,
                },

                xAxis: {
                  type: 'category',
                  boundaryGap: false,
                  data: xAxisData,
                },
                yAxis: {
                  type: 'value',
                },
                series: seriesData,
              }}
              style={{ height: 400, width: '100%' }}
            />
          )} */}
      </div>
    </div>
  );
};

// Utility function
function arrayMove<T>(array: T[], from: number, to: number) {
  const newArray = [...array];
  const [removed] = newArray.splice(from, 1);
  newArray.splice(to, 0, removed);
  return newArray;
}
