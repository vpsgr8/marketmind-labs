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

      <h2>One-Time Tool Walkthrough (₹3,999)</h2>
      <p>
        We optionally offer a one-time paid walkthrough that explains the complete strength and correct
        usage of the calculators and tools provided on this website. This is <strong>not a course</strong>,
        not a training program, and not a tipping or advisory service. The entire discussion is limited
        strictly to how the website&apos;s own tools work. The fee is a one-time charge with no recurring
        billing.
      </p>

      <h2>Affiliate Links</h2>
      <p>
        Product links to Amazon may earn us a commission at no extra cost to you.
      </p>

      <h2>Disclaimer &amp; Risk Disclosure</h2>
      <p>
        <strong>We are not SEBI-registered</strong> and we do not provide investment, trading, or
        financial advice, stock tips, buy/sell recommendations, or portfolio management of any kind.
        We do not sell courses. All calculators, tools, and any paid walkthrough are provided purely for
        informational and educational purposes regarding the use of this website&apos;s tools.
      </p>
      <p>
        Trading and investing in securities involve substantial risk, including possible loss of capital.
        Past performance does not guarantee future results. Any decisions you make based on information
        from this website are solely your own responsibility. Please consult a SEBI-registered investment
        adviser before making any financial decision.
      </p>
    </div>
  )
}
