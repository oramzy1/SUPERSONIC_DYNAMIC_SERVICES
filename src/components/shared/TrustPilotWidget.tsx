import { useEffect } from 'react'

const BUSINESS_UNIT_ID = '6a12cff780bfc0e4a45d73cb'

export default function TrustPilotWidget() {
  useEffect(() => {
    const win = window as any
    if (win.Trustpilot) {
      win.Trustpilot.loadFromElement(
        document.querySelector('.trustpilot-widget')
      )
    }
  }, [])

    return (
    <div className="flex justify-center py-6">
      <div
        className="trustpilot-widget"
        data-locale="en-NL"
        data-template-id="56278e9abfbbba0bdcd568bc"
        data-businessunit-id={BUSINESS_UNIT_ID}
        data-style-height="24px"
        data-style-width="250px"
        data-theme="dark"
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
  )
}