// import { Dropdown,   Sidebar } from '../ui'
//
//
// import { useState, useEffect } from 'react'
// import { Curvature } from './lines/curvature/curvature.tsx'
// import { RadiusIcon } from '../../assets/radius-icon.tsx'
// import { RotateCircularLine } from './lines/rotate-circular-line/rotate-circular-line.tsx'
// import { AddStations } from './stations/add-stations/add-stations.tsx'
// import { useMetro } from '../../store/hooks/use-metro.ts'
// import type { IControlPanelProps } from './types.ts'
//
//
// const ControlPanel = ({
//   curvatureRef,
//   circleRadiusRef,
//   setFreeMoving,
//   freeMoving,
//   rotationAngleRef,
//   setLineMoveEnabled,
//   lineMoveEnabled,
// }: IControlPanelProps & {
//   setLineMoveEnabled: React.Dispatch<React.SetStateAction<boolean>>
//   lineMoveEnabled: boolean
// }) => {
//   const { metroNetwork, activeLineId, actions: metroActions } = useMetro()
//   console.log('metroNetwork', metroNetwork)
//   const [radiusValue, setRadiusValue] = useState(300) // Временное значение, будет пересчитано
//
//
//   // Проверяем, является ли активная линия круговой
//   const isActiveLineCircular = activeLineId
//     ? metroNetwork.some(
//         (line) => line.id === activeLineId && line.renderStyle === 'circular',
//       )
//     : false
//
//   // Вычисляем фактический радиус из текущих позиций станций при выборе круговой линии
//   useEffect(() => {
//     if (isActiveLineCircular && activeLineId) {
//       const activeLine = metroNetwork.find((line) => line.id === activeLineId)
//       if (activeLine && activeLine.stations.length > 0) {
//         // Вычисляем центр линии
//         const centerX =
//           activeLine.stations.reduce((sum, s) => sum + s.x, 0) /
//           activeLine.stations.length
//         const centerY =
//           activeLine.stations.reduce((sum, s) => sum + s.y, 0) /
//           activeLine.stations.length
//
//         // Вычисляем средний радиус
//         const avgRadius =
//           activeLine.stations.reduce((sum, station) => {
//             const dx = station.x - centerX
//             const dy = station.y - centerY
//             return sum + Math.sqrt(dx * dx + dy * dy)
//           }, 0) / activeLine.stations.length
//
//         // Округляем до целого и устанавливаем значения
//         const calculatedRadius = Math.round(avgRadius)
//         setRadiusValue(calculatedRadius)
//         circleRadiusRef.current = calculatedRadius
//       }
//     }
//   }, [isActiveLineCircular, activeLineId, metroNetwork])
//
//   const handleRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const newRadius = Number(e.target.value)
//     setRadiusValue(newRadius)
//     circleRadiusRef.current = newRadius
//   }
//
//
//
//   const handleLineChange = (selectedValue: string | number) => {
//     const id = selectedValue === '' ? null : Number(selectedValue)
//     metroActions.setActiveLineId(id)
//     setLineMoveEnabled(false)
//
//     // Сбрасываем угол поворота при смене линии
//     // setRotationAngle(0)
//     rotationAngleRef.current = 0
//
//     // НЕ меняем радиус при смене линии - он будет вычислен автоматически
//   }
//
//   const handleLineMoveToggle = () => {
//     if (!activeLineId) {
//       alert('Сначала выберите линию для перемещения')
//       return
//     }
//     setLineMoveEnabled(!lineMoveEnabled)
//   }
//
//   // Функция для выравнивания расстояния между станциями
//   const handleEvenlyDistributeStations = () => {
//     if (!activeLineId) {
//       alert('Сначала выберите линию для выравнивания')
//       return
//     }
//
//     const activeLine = metroNetwork.find((line) => line.id === activeLineId)
//     if (!activeLine || activeLine.stations.length < 3) {
//       alert('Для выравнивания нужно минимум 3 станции в линии')
//       return
//     }
//
//     metroActions.evenlyDistributeStations(activeLineId)
//   }
//
//   return (
//     <div>
//       <Sidebar>
//         <div
//           style={{
//             position: 'relative',
//             top: '20px',
//             padding: '10px',
//             borderBottom: '1px solid #ddd',
//           }}
//         >
//           <Dropdown
//             label="Выберите линию метро"
//             options={metroNetwork.map((line) => ({
//               value: line.id,
//               label: `${line.name} ${line.renderStyle === 'circular' ? '(кольцевая)' : ''}`,
//               color: line.color,
//             }))}
//             value={activeLineId || ''}
//             onChange={handleLineChange}
//             placeholder="Выберите линию..."
//             className="metro-line-dropdown"
//             showColor={true}
//           />
//           <div>
//             <label style={{ color: 'white', padding: '10px' }}>
//               <input
//                 type="checkbox"
//                 checked={freeMoving}
//                 onChange={() => setFreeMoving(!freeMoving)}
//                 title={'Режим свободного перемещения'}
//               />
//               Режим свободного перемещения
//             </label>
//           </div>
//           {/* Перемещение всей линии */}
//           {activeLineId && (
//             <div
//               style={{
//                 marginBottom: '12px',
//                 padding: '8px',
//                 backgroundColor: '#333335',
//                 borderRadius: '4px',
//               }}
//             >
//               <label
//                 style={{
//                   display: 'flex',
//                   alignItems: 'center',
//                   color: 'white',
//                 }}
//               >
//                 <input
//                   type="checkbox"
//                   checked={lineMoveEnabled}
//                   onChange={handleLineMoveToggle}
//                   style={{ marginRight: '8px' }}
//                 />
//                 Режим перемещения всей линии
//               </label>
//               {lineMoveEnabled && (
//                 <div
//                   style={{ marginTop: '8px', fontSize: '12px', color: '#ccc' }}
//                 >
//                   Перетащите любую станцию для перемещения всей линии
//                 </div>
//               )}
//             </div>
//           )}
//           {/* Радиус кольцевой ветки - ТОЛЬКО для круговых линий */}
//           {isActiveLineCircular && (
//             <Range
//               onChange={handleRadiusChange}
//               value={radiusValue}
//               placeholder="Радиус кольцевой ветки"
//               icon={<RadiusIcon strokeColor={'#1eda8c'} />}
//               min={5}
//               max={2000}
//               step={5}
//             />
//           )}
//           {/* Кривизна линий - ТОЛЬКО для круговых линий */}
//           {isActiveLineCircular && (
//             <Curvature
//               activeLineId={activeLineId}
//               curvatureRef={curvatureRef}
//             />
//           )}
//           {isActiveLineCircular && (
//             <RotateCircularLine rotationAngleRef={rotationAngleRef} />
//           )}
//           {/* Кнопка выравнивания расстояния между станциями */}
//           {activeLineId && (
//             <button
//               onClick={handleEvenlyDistributeStations}
//               style={{
//                 marginBottom: '12px',
//                 width: '100%',
//                 backgroundColor: '#4a90e2',
//                 color: 'white',
//                 border: 'none',
//                 padding: '8px 12px',
//                 borderRadius: '4px',
//                 cursor: 'pointer',
//               }}
//               title="Равномерно распределить станции вдоль линии"
//             >
//               🎯 Выровнять расстояние между станциями
//             </button>
//           )}{' '}
//
//       <AddStations/>
//
//         </div>
//       </Sidebar>
//     </div>
//   )
// }
//
// export { ControlPanel }
