/**
 * Bot and DDoS Protection
 */

interface BotPattern {
  userAgent: string
  reason: string
}

// Known bot user agents to block
const BLOCKED_USER_AGENTS: BotPattern[] = [
  { userAgent: 'curl', reason: 'Command-line tool' },
  { userAgent: 'wget', reason: 'Command-line tool' },
  { userAgent: 'python-requests', reason: 'Script' },
  { userAgent: 'scrapy', reason: 'Scraper' },
  { userAgent: 'bot', reason: 'Generic bot' },
  { userAgent: 'crawler', reason: 'Crawler' },
  { userAgent: 'spider', reason: 'Spider' },
  { userAgent: 'scraper', reason: 'Scraper' },
]

// Suspicious patterns
const SUSPICIOUS_PATTERNS = [
  /sqlmap/i,
  /nikto/i,
  /nmap/i,
  /masscan/i,
  /zap/i,
  /burp/i,
  /dirb/i,
  /gobuster/i,
]

/**
 * Check if user agent is blocked
 */
export function isBlockedUserAgent(userAgent: string | null): {
  blocked: boolean
  reason?: string
} {
  if (!userAgent) {
    return { blocked: true, reason: 'Missing user agent' }
  }
  
  const ua = userAgent.toLowerCase()
  
  // Check against blocked list
  for (const pattern of BLOCKED_USER_AGENTS) {
    if (ua.includes(pattern.userAgent.toLowerCase())) {
      return { blocked: true, reason: pattern.reason }
    }
  }
  
  // Check for suspicious patterns
  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(ua)) {
      return { blocked: true, reason: 'Suspicious user agent pattern' }
    }
  }
  
  return { blocked: false }
}

/**
 * Honeypot endpoint detection
 * If someone accesses /secret-test, they're likely a bot/scraper
 */
export function isHoneypotEndpoint(pathname: string): boolean {
  const honeypotPaths = [
    '/secret-test',
    '/admin.php',
    '/wp-admin',
    '/phpmyadmin',
    '/.env',
    '/config.php',
  ]
  
  return honeypotPaths.some((path) => pathname.toLowerCase().includes(path))
}

/**
 * Rate limit store for IP blocking
 */
interface IPBlock {
  count: number
  firstSeen: number
  blockedUntil: number | null
}

const ipBlocks: Map<string, IPBlock> = new Map()

// Clean up old entries every 10 minutes
setInterval(() => {
  const now = Date.now()
  for (const ip of Array.from(ipBlocks.keys())) {
    const block = ipBlocks.get(ip)
    if (block && block.blockedUntil && block.blockedUntil < now) {
      ipBlocks.delete(ip)
    }
  }
}, 10 * 60 * 1000)

/**
 * Track and block repeated offenders
 */
export function trackIP(ip: string): {
  allowed: boolean
  blockedUntil?: number
} {
  const now = Date.now()
  const block = ipBlocks.get(ip) || { count: 0, firstSeen: now, blockedUntil: null }
  
  // If currently blocked, check if block has expired
  if (block.blockedUntil && block.blockedUntil > now) {
    return { allowed: false, blockedUntil: block.blockedUntil }
  }
  
  // Reset if block expired
  if (block.blockedUntil && block.blockedUntil <= now) {
    block.count = 0
    block.firstSeen = now
    block.blockedUntil = null
  }
  
  // Increment count
  block.count++
  
  // Block for 24 hours if more than 100 requests in 1 minute
  if (block.count > 100 && now - block.firstSeen < 60 * 1000) {
    block.blockedUntil = now + 24 * 60 * 60 * 1000 // 24 hours
    ipBlocks.set(ip, block)
    return { allowed: false, blockedUntil: block.blockedUntil }
  }
  
  // Reset count after 1 minute
  if (now - block.firstSeen > 60 * 1000) {
    block.count = 1
    block.firstSeen = now
  }
  
  ipBlocks.set(ip, block)
  return { allowed: true }
}

/**
 * Get client IP
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  const realIP = request.headers.get('x-real-ip')
  if (realIP) {
    return realIP
  }
  
  return 'unknown'
}




