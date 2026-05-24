import React from 'react'

function TrustPilotWidget() {
  return (
     <section className="py-16 bg-background">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h2 className="text-2xl font-bold text-foreground font-display mb-2">
          Trusted by Customers Across the Netherlands
        </h2>
        <p className="text-muted-foreground text-sm mb-8">
          See what our customers are saying about their moving experience
        </p>

        {/* Trustpilot Widget — Mini Widget */}
        <div
          className="trustpilot-widget"
          data-locale="en-NL"
          data-template-id="56278e9abfbbba0bdcd568bc"
          data-businessunit-id="YOUR_BUSINESS_UNIT_ID"
          data-style-height="52px"
          data-style-width="100%"
        >
          <a
            href="https://www.trustpilot.com/review/supersonicdynamicservices.nl"
            target="_blank"
            rel="noopener noreferrer"
          >
            Trustpilot
          </a>
        </div>
      </div>
    </section>
  )
}

export default TrustPilotWidget