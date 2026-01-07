import type { FC } from 'react'
import type { ISunIconProps } from '@assets/theme-icons/types.ts'

const MoonIcon: FC<ISunIconProps> = ({
  backgroundColor = '#8aa6f8',
  borderColor = '#8aa6f8',
  width = 30,
  height = 30,
}) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={width} height={height}>
    <path
      fill={backgroundColor}
      stroke={borderColor}
      fillRule="evenodd"
      d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
      clipRule="evenodd"
    />
  </svg>
)
export { MoonIcon }
