'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function DashboardPage() {
  const { user, isPremium, loading } = useAuth()
  const router = useRouter()
  const [reports, setReports] = useState<any[]>([])
  const [alerts, setAlerts] = useState<any[]>([])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }
    if (user && isPremium) {
      api.reports.history().then(setReports).catch(() => {})
      api.alerts.list().then(setAlerts).catch(() => {})
    }
  }, [user, loading, isPremium, router])

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /></div>
  if (!user) return null

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-gray-500 mb-8">Welcome back, {user.name}</p>

      {!isPremium && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
          <h2 className="font-semibold text-lg mb-2">Upgrade to Premium</h2>
          <p className="text-sm text-gray-600 mb-4">Get unlimited reports, PDF export, watchlists, alerts, and more.</p>
          <Link href="/pricing" className="bg-primary-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-primary-700">
            Upgrade Now
          </Link>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-semibold text-lg mb-4">Recent Reports</h2>
          {reports.length === 0 ? (
            <p className="text-sm text-gray-500">No reports saved yet. Use the calculators to generate reports.</p>
          ) : (
            <div className="space-y-3">
              {reports.slice(0, 5).map((r) => (
                <div key={r.id} className="flex justify-between items-center text-sm">
                  <span className="font-medium">{r.market}</span>
                  <span className="text-gray-500">{r.report_type}</span>
                  <span className={`font-semibold ${r.signal === 'BUY' || r.signal === 'STRONG_BUY' ? 'text-green-600' : r.signal === 'SELL' ? 'text-red-600' : 'text-yellow-600'}`}>{r.signal}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-semibold text-lg mb-4">Active Alerts</h2>
          {alerts.length === 0 ? (
            <p className="text-sm text-gray-500">No active alerts. Create alerts to get notified of market conditions.</p>
          ) : (
            <div className="space-y-3">
              {alerts.map((a) => (
                <div key={a.id} className="flex justify-between items-center text-sm">
                  <span className="font-medium">{a.market}</span>
                  <span className="text-gray-500">{a.alert_type}</span>
                  <span className={`text-xs px-2 py-1 rounded ${a.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>{a.is_active ? 'Active' : 'Inactive'}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
