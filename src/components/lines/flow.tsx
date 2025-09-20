import { Fragment, useState } from 'react'
import { Circle, Layer, Stage, Text } from 'react-konva'
import Konva from 'konva'

const Lines = () => {

  const [lines, setLines] = useState<MetroLine[]>([
    {
      id: 1,
      color: '#90a05f',
      name: 'Арбатско-Покровская',
      stations: [
        { id: 1, x: 200, y: 300, color: '#90a05f', label: 'Парк победы', labelOffset: { x: 0, y: -60 } },
        { id: 2, x: 600, y: 300, color: '#90a05f', label: 'Кутузовская', labelOffset: { x: 0, y: -60 } },
      ],
      segments: [
        { fromStationId: 1, toStationId: 2, timeMinutes: 5 },
      ],
      isCircular: false,
      renderStyle: 'linear',
    },
    {
      id: 2,
      color: '#c6590c',
      name: 'Калининская',
      stations: [
        { id: 3, x: 300, y: 600, color: '#c6590c', label: 'Новокосино', labelOffset: { x: 0, y: -60 } },
        { id: 4, x: 700, y: 600, color: '#c6590c', label: 'Ломоносовская', labelOffset: { x: 0, y: -60 } },
      ],
      segments: [
        { fromStationId: 3, toStationId: 4, timeMinutes: 8 },
      ],
      isCircular: false,
      renderStyle: 'linear',
    },
  ]);

  return (
    <Stage
      width={1600}
      height={790}
      onWheel={handleWheel}
      // ref={stageRef}
      // onClick={handleStageClick}
      // onMouseDown={handleStageMouseDown}
      // onMouseMove={handleStageMouseMove}
      // onMouseUp={handleStageMouseUp}
      // onMouseLeave={handleStageMouseUp}
    >
              <Layer x={position.x} y={position.y} scaleX={scale} scaleY={scale}>
                {lines.map(renderLine)}
      {/*          {transferLines.map(renderTransferLine)}*/}
      {/*          {lines.flatMap(line => line.segments.map((seg, i) => renderSegmentLabel(seg, i, line.id)))}*/}
      {/*          {transferLines.map((transfer, i) => renderTransferLabel(transfer, i))}*/}
      {/*          {lines.flatMap((line) =>*/}
      {/*            line.stations.map((station) => {*/}
      {/*              const isSelectedLine = selectedLineId === line.id;*/}
      {/*              // 👇 Проверяем, входит ли станция в подсвеченный маршрут*/}
      {/*              const isOnPath = highlightedPath.stations.has(station.id);*/}
      {/*              return (*/}
      {/*                <Fragment key={station.id}>*/}
      {/*                  <Circle*/}
      {/*                    x={station.x}*/}
      {/*                    y={station.y}*/}
      {/*                    radius={32}*/}
      {/*                    fill="#2b2d30"*/}
      {/*                    stroke={isOnPath ? '#ffff00' : station.color}*/}
      {/*                    strokeWidth={isOnPath ? 8 : 6}*/}
      {/*                    strokeScaleEnabled={false}*/}
      {/*                    filters={isSelectedLine ? [Konva.Filters.Blur] : undefined}*/}
      {/*                    blurRadius={isSelectedLine ? 5 : 0}*/}
      {/*                    draggable={activeMode !== 'free'}*/}
      {/*                    onMouseEnter={handleMouseEnter}*/}
      {/*                    onMouseLeave={handleMouseLeave}*/}
      {/*                    onDragStart={handleDragStart}*/}
      {/*                    onDragMove={(e) => handleDragMove(e, station.id)}*/}
      {/*                    onDragEnd={(e) => handleDragEnd(e, station.id)}*/}
      {/*                    onClick={(e) => handleStationClick(station.id, e)}*/}
      {/*                    onContextMenu={(e) => {*/}
      {/*                      e.evt.preventDefault();*/}
      {/*                      const menu = window.confirm(*/}
      {/*                        `Станция: ${station.label}*/}
      {/*` +*/}
      {/*                        `Выберите действие:*/}
      {/*` +*/}
      {/*                        `OK - Удалить станцию*/}
      {/*` +*/}
      {/*                        `Отмена - Настроить подпись`*/}
      {/*                      );*/}
      {/*                      if (menu) {*/}
      {/*                        setConfirmDelete({ type: 'station', id: station.id });*/}
      {/*                      } else {*/}
      {/*                        setLabelPositionStation(station);*/}
      {/*                        setLabelOffsetX(station.labelOffset.x);*/}
      {/*                        setLabelOffsetY(station.labelOffset.y);*/}
      {/*                        setIsLabelPositionModalOpen(true);*/}
      {/*                      }*/}
      {/*                    }}*/}
      {/*                  />*/}
      {/*                  <Text*/}
      {/*                    x={station.x + station.labelOffset.x}*/}
      {/*                    y={station.y + station.labelOffset.y}*/}
      {/*                    text={station.label}*/}
      {/*                    fontSize={33 / 2 / scale}*/}
      {/*                    fontFamily="Arial"*/}
      {/*                    fill="#accfc6"*/}
      {/*                    align="center"*/}
      {/*                    width={300 / 2 / scale}*/}
      {/*                    onDblClick={() => {*/}
      {/*                      setEditingStation(station);*/}
      {/*                      setEditStationName(station.label);*/}
      {/*                      setIsEditStationModalOpen(true);*/}
      {/*                    }}*/}
      {/*                  />*/}
      {/*                </Fragment>*/}
      {/*              );*/}
      {/*            })*/}
      {/*          )}*/}
              </Layer>
    </Stage>
  )
}

export { Lines }









import { Circle, Layer, Line, Stage, Text, Path } from 'react-konva';
import Konva from 'konva';
import { useState, useRef, useCallback, useEffect, Fragment } from 'react';


interface TransferLine {
  fromStationId: number;
  toStationId: number;
  timeMinutes: number;
}

const FlowExample = () => {
  const stageRef = useRef<any>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [cursor, setCursor] = useState('default');
  const [stationName, setStationName] = useState('');
  const [lastClickPos, setLastClickPos] = useState<{ x: number; y: number } | null>(null);
  const [selectedLineId, setSelectedLineId] = useState<number | null>(1);

  type ActiveMode = 'free' | 'idle' | 'addBetween' | 'createTransfer' | 'findPath' | 'closeLoop';
  const [activeMode, setActiveMode] = useState<ActiveMode>('idle');

  const [insertBetween, setInsertBetween] = useState<{ firstId: number | null; secondId: number | null }>({
    firstId: null,
    secondId: null,
  });

  const [transferStartStationId, setTransferStartStationId] = useState<number | null>(null);
  const [transferLines, setTransferLines] = useState<TransferLine[]>([]);

  // 👇 Для поиска пути
  const [pathStartStationId, setPathStartStationId] = useState<number | null>(null);
  const [pathEndStationId, setPathEndStationId] = useState<number | null>(null);
  const [calculatedPath, setCalculatedPath] = useState<{
    totalMinutes: number;
    stations: number[];
    segments: { from: number; to: number; type: 'line' | 'transfer'; time: number; lineId?: number }[];
  } | null>(null);

  // 👇 Новое состояние для подсветки сегментов и станций
  const [highlightedPath, setHighlightedPath] = useState<{
    stations: Set<number>;
    segments: Set<string>;
    transfers: Set<string>;
  }>({
    stations: new Set(),
    segments: new Set(),
    transfers: new Set(),
  });

  const [lines, setLines] = useState<MetroLine[]>([
    {
      id: 1,
      color: '#90a05f',
      name: 'Арбатско-Покровская',
      stations: [
        { id: 1, x: 200, y: 300, color: '#90a05f', label: 'Парк победы', labelOffset: { x: 0, y: -60 } },
        { id: 2, x: 600, y: 300, color: '#90a05f', label: 'Кутузовская', labelOffset: { x: 0, y: -60 } },
      ],
      segments: [
        { fromStationId: 1, toStationId: 2, timeMinutes: 5 },
      ],
      isCircular: false,
      renderStyle: 'linear',
    },
    {
      id: 2,
      color: '#c6590c',
      name: 'Калининская',
      stations: [
        { id: 3, x: 300, y: 600, color: '#c6590c', label: 'Новокосино', labelOffset: { x: 0, y: -60 } },
        { id: 4, x: 700, y: 600, color: '#c6590c', label: 'Ломоносовская', labelOffset: { x: 0, y: -60 } },
      ],
      segments: [
        { fromStationId: 3, toStationId: 4, timeMinutes: 8 },
      ],
      isCircular: false,
      renderStyle: 'linear',
    },
  ]);

  // Модальные окна
  const [isCreateLineModalOpen, setIsCreateLineModalOpen] = useState(false);
  const [newLineName, setNewLineName] = useState('');
  const [newLineColor, setNewLineColor] = useState('#ff0000');

  // 👇 Состояния для новой объединенной модалки
  const [isCombinedInsertModalOpen, setIsCombinedInsertModalOpen] = useState(false);
  const [combinedInsertStep, setCombinedInsertStep] = useState<'position' | 'time'>('position');
  const [combinedInsertData, setCombinedInsertData] = useState<{
    insertAfter: string | number | null;
    adjacentStationId: number | null;
    newStationId: number;
    newStationLabel: string;
    lineId: number;
    isClosingLoop: boolean;
  } | null>(null);

  const [isTimeInputModalOpen, setIsTimeInputModalOpen] = useState(false);
  const [timeInputQueue, setTimeInputQueue] = useState<Array<{
    type: 'segment' | 'transfer';
    fromId: number;
    toId: number;
    action: 'create' | 'update';
    lineId?: number;
  }>>([]);
  const [inputTimeMinutes, setInputTimeMinutes] = useState<number | ''>('');
  const [currentInputTarget, setCurrentInputTarget] = useState<{
    type: 'segment' | 'transfer';
    fromId: number;
    toId: number;
    action: 'create' | 'update';
    lineId?: number;
  } | null>(null);

  // Редактирование
  const [isEditStationModalOpen, setIsEditStationModalOpen] = useState(false);
  const [editingStation, setEditingStation] = useState<Station | null>(null);
  const [editStationName, setEditStationName] = useState('');
  const [isEditSegmentModalOpen, setIsEditSegmentModalOpen] = useState(false);
  const [editingSegment, setEditingSegment] = useState<{ lineId: number; segment: Segment } | null>(null);
  const [isEditLineModalOpen, setIsEditLineModalOpen] = useState(false);
  const [editingLine, setEditingLine] = useState<MetroLine | null>(null);
  const [editLineName, setEditLineName] = useState('');
  const [editLineColor, setEditLineColor] = useState('');

  // 👇 Настройка подписи станции
  const [isLabelPositionModalOpen, setIsLabelPositionModalOpen] = useState(false);
  const [labelPositionStation, setLabelPositionStation] = useState<Station | null>(null);
  const [labelOffsetX, setLabelOffsetX] = useState(0);
  const [labelOffsetY, setLabelOffsetY] = useState(-60);

  // Удаление
  const [confirmDelete, setConfirmDelete] = useState<{
    type: 'station' | 'line' | 'transfer';
    id: number;
    lineId?: number;
  } | null>(null);

  // Перетаскивание сцены
  const [isDragging, setIsDragging] = useState(false);
  const [lastPointerPos, setLastPointerPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const container = stageRef.current?.container();
    if (container) {
      container.style.cursor = cursor;
    }
  }, [cursor]);

  // 👇 Обработка очереди ввода времени
  useEffect(() => {
    if (timeInputQueue.length > 0 && !isTimeInputModalOpen) {
      const next = timeInputQueue[0];
      setCurrentInputTarget(next);
      setIsTimeInputModalOpen(true);
      setTimeInputQueue(prev => prev.slice(1));
    }
  }, [timeInputQueue, isTimeInputModalOpen]);

  const getPointOnCircle = (
    centerX: number,
    centerY: number,
    radius: number,
    targetX: number,
    targetY: number,
    offset: number = 0
  ) => {
    const dx = targetX - centerX;
    const dy = targetY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance === 0) return { x: centerX, y: centerY };
    const ratio = (radius + offset) / distance;
    return {
      x: centerX + dx * ratio,
      y: centerY + dy * ratio,
    };
  };

  // 👇 Рассчитать позицию для вставки станции между двумя другими
  const getMidpoint = (x1: number, y1: number, x2: number, y2: number) => {
    return { x: (x1 + x2) / 2, y: (y1 + y2) / 2 };
  };

  // 👇 Рассчитать позицию для вставки после станции (продолжение линии)
  const getExtensionPoint = (x1: number, y1: number, x2: number, y2: number, distance = 100) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len === 0) return { x: x1 + distance, y: y1 };
    return {
      x: x2 + (dx / len) * distance,
      y: y2 + (dy / len) * distance,
    };
  };

  const handleCreateStation = () => {
    if (!stationName.trim()) {
      alert('Введите название станции!');
      return;
    }
    if (!selectedLineId) {
      alert('Выберите линию для новой станции!');
      return;
    }
    const currentLine = lines.find(line => line.id === selectedLineId);
    if (!currentLine) return;

    if (activeMode === 'addBetween') {
      if (insertBetween.firstId === null || insertBetween.secondId === null) {
        alert('Сначала выберите две станции, между которыми вставить новую!');
        return;
      }
      const allStations = lines.flatMap((line) => line.stations);
      const firstStation = allStations.find((s) => s.id === insertBetween.firstId);
      const secondStation = allStations.find((s) => s.id === insertBetween.secondId);
      if (!firstStation || !secondStation) {
        alert('Выбранные станции не найдены!');
        return;
      }
      const lineWithSegment = lines.find(line =>
        line.segments.some(seg =>
          (seg.fromStationId === insertBetween.firstId && seg.toStationId === insertBetween.secondId) ||
          (seg.fromStationId === insertBetween.secondId && seg.toStationId === insertBetween.firstId)
        )
      );
      if (!lineWithSegment) {
        alert('Сегмент между станциями не найден.');
        return;
      }
      const { x: layerX, y: layerY } = getMidpoint(firstStation.x, firstStation.y, secondStation.x, secondStation.y);
      const newStationId = Date.now();
      const newStation = {
        id: newStationId,
        x: layerX,
        y: layerY,
        color: lineWithSegment.color,
        label: stationName,
        labelOffset: { x: 0, y: -60 },
      };
      setLines((prevLines) =>
        prevLines.map((line) => {
          if (line.id !== lineWithSegment.id) return line;
          const firstIndex = line.stations.findIndex((s) => s.id === insertBetween.firstId);
          const secondIndex = line.stations.findIndex((s) => s.id === insertBetween.secondId);
          if (firstIndex === -1 || secondIndex === -1) return line;
          const insertIndex = Math.min(firstIndex, secondIndex) + 1;
          const newStations = [...line.stations];
          newStations.splice(insertIndex, 0, newStation);
          const newSegments = line.segments.filter(seg =>
            !(seg.fromStationId === insertBetween.firstId && seg.toStationId === insertBetween.secondId) &&
            !(seg.fromStationId === insertBetween.secondId && seg.toStationId === insertBetween.firstId)
          );
          // 👇 Сразу ставим в очередь запросы времени
          setTimeInputQueue([
            {
              type: 'segment',
              fromId: insertBetween.firstId,
              toId: newStationId,
              action: 'create',
              lineId: line.id,
            },
            {
              type: 'segment',
              fromId: newStationId,
              toId: insertBetween.secondId,
              action: 'create',
              lineId: line.id,
            },
          ]);
          return {
            ...line,
            stations: newStations,
            segments: newSegments,
          };
        })
      );
      setInsertBetween({ firstId: null, secondId: null });
      setCursor('default');
      setStationName(''); // 👈 Очищаем после успешного создания
    } else if (activeMode === 'idle') {
      // 👇 Если это первая станция на линии — добавляем без модалки
      if (currentLine.stations.length === 0) {
        const newStationId = Date.now();
        const newStation = {
          id: newStationId,
          x: 400,
          y: 400,
          color: currentLine.color,
          label: stationName,
          labelOffset: { x: 0, y: -60 },
        };
        setLines(prev => prev.map(line =>
          line.id === selectedLineId
            ? { ...line, stations: [newStation] }
            : line
        ));
        setStationName('');
        return;
      }

      // 👇 Открываем объединенную модалку
      setIsCombinedInsertModalOpen(true);
      setCombinedInsertStep('position');
      setCombinedInsertData({
        insertAfter: null,
        adjacentStationId: null,
        newStationId: Date.now(),
        newStationLabel: stationName,
        lineId: selectedLineId!,
        isClosingLoop: false,
      });
    }
  };

  const createNewLine = () => {
    setIsCreateLineModalOpen(true);
  };

  const handleMouseEnter = () => {
    if (activeMode === 'free') {
      setCursor('grab');
    }
  };

  const handleMouseLeave = () => setCursor('default');

  const handleDragStart = () => {
    if (activeMode === 'free') {
      setCursor('grabbing');
      setIsDragging(true);
    }
  };

  const handleDragEnd = (e: any, id: number) => {
    if (activeMode === 'free') {
      setIsDragging(false);
      setCursor('grab');
    } else {
      handleDragMove(e, id);
      setCursor('grab');
    }
  };

  const handleStageClick = (e: any) => {
    const stage = e.target.getStage();
    const pointer = stage.getPointerPosition();
    if (pointer) {
      setLastClickPos(pointer);
    }
    if (activeMode === 'free' && !isDragging) {
      return;
    }
    if (activeMode !== 'idle' && activeMode !== 'findPath' && activeMode !== 'closeLoop') return;
  };

  const handleStageMouseDown = (e: any) => {
    if (activeMode === 'free') {
      const stage = e.target.getStage();
      const pointer = stage.getPointerPosition();
      if (pointer) {
        setLastPointerPos(pointer);
        setIsDragging(true);
        setCursor('grabbing');
      }
    }
  };

  const handleStageMouseMove = (e: any) => {
    if (activeMode === 'free' && isDragging) {
      const stage = e.target.getStage();
      const pointer = stage.getPointerPosition();
      if (pointer && lastPointerPos) {
        const dx = pointer.x - lastPointerPos.x;
        const dy = pointer.y - lastPointerPos.y;
        setPosition(prev => ({
          x: prev.x + dx,
          y: prev.y + dy,
        }));
        setLastPointerPos(pointer);
      }
    }
  };

  const handleStageMouseUp = () => {
    if (activeMode === 'free' && isDragging) {
      setIsDragging(false);
      setCursor('grab');
      setLastPointerPos(null);
    }
  };

  // const handleWheel = useCallback((e: any) => {
  //   e.evt.preventDefault();
  //   const stage = stageRef.current;
  //   if (!stage) return;
  //   const oldScale = scale;
  //   const delta = e.evt.deltaY > 0 ? -0.1 : 0.1;
  //   const newScale = Math.max(0.1, Math.min(5, oldScale + delta));
  //   const pointer = stage.getPointerPosition();
  //   if (!pointer) return;
  //   const mousePointTo = {
  //     x: (pointer.x - position.x) / oldScale,
  //     y: (pointer.y - position.y) / oldScale,
  //   };
  //   setScale(newScale);
  //   const newPos = {
  //     x: pointer.x - mousePointTo.x * newScale,
  //     y: pointer.y - mousePointTo.y * newScale,
  //   };
  //   setPosition(newPos);
  // }, [scale, position]);
  //
  const handleDragMove = (e: any, stationId: number) => {
    if (activeMode === 'free') return;
    const node = e.target;
    setLines((prevLines) =>
      prevLines.map((line) => ({
        ...line,
        stations: line.stations.map((station) =>
          station.id === stationId
            ? { ...station, x: node.x(), y: node.y() }
            : station
        ),
      }))
    );
  };

  // 👇 Генерация SVG-пути для круговой линии
  const generateCircularPath = (stations: Station[], color: string, strokeWidth: number, radius: number) => {
    if (stations.length < 2) return null;
    const center = {
      x: stations.reduce((sum, s) => sum + s.x, 0) / stations.length,
      y: stations.reduce((sum, s) => sum + s.y, 0) / stations.length,
    };
    // Сортируем по углу
    const sortedStations = [...stations].sort((a, b) => {
      const angleA = Math.atan2(a.y - center.y, a.x - center.x);
      const angleB = Math.atan2(b.y - center.y, b.x - center.x);
      return angleA - angleB;
    });
    let pathData = '';
    let firstPoint: { x: number; y: number } | null = null;
    for (let i = 0; i < sortedStations.length; i++) {
      const current = sortedStations[i];
      const next = sortedStations[(i + 1) % sortedStations.length];
      const start = getPointOnCircle(current.x, current.y, radius, next.x, next.y, strokeWidth / 2);
      const end = getPointOnCircle(next.x, next.y, radius, current.x, current.y, strokeWidth / 2);
      if (i === 0) {
        pathData += `M ${start.x} ${start.y}`;
        firstPoint = start;
      }
      // Дуга через контрольную точку
      const midAngle = (Math.atan2(current.y - center.y, current.x - center.x) +
        Math.atan2(next.y - center.y, next.x - center.x)) / 2;
      const controlRadius = Math.sqrt((current.x - center.x) ** 2 + (current.y - center.y) ** 2) * 1.1;
      const controlX = center.x + Math.cos(midAngle) * controlRadius;
      const controlY = center.y + Math.sin(midAngle) * controlRadius;
      pathData += ` Q ${controlX} ${controlY} ${end.x} ${end.y}`;
    }
    if (firstPoint) {
      pathData += ' Z';
    }
    return (
      <Path
        key="circular-path"
        data={pathData}
        stroke={color}
        strokeWidth={strokeWidth}
        lineCap="round"
        lineJoin="round"
        fill="transparent"
      />
    );
  };

  const renderLine = (line: MetroLine) => {
    if (line.stations.length < 2) return null;
    const radius = 32;
    const strokeWidth = 15;
    if (line.renderStyle === 'circular' && line.isCircular) {
      return generateCircularPath(line.stations, line.color, strokeWidth, radius);
    }
    // 👇 Линейный стиль
    const points: number[] = [];
    for (let i = 0; i < line.stations.length; i++) {
      const current = line.stations[i];
      let startX = current.x;
      let startY = current.y;
      if (i > 0) {
        const prev = line.stations[i - 1];
        const fromPrev = getPointOnCircle(current.x, current.y, radius, prev.x, prev.y, strokeWidth / 2);
        startX = fromPrev.x;
        startY = fromPrev.y;
      }
      if (i < line.stations.length - 1) {
        const next = line.stations[i + 1];
        const toNext = getPointOnCircle(current.x, current.y, radius, next.x, next.y, strokeWidth / 2);
        points.push(startX, startY, toNext.x, toNext.y);
      } else {
        points.push(startX, startY);
      }
    }
    if (line.stations.length === 2) {
      const [first, second] = line.stations;
      const start = getPointOnCircle(first.x, first.y, radius, second.x, second.y, strokeWidth / 2);
      const end = getPointOnCircle(second.x, second.y, radius, first.x, first.y, strokeWidth / 2);
      return (
        <Line
          key={line.id}
          points={[start.x, start.y, end.x, end.y]}
          stroke={line.color}
          strokeWidth={strokeWidth}
          lineCap="round"
          lineJoin="round"
        />
      );
    }
    if (points.length < 4) return null;
    return (
      <Line
        key={line.id}
        points={points}
        stroke={line.color}
        strokeWidth={strokeWidth}
        lineCap="round"
        lineJoin="round"
      />
    );
  };

  const handleStationClick = (stationId: number, e: any) => {
    if (e.evt.button === 2) {
      e.evt.preventDefault();
      const menu = window.confirm(
        `Станция: ${getStationLabel(stationId)}
` +
        `Выберите действие:
` +
        `OK - Удалить станцию
` +
        `Отмена - Настроить подпись`
      );
      if (menu) {
        setConfirmDelete({ type: 'station', id: stationId });
      } else {
        const station = lines.flatMap(l => l.stations).find(s => s.id === stationId);
        if (station) {
          setLabelPositionStation(station);
          setLabelOffsetX(station.labelOffset.x);
          setLabelOffsetY(station.labelOffset.y);
          setIsLabelPositionModalOpen(true);
        }
      }
      return;
    }
    if (e.evt.detail === 2) {
      const station = lines.flatMap(l => l.stations).find(s => s.id === stationId);
      if (station) {
        setEditingStation(station);
        setEditStationName(station.label);
        setIsEditStationModalOpen(true);
      }
      return;
    }
    const allStations = lines.flatMap((line) => line.stations);
    const clickedStation = allStations.find(s => s.id === stationId);
    if (activeMode === 'addBetween') {
      if (insertBetween.firstId === null) {
        setInsertBetween({ firstId: stationId, secondId: null });
        setCursor('crosshair');
      } else if (insertBetween.secondId === null && insertBetween.firstId !== stationId) {
        const firstStation = allStations.find(s => s.id === insertBetween.firstId);
        setInsertBetween({ firstId: insertBetween.firstId, secondId: stationId });
        setCursor('default');
        alert(`Выбран интервал между станциями "${firstStation?.label || '—'}" и "${clickedStation?.label || '—'}"`);
      } else {
        setInsertBetween({ firstId: null, secondId: null });
        setCursor('default');
      }
    } else if (activeMode === 'createTransfer') {
      if (transferStartStationId === null) {
        setTransferStartStationId(stationId);
        setCursor('copy');
        alert(`Выбрана начальная станция "${clickedStation?.label || '—'}" — выберите конечную`);
      } else {
        if (transferStartStationId === stationId) {
          alert('Нельзя соединить станцию с самой собой.');
          setTransferStartStationId(null);
          setCursor('default');
          return;
        }
        setTimeInputQueue([
          {
            type: 'transfer',
            fromId: transferStartStationId,
            toId: stationId,
            action: 'create',
          },
        ]);
        setTransferStartStationId(null);
        setCursor('default');
      }
    } else if (activeMode === 'findPath') {
      if (pathStartStationId === null) {
        setPathStartStationId(stationId);
        alert(`Начальная станция: ${clickedStation?.label}`);
      } else if (pathEndStationId === null && pathStartStationId !== stationId) {
        setPathEndStationId(stationId);
        alert(`Конечная станция: ${clickedStation?.label}`);
        calculateShortestPath(pathStartStationId, stationId);
      } else {
        setPathStartStationId(null);
        setPathEndStationId(null);
        setCalculatedPath(null);
        setHighlightedPath({ stations: new Set(), segments: new Set(), transfers: new Set() });
      }
    } else if (activeMode === 'closeLoop') {
      const line = lines.find(l => l.stations.some(s => s.id === stationId));
      if (!line) {
        alert('Станция не принадлежит ни одной линии');
        return;
      }
      if (line.stations.length < 2) {
        alert('Нужно минимум 2 станции для замыкания');
        return;
      }
      setLines(prev => prev.map(l => {
        if (l.id !== line.id) return l;
        const firstId = l.stations[0].id;
        const lastId = l.stations[l.stations.length - 1].id;
        const hasSegment = l.segments.some(seg =>
          (seg.fromStationId === firstId && seg.toStationId === lastId) ||
          (seg.fromStationId === lastId && seg.toStationId === firstId)
        );
        if (hasSegment) {
          alert('Линия уже замкнута');
          return l;
        }
        setTimeInputQueue([
          {
            type: 'segment',
            fromId: firstId,
            toId: lastId,
            action: 'create',
            lineId: l.id,
          },
        ]);
        return {
          ...l,
          isCircular: true,
        };
      }));
      setActiveMode('idle');
      setCursor('default');
      alert('Линия будет замкнута после ввода времени');
    }
  };

  // 👇 Улучшенный алгоритм с группировкой сегментов одной линии
  const calculateShortestPath = (startId: number, endId: number) => {
    const graph = new Map<number, { to: number; time: number; type: 'line' | 'transfer'; lineId?: number }[]>();
    const allStations = lines.flatMap(l => l.stations);
    allStations.forEach(station => {
      graph.set(station.id, []);
    });
    // Добавляем пересадки
    transferLines.forEach((transfer, index) => {
      if (!graph.has(transfer.fromStationId)) graph.set(transfer.fromStationId, []);
      if (!graph.has(transfer.toStationId)) graph.set(transfer.toStationId, []);
      graph.get(transfer.fromStationId)!.push({
        to: transfer.toStationId,
        time: transfer.timeMinutes,
        type: 'transfer',
        lineId: undefined
      });
      graph.get(transfer.toStationId)!.push({
        to: transfer.fromStationId,
        time: transfer.timeMinutes,
        type: 'transfer',
        lineId: undefined
      });
    });
    // Добавляем сегменты линий с указанием lineId
    lines.forEach(line => {
      line.segments.forEach(seg => {
        if (!graph.has(seg.fromStationId)) graph.set(seg.fromStationId, []);
        if (!graph.has(seg.toStationId)) graph.set(seg.toStationId, []);
        graph.get(seg.fromStationId)!.push({
          to: seg.toStationId,
          time: seg.timeMinutes,
          type: 'line',
          lineId: line.id
        });
        graph.get(seg.toStationId)!.push({
          to: seg.fromStationId,
          time: seg.timeMinutes,
          type: 'line',
          lineId: line.id
        });
      });
    });
    // Алгоритм Дейкстры
    const distances = new Map<number, number>();
    const previous = new Map<number, { from: number; type: 'line' | 'transfer'; lineId?: number }>();
    const visited = new Set<number>();
    const queue: { id: number; distance: number }[] = [];
    distances.set(startId, 0);
    queue.push({ id: startId, distance: 0 });
    while (queue.length > 0) {
      let minIndex = 0;
      for (let i = 1; i < queue.length; i++) {
        if (queue[i].distance < queue[minIndex].distance) {
          minIndex = i;
        }
      }
      const current = queue.splice(minIndex, 1)[0];
      if (visited.has(current.id)) continue;
      visited.add(current.id);
      if (current.id === endId) break;
      const neighbors = graph.get(current.id) || [];
      for (const neighbor of neighbors) {
        if (visited.has(neighbor.to)) continue;
        const newDistance = (distances.get(current.id) || 0) + neighbor.time;
        const currentBest = distances.get(neighbor.to) || Infinity;
        if (newDistance < currentBest) {
          distances.set(neighbor.to, newDistance);
          previous.set(neighbor.to, { from: current.id, type: neighbor.type, lineId: neighbor.lineId });
          queue.push({ id: neighbor.to, distance: newDistance });
        }
      }
    }
    if (!distances.has(endId) || distances.get(endId) === Infinity) {
      alert('Маршрут не найден! Убедитесь, что между станциями есть сегменты с указанным временем.');
      return;
    }
    // Восстанавливаем путь
    const pathStations: number[] = [];
    const rawSegments: { from: number; to: number; type: 'line' | 'transfer'; lineId?: number }[] = [];
    let current = endId;
    while (current !== startId) {
      pathStations.unshift(current);
      const prev = previous.get(current);
      if (!prev) break;
      rawSegments.unshift({ from: prev.from, to: current, type: prev.type, lineId: prev.lineId });
      current = prev.from;
    }
    pathStations.unshift(startId);
    // 👇 Группируем последовательные сегменты одной линии
    const groupedSegments: { from: number; to: number; type: 'line' | 'transfer'; time: number; lineId?: number }[] = [];
    let i = 0;
    while (i < rawSegments.length) {
      const currentSeg = rawSegments[i];
      if (currentSeg.type === 'transfer') {
        groupedSegments.push({
          ...currentSeg,
          time: getTimeBetween(currentSeg.from, currentSeg.to, currentSeg.type)
        });
        i++;
      } else {
        // Начинаем группировку сегментов одной линии
        let groupStart = i;
        let currentLineId = currentSeg.lineId;
        let totalTime = getTimeBetween(currentSeg.from, currentSeg.to, currentSeg.type);
        // Ищем последовательные сегменты той же линии
        while (i + 1 < rawSegments.length &&
        rawSegments[i + 1].type === 'line' &&
        rawSegments[i + 1].lineId === currentLineId) {
          i++;
          totalTime += getTimeBetween(rawSegments[i].from, rawSegments[i].to, 'line');
        }
        groupedSegments.push({
          from: rawSegments[groupStart].from,
          to: rawSegments[i].to,
          type: 'line',
          time: totalTime,
          lineId: currentLineId
        });
        i++;
      }
    }
    setCalculatedPath({
      totalMinutes: distances.get(endId)!,
      stations: pathStations,
      segments: groupedSegments,
    });

    // 👇 Создаем наборы ключей для подсветки сегментов, пересадок и станций
    const newHighlightedStations = new Set<number>();
    const newHighlightedSegments = new Set<string>();
    const newHighlightedTransfers = new Set<string>();

    // Подсвечиваем все станции маршрута
    pathStations.forEach(stationId => newHighlightedStations.add(stationId));

    // Подсвечиваем все сегменты маршрута
    groupedSegments.forEach(seg => {
      const key = `${seg.from}-${seg.to}`;
      const reverseKey = `${seg.to}-${seg.from}`;
      if (seg.type === 'line') {
        newHighlightedSegments.add(key);
        newHighlightedSegments.add(reverseKey);
      } else if (seg.type === 'transfer') {
        newHighlightedTransfers.add(key);
        newHighlightedTransfers.add(reverseKey);
      }
    });

    setHighlightedPath({
      stations: newHighlightedStations,
      segments: newHighlightedSegments,
      transfers: newHighlightedTransfers,
    });

    // 👇 Формируем описание с группировкой
    let routeDescription = `Маршрут от "${getStationLabel(startId)}" до "${getStationLabel(endId)}":
`;
    routeDescription += `Общее время: ${distances.get(endId)} минут
`;
    routeDescription += `Станции (${pathStations.length}): ${pathStations.map(id => getStationLabel(id)).join(' → ')}
`;
    if (groupedSegments.length > 0) {
      routeDescription += 'Детали:';
      groupedSegments.forEach((seg, i) => {
        const fromLabel = getStationLabel(seg.from);
        const toLabel = getStationLabel(seg.to);
        const typeLabel = seg.type === 'transfer' ? ' (пересадка)' : seg.lineId ? ` (линия ${lines.find(l => l.id === seg.lineId)?.name || '—'})` : '';
        routeDescription += `${i + 1}. ${fromLabel} → ${toLabel}${typeLabel}: ${seg.time} мин
`;
      });
    }
    alert(routeDescription);
  };

  const getStationLabel = (stationId: number) => {
    const station = lines.flatMap(l => l.stations).find(s => s.id === stationId);
    return station?.label || `Станция ${stationId}`;
  };

  const getTimeBetween = (fromId: number, toId: number, type: 'line' | 'transfer') => {
    if (type === 'line') {
      for (const line of lines) {
        for (const seg of line.segments) {
          if ((seg.fromStationId === fromId && seg.toStationId === toId) ||
            (seg.fromStationId === toId && seg.toStationId === fromId)) {
            return seg.timeMinutes;
          }
        }
      }
    } else {
      for (const transfer of transferLines) {
        if ((transfer.fromStationId === fromId && transfer.toStationId === toId) ||
          (transfer.fromStationId === toId && transfer.toStationId === fromId)) {
          return transfer.timeMinutes;
        }
      }
    }
    return 0;
  };

  const renderTransferLine = (transfer: TransferLine, index: number) => {
    const allStations = lines.flatMap((line) => line.stations);
    const fromStation = allStations.find((s) => s.id === transfer.fromStationId);
    const toStation = allStations.find((s) => s.id === transfer.toStationId);
    if (!fromStation || !toStation) return null;
    const radius = 32;
    const strokeWidth = 20;
    const offset = strokeWidth / 2;
    const startPoint = getPointOnCircle(fromStation.x, fromStation.y, radius, toStation.x, toStation.y, offset);
    const endPoint = getPointOnCircle(toStation.x, toStation.y, radius, fromStation.x, fromStation.y, offset);

    // 👇 Проверяем, входит ли этот сегмент в подсвеченный маршрут
    const isHighlighted = highlightedPath.transfers.has(`${transfer.fromStationId}-${transfer.toStationId}`) ||
      highlightedPath.transfers.has(`${transfer.toStationId}-${transfer.fromStationId}`);

    return (
      <Line
        key={`transfer-${index}`}
        points={[startPoint.x, startPoint.y, endPoint.x, endPoint.y]}
        strokeWidth={strokeWidth}
        lineCap="round"
        lineJoin="round"
        stroke={isHighlighted ? '#ffff00' : undefined}
        strokeLinearGradientStartPoint={{ x: startPoint.x, y: startPoint.y }}
        strokeLinearGradientEndPoint={{ x: endPoint.x, y: endPoint.y }}
        strokeLinearGradientColorStops={[0, isHighlighted ? '#ffff00' : fromStation.color, 1, isHighlighted ? '#ffff00' : toStation.color]}
        onContextMenu={(e) => {
          e.evt.preventDefault();
          setConfirmDelete({ type: 'transfer', id: index });
        }}
        onDblClick={() => {
          setTimeInputQueue([
            {
              type: 'transfer',
              fromId: transfer.fromStationId,
              toId: transfer.toStationId,
              action: 'update',
            },
          ]);
        }}
      />
    );
  };

  const renderSegmentLabel = (segment: Segment, index: number, lineId: number) => {
    const allStations = lines.flatMap((line) => line.stations);
    const fromStation = allStations.find((s) => s.id === segment.fromStationId);
    const toStation = allStations.find((s) => s.id === segment.toStationId);
    if (!fromStation || !toStation) return null;
    const midX = (fromStation.x + toStation.x) / 2;
    const midY = (fromStation.y + toStation.y) / 2 - 15;

    // Проверяем, входит ли этот сегмент в подсвеченный маршрут
    const isHighlighted = highlightedPath.segments.has(`${segment.fromStationId}-${segment.toStationId}`) ||
      highlightedPath.segments.has(`${segment.toStationId}-${segment.fromStationId}`);

    return (
      <Text
        key={`seg-label-${lineId}-${index}`}
        x={midX}
        y={midY}
        text={`${segment.timeMinutes} мин`}
        fontSize={14 / scale}
        fill={isHighlighted ? '#ffff00' : '#fff'}
        align="center"
        onDblClick={() => {
          setEditingSegment({ lineId, segment });
          setInputTimeMinutes(segment.timeMinutes);
          setIsEditSegmentModalOpen(true);
        }}
      />
    );
  };

  const renderTransferLabel = (transfer: TransferLine, index: number) => {
    const allStations = lines.flatMap((line) => line.stations);
    const fromStation = allStations.find((s) => s.id === transfer.fromStationId);
    const toStation = allStations.find((s) => s.id === transfer.toStationId);
    if (!fromStation || !toStation) return null;
    const midX = (fromStation.x + toStation.x) / 2;
    const midY = (fromStation.y + toStation.y) / 2 + 20;

    // 👇 Проверяем, входит ли этот сегмент в подсвеченный маршрут
    const isHighlighted = highlightedPath.transfers.has(`${transfer.fromStationId}-${transfer.toStationId}`) ||
      highlightedPath.transfers.has(`${transfer.toStationId}-${transfer.fromStationId}`);

    return (
      <Text
        key={`transfer-label-${index}`}
        x={midX}
        y={midY}
        text={`${transfer.timeMinutes} мин (пересадка)`}
        fontSize={12 / scale}
        fill={isHighlighted ? '#ffff00' : '#fff'}
        align="center"
        onDblClick={() => {
          setTimeInputQueue([
            {
              type: 'transfer',
              fromId: transfer.fromStationId,
              toId: transfer.toStationId,
              action: 'update',
            },
          ]);
        }}
      />
    );
  };

  const resetModes = () => {
    setInsertBetween({ firstId: null, secondId: null });
    setTransferStartStationId(null);
    setPathStartStationId(null);
    setPathEndStationId(null);
    setCalculatedPath(null);
    setHighlightedPath({ stations: new Set(), segments: new Set(), transfers: new Set() });
    setCursor('default');
  };

  const handleEditStation = () => {
    if (!editingStation || !editStationName.trim()) {
      alert('Введите название станции');
      return;
    }
    setLines(prev => prev.map(line => ({
      ...line,
      stations: line.stations.map(station =>
        station.id === editingStation.id
          ? { ...station, label: editStationName.trim() }
          : station
      ),
    })));
    setIsEditStationModalOpen(false);
    setEditingStation(null);
    setEditStationName('');
  };

  const handleEditSegment = () => {
    if (!editingSegment || typeof inputTimeMinutes !== 'number' || inputTimeMinutes <= 0) {
      alert('Введите корректное время');
      return;
    }
    setLines(prev => prev.map(line => {
      if (line.id !== editingSegment.lineId) return line;
      return {
        ...line,
        segments: line.segments.map(seg =>
          (seg.fromStationId === editingSegment.segment.fromStationId && seg.toStationId === editingSegment.segment.toStationId) ||
          (seg.fromStationId === editingSegment.segment.toStationId && seg.toStationId === editingSegment.segment.fromStationId)
            ? { ...seg, timeMinutes: inputTimeMinutes }
            : seg
        ),
      };
    }));
    setIsEditSegmentModalOpen(false);
    setEditingSegment(null);
    setInputTimeMinutes('');
  };

  const handleEditLine = () => {
    if (!editingLine || !editLineName.trim()) {
      alert('Введите название линии');
      return;
    }
    if (!/^#[0-9A-F]{6}$/i.test(editLineColor)) {
      alert('Цвет должен быть в формате HEX, например: #ff0000');
      return;
    }
    setLines(prev => prev.map(line =>
      line.id === editingLine.id
        ? {
          ...line,
          name: editLineName.trim(),
          color: editLineColor,
          // 👇 Обновляем цвет всех станций этой линии
          stations: line.stations.map(station => ({
            ...station,
            color: editLineColor
          }))
        }
        : line
    ));
    setIsEditLineModalOpen(false);
    setEditingLine(null);
    setEditLineName('');
    setEditLineColor('');
  };

  const handleLabelPositionUpdate = () => {
    if (!labelPositionStation) return;
    setLines(prev => prev.map(line => ({
      ...line,
      stations: line.stations.map(station =>
        station.id === labelPositionStation.id
          ? { ...station, labelOffset: { x: labelOffsetX, y: labelOffsetY } }
          : station
      ),
    })));
    setIsLabelPositionModalOpen(false);
    setLabelPositionStation(null);
    setLabelOffsetX(0);
    setLabelOffsetY(-60);
  };

  const handleConfirmDelete = () => {
    if (!confirmDelete) return;
    if (confirmDelete.type === 'station') {
      const stationId = confirmDelete.id;
      let found = false;
      setLines(prev => prev.map(line => {
        const stationIndex = line.stations.findIndex(s => s.id === stationId);
        if (stationIndex === -1) return line;
        found = true;
        const newSegments = line.segments.filter(seg =>
          seg.fromStationId !== stationId && seg.toStationId !== stationId
        );
        const newStations = line.stations.filter(s => s.id !== stationId);
        return {
          ...line,
          stations: newStations,
          segments: newSegments,
        };
      }));
      setTransferLines(prev => prev.filter(transfer =>
        transfer.fromStationId !== stationId && transfer.toStationId !== stationId
      ));
      if (found) {
        alert('Станция удалена');
      } else {
        alert('Станция не найдена');
      }
    } else if (confirmDelete.type === 'line') {
      const lineId = confirmDelete.id;
      setLines(prev => prev.filter(line => line.id !== lineId));
      alert('Линия удалена');
    } else if (confirmDelete.type === 'transfer') {
      const index = confirmDelete.id;
      setTransferLines(prev => prev.filter((_, i) => i !== index));
      alert('Пересадка удалена');
    }
    setConfirmDelete(null);
  };

  // 👇 Новый компонент объединенной модалки
  const CombinedInsertModal = () => {
    if (!isCombinedInsertModalOpen || !combinedInsertData) return null;

    const { lineId, newStationId, newStationLabel } = combinedInsertData;
    const currentLine = lines.find(line => line.id === lineId);
    if (!currentLine) return null;

    const selectRef = useRef<HTMLSelectElement>(null);

    // 👇 Обработчик выбора позиции
    const handlePositionSelect = () => {
      const select = selectRef.current;
      if (!select) return;

      const insertAfter = select.value;
      let adjacentStationId: number | null = null;
      let isClosingLoop = false;

      if (insertAfter === 'start') {
        adjacentStationId = currentLine.stations[0]?.id || null;
      } else if (insertAfter === 'end') {
        adjacentStationId = currentLine.stations[currentLine.stations.length - 1]?.id || null;
      } else if (insertAfter === 'closeLoop') {
        adjacentStationId = currentLine.stations[currentLine.stations.length - 1]?.id || null;
        isClosingLoop = true;
      } else {
        const afterStation = currentLine.stations.find(s => s.id === Number(insertAfter));
        adjacentStationId = afterStation?.id || null;
      }

      setCombinedInsertData(prev => prev ? { ...prev, insertAfter, adjacentStationId, isClosingLoop } : null);
      setCombinedInsertStep('time'); // Переходим к шагу ввода времени
    };

    // 👇 Обработчик подтверждения создания станции и времени
    const handleTimeSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (typeof inputTimeMinutes !== 'number' || inputTimeMinutes <= 0) {
        alert('Введите корректное время (положительное число)');
        return;
      }

      const { insertAfter, adjacentStationId, isClosingLoop } = combinedInsertData;

      // 👇 Создаем станцию на сцене
      setLines((prevLines) =>
        prevLines.map((line) => {
          if (line.id !== lineId) return line;

          let insertIndex = line.stations.length;
          let finalX = 400;
          let finalY = 400;
          let shouldCloseLoop = isClosingLoop;

          const firstStation = line.stations[0];
          const lastStation = line.stations[line.stations.length - 1];

          if (insertAfter === 'start') {
            insertIndex = 0;
            if (line.stations.length > 1) {
              const secondStation = line.stations[1];
              const point = getExtensionPoint(secondStation.x, secondStation.y, firstStation.x, firstStation.y, 100);
              finalX = point.x;
              finalY = point.y;
            } else {
              finalX = firstStation.x - 100;
              finalY = firstStation.y;
            }
          } else if (insertAfter === 'end') {
            insertIndex = line.stations.length;
            if (line.stations.length > 1) {
              const prevStation = line.stations[line.stations.length - 2];
              const point = getExtensionPoint(prevStation.x, prevStation.y, lastStation.x, lastStation.y, 100);
              finalX = point.x;
              finalY = point.y;
            } else {
              finalX = lastStation.x + 100;
              finalY = lastStation.y;
            }
          } else if (insertAfter === 'closeLoop') {
            insertIndex = line.stations.length;
            finalX = (firstStation.x + lastStation.x) / 2;
            finalY = (firstStation.y + lastStation.y) / 2 - 80;
          } else {
            const afterIndex = line.stations.findIndex((s) => s.id === Number(insertAfter));
            if (afterIndex !== -1) {
              insertIndex = afterIndex + 1;
              const afterStation = line.stations[afterIndex];
              if (afterIndex + 1 < line.stations.length) {
                const nextStation = line.stations[afterIndex + 1];
                const point = getMidpoint(afterStation.x, afterStation.y, nextStation.x, nextStation.y);
                finalX = point.x;
                finalY = point.y;
              } else {
                if (afterIndex > 0) {
                  const prevStation = line.stations[afterIndex - 1];
                  const point = getExtensionPoint(prevStation.x, prevStation.y, afterStation.x, afterStation.y, 100);
                  finalX = point.x;
                  finalY = point.y;
                } else {
                  finalX = afterStation.x + 100;
                  finalY = afterStation.y;
                }
              }
            }
          }

          const newStation = {
            id: newStationId,
            x: finalX,
            y: finalY,
            color: line.color,
            label: newStationLabel,
            labelOffset: { x: 0, y: -60 },
          };

          const newStations = [...line.stations];
          newStations.splice(insertIndex, 0, newStation);

          if (shouldCloseLoop) {
            // 👇 Исправление: НЕ добавляем сегмент вручную.
            // Вместо этого, просто помечаем линию как круговую.
            // Сегмент будет создан автоматически при рендере кругового пути.
            // setTimeInputQueue([
            //   {
            //     type: 'segment',
            //     fromId: firstStation.id,
            //     toId: lastStation.id,
            //     action: 'create',
            //     lineId: line.id,
            //   },
            // ]);

            return {
              ...line,
              stations: newStations,
              isCircular: true, // 👈 Это главное изменение
            };
          }

          // 👇 Ставим в очередь запрос времени для одного сегмента
          if (adjacentStationId !== null) {
            setTimeInputQueue([
              {
                type: 'segment',
                fromId: adjacentStationId,
                toId: newStationId,
                action: 'create',
                lineId: line.id,
              },
            ]);
          }

          return {
            ...line,
            stations: newStations,
          };
        })
      );

      // 👇 Закрываем модалку и сбрасываем состояние
      setIsCombinedInsertModalOpen(false);
      setCombinedInsertData(null);
      setCombinedInsertStep('position');
      setInputTimeMinutes('');
      setStationName(''); // 👈 Очищаем после успешного создания
    };

    // 👇 Обработчик отмены
    const handleClose = () => {
      setIsCombinedInsertModalOpen(false);
      setCombinedInsertData(null);
      setCombinedInsertStep('position');
      setInputTimeMinutes('');
    };

    if (combinedInsertStep === 'position') {
      return (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '10px',
            minWidth: '350px',
          }}>
            <h3 style={{ margin: 0, marginBottom: '20px' }}>Создание станции: "{newStationLabel}"</h3>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
                Выберите позицию вставки:
              </label>
              <select
                ref={selectRef}
                defaultValue="end"
                style={{ width: '100%', padding: '10px', fontSize: '16px' }}
              >
                <option value="start">В начало линии</option>
                {currentLine.stations.map(station => (
                  <option key={station.id} value={station.id}>
                    После "{station.label}"
                  </option>
                ))}
                <option value="end">В конец линии</option>
                {currentLine.stations.length >= 2 && (
                  <option value="closeLoop">Замкнуть с началом (кольцо)</option>
                )}
              </select>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={handleClose}
                style={{
                  padding: '10px 20px',
                  fontSize: '14px',
                  background: '#ccc',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={handlePositionSelect}
                style={{
                  padding: '10px 20px',
                  fontSize: '14px',
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Далее
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (combinedInsertStep === 'time') {
      const { adjacentStationId, insertAfter, isClosingLoop } = combinedInsertData;
      const adjacentStation = currentLine.stations.find(s => s.id === adjacentStationId);
      const firstStation = currentLine.stations[0];
      const lastStation = currentLine.stations[currentLine.stations.length - 1];

      return (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '10px',
            minWidth: '350px',
          }}>
            <h3 style={{ margin: 0, marginBottom: '20px' }}>
              Введите время в пути (минуты)
            </h3>
            <div style={{ marginBottom: '20px' }}>
              <p>
                {!isClosingLoop ? (
                  <>
                    От: <strong>{adjacentStation?.label || '—'}</strong><br />
                    До: <strong>{newStationLabel}</strong>
                  </>
                ) : (
                  <>
                    <strong>Замыкание кольца:</strong><br />
                    От: <strong>{firstStation?.label || '—'}</strong><br />
                    До: <strong>{lastStation?.label || '—'}</strong>
                  </>
                )}
              </p>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Время (мин):
              </label>
              <input
                type="number"
                min="1"
                value={inputTimeMinutes}
                onChange={(e) => setInputTimeMinutes(e.target.value === '' ? '' : Number(e.target.value))}
                style={{ width: '100%', padding: '8px', fontSize: '16px' }}
                autoFocus
              />
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setCombinedInsertStep('position')} // Возврат к выбору позиции
                style={{
                  padding: '8px 16px',
                  fontSize: '14px',
                  background: '#ccc',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Назад
              </button>
              <button
                type="button"
                onClick={handleTimeSubmit}
                disabled={typeof inputTimeMinutes !== 'number' || inputTimeMinutes <= 0}
                style={{
                  padding: '8px 16px',
                  fontSize: '14px',
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  opacity: (typeof inputTimeMinutes !== 'number' || inputTimeMinutes <= 0) ? 0.5 : 1,
                }}
              >
                Создать станцию
              </button>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  // 👇 Остальные компоненты модальных окон без изменений...
  const CreateLineModal = () => {
    if (!isCreateLineModalOpen) return null;
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newLineName.trim()) {
        alert('Введите название линии!');
        return;
      }
      if (!/^#[0-9A-F]{6}$/i.test(newLineColor)) {
        alert('Цвет должен быть в формате HEX, например: #ff0000');
        return;
      }
      const newLine: MetroLine = {
        id: Date.now(),
        color: newLineColor,
        name: newLineName.trim(),
        stations: [],
        segments: [],
        isCircular: false,
        renderStyle: 'linear',
      };
      setLines((prev) => [...prev, newLine]);
      setSelectedLineId(newLine.id);
      setIsCreateLineModalOpen(false);
      setNewLineName('');
      setNewLineColor('#ff0000');
    };
    const handleClose = () => {
      setIsCreateLineModalOpen(false);
      setNewLineName('');
      setNewLineColor('#ff0000');
    };
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '10px',
          minWidth: '300px',
        }}>
          <h3 style={{ margin: 0, marginBottom: '20px' }}>Создать новую линию</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Название линии:
              </label>
              <input
                type="text"
                value={newLineName}
                onChange={(e) => setNewLineName(e.target.value)}
                style={{ width: '100%', padding: '8px', fontSize: '16px' }}
                autoFocus
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Цвет линии:
              </label>
              <input
                type="color"
                value={newLineColor}
                onChange={(e) => setNewLineColor(e.target.value)}
                style={{ width: '60px', height: '40px', border: 'none', cursor: 'pointer' }}
              />
              <input
                type="text"
                value={newLineColor}
                onChange={(e) => setNewLineColor(e.target.value)}
                style={{ marginLeft: '10px', padding: '8px', fontSize: '16px', width: '100px' }}
                placeholder="#ff0000"
              />
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={handleClose}
                style={{
                  padding: '8px 16px',
                  fontSize: '14px',
                  background: '#ccc',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Отмена
              </button>
              <button
                type="submit"
                style={{
                  padding: '8px 16px',
                  fontSize: '14px',
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Создать
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // 👇 Этот компонент больше не используется, но оставлен для референса
  const InsertPositionModal = () => {
    return null;
  };

  const TimeInputModal = () => {
    if (!isTimeInputModalOpen || !currentInputTarget) return null;
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (typeof inputTimeMinutes !== 'number' || inputTimeMinutes <= 0) {
        alert('Введите корректное время (положительное число)');
        return;
      }
      const { type, fromId, toId, action, lineId } = currentInputTarget;
      if (type === 'segment' && lineId) {
        setLines((prevLines) =>
          prevLines.map((line) => {
            if (line.id !== lineId) return line;
            if (action === 'create') {
              const exists = line.segments.some(seg =>
                (seg.fromStationId === fromId && seg.toStationId === toId) ||
                (seg.fromStationId === toId && seg.toStationId === fromId)
              );
              if (!exists) {
                return {
                  ...line,
                  segments: [
                    ...line.segments,
                    { fromStationId: fromId, toStationId: toId, timeMinutes: inputTimeMinutes },
                  ],
                };
              }
            } else {
              return {
                ...line,
                segments: line.segments.map(seg =>
                  (seg.fromStationId === fromId && seg.toStationId === toId) ||
                  (seg.fromStationId === toId && seg.toStationId === fromId)
                    ? { ...seg, timeMinutes: inputTimeMinutes }
                    : seg
                ),
              };
            }
            return line;
          })
        );
      } else if (type === 'transfer') {
        if (action === 'create') {
          const exists = transferLines.some(t =>
            (t.fromStationId === fromId && t.toStationId === toId) ||
            (t.fromStationId === toId && t.toStationId === fromId)
          );
          if (!exists) {
            setTransferLines(prev => [
              ...prev,
              { fromStationId: fromId, toStationId: toId, timeMinutes: inputTimeMinutes },
            ]);
          }
        } else {
          setTransferLines(prev => prev.map(t =>
            (t.fromStationId === fromId && t.toStationId === toId) ||
            (t.fromStationId === toId && t.toStationId === fromId)
              ? { ...t, timeMinutes: inputTimeMinutes }
              : t
          ));
        }
      }
      setIsTimeInputModalOpen(false);
      setCurrentInputTarget(null);
      setInputTimeMinutes('');
    };
    const handleClose = () => {
      setIsTimeInputModalOpen(false);
      setCurrentInputTarget(null);
      setInputTimeMinutes('');
    };
    const stationMap = new Map<number, Station>();
    lines.forEach(line => {
      line.stations.forEach(station => stationMap.set(station.id, station));
    });
    const fromStation = stationMap.get(currentInputTarget.fromId);
    const toStation = stationMap.get(currentInputTarget.toId);
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '10px',
          minWidth: '350px',
        }}>
          <h3 style={{ margin: 0, marginBottom: '20px' }}>
            {currentInputTarget.action === 'update' ? 'Изменить время' : 'Введите время в пути'} (минуты)
          </h3>
          <div style={{ marginBottom: '20px' }}>
            <p>
              От: <strong>{fromStation?.label || '—'}</strong><br />
              До: <strong>{toStation?.label || '—'}</strong>
            </p>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Время (мин):
            </label>
            <input
              type="number"
              min="1"
              value={inputTimeMinutes}
              onChange={(e) => setInputTimeMinutes(e.target.value === '' ? '' : Number(e.target.value))}
              style={{ width: '100%', padding: '8px', fontSize: '16px' }}
              autoFocus
            />
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={handleClose}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                background: '#ccc',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Отмена
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={typeof inputTimeMinutes !== 'number' || inputTimeMinutes <= 0}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                opacity: (typeof inputTimeMinutes !== 'number' || inputTimeMinutes <= 0) ? 0.5 : 1,
              }}
            >
              Сохранить
            </button>
          </div>
        </div>
      </div>
    );
  };

  const EditStationModal = () => {
    if (!isEditStationModalOpen || !editingStation) return null;
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '10px',
          minWidth: '300px',
        }}>
          <h3 style={{ margin: 0, marginBottom: '20px' }}>Изменить станцию</h3>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Название станции:
            </label>
            <input
              type="text"
              value={editStationName}
              onChange={(e) => setEditStationName(e.target.value)}
              style={{ width: '100%', padding: '8px', fontSize: '16px' }}
              autoFocus
            />
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => {
                setIsEditStationModalOpen(false);
                setEditingStation(null);
                setEditStationName('');
              }}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                background: '#ccc',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Отмена
            </button>
            <button
              type="button"
              onClick={handleEditStation}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Сохранить
            </button>
          </div>
        </div>
      </div>
    );
  };

  const EditSegmentModal = () => {
    if (!isEditSegmentModalOpen || !editingSegment) return null;
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '10px',
          minWidth: '350px',
        }}>
          <h3 style={{ margin: 0, marginBottom: '20px' }}>Изменить время сегмента</h3>
          <div style={{ marginBottom: '20px' }}>
            <p>
              От: <strong>{getStationLabel(editingSegment.segment.fromStationId)}</strong><br />
              До: <strong>{getStationLabel(editingSegment.segment.toStationId)}</strong>
            </p>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Время (мин):
            </label>
            <input
              type="number"
              min="1"
              value={inputTimeMinutes}
              onChange={(e) => setInputTimeMinutes(e.target.value === '' ? '' : Number(e.target.value))}
              style={{ width: '100%', padding: '8px', fontSize: '16px' }}
              autoFocus
            />
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => {
                setIsEditSegmentModalOpen(false);
                setEditingSegment(null);
                setInputTimeMinutes('');
              }}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                background: '#ccc',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Отмена
            </button>
            <button
              type="button"
              onClick={handleEditSegment}
              disabled={typeof inputTimeMinutes !== 'number' || inputTimeMinutes <= 0}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                opacity: (typeof inputTimeMinutes !== 'number' || inputTimeMinutes <= 0) ? 0.5 : 1,
              }}
            >
              Сохранить
            </button>
          </div>
        </div>
      </div>
    );
  };

  const EditLineModal = () => {
    if (!isEditLineModalOpen || !editingLine) return null;
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '10px',
          minWidth: '300px',
        }}>
          <h3 style={{ margin: 0, marginBottom: '20px' }}>Редактировать линию</h3>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Название линии:
            </label>
            <input
              type="text"
              value={editLineName}
              onChange={(e) => setEditLineName(e.target.value)}
              style={{ width: '100%', padding: '8px', fontSize: '16px' }}
              autoFocus
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Цвет линии:
            </label>
            <input
              type="color"
              value={editLineColor}
              onChange={(e) => setEditLineColor(e.target.value)}
              style={{ width: '60px', height: '40px', border: 'none', cursor: 'pointer' }}
            />
            <input
              type="text"
              value={editLineColor}
              onChange={(e) => setEditLineColor(e.target.value)}
              style={{ marginLeft: '10px', padding: '8px', fontSize: '16px', width: '100px' }}
              placeholder="#ff0000"
            />
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => {
                setIsEditLineModalOpen(false);
                setEditingLine(null);
                setEditLineName('');
                setEditLineColor('');
              }}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                background: '#ccc',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Отмена
            </button>
            <button
              type="button"
              onClick={handleEditLine}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Сохранить
            </button>
          </div>
        </div>
      </div>
    );
  };

  const LabelPositionModal = () => {
    if (!isLabelPositionModalOpen || !labelPositionStation) return null;
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '10px',
          minWidth: '350px',
        }}>
          <h3 style={{ margin: 0, marginBottom: '20px' }}>Настроить подпись станции</h3>
          <div style={{ marginBottom: '20px' }}>
            <p>Станция: <strong>{labelPositionStation.label}</strong></p>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
              <label style={{ fontWeight: 'bold' }}>Смещение X:</label>
              <input
                type="number"
                value={labelOffsetX}
                onChange={(e) => setLabelOffsetX(Number(e.target.value))}
                style={{ width: '80px', padding: '5px' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <label style={{ fontWeight: 'bold' }}> Смещение Y:</label>
              <input
                type="number"
                value={labelOffsetY}
                onChange={(e) => setLabelOffsetY(Number(e.target.value))}
                style={{ width: '80px', padding: '5px' }}
              />
            </div>
            <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
              Относительно центра станции. По умолчанию: X=0, Y=-60 (сверху).
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => {
                setIsLabelPositionModalOpen(false);
                setLabelPositionStation(null);
              }}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                background: '#ccc',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Отмена
            </button>
            <button
              type="button"
              onClick={handleLabelPositionUpdate}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Применить
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ConfirmDeleteModal = () => {
    if (!confirmDelete) return null;
    const getDeleteMessage = () => {
      if (confirmDelete.type === 'station') {
        const station = lines.flatMap(l => l.stations).find(s => s.id === confirmDelete.id);
        return `Удалить станцию "${station?.label || 'неизвестно'}"? Это также удалит все связанные сегменты и пересадки.`;
      } else if (confirmDelete.type === 'line') {
        const line = lines.find(l => l.id === confirmDelete.id);
        return `Удалить линию "${line?.name || 'неизвестно'}"? Это также удалит все станции и сегменты линии.`;
      } else {
        return 'Удалить пересадку?';
      }
    };
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '10px',
          minWidth: '300px',
        }}>
          <h3 style={{ margin: 0, marginBottom: '20px' }}>Подтверждение удаления</h3>
          <p>{getDeleteMessage()}</p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => setConfirmDelete(null)}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                background: '#ccc',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Отмена
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                background: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Удалить
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div
        style={{
          padding: '15px',
          marginBottom: '15px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          alignItems: 'center',
        }}
      >
        <input
          type="text"
          placeholder="Название станции"
          value={stationName}
          onChange={(e) => setStationName(e.target.value)}
          style={{ padding: '10px', fontSize: '16px', minWidth: '200px' }}
        />
        <select
          value={selectedLineId || ''}
          onChange={(e) => setSelectedLineId(Number(e.target.value) || null)}
          style={{ padding: '10px', fontSize: '16px', minWidth: '180px' }}
        >
          <option value="">-- Выберите линию --</option>
          {lines.map((line) => (
            <option
              key={line.id}
              value={line.id}
              style={{ backgroundColor: line.color, color: '#fff' }}
            >
              {line.name} ({line.stations.length} ст.)
            </option>
          ))}
        </select>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <input
              type="radio"
              name="mode"
              checked={activeMode === 'free'}
              onChange={() => {
                setActiveMode('free');
                resetModes();
              }}
            />
            Свободный просмотр
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <input
              type="radio"
              name="mode"
              checked={activeMode === 'idle'}
              onChange={() => {
                setActiveMode('idle');
                resetModes();
              }}
            />
            Обычное добавление
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <input
              type="radio"
              name="mode"
              checked={activeMode === 'addBetween'}
              onChange={() => {
                setActiveMode('addBetween');
                setCursor('pointer');
                setTransferStartStationId(null);
              }}
            />
            Вставить между станциями
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <input
              type="radio"
              name="mode"
              checked={activeMode === 'createTransfer'}
              onChange={() => {
                setActiveMode('createTransfer');
                setCursor('alias');
                setInsertBetween({ firstId: null, secondId: null });
              }}
            />
            Создать пересадку
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <input
              type="radio"
              name="mode"
              checked={activeMode === 'findPath'}
              onChange={() => {
                setActiveMode('findPath');
                setCursor('help');
                setInsertBetween({ firstId: null, secondId: null });
                setTransferStartStationId(null);
              }}
            />
            Расчёт оптимального пути
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <input
              type="radio"
              name="mode"
              checked={activeMode === 'closeLoop'}
              onChange={() => {
                setActiveMode('closeLoop');
                setCursor('copy');
                setInsertBetween({ firstId: null, secondId: null });
                setTransferStartStationId(null);
              }}
            />
            Замкнуть линию
          </label>
        </div>
        <button
          onClick={handleCreateStation}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Создать станцию
        </button>
        <button
          onClick={createNewLine}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            background: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Создать линию
        </button>
        {selectedLineId && (
          <button
            onClick={() => {
              const line = lines.find(l => l.id === selectedLineId);
              if (line) {
                setEditingLine(line);
                setEditLineName(line.name);
                setEditLineColor(line.color);
                setIsEditLineModalOpen(true);
              }
            }}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              background: '#ffc107',
              color: 'black',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Редактировать линию
          </button>
        )}
        {selectedLineId && (
          <button
            onClick={() => {
              setConfirmDelete({ type: 'line', id: selectedLineId });
            }}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              background: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Удалить линию
          </button>
        )}
        {selectedLineId && (
          <div style={{ marginLeft: '20px' }}>
            <label style={{ fontWeight: 'bold', marginRight: '5px' }}>Стиль линии:</label>
            <select
              value={lines.find(l => l.id === selectedLineId)?.renderStyle || 'linear'}
              onChange={(e) => {
                setLines(prev => prev.map(line =>
                  line.id === selectedLineId
                    ? { ...line, renderStyle: e.target.value as 'linear' | 'circular' }
                    : line
                ));
              }}
              style={{ padding: '5px', fontSize: '14px' }}
            >
              <option value="linear">Линейный</option>
              <option value="circular">Круговой</option>
            </select>
          </div>
        )}
        {activeMode === 'addBetween' && insertBetween.firstId !== null && insertBetween.secondId === null && (
          <span style={{ marginLeft: '20px', color: '#1976d2', fontSize: '14px' }}>
            Выбрана первая станция — выберите вторую
          </span>
        )}
        {activeMode === 'addBetween' && insertBetween.firstId !== null && insertBetween.secondId !== null && (
          <span style={{ marginLeft: '20px', color: '#2e7d32', fontSize: '14px' }}>
            Готово! Введите название станции и нажмите "Создать станцию"
          </span>
        )}
        {activeMode === 'createTransfer' && transferStartStationId !== null && (
          <span style={{ marginLeft: '20px', color: '#ed6c02', fontSize: '14px' }}>
            Выбрана начальная станция — выберите конечную
          </span>
        )}
        {activeMode === 'findPath' && pathStartStationId && !pathEndStationId && (
          <span style={{ marginLeft: '20px', color: '#007bff', fontSize: '14px' }}>
            Выберите конечную станцию
          </span>
        )}
        {calculatedPath && (
          <span style={{ marginLeft: '20px', color: '#2e7d32', fontSize: '14px', fontWeight: 'bold' }}>
            🚇 Оптимальный маршрут: {calculatedPath.totalMinutes} мин ({calculatedPath.stations.length} станций)
          </span>
        )}
      </div>
      <Stage
        width={1600}
        height={790}
        onWheel={handleWheel}
        ref={stageRef}
        onClick={handleStageClick}
        onMouseDown={handleStageMouseDown}
        onMouseMove={handleStageMouseMove}
        onMouseUp={handleStageMouseUp}
        onMouseLeave={handleStageMouseUp}
      >
        <Layer x={position.x} y={position.y} scaleX={scale} scaleY={scale}>
          {lines.map(renderLine)}
          {transferLines.map(renderTransferLine)}
          {lines.flatMap(line => line.segments.map((seg, i) => renderSegmentLabel(seg, i, line.id)))}
          {transferLines.map((transfer, i) => renderTransferLabel(transfer, i))}
          {lines.flatMap((line) =>
            line.stations.map((station) => {
              const isSelectedLine = selectedLineId === line.id;
              // 👇 Проверяем, входит ли станция в подсвеченный маршрут
              const isOnPath = highlightedPath.stations.has(station.id);
              return (
                <Fragment key={station.id}>
                  <Circle
                    x={station.x}
                    y={station.y}
                    radius={32}
                    fill="#2b2d30"
                    stroke={isOnPath ? '#ffff00' : station.color}
                    strokeWidth={isOnPath ? 8 : 6}
                    strokeScaleEnabled={false}
                    filters={isSelectedLine ? [Konva.Filters.Blur] : undefined}
                    blurRadius={isSelectedLine ? 5 : 0}
                    draggable={activeMode !== 'free'}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onDragStart={handleDragStart}
                    onDragMove={(e) => handleDragMove(e, station.id)}
                    onDragEnd={(e) => handleDragEnd(e, station.id)}
                    onClick={(e) => handleStationClick(station.id, e)}
                    onContextMenu={(e) => {
                      e.evt.preventDefault();
                      const menu = window.confirm(
                        `Станция: ${station.label}
` +
                        `Выберите действие:
` +
                        `OK - Удалить станцию
` +
                        `Отмена - Настроить подпись`
                      );
                      if (menu) {
                        setConfirmDelete({ type: 'station', id: station.id });
                      } else {
                        setLabelPositionStation(station);
                        setLabelOffsetX(station.labelOffset.x);
                        setLabelOffsetY(station.labelOffset.y);
                        setIsLabelPositionModalOpen(true);
                      }
                    }}
                  />
                  <Text
                    x={station.x + station.labelOffset.x}
                    y={station.y + station.labelOffset.y}
                    text={station.label}
                    fontSize={33 / 2 / scale}
                    fontFamily="Arial"
                    fill="#accfc6"
                    align="center"
                    width={300 / 2 / scale}
                    onDblClick={() => {
                      setEditingStation(station);
                      setEditStationName(station.label);
                      setIsEditStationModalOpen(true);
                    }}
                  />
                </Fragment>
              );
            })
          )}
        </Layer>
      </Stage>
      <CreateLineModal />
      {/* <InsertPositionModal /> 👈 Этот компонент больше не используется */}
      <TimeInputModal />
      <EditStationModal />
      <EditSegmentModal />
      <EditLineModal />
      <LabelPositionModal />
      <ConfirmDeleteModal />
      <CombinedInsertModal /> {/* 👈 Новая объединенная модалка */}
    </>
  );
};

export { FlowExample };