'use client'

interface Props {
  value: number
  label: string
  color: string
}

export default function ProbabilityGauge({ value, label, color }: Props) {
  const safeValue = Math.min(100, Math.max(0, value || 0))
  const circumference = 2 * Math.PI * 40
  const offset = circumference - (safeValue / 100) * circumference

  return (
    <div className="flex flex-col items-center">
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="8" />
        <circle
          cx="50" cy="50" r="40" fill="none"
          stroke={color} strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          className="transition-all duration-1000"
        />
        <text x="50" y="50" textAnchor="middle" dominantBaseline="central"
          className="text-xl font-bold" fill={color}>
          {Math.round(safeValue)}%
        </text>
      </svg>
      <span className="text-sm font-medium text-gray-600 mt-1">{label}</span>
    </div>
  )
}
