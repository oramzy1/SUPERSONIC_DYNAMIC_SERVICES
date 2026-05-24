import { useEffect } from 'react'

const BUSINESS_UNIT_ID = '6a12cff780bfc0e4a45d73cb'
const TRUSTPILOT_SCRIPT_URL = '//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js';

export default function TrustPilotWidget() {
  useEffect(() => {
    const initTrustpilotWidget = () => {
      const win = window as any;
      if (win.Trustpilot) {
        const el = document.querySelector('.trustpilot-widget');
        if (el) {
          console.log('Trustpilot object found, attempting to load widget.');
          win.Trustpilot.loadFromElement(el);
        } else {
          console.error('Error: Trustpilot widget element (.trustpilot-widget) not found in DOM.');
        }
      } else {
        console.warn('Warning: window.Trustpilot is not defined. Script might not have loaded yet or failed.');
      }
    };

    // Check if Trustpilot script is already loaded
    if ((window as any).Trustpilot) {
      initTrustpilotWidget();
    } else {
      // If not loaded, dynamically add the script
      const script = document.createElement('script');
      script.src = TRUSTPILOT_SCRIPT_URL;
      script.async = true;
      script.onload = initTrustpilotWidget; // Initialize once the script is loaded
      script.onerror = () => console.error('Failed to load Trustpilot script.');
      document.body.appendChild(script);

      // Cleanup function: remove the script when the component unmounts
      return () => {
        document.body.removeChild(script);
      };
    }

    // The empty dependency array ensures this effect runs only once on mount and cleans up on unmount.
  }, []);
    return (
    <div className="flex justify-start py-6">
      <div
        className="trustpilot-widget"
        data-locale="en-NL"
        data-template-id="56278e9abfbbba0bdcd568bc"
        data-businessunit-id={BUSINESS_UNIT_ID}
        data-style-height="50px"
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