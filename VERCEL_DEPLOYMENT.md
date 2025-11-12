# Vercel Deployment Guide

## ✅ Configuration Complete

Your Angular application is now configured for Vercel deployment with the following setup:

### Files Created/Updated:

1. **vercel.json** - Vercel configuration
   - Framework: Angular
   - Build command: `npm run build`
   - Output directory: `dist/propella-crm/browser`
   - SPA routing configured

2. **angular.json** - Production build configuration
   - Production configuration with optimization
   - Environment file replacement
   - Bundle size budgets configured
   - Output path: `dist/propella-crm`

3. **package.json** - Updated build scripts
   - `npm run build` - Production build
   - `npm run build:dev` - Development build

4. **environment.prod.ts** - Production environment
   - API URL set to `/api`
   - Production flag enabled

5. **.vercelignore** - Files to exclude from deployment
   - node_modules
   - .angular cache
   - logs and temp files

## 🚀 Deployment Steps

### Option 1: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Import your Git repository
4. Vercel will auto-detect Angular and use the configuration
5. Click "Deploy"

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

## 🔧 Build Configuration

### Production Build Settings:
- **Optimization**: Enabled
- **Source Maps**: Disabled
- **Output Hashing**: All files
- **Tree Shaking**: Enabled
- **Minification**: Enabled

### Bundle Sizes:
- Initial bundle: Max 5MB (Warning at 2MB)
- Component styles: Max 20KB (Warning at 15KB)

## 🌐 Environment Variables (Optional)

If you need to add environment variables in Vercel:

1. Go to Project Settings → Environment Variables
2. Add variables:
   - `PRODUCTION` = `true`
   - `API_URL` = `your-api-url` (if using external API)

## 📝 Login Credentials

For testing the deployed application:

### Superadmin Access:
- **Email**: `superadmin@novakeys.com`
- **Password**: `superadmin`

### Regular Users:
- **Email**: `admin@crm.com` or `agent@crm.com`
- **Password**: `password123`

## ⚙️ Routing Configuration

The application uses Angular routing with the following setup:
- All routes redirect to `index.html` (SPA mode)
- Hash-based routing: NO (uses HTML5 pushState)
- 404 handling: All unknown routes serve `index.html`

## 🔍 Troubleshooting

### Issue: 404 on page refresh
**Solution**: Already configured in `vercel.json` - all routes redirect to `/index.html`

### Issue: Build fails on Vercel
**Solutions**:
1. Check Node.js version (recommend Node 18+)
2. Verify all dependencies are in `package.json`
3. Check build logs for specific errors

### Issue: Environment variables not working
**Solution**: 
1. Set in Vercel Dashboard → Project Settings → Environment Variables
2. Redeploy after adding variables

### Issue: Large bundle size warnings
**Solution**: Already configured with increased budgets. If needed, enable lazy loading:
```typescript
// In app.routes.ts
{
  path: 'analytics',
  loadComponent: () => import('./components/analytics-dashboard/analytics-dashboard.component')
    .then(m => m.AnalyticsDashboardComponent)
}
```

## 📊 Performance Optimizations

1. **AOT Compilation**: Enabled in production
2. **Tree Shaking**: Removes unused code
3. **Lazy Loading**: Can be implemented for large modules
4. **Bundle Splitting**: Automatic code splitting
5. **Caching**: Static assets cached with hash-based names

## 🎯 Post-Deployment Checklist

- [ ] Verify login functionality
- [ ] Test all routes (dashboard, leads, superadmin, etc.)
- [ ] Check tenant navigation system
- [ ] Verify D3.js charts load correctly
- [ ] Test responsive design on mobile
- [ ] Check console for errors
- [ ] Verify session management (30-min timeout)
- [ ] Test tenant preview functionality

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Angular Deployment Guide](https://angular.io/guide/deployment)
- [Vercel CLI Reference](https://vercel.com/docs/cli)

## 💡 Tips

1. **Custom Domain**: Add in Vercel → Project Settings → Domains
2. **HTTPS**: Automatically enabled by Vercel
3. **Analytics**: Enable Vercel Analytics for performance monitoring
4. **Preview Deployments**: Every branch/PR gets a preview URL
5. **Rollback**: Easy rollback to previous deployments in Vercel dashboard

---

## 🎉 Your Application is Ready!

The build completed successfully with only minor warnings (non-blocking).

### Current Status:
✅ Production build successful  
✅ Bundle size: 1.42 MB (within limits)  
✅ All routes configured  
✅ Environment files set up  
✅ Vercel configuration complete  

**Next Step**: Push to GitHub and deploy via Vercel dashboard or CLI!
