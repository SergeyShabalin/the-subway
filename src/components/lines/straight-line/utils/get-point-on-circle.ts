export const getPointOnCircle = (
  center: { x: number; y: number },
  target: { x: number; y: number },
  radius: number
) => {
  const dx = target.x - center.x
  const dy = target.y - center.y
  const distance = Math.sqrt(dx * dx + dy * dy)

  if (distance === 0) return { x: center.x + radius, y: center.y } // защита от деления на 0

  const angle = Math.atan2(dy, dx)

  return {
    x: center.x + Math.cos(angle) * radius,
    y: center.y + Math.sin(angle) * radius,
  }
}
