import Link from 'next/link'
import { Check } from 'lucide-react'

const plans = [
  {
    name: 'Free',
    price: '0',
    features: ['All Calculators', 'Blog Access', 'Basic Charts', '3 Reports/Day'],
    cta: 'Get Started',
    href: '/register',
  },
  {
    name: 'Premium',
    price: '499',
    period: '/month',
    features: [
      'Everything in Free',
      'Unlimited Reports',
      'PDF Export',
      'Watchlists',
      'Price Alerts',
      'Daily Email Reports',
      'Telegram Integration',
      'Historical Data',
    ],
    cta: 'Go Premium',
    href: '/register',
    featured: true,
  },
  {
    name: 'Admin',
    price: 'Custom',
    features: ['Everything in Premium', 'API Access', 'White-label', 'Priority Support'],
    cta: 'Contact Us',
    href: '/contact',
  },
]

export default function PricingPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Simple Pricing</h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Start free, upgrade when you need advanced features. All plans include access to our core analysis tools.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <div key={plan.name} className={`bg-white border-2 rounded-2xl p-8 ${plan.featured ? 'border-primary-500 shadow-xl relative' : 'border-gray-200'}`}>
            {plan.featured && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                Most Popular
              </div>
            )}
            <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold">₹{plan.price}</span>
              {plan.period && <span className="text-gray-500 text-sm">{plan.period}</span>}
            </div>
            <ul className="space-y-3 mb-8">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <Link href={plan.href}
              className={`block text-center py-3 rounded-lg font-semibold ${plan.featured ? 'bg-primary-600 text-white hover:bg-primary-700' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
