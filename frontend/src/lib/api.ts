const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token')
  }
  return null
}

async function request(path: string, options: RequestInit = {}): Promise<any> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail || 'API request failed')
  }
  return res.json()
}

export const api = {
  // Probability
  probability: {
    nifty: (data: any) => request('/api/probability/nifty', { method: 'POST', body: JSON.stringify(data) }),
    banknifty: (data: any) => request('/api/probability/banknifty', { method: 'POST', body: JSON.stringify(data) }),
    sensex: (data: any) => request('/api/probability/sensex', { method: 'POST', body: JSON.stringify(data) }),
  },

  // GANN
  gann: {
    squareOf9: (data: any) => request('/api/gann/square-of-9', { method: 'POST', body: JSON.stringify(data) }),
    timeCycle: (data: any) => request('/api/gann/time-cycle', { method: 'POST', body: JSON.stringify(data) }),
  },

  // Master Candle
  masterCandle: {
    detect: (data: any) => request('/api/master-candle/detect', { method: 'POST', body: JSON.stringify(data) }),
  },

  // Swish
  swish: {
    scan: (data: any) => request('/api/swish/scan', { method: 'POST', body: JSON.stringify(data) }),
    analyze: (data: any) => request('/api/swish/analyze', { method: 'POST', body: JSON.stringify(data) }),
  },

  // Reversal Time
  reversalTime: {
    calculate: (data: any) => request('/api/reversal-time/calculate', { method: 'POST', body: JSON.stringify(data) }),
    times: () => request('/api/reversal-time/times'),
  },

  // S&R
  supportResistance: {
    calculate: (data: any) => request('/api/support-resistance/calculate', { method: 'POST', body: JSON.stringify(data) }),
  },

  // Daily Outlook
  dailyOutlook: {
    generate: (data: any) => request('/api/daily-outlook/generate', { method: 'POST', body: JSON.stringify(data) }),
  },

  // Auth
  auth: {
    login: (data: any) => request('/api/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    register: (data: any) => request('/api/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    google: (data: any) => request('/api/auth/google', { method: 'POST', body: JSON.stringify(data) }),
    me: () => request('/api/auth/me'),
  },

  // Payments (Razorpay)
  payments: {
    plans: () => request('/api/payments/plans'),
    status: () => request('/api/payments/status'),
    createSubscription: () => request('/api/payments/create-subscription', { method: 'POST' }),
    verify: (data: any) => request('/api/payments/verify', { method: 'POST', body: JSON.stringify(data) }),
  },

  // Monetization config
  monetization: {
    config: () => request('/api/ads/config'),
  },

  // Reports (premium)
  reports: {
    save: (data: any) => request('/api/reports/save', { method: 'POST', body: JSON.stringify(data) }),
    history: () => request('/api/reports/history'),
  },

  // Alerts (premium)
  alerts: {
    create: (data: any) => request('/api/alerts/create', { method: 'POST', body: JSON.stringify(data) }),
    list: () => request('/api/alerts/list'),
    delete: (id: number) => request(`/api/alerts/${id}`, { method: 'DELETE' }),
  },

  // Export
  export: {
    pdf: async (data: any) => {
      const token = getToken()
      const res = await fetch(`${API_URL}/api/export/pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('PDF export failed')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `marketmind-report-${data.report_type.toLowerCase()}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    },
  },
}
