import { useMemo } from "react"
import { useMetro } from '@store/hooks/use-metro.ts'

// Оптимизированная функция для расчета направлений линий
const useStationGradient = (station: any) => {
  const { metroNetwork } = useMetro()

  return useMemo(() => {
    // Находим все линии, к которым принадлежит станция
    const stationLines = metroNetwork.filter(line =>
      line.stations.some((s: any) => s.id === station.id)
    )

    // Если станция не пересадочная, возвращаем null
    if (stationLines.length <= 1) return null

    const directionsByColor = new Map<string, { angles: number[]; color: string }>()

    // Ограничиваем поиск только линиями, к которым принадлежит станция
    stationLines.forEach(line => {
      line.segments.forEach((segment: any) => {
        if (segment.fromStationId === station.id || segment.toStationId === station.id) {
          const otherStationId = segment.fromStationId === station.id ? segment.toStationId : segment.fromStationId
          const otherStation = line.stations.find((s: any) => s.id === otherStationId)

          if (otherStation) {
            const dx = otherStation.x - station.x
            const dy = otherStation.y - station.y
            const angle = Math.atan2(dy, dx) * (180 / Math.PI)

            if (!directionsByColor.has(line.color)) {
              directionsByColor.set(line.color, { angles: [], color: line.color })
            }
            directionsByColor.get(line.color)!.angles.push(angle)
          }
        }
      })
    })

    const directions: { angle: number; color: string }[] = []

    directionsByColor.forEach((value, color) => {
      if (value.angles.length > 0) {
        let sumSin = 0
        let sumCos = 0

        value.angles.forEach(angle => {
          const rad = angle * Math.PI / 180
          sumSin += Math.sin(rad)
          sumCos += Math.cos(rad)
        })

        const avgAngle = Math.atan2(sumSin / value.angles.length, sumCos / value.angles.length) * (180 / Math.PI)
        directions.push({ angle: avgAngle, color })
      }
    })

    if (directions.length > 1) {
      const sortedDirections = [...directions].sort((a, b) => a.angle - b.angle)
      const startAngle = sortedDirections[0].angle
      const endAngle = sortedDirections[sortedDirections.length - 1].angle

      return {
        type: 'linear' as const,
        startAngle,
        endAngle,
        colors: sortedDirections.map(d => d.color)
      }
    } else if (stationLines.length > 1) {
      return {
        type: 'radial' as const,
        colors: stationLines.map(line => line.color)
      }
    }

    return null
  }, [station.id, station.x, station.y, metroNetwork])
}

export {useStationGradient}