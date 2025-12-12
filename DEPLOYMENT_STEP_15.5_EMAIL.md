# STEP 15.5 — Set Up Business Email with Zoho Mail

## Email: `contact@bk-agencements.com`

### Why Zoho Mail?
- ✅ Free plan available (up to 5 users)
- ✅ 5GB storage per user
- ✅ Works well in Morocco
- ✅ Professional email addresses
- ✅ Webmail + Mobile apps
- ✅ Good deliverability

### Step 1: Sign Up for Zoho Mail

1. Go to [zoho.com/mail](https://www.zoho.com/mail/)
2. Click **"Sign Up Now"**
3. Choose **"Mail for Your Domain"**
4. Enter your domain: `bk-agencements.com`
5. Create your Zoho account
6. Verify domain ownership (see Step 2)

### Step 2: Verify Domain Ownership

Zoho will ask you to verify domain ownership. Options:

**Option A: Add TXT Record (Recommended)**
```
Type: TXT
Name: @ (or blank)
Value: zoho-verification=xxxxxxxxxxxxx
TTL: 3600
```

**Option B: Add HTML File**
- Download HTML file from Zoho
- Upload to your website root
- Zoho will verify via HTTP

### Step 3: Add MX Records

**Add these MX records in your DNS provider:**

```
Type: MX
Name: @ (or blank/root)
Priority: 10
Value: mx.zoho.com
TTL: 3600

Type: MX
Name: @ (or blank/root)
Priority: 20
Value: mx2.zoho.com
TTL: 3600
```

**Complete MX Records List:**
```
Priority 10: mx.zoho.com
Priority 20: mx2.zoho.com
```

### Step 4: Add SPF Record

**SPF (Sender Policy Framework) - Prevents email spoofing:**

```
Type: TXT
Name: @ (or blank)
Value: v=spf1 include:zoho.com ~all
TTL: 3600
```

**Important:** If you have existing SPF records, combine them:
```
v=spf1 include:zoho.com include:_spf.google.com ~all
```

### Step 5: Add DKIM Record

**DKIM (DomainKeys Identified Mail) - Email authentication:**

1. In Zoho Mail dashboard, go to **Domain Settings** → **Email Authentication**
2. Click **"Add"** next to DKIM
3. Zoho will generate a DKIM key
4. Add TXT record:

```
Type: TXT
Name: zmail._domainkey
Value: (copy from Zoho - looks like: v=DKIM1; k=rsa; p=xxxxxxxxxxxxx...)
TTL: 3600
```

**Example:**
```
Type: TXT
Name: zmail._domainkey
Value: v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC...
TTL: 3600
```

### Step 6: Add DMARC Record

**DMARC (Domain-based Message Authentication) - Email security:**

```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:dmarc@bk-agencements.com; ruf=mailto:dmarc@bk-agencements.com; fo=1
TTL: 3600
```

**DMARC Policies:**
- `p=none` - Monitor only (start here)
- `p=quarantine` - Quarantine suspicious emails
- `p=reject` - Reject suspicious emails (use after testing)

**After testing (1-2 weeks), update to:**
```
v=DMARC1; p=quarantine; rua=mailto:dmarc@bk-agencements.com; ruf=mailto:dmarc@bk-agencements.com; fo=1; pct=100
```

### Step 7: Create Email Account

1. In Zoho Mail dashboard, go to **Users** → **Add User**
2. Enter email: `contact@bk-agencements.com`
3. Set password (strong password recommended)
4. Choose plan: **Free** (if available) or **Mail Lite**
5. Click **Add**

### Step 8: Configure Email Client (Optional)

**For Webmail:**
- Go to [mail.zoho.com](https://mail.zoho.com)
- Sign in with `contact@bk-agencements.com`

**For Desktop Client (Outlook, Thunderbird):**

**IMAP Settings:**
```
Incoming Mail Server: imap.zoho.com
Port: 993
Security: SSL/TLS
Username: contact@bk-agencements.com
Password: (your password)

Outgoing Mail Server: smtp.zoho.com
Port: 465
Security: SSL/TLS
Username: contact@bk-agencements.com
Password: (your password)
```

**POP3 Settings:**
```
Incoming Mail Server: pop.zoho.com
Port: 995
Security: SSL/TLS
Username: contact@bk-agencements.com
Password: (your password)

Outgoing Mail Server: smtp.zoho.com
Port: 465
Security: SSL/TLS
Username: contact@bk-agencements.com
Password: (your password)
```

### Step 9: Verify DNS Records

**Wait 24-48 hours for DNS propagation, then verify:**

**Check MX Records:**
```bash
dig bk-agencements.com MX
# Should show: mx.zoho.com and mx2.zoho.com
```

**Check SPF:**
```bash
dig bk-agencements.com TXT | grep spf
# Should show: v=spf1 include:zoho.com ~all
```

**Check DKIM:**
```bash
dig zmail._domainkey.bk-agencements.com TXT
# Should show DKIM key
```

**Check DMARC:**
```bash
dig _dmarc.bk-agencements.com TXT
# Should show DMARC policy
```

**Online Tools:**
- [MXToolbox](https://mxtoolbox.com/)
- [DMARC Analyzer](https://www.dmarcanalyzer.com/)
- [SPF Record Checker](https://www.spf-record.com/)

### Step 10: Test Email Delivery

**Send test emails:**
1. Send from `contact@bk-agencements.com` to Gmail
2. Send from `contact@bk-agencements.com` to Outlook
3. Check spam folder
4. Verify email headers show correct authentication

**Check email headers:**
- SPF: `PASS`
- DKIM: `PASS`
- DMARC: `PASS`

### Step 11: Update Contact Form

**Update your contact form to use Zoho SMTP:**

**Option A: Use Zoho SMTP in your code:**

```typescript
// lib/email.ts
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.ZOHO_EMAIL,
    pass: process.env.ZOHO_PASSWORD,
  },
})
```

**Environment Variables:**
```
ZOHO_EMAIL=contact@bk-agencements.com
ZOHO_PASSWORD=your-zoho-password
```

**Option B: Use Zoho API (Recommended):**

1. Generate Zoho API token
2. Use Zoho Mail API for sending emails
3. More reliable than SMTP

### Step 12: Set Up Email Forwarding (Optional)

**Forward emails to personal email:**

1. In Zoho Mail dashboard
2. Go to **Settings** → **Mail Forwarding**
3. Add forwarding address
4. Choose: Forward and keep copy (or just forward)

## Complete DNS Records Summary

```
Type    Name              Value/Data                                    Priority  TTL
TXT     @                 zoho-verification=xxxxxxxxxxxxx              -         3600
MX      @                 mx.zoho.com                                   10        3600
MX      @                 mx2.zoho.com                                  20        3600
TXT     @                 v=spf1 include:zoho.com ~all                  -         3600
TXT     zmail._domainkey  v=DKIM1; k=rsa; p=xxxxxxxxxxxxx...            -         3600
TXT     _dmarc            v=DMARC1; p=none; rua=mailto:dmarc@...        -         3600
```

## Troubleshooting

### Emails Not Receiving
- Wait 24-48 hours for DNS propagation
- Verify MX records are correct
- Check spam folder
- Verify email account is active in Zoho

### Emails Going to Spam
- Verify SPF record is correct
- Verify DKIM is set up
- Set up DMARC (start with `p=none`)
- Warm up email account (send regular emails)
- Avoid spam trigger words

### DKIM Not Working
- Verify TXT record name is exactly: `zmail._domainkey`
- Check DKIM key is complete (very long string)
- Wait for DNS propagation
- Verify in Zoho dashboard

### SPF Errors
- Ensure only one SPF record exists
- Combine multiple includes: `v=spf1 include:zoho.com include:other.com ~all`
- Check for typos

## Security Best Practices

1. **Use Strong Passwords** - 16+ characters, mixed case, numbers, symbols
2. **Enable 2FA** - Two-factor authentication in Zoho
3. **Regular Backups** - Export important emails
4. **Monitor DMARC Reports** - Check for spoofing attempts
5. **Update DMARC Policy** - Move from `none` to `quarantine` to `reject`

## Zoho Mail Plans

**Free Plan:**
- 5 users
- 5GB storage per user
- Webmail + Mobile apps
- Basic features

**Mail Lite ($1/user/month):**
- 10GB storage
- Email hosting
- All free features

**Mail Premium ($4/user/month):**
- 50GB storage
- Advanced features
- Priority support

---

**Next Step:** STEP 15.6 - Create Automated Backups




