export interface User {
  id: number
  name: string
  email: string
  plan: string
  is_premium?: boolean
  is_trial_active?: boolean
  trial_ends_at?: string | null
  premium_expires_at?: string | null
  trial_days_remaining?: number
  subscription_amount_inr?: number
}

export interface AuthResponse {
  access_token: string
  token_type: string
  user: User
}

export interface PaymentPlans {
  trial_days: number
  monthly_amount_inr: number
  currency: string
  plan_name: string
  razorpay_configured: boolean
}

export interface CandleData {
  open: number
  high: number
  low: number
  close: number
}

export interface ProbabilityResult {
  bull_probability: number
  bear_probability: number
  sideways_probability: number
  confidence_score: number
  signal: string
  components: {
    candle_strength: number
    bull_force: number
    bear_force: number
    momentum: number
    trend: number
    volatility: number
    gann: number
  }
}

export interface GannSquareResult {
  price: number
  levels: Record<string, number>
  cardinal_points: Record<string, number>
  ordinal_points: Record<string, number>
}

export interface GannTimeResult {
  swing_days: number
  cycles: Record<string, string>
  current_cycle_degree: number
  harmonic_levels: Record<string, number>
}

export interface MasterCandleResult {
  found: boolean
  master_candle?: number
  master_high?: number
  master_low?: number
  master_open?: number
  master_close?: number
  master_range?: number
  inside_complete?: boolean
  breakout?: {
    direction: string
    price: number
    breakout_level: number
  } | null
  swish_signal?: string | null
  swish_probability?: number
  target?: number
  risk?: number
}

export interface SwishResult {
  found: boolean
  swish_high?: number
  swish_low?: number
  direction?: string
  probability?: number
  target?: number
  risk?: number
}

export interface ReversalTimeResult {
  market_open: string
  market_close: string
  reversal_times: Array<{
    time: string
    is_past: boolean
    price_level: number
    angle_deg: number
  }>
  current_time_index: number
  next_reversal: { time: string; minutes_until: string | number }
  is_market_open: boolean
  time_until_close: string
}

export interface SupportResistanceResult {
  immediate_support: number | null
  major_support: number | null
  immediate_resistance: number | null
  major_resistance: number | null
  pivot_points: Record<string, number | null>
  current_price: number
  range_high: number
  range_low: number
}

export interface DailyOutlookResult {
  market: string
  date: string
  direction: string
  probability: number
  bullish_probability: number
  bearish_probability: number
  sideways_probability: number
  expected_range: { min: number; max: number; average: number }
  risk_level: string
  open: number
  high: number
  low: number
  close: number
  signal: string
  confidence_score: number
  key_levels: Record<string, number>
  suggested_strategy: string
}
