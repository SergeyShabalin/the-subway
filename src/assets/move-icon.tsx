import type { FC } from 'react'

export interface IRadiusIconProps {
  strokeColor: string
}

export const MoveIcon: FC<IRadiusIconProps> = ({
  strokeColor = '#509aea',
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 32 32"
  >
    <title>Move SVG Icon</title>
    <path
      fill="none"
      stroke={strokeColor}
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M3 16h26M16 3v26M12 7l4-4l4 4m-8 18l4 4l4-4m5-13l4 4l-4 4M7 12l-4 4l4 4"
    />
  </svg>
)
