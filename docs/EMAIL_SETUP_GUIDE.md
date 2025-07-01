# Email Setup Guide for TimeDelivery

This guide will help you set up a custom domain email (support@timedelivery.tn) to avoid emails going to spam folders.

## Step 1: Domain and DNS Configuration

### 1.1 Purchase and Configure Domain
- Ensure you own the domain `timedelivery.tn`
- Access your domain registrar's DNS management panel

### 1.2 Set up MX Records
Add these MX records to your DNS:
```
Priority: 10, Value: mail.timedelivery.tn
```

### 1.3 Set up A Record for Mail Server
```
Type: A
Name: mail
Value: [Your mail server IP address]
```

### 1.4 Set up SPF Record
Add this TXT record to prevent spoofing:
```
Type: TXT
Name: @
Value: v=spf1 include:_spf.google.com ~all
```

### 1.5 Set up DKIM Record
Add DKIM record (you'll get this from your email provider):
```
Type: TXT
Name: default._domainkey
Value: [DKIM key from your email provider]
```

### 1.6 Set up DMARC Record
Add DMARC record for email authentication:
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@timedelivery.tn
```

## Step 2: Email Service Provider Options

### Option A: Google Workspace (Recommended)
1. Sign up for Google Workspace at https://workspace.google.com
2. Verify domain ownership
3. Set up MX records as provided by Google
4. Create email account: support@timedelivery.tn
5. Generate App Password for SMTP

**Environment Variables for Google Workspace:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=support@timedelivery.tn
SMTP_PASS=your_app_password
FROM_EMAIL=support@timedelivery.tn
FROM_NAME=TimeDelivery Support
```

### Option B: Microsoft 365
1. Sign up for Microsoft 365 Business
2. Add and verify your domain
3. Create email account: support@timedelivery.tn

**Environment Variables for Microsoft 365:**
```env
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=support@timedelivery.tn
SMTP_PASS=your_password
FROM_EMAIL=support@timedelivery.tn
FROM_NAME=TimeDelivery Support
```

### Option C: Dedicated Email Services

#### SendGrid
1. Sign up at https://sendgrid.com
2. Verify domain
3. Set up domain authentication

**Environment Variables:**
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key
FROM_EMAIL=support@timedelivery.tn
FROM_NAME=TimeDelivery Support
```

#### Mailgun
1. Sign up at https://mailgun.com
2. Add and verify domain
3. Set up DNS records as instructed

**Environment Variables:**
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=postmaster@timedelivery.tn
SMTP_PASS=your_mailgun_password
FROM_EMAIL=support@timedelivery.tn
FROM_NAME=TimeDelivery Support
```

## Step 3: Fly.io Environment Variables

Set environment variables in Fly.io:

```bash
# Set email configuration
flyctl secrets set SMTP_HOST=smtp.gmail.com
flyctl secrets set SMTP_PORT=587
flyctl secrets set SMTP_SECURE=false
flyctl secrets set SMTP_USER=support@timedelivery.tn
flyctl secrets set SMTP_PASS=your_app_password
flyctl secrets set FROM_EMAIL=support@timedelivery.tn
flyctl secrets set FROM_NAME="TimeDelivery Support"
```

## Step 4: Testing Email Configuration

### 4.1 Test Email Service
Add this test endpoint to your application:

```javascript
// Add to your routes
app.get('/test-email', async (req, res) => {
  try {
    const emailService = require('./src/services/emailService');
    await emailService.sendPasswordResetEmail('test@example.com', '123456');
    res.json({ success: true, message: 'Test email sent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

### 4.2 Check Email Deliverability
Use tools like:
- https://www.mail-tester.com
- https://mxtoolbox.com
- https://dkimvalidator.com

## Step 5: Best Practices

### 5.1 Email Content
- Use professional email templates
- Include unsubscribe links
- Avoid spam trigger words
- Keep subject lines clear and concise

### 5.2 Monitoring
- Monitor email delivery rates
- Set up bounce handling
- Track email opens and clicks
- Monitor spam complaints

### 5.3 Security
- Use strong passwords
- Enable 2FA on email accounts
- Regularly rotate SMTP passwords
- Monitor for unauthorized access

## Step 6: Troubleshooting

### Common Issues:
1. **Emails still going to spam**
   - Check SPF, DKIM, and DMARC records
   - Warm up your domain gradually
   - Ensure consistent sender reputation

2. **SMTP Authentication Failed**
   - Verify credentials
   - Check if 2FA is enabled (use app passwords)
   - Ensure correct SMTP settings

3. **DNS Propagation Issues**
   - Wait 24-48 hours for DNS changes
   - Use DNS checker tools
   - Clear DNS cache

### Testing Commands:
```bash
# Test DNS records
nslookup -type=MX timedelivery.tn
nslookup -type=TXT timedelivery.tn

# Test SMTP connection
telnet smtp.gmail.com 587
```

## Cost Considerations

- **Google Workspace**: ~$6/user/month
- **Microsoft 365**: ~$5/user/month  
- **SendGrid**: Free tier available, then pay-as-you-go
- **Mailgun**: Free tier available, then pay-as-you-go

## Recommendation

For a production application like TimeDelivery, I recommend:
1. **Google Workspace** for professional email hosting
2. **SendGrid** or **Mailgun** for transactional emails
3. Proper DNS configuration with SPF, DKIM, and DMARC
4. Regular monitoring of email deliverability

This setup will significantly improve email deliverability and reduce spam folder placement.