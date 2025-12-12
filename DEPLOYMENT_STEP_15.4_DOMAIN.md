# STEP 15.4 — Connect Custom Domain to Vercel

## Domain: `bk-agencements.com`

### Step 1: Add Domain in Vercel

1. Go to your Vercel project dashboard
2. Click **Settings** → **Domains**
3. Enter: `bk-agencements.com`
4. Click **Add**
5. Vercel will show you DNS configuration

### Step 2: Configure DNS Records

#### Option A: Root Domain (bk-agencements.com) - Recommended

**If your DNS provider supports A/AAAA records:**

1. **A Record:**
   ```
   Type: A
   Name: @ (or blank/root)
   Value: 76.76.21.21
   TTL: 3600 (or Auto)
   ```

2. **AAAA Record (IPv6):**
   ```
   Type: AAAA
   Name: @ (or blank/root)
   Value: 2606:4700:3034::ac43:92ae
   TTL: 3600 (or Auto)
   ```

**If your DNS provider doesn't support A/AAAA (use CNAME):**

1. **CNAME Record:**
   ```
   Type: CNAME
   Name: @ (or blank/root)
   Value: cname.vercel-dns.com
   TTL: 3600 (or Auto)
   ```

#### Option B: www Subdomain

**Always add www subdomain:**

1. **CNAME Record:**
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   TTL: 3600 (or Auto)
   ```

### Step 3: Configure in Vercel

1. In Vercel **Domains** settings:
   - Add `bk-agencements.com` (root domain)
   - Add `www.bk-agencements.com` (www subdomain)

2. Vercel will automatically:
   - Issue SSL certificate (Let's Encrypt)
   - Set up HTTPS redirect
   - Configure www redirect

### Step 4: DNS Provider Instructions

#### For Common DNS Providers:

**Cloudflare:**
1. Go to **DNS** → **Records**
2. Add A record: `@` → `76.76.21.21`
3. Add AAAA record: `@` → `2606:4700:3034::ac43:92ae`
4. Add CNAME: `www` → `cname.vercel-dns.com`
5. Set **Proxy status** to **DNS only** (gray cloud)

**Namecheap:**
1. Go to **Domain List** → **Manage**
2. Go to **Advanced DNS**
3. Add A record: `@` → `76.76.21.21`
4. Add CNAME: `www` → `cname.vercel-dns.com`

**GoDaddy:**
1. Go to **DNS Management**
2. Add A record: `@` → `76.76.21.21`
3. Add CNAME: `www` → `cname.vercel-dns.com`

**Google Domains:**
1. Go to **DNS** settings
2. Add A record: `@` → `76.76.21.21`
3. Add CNAME: `www` → `cname.vercel-dns.com`

**OVH (Morocco):**
1. Go to **Domain** → **DNS Zone**
2. Add A record: `@` → `76.76.21.21`
3. Add CNAME: `www` → `cname.vercel-dns.com`

### Step 5: Verify DNS Configuration

**Check DNS propagation:**

```bash
# Check A record
dig bk-agencements.com A

# Check CNAME for www
dig www.bk-agencements.com CNAME

# Online tools:
# - https://dnschecker.org
# - https://www.whatsmydns.net
```

**Expected Results:**
- Root domain should point to Vercel IPs
- www should point to `cname.vercel-dns.com`
- Both should resolve correctly

### Step 6: Wait for SSL Certificate

1. Vercel automatically issues SSL certificate
2. Takes 1-5 minutes after DNS propagates
3. Check in Vercel dashboard: **Domains** → SSL status
4. Status should show: **Valid Certificate**

### Step 7: Configure Redirects

**Vercel automatically handles:**
- `http://` → `https://` (HTTPS redirect)
- `www.bk-agencements.com` → `bk-agencements.com` (or vice versa)

**To customize redirects, add to `vercel.json`:**

```json
{
  "redirects": [
    {
      "source": "/old-path",
      "destination": "/new-path",
      "permanent": true
    }
  ]
}
```

### Step 8: Verify Everything Works

**Test checklist:**
- [ ] `https://bk-agencements.com` loads
- [ ] `https://www.bk-agencements.com` redirects correctly
- [ ] SSL certificate is valid (green lock in browser)
- [ ] All pages load correctly
- [ ] API routes work: `https://bk-agencements.com/api/...`
- [ ] Images load correctly
- [ ] No mixed content warnings

### Step 9: Update Environment Variables

**Update in Vercel dashboard:**
```
NEXT_PUBLIC_BASE_URL=https://bk-agencements.com
NEXT_PUBLIC_SITE_URL=https://bk-agencements.com
```

**Redeploy** after updating environment variables.

## Troubleshooting

### DNS Not Propagating
- Wait 24-48 hours (usually takes 1-2 hours)
- Clear DNS cache: `ipconfig /flushdns` (Windows) or `sudo dscacheutil -flushcache` (Mac)
- Check with multiple DNS checkers

### SSL Certificate Not Issuing
- Verify DNS records are correct
- Wait 5-10 minutes
- Check Vercel dashboard for errors
- Ensure domain is not using Cloudflare proxy (use DNS only)

### Domain Not Resolving
- Double-check DNS records
- Verify TTL is not too high (use 3600 or Auto)
- Check for typos in domain name
- Ensure domain is not expired

### Mixed Content Warnings
- Ensure all images use HTTPS
- Check `NEXT_PUBLIC_*` URLs use HTTPS
- Update any hardcoded HTTP URLs

## DNS Records Summary

```
Type    Name    Value                          TTL
A       @       76.76.21.21                    3600
AAAA    @       2606:4700:3034::ac43:92ae      3600
CNAME   www     cname.vercel-dns.com           3600
```

**Note:** Vercel IPs may change. Always check Vercel dashboard for current IPs.

---

**Next Step:** STEP 15.5 - Set Up Business Email




