

export const getPointOnCircle = (
  center: { x: number; y: number },
  target: { x: number; y: number },
  radius: number
) => {
  const dx = target.x - center.x
  const dy = target.y - center.y
  const distance = Math.sqrt(dx * dx + dy * dy)

  if (distance === 0) return center // защита от деления на 0

  // Нормализуем вектор и умножаем на радиус
  const unitX = dx / distance
  const unitY = dy / distance

  return {
    x: center.x + unitX * radius,
    y: center.y + unitY * radius,
  }
}