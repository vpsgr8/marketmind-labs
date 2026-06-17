export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 prose prose-gray">
      <h1>Terms of Service</h1>
      <p>Last updated: {new Date().getFullYear()}</p>

      <h2>Service Description</h2>
      <p>
        LogicTrade / MarketMind Labs provides educational market analysis tools for NIFTY, BANKNIFTY, and SENSEX traders.
        This is not investment advice.
      </p>

      <h2>Free Trial &amp; Subscription</h2>
      <ul>
        <li>New accounts receive a <strong>7-day free Premium trial</strong>.</li>
        <li>After the trial, Premium costs <strong>₹999/month</strong>, billed via Razorpay.</li>
        <li>Subscriptions renew monthly until cancelled.</li>
        <li>Free tier includes ads (Google AdSense) and limited premium features.</li>
      </ul>

      <h2>Affiliate Links</h2>
      <p>
        Product links to Amazon may earn us a commission at no extra cost to you.
      </p>

      <h2>Disclaimer</h2>
      <p>
        Trading involves substantial risk. Past performance does not guarantee future results.
        Use our tools for educational purposes only.
      </p>
    </div>
  )
}
