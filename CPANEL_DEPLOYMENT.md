# cPanel Deployment Guide for Propella Real Estate CRM

## Prerequisites
- cPanel hosting account with file manager access
- Node.js installed locally (for building)
- Angular CLI installed globally

## Deployment Steps

### 1. Build for Production
```bash
# Install dependencies
npm install

# Build for production
ng build --configuration production

# This creates a 'dist/' folder with static files
```

### 2. Upload to cPanel
1. **Access cPanel File Manager**
   - Login to your cPanel
   - Open "File Manager"
   - Navigate to `public_html` (or your domain folder)

2. **Upload Built Files**
   - Upload all files from `dist/propella-crm/` to your domain folder
   - Ensure `index.html` is in the root directory

### 3. Configure .htaccess for Angular Routing
Create `.htaccess` file in your domain root:

```apache
RewriteEngine On
RewriteBase /

# Handle Angular Router
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Security Headers
Header always set X-Frame-Options DENY
Header always set X-Content-Type-Options nosniff
Header always set Referrer-Policy "strict-origin-when-cross-origin"

# Cache Static Assets
<filesMatch "\\.(css|js|png|jpg|jpeg|gif|ico|svg)$">
  ExpiresActive On
  ExpiresDefault "access plus 1 month"
</filesMatch>
```

## File Structure After Upload
```
public_html/
├── index.html
├── main.[hash].js
├── polyfills.[hash].js
├── runtime.[hash].js
├── styles.[hash].css
├── assets/
├── favicon.ico
└── .htaccess
```

## Important Considerations

### 1. API Backend
- This is a frontend-only application
- You'll need a separate backend API
- Options:
  - PHP backend on same cPanel
  - External API service
  - Firebase/Supabase

### 2. Environment Configuration
Update `src/environments/environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://yourdomain.com/api', // Your API endpoint
  appUrl: 'https://yourdomain.com'
};
```

### 3. Base Href Configuration
If deploying to a subdirectory:
```bash
ng build --base-href="/subfolder/"
```

## Limitations of cPanel Hosting

### What Works:
✅ Static file serving
✅ Angular routing (with .htaccess)
✅ Client-side functionality
✅ CSS/JS assets
✅ Images and fonts

### What Doesn't Work:
❌ Server-side rendering (SSR)
❌ Node.js backend
❌ Real-time features (WebSocket)
❌ File uploads (without PHP backend)

## Alternative Hosting Solutions

### For Full-Stack Applications:
1. **Vercel** - Best for Angular apps
2. **Netlify** - Great for static sites
3. **AWS Amplify** - Full-stack hosting
4. **DigitalOcean App Platform** - Node.js support

### For cPanel + Backend:
1. **PHP Backend** - Create REST API in PHP
2. **External API** - Use services like Firebase
3. **Subdomain Setup** - API on api.yourdomain.com

## Sample PHP Backend Structure
If you want to add a PHP backend to your cPanel:

```
public_html/
├── index.html (Angular app)
├── api/
│   ├── index.php
│   ├── properties/
│   ├── leads/
│   └── config/
└── .htaccess
```

## Build Script for Easy Deployment
Add to `package.json`:
```json
{
  "scripts": {
    "build:cpanel": "ng build --configuration production && echo 'Upload dist/propella-crm/* to cPanel public_html/'"
  }
}
```

## Security Considerations
- Enable HTTPS in cPanel
- Use environment variables for sensitive data
- Implement proper CORS headers
- Add security headers in .htaccess

## Performance Optimization
- Enable gzip compression in cPanel
- Use CDN for assets
- Optimize images before upload
- Minify CSS/JS (done automatically by Angular build)

## Troubleshooting

### Common Issues:
1. **404 on refresh** - Check .htaccess configuration
2. **Assets not loading** - Verify file paths and permissions
3. **API calls failing** - Check CORS and API endpoints
4. **Slow loading** - Enable compression and caching

### File Permissions:
- Folders: 755
- Files: 644
- .htaccess: 644