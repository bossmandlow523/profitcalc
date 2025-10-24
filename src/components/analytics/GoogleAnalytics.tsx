import { useEffect } from 'react';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Replace with your Google Analytics 4 Measurement ID
// Get this from: https://analytics.google.com > Admin > Data Streams
export const GA_TRACKING_ID = 'G-XXXXXXXXXX';

interface GoogleAnalyticsProps {
  trackingId?: string;
}

export function GoogleAnalytics({ trackingId = GA_TRACKING_ID }: GoogleAnalyticsProps) {
  useEffect(() => {
    // Only load in production or if explicitly enabled
    if (import.meta.env.DEV && !(import.meta.env as any).VITE_ENABLE_ANALYTICS) {
      console.log('Analytics disabled in development mode');
      return;
    }

    if (!trackingId || trackingId === 'G-XXXXXXXXXX') {
      console.warn('Google Analytics tracking ID not configured');
      return;
    }

    // Load Google Analytics script
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${trackingId}', {
        page_path: window.location.pathname,
        send_page_view: true
      });
    `;
    document.head.appendChild(script2);

    return () => {
      // Cleanup scripts on unmount
      document.head.removeChild(script1);
      document.head.removeChild(script2);
    };
  }, [trackingId]);

  return null;
}

// Event tracking helpers
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  } else {
    console.log('GA Event:', eventName, parameters);
  }
};

// Custom event trackers for calculator
export const trackCalculation = (strategy: string, parameters?: Record<string, any>) => {
  trackEvent('calculation_performed', {
    strategy_type: strategy,
    ...parameters
  });
};

export const trackStrategySelection = (strategy: string) => {
  trackEvent('strategy_selected', {
    strategy_name: strategy
  });
};

export const trackPageView = (pageName: string, pageUrl?: string) => {
  trackEvent('page_view', {
    page_title: pageName,
    page_location: pageUrl || window.location.href,
    page_path: window.location.pathname
  });
};

export const trackButtonClick = (buttonName: string, buttonLocation?: string) => {
  trackEvent('button_click', {
    button_name: buttonName,
    button_location: buttonLocation
  });
};

export const trackChartInteraction = (interactionType: string) => {
  trackEvent('chart_interaction', {
    interaction_type: interactionType
  });
};

export const trackNewsletterSignup = (source?: string) => {
  trackEvent('newsletter_signup', {
    signup_source: source
  });
};

export const trackSocialShare = (platform: string, content?: string) => {
  trackEvent('social_share', {
    platform: platform,
    content_shared: content
  });
};

// Usage examples in components:
/*
import { trackCalculation, trackStrategySelection } from './analytics/GoogleAnalytics';

// When user selects a strategy
trackStrategySelection('Long Call');

// When calculation is performed
trackCalculation('Long Call', {
  stock_price: 100,
  strike_price: 105,
  premium: 2.50
});

// When user clicks a button
trackButtonClick('Calculate', 'Strategy Form');
*/
