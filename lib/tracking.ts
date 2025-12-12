/**
 * Conversion Tracking Helper
 * Centralized tracking for Meta Pixel, Google Ads, and other platforms
 */

// Meta Pixel types
declare global {
  interface Window {
    fbq?: (
      action: string,
      event: string,
      params?: Record<string, any>
    ) => void
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, any>
    ) => void
    dataLayer?: any[]
    _hj?: any
  }
}

/**
 * Initialize Meta Pixel
 */
export function initMetaPixel(pixelId: string) {
  if (typeof window === 'undefined') return
  
  // Check if already initialized
  if (window.fbq) return
  
  // Create fbq function
  ;(function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
    if (f.fbq) return
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
    }
    if (!f._fbq) f._fbq = n
    n.push = n
    n.loaded = !0
    n.version = '2.0'
    n.queue = []
    t = b.createElement(e)
    t.async = !0
    t.src = v
    s = b.getElementsByTagName(e)[0]
    s.parentNode?.insertBefore(t, s)
  })(
    window,
    document,
    'script',
    'https://connect.facebook.net/en_US/fbevents.js'
  )
  
  // Initialize pixel
  const fbqFunc = window.fbq as ((action: string, event: string, params?: Record<string, any>) => void) | undefined
  if (fbqFunc) {
    fbqFunc('init', pixelId)
    fbqFunc('track', 'PageView')
  }
}

/**
 * Initialize Google Ads / Google Analytics
 */
export function initGoogleAds(measurementId: string) {
  if (typeof window === 'undefined') return
  
  // Initialize dataLayer
  if (!window.dataLayer) {
    window.dataLayer = []
  }
  function gtag(...args: any[]) {
    if (window.dataLayer) {
      window.dataLayer.push(args)
    }
  }
  window.gtag = gtag
  
  // Load Google Analytics script
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
  document.head.appendChild(script)
  
  // Initialize
  gtag('js', new Date())
  gtag('config', measurementId, {
    send_page_view: false, // We'll track manually
  })
}

/**
 * Track page view
 */
export function trackPageView(url?: string) {
  if (typeof window === 'undefined') return
  
  const pageUrl = url || window.location.pathname
  
  // Meta Pixel
  if (window.fbq) {
    window.fbq('track', 'PageView', {
      content_name: pageUrl,
    })
  }
  
  // Google Ads
  if (window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: pageUrl,
    })
  }
}

/**
 * Track product view
 */
export function trackProductView(productId: string, productName: string, price: number, currency: string = 'EUR') {
  if (typeof window === 'undefined') return
  
  // Meta Pixel - ViewContent
  if (window.fbq) {
    window.fbq('track', 'ViewContent', {
      content_name: productName,
      content_ids: [productId],
      content_type: 'product',
      value: price / 100, // Convert from cents
      currency: currency,
    })
  }
  
  // Google Ads - view_item
  if (window.gtag) {
    window.gtag('event', 'view_item', {
      currency: currency,
      value: price / 100,
      items: [
        {
          item_id: productId,
          item_name: productName,
          price: price / 100,
        },
      ],
    })
  }
}

/**
 * Track add to cart
 */
export function trackAddToCart(productId: string, productName: string, price: number, quantity: number = 1, currency: string = 'EUR') {
  if (typeof window === 'undefined') return
  
  // Meta Pixel - AddToCart
  if (window.fbq) {
    window.fbq('track', 'AddToCart', {
      content_name: productName,
      content_ids: [productId],
      content_type: 'product',
      value: (price / 100) * quantity,
      currency: currency,
      num_items: quantity,
    })
  }
  
  // Google Ads - add_to_cart
  if (window.gtag) {
    window.gtag('event', 'add_to_cart', {
      currency: currency,
      value: (price / 100) * quantity,
      items: [
        {
          item_id: productId,
          item_name: productName,
          price: price / 100,
          quantity: quantity,
        },
      ],
    })
  }
}

/**
 * Track checkout start
 */
export function trackInitiateCheckout(items: Array<{ id: string; name: string; price: number; quantity: number }>, total: number, currency: string = 'EUR') {
  if (typeof window === 'undefined') return
  
  // Meta Pixel - InitiateCheckout
  if (window.fbq) {
    window.fbq('track', 'InitiateCheckout', {
      content_ids: items.map((item) => item.id),
      content_type: 'product',
      value: total / 100,
      currency: currency,
      num_items: items.reduce((sum, item) => sum + item.quantity, 0),
    })
  }
  
  // Google Ads - begin_checkout
  if (window.gtag) {
    window.gtag('event', 'begin_checkout', {
      currency: currency,
      value: total / 100,
      items: items.map((item) => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price / 100,
        quantity: item.quantity,
      })),
    })
  }
}

/**
 * Track purchase / checkout complete
 */
export function trackPurchase(orderId: string, items: Array<{ id: string; name: string; price: number; quantity: number }>, total: number, currency: string = 'EUR') {
  if (typeof window === 'undefined') return
  
  // Meta Pixel - Purchase
  if (window.fbq) {
    window.fbq('track', 'Purchase', {
      content_ids: items.map((item) => item.id),
      content_type: 'product',
      value: total / 100,
      currency: currency,
      num_items: items.reduce((sum, item) => sum + item.quantity, 0),
      order_id: orderId,
    })
  }
  
  // Google Ads - purchase
  if (window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: orderId,
      currency: currency,
      value: total / 100,
      items: items.map((item) => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price / 100,
        quantity: item.quantity,
      })),
    })
  }
}

/**
 * Track form submission (contact form)
 */
export function trackFormSubmission(formName: string, formId?: string) {
  if (typeof window === 'undefined') return
  
  // Meta Pixel - Lead
  if (window.fbq) {
    window.fbq('track', 'Lead', {
      content_name: formName,
      content_category: 'form',
    })
  }
  
  // Google Ads - generate_lead
  if (window.gtag) {
    window.gtag('event', 'generate_lead', {
      form_name: formName,
      form_id: formId,
    })
  }
}

/**
 * Track search
 */
export function trackSearch(searchTerm: string, resultsCount?: number) {
  if (typeof window === 'undefined') return
  
  // Meta Pixel - Search
  if (window.fbq) {
    window.fbq('track', 'Search', {
      search_string: searchTerm,
    })
  }
  
  // Google Ads - search
  if (window.gtag) {
    window.gtag('event', 'search', {
      search_term: searchTerm,
      ...(resultsCount && { results_count: resultsCount }),
    })
  }
}




