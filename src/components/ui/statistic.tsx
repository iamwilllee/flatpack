import * as React from 'react'

export function Statistic({ label, value, suffix, prefix, trend, hint }: {
  label: string
  value: React.ReactNode
  suffix?: string
  prefix?: string
  trend?: { value: number; direction?: 'up' | 'down' }
  hint?: string
}) {
  return (
    <div data-slot="statistic">
      <div data-slot="statistic-label">{label}</div>
      <div data-slot="statistic-value">
        {prefix && <span data-slot="statistic-affix">{prefix}</span>}
        <span data-slot="statistic-number">{value}</span>
        {suffix && <span data-slot="statistic-affix">{suffix}</span>}
      </div>
      {(trend || hint) && (
        <div data-slot="statistic-footer">
          {trend && (
            <span data-slot="statistic-trend" data-direction={trend.direction ?? (trend.value >= 0 ? 'up' : 'down')}>
              {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
            </span>
          )}
          {hint && <span data-slot="statistic-hint">{hint}</span>}
        </div>
      )}
    </div>
  )
}
