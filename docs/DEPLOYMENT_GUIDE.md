# Impact Dashboard: Publishing & Live Hosting Guide

This guide details the hosting architecture and deployment workflows for the **Impact Dashboard — Progress & Analytics Platform**.

---

## 1. Cloud Deployment: Firebase App Hosting / Google Cloud

The application supports serverless deployment on **Firebase App Hosting** (Google Cloud Run + Cloud Build):

- **Framework:** Next.js 14 (App Router, Server Components, React 18, TypeScript)
- **Database Drivers:** Local JSON (`memory`), Firebase Firestore (`firestore`), or External REST API (`inhouse`)

### Deploying Updates via GitHub:
Firebase App Hosting automatically builds and deploys when code is pushed to your connected GitHub repository:
```bash
git add .
git commit -m "Update dashboard indicators and spatial layers"
git push origin main
```

### Custom Domain Configuration:
1. Open the [Firebase Console](https://console.firebase.google.com/) and select your project.
2. Navigate to **App Hosting** → **Custom Domains**.
3. Add your domain (e.g. `dashboard.example.org`) and configure the provided DNS CNAME/TXT records with your registrar.

---

## 2. Running Locally for Development & Testing

```bash
# 1. Install project dependencies
npm install

# 2. Optional: configure environment variables in .env.local
# NEXT_PUBLIC_FIREBASE_PROJECT_ID=impact-dashboard-app
# NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=impact-dashboard-app.firebaseapp.com

# 3. Launch local development server
npm run dev
# → Open http://localhost:3000

# 4. Build optimized production bundle
npm run build

# 5. Run production server locally
npm run start
# → Open http://localhost:3000
```

---

## 3. Alternative Cloud Deployments

### Option A: Vercel (Next.js-Native)
```bash
npx vercel --prod
```

### Option B: Netlify
```bash
npx netlify-cli deploy --prod
```

### Option C: Static Export Mode (Static Web Server)
1. Add `output: 'export'` to `next.config.js`:
   ```javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     output: 'export',
     images: { unoptimized: true },
   };
   module.exports = nextConfig;
   ```
2. Run `npm run build` to generate the static `out/` folder. *(Note: Dynamic `/admin` API routes require a Node.js runtime).*

---

## 4. Self-Hosted Linux / On-Premises Server (Node.js 18+ & Nginx)

1. Provision an Ubuntu 22.04+ LTS server and install Node.js 18+ and PM2:
   ```bash
   sudo apt update && sudo apt install -y nodejs npm
   sudo npm install -g pm2
   ```
2. Clone the repository and build:
   ```bash
   git clone <YOUR_REPO_URL> /var/www/impact-dashboard
   cd /var/www/impact-dashboard
   npm install
   npm run build
   ```
3. Start Next.js with PM2:
   ```bash
   pm2 start npm --name "impact-dashboard" -- start -- -p 3000
   pm2 save
   pm2 startup
   ```
4. Configure Nginx reverse proxy with SSL:
   ```nginx
   server {
       listen 80;
       server_name dashboard.example.org;
       return 301 https://$host$request_uri;
   }

   server {
       listen 443 ssl http2;
       server_name dashboard.example.org;

       ssl_certificate /etc/letsencrypt/live/dashboard.example.org/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/dashboard.example.org/privkey.pem;

       location / {
           proxy_pass http://127.0.0.1:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
