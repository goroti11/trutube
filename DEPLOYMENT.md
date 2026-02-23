# GOROTI Platform - Deployment Guide

## Pre-Deployment Checklist

### ✅ Database Ready
- All demo data has been removed from Supabase
- RLS (Row Level Security) is enabled on all tables
- Auth policies optimized with `(select auth.uid())`
- All foreign keys properly indexed (130+ indexes added)
- No "always true" policies - all properly restricted

### ✅ Frontend Ready
- React 18 + TypeScript + Vite setup
- Supabase client configured
- Authentication flow implemented
- Clean, production-ready code
- No test/demo components

## Environment Setup

### 1. Supabase Configuration

Get your Supabase credentials from your [Supabase Dashboard](https://app.supabase.com):

1. Go to Project Settings > API
2. Copy your Project URL and anon/public key
3. Create `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 2. Build the Application

```bash
# Install dependencies
npm install

# Build for production
npm run build
```

This creates a `dist` folder with optimized production files.

## Deployment Options

### Option 1: Vercel (Recommended)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy!

### Option 2: Netlify

1. Push your code to GitHub
2. Go to [Netlify](https://netlify.com)
3. Import your repository
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Add environment variables in Site Settings
6. Deploy!

### Option 3: AWS Amplify

1. Push your code to GitHub
2. Go to AWS Amplify Console
3. Connect your repository
4. Build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
5. Add environment variables
6. Deploy!

### Option 4: Self-Hosted

1. Build the project:
   ```bash
   npm run build
   ```

2. Upload the `dist` folder to your server

3. Configure your web server (nginx example):
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /path/to/dist;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

## Post-Deployment Tasks

### 1. Test Authentication
- Sign up with a new account
- Verify email functionality (if enabled)
- Test login/logout flow

### 2. Verify Database Connections
- Check that the app connects to Supabase
- Verify RLS policies are working
- Test data operations

### 3. Performance Check
- Run Lighthouse audit
- Check load times
- Verify mobile responsiveness

### 4. Security Verification
- Ensure `.env` file is not committed to git
- Verify RLS is blocking unauthorized access
- Check that API keys are properly secured

## Environment Variables for Production

Make sure these are set in your deployment platform:

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...
```

**Important**: Never commit these to version control!

## Monitoring

After deployment, monitor:
- Supabase Dashboard for database usage
- Error logs in your deployment platform
- User authentication success rate
- API response times

## Scaling Considerations

As your platform grows:
1. Monitor Supabase usage and upgrade plan if needed
2. Consider CDN for static assets
3. Enable caching where appropriate
4. Monitor database query performance
5. Set up proper logging and error tracking

## Support

For issues or questions:
- Check Supabase status page
- Review deployment platform logs
- Verify environment variables are set correctly

## Database Maintenance

Regular tasks:
- Monitor slow queries in Supabase
- Review and optimize indexes as usage grows
- Clean up old data periodically
- Backup database regularly (automated in Supabase)

---

**The GOROTI platform is now production-ready with a clean database and optimized security!**
