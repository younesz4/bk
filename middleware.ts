import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isBlockedUserAgent, isHoneypotEndpoint, trackIP, getClientIP } from '@/lib/security/bot-protection'

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key'

/**
 * Global Next.js Middleware
 * 
 * Responsibilities:
 * 1. Set security headers for all routes
 * 2. Bot and DDoS protection
 * 3. Admin route protection
 * 4. URL sanitization
 * 5. Method override prevention
 */

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const userAgent = request.headers.get('user-agent')
  const method = request.method

  // ============================================================================
  // ADMIN ROUTE PROTECTION (JWT-based)
  // ============================================================================
  // Protect all /admin routes except login and login API
  const isAdminRoute = pathname.startsWith('/admin')
  const isAdminAuthRoute = pathname === '/admin/login' || pathname.startsWith('/api/admin/login') || pathname.startsWith('/api/admin/logout')

  if (isAdminRoute && !isAdminAuthRoute) {
    const { getAdminFromRequest } = await import('@/lib/adminAuth')
    const admin = await getAdminFromRequest(request)

    // Debug logging
    const cookieValue = request.cookies.get('admin_session')?.value
    console.log('Admin route check:', {
      pathname,
      hasCookie: !!cookieValue,
      cookieLength: cookieValue?.length || 0,
      adminFound: !!admin
    })

    if (!admin) {
      console.log('Admin not authenticated, redirecting to login')
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // Legacy /bk-agencements-panel protection (keep existing logic)
  const isLegacyAdminRoute = pathname.startsWith('/bk-agencements-panel')
  const isLegacyAuthRoute =
    pathname === '/bk-agencements-panel/login' ||
    pathname === '/bk-agencements-panel/verify' ||
    pathname.startsWith('/api/admin/login') ||
    pathname.startsWith('/api/admin/verify')

  if (isLegacyAdminRoute) {
    const sessionId = request.cookies.get('admin_session')?.value

    // If no session and not on login/verify → redirect to login
    if (!sessionId && !isLegacyAuthRoute) {
      const url = request.nextUrl.clone()
      url.pathname = '/bk-agencements-panel/login'
      return NextResponse.redirect(url)
    }

    // If session exists, verify in DB
    // Note: AdminSession model not in schema yet, so session validation is disabled
    if (sessionId) {
      // TODO: Add AdminSession model to Prisma schema
      // For now, allow access if session cookie exists
      /*
      try {
        const { prisma } = await import('@/lib/prisma')
        const session = await prisma.adminSession.findUnique({
          where: { id: sessionId },
          include: { admin: true },
        })

        const now = new Date()

        if (!session || session.expiresAt < now) {
          // Invalid or expired session → redirect to login, clear cookie
          const res = NextResponse.redirect(
            new URL('/bk-agencements-panel/login', request.url)
          )
          res.cookies.set('admin_session', '', { maxAge: 0, path: '/' })
          return res
        }

        // If user is trying to access /login or /verify but is already logged in → redirect to panel home
        if (isLegacyAuthRoute && !pathname.startsWith('/api/')) {
          return NextResponse.redirect(
            new URL('/bk-agencements-panel', request.url)
          )
        }
      } catch (error) {
        console.error('Admin session verification error:', error)
        // On error, redirect to login
        const res = NextResponse.redirect(
          new URL('/bk-agencements-panel/login', request.url)
        )
        res.cookies.set('admin_session', '', { maxAge: 0, path: '/' })
        return res
      }
      */
    }
  }

  // ============================================================================
  // BOT PROTECTION
  // ============================================================================
  const botCheck = isBlockedUserAgent(userAgent)
  if (botCheck.blocked) {
    console.warn(`Blocked bot: ${userAgent} - ${botCheck.reason}`)
    return new NextResponse('Forbidden', { status: 403 })
  }

  // Honeypot endpoint detection
  if (isHoneypotEndpoint(pathname)) {
    const clientIP = getClientIP(request)
    console.warn(`Honeypot accessed: ${pathname} from IP: ${clientIP}`)
    // Track and potentially block
    trackIP(clientIP)
    return new NextResponse('Not Found', { status: 404 })
  }

  // IP tracking for DDoS protection
  const clientIP = getClientIP(request)
  const ipCheck = trackIP(clientIP)
  if (!ipCheck.allowed) {
    return new NextResponse('Too Many Requests', { 
      status: 429,
      headers: {
        'Retry-After': ipCheck.blockedUntil 
          ? Math.ceil((ipCheck.blockedUntil - Date.now()) / 1000).toString()
          : '3600',
      },
    })
  }

  // ============================================================================
  // METHOD OVERRIDE PREVENTION
  // ============================================================================
  // Block method override headers (prevent method spoofing)
  if (request.headers.get('x-http-method-override')) {
    return new NextResponse('Method Override Not Allowed', { status: 405 })
  }

  // ============================================================================
  // URL SANITIZATION
  // ============================================================================
  // Check for suspicious URL patterns
  const suspiciousPatterns = [
    /\.\./, // Path traversal
    /%2e%2e/i, // URL encoded path traversal
    /<script/i, // XSS attempts
    /javascript:/i, // JavaScript protocol
    /on\w+\s*=/i, // Event handlers
  ]

  const urlString = pathname + request.nextUrl.search
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(urlString)) {
      console.warn(`Suspicious URL pattern detected: ${urlString}`)
      return new NextResponse('Bad Request', { status: 400 })
    }
  }

  // ============================================================================
  // ADMIN ROUTE PROTECTION
  // ============================================================================
  // Block /api/admin unless from allowed IP (configure in env)
  if (pathname.startsWith('/api/admin') && !pathname.includes('/login') && !pathname.includes('/logout')) {
    const allowedIPs = (process.env.ADMIN_ALLOWED_IPS || '').split(',').filter(Boolean)
    
    if (allowedIPs.length > 0 && !allowedIPs.includes(clientIP)) {
      console.warn(`Unauthorized admin access attempt from IP: ${clientIP}`)
      return new NextResponse('Forbidden', { status: 403 })
    }
  }

  // ============================================================================
  // RESPONSE SETUP
  // ============================================================================
  let response: NextResponse

  // Allow public paths (no special handling needed)
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/admin/login') ||
    pathname.startsWith('/api/admin/verify') ||
    pathname.startsWith('/api/admin/logout') ||
    pathname === '/favicon.ico' ||
    pathname.startsWith('/public')
  ) {
    response = NextResponse.next()
  }
  // For existing /admin routes (different from /bk-agencements-panel), add pathname to headers
  // The layout will handle authentication checks
  else if (pathname.startsWith('/admin')) {
    response = NextResponse.next()
    response.headers.set('x-pathname', pathname)
  }
  // Allow all other routes
  else {
    response = NextResponse.next()
  }

  // ============================================================================
  // SECURITY HEADERS - Applied to all responses
  // ============================================================================

  // X-Frame-Options: Prevent clickjacking attacks
  // SAMEORIGIN allows framing from same origin (useful for embedded content)
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')

  // X-Content-Type-Options: Prevent MIME type sniffing
  // Forces browser to respect Content-Type header
  response.headers.set('X-Content-Type-Options', 'nosniff')

  // Referrer-Policy: Control referrer information
  // strict-origin-when-cross-origin: Send full URL for same-origin, origin only for cross-origin HTTPS
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // Permissions-Policy: Restrict browser features
  // Restrictive defaults: no camera, microphone, geolocation by default
  // Only allow features that are explicitly needed
  response.headers.set(
    'Permissions-Policy',
    [
      'camera=()',                    // Disable camera
      'microphone=()',                // Disable microphone
      'geolocation=()',               // Disable geolocation
      'gyroscope=()',                 // Disable gyroscope
      'magnetometer=()',              // Disable magnetometer
      'payment=()',                    // Disable payment API
      'usb=()',                        // Disable USB API
      'serial=()',                     // Disable serial API
      'bluetooth=()',                  // Disable Bluetooth
      'nfc=()',                        // Disable NFC
      'accelerometer=()',             // Disable accelerometer
      'ambient-light-sensor=()',       // Disable ambient light sensor
      'autoplay=()',                   // Disable autoplay
      'battery=()',                    // Disable battery API
      'cross-origin-isolated=()',      // Disable cross-origin isolation
      'display-capture=()',            // Disable display capture
      'document-domain=()',              // Disable document.domain
      'encrypted-media=()',            // Disable encrypted media
      'execution-while-not-rendered=()', // Disable execution while not rendered
      'execution-while-out-of-viewport=()', // Disable execution while out of viewport
      'fullscreen=(self)',            // Allow fullscreen for same origin
      'picture-in-picture=()',        // Disable picture-in-picture
      'publickey-credentials-get=()',  // Disable public key credentials
      'screen-wake-lock=()',          // Disable screen wake lock
      'sync-xhr=()',                   // Disable synchronous XHR
      'web-share=()',                  // Disable Web Share API
      'xr-spatial-tracking=()',       // Disable XR spatial tracking
    ].join(', ')
  )

  // Content-Security-Policy (CSP)
  // Strict CSP that allows Next.js, framer-motion, and images
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // 'unsafe-eval' needed for Next.js, 'unsafe-inline' for some scripts
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com", // Allow Google Fonts CSS
    "img-src 'self' data: https: blob:", // Allow images from self, data URIs, HTTPS, and blob
    "font-src 'self' data: https://fonts.gstatic.com", // Allow Google Fonts
    "connect-src 'self' https://api.stripe.com https://*.stripe.com", // Allow Stripe API
    "frame-src 'self' https://js.stripe.com", // Allow Stripe iframes
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
    "upgrade-insecure-requests", // Upgrade HTTP to HTTPS
  ].join('; ')

  response.headers.set('Content-Security-Policy', csp)

  // Strict-Transport-Security (HSTS): Force HTTPS in production only
  // Only set in production to avoid issues in development
  const isProduction = process.env.NODE_ENV === 'production'
  
  if (isProduction) {
    // HSTS with 1 year max-age, includeSubDomains, and preload
    // max-age=31536000 = 1 year
    // includeSubDomains: Apply to all subdomains
    // preload: Allow inclusion in browser HSTS preload lists
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    )
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
    '/bk-agencements-panel/:path*',
  ],
}
