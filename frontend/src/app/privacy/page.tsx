export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 prose prose-gray">
      <h1>Privacy Policy</h1>
      <p>Last updated: {new Date().getFullYear()}</p>

      <h2>Information We Collect</h2>
      <p>We collect account information (name, email) when you register, and usage data when you use our analysis tools.</p>

      <h2>Google AdSense</h2>
      <p>
        We use Google AdSense to display advertisements. Google and its partners may use cookies to serve ads based on your visits to this site and other sites on the Internet.
        You may opt out of personalized advertising by visiting{' '}
        <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.
      </p>

      <h2>Amazon Associates</h2>
      <p>
        LogicTrade / MarketMind Labs is a participant in the Amazon Associates Program. We earn advertising fees by linking to Amazon.in products.
      </p>

      <h2>Payments (Razorpay)</h2>
      <p>
        Subscription payments are processed by Razorpay. We do not store your full card or UPI details — Razorpay handles payment data securely.
      </p>

      <h2>Contact</h2>
      <p>For privacy questions, contact us via the LogicTrade website.</p>
    </div>
  )
}
