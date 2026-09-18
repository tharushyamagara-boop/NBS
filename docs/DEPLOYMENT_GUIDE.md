# SUNCASA Kigali NbS Dashboard: Publishing & Live Hosting Guide

This guide details the hosting architecture and deployment workflows for the **SUNCASA Kigali Nature-Based Solutions (NbS) Impact Dashboard (v2.0.0)**.

---

## 🌐 1. Active Production Deployment: Firebase App Hosting (Google Cloud)

The application is **actively deployed live in production** on **Firebase App Hosting** (Google Cloud Platform, region `us-central1`):

- **Live URL:** [https://nbs-455962--nbs-project-7deac.us-central1.hosted.app/](https://nbs-455962--nbs-project-7deac.us-central1.hosted.app/)
- **Google Cloud / Firebase Project:** `nbs-project-7deac`
- **Backend Site ID:** `nbs-455962`
- **Region:** `us-central1` (Iowa, high-speed fiber backbone with global CDN caching)
- **Framework:** Next.js 14 (App Router, Server Components, React 18, TypeScript)

### Why Firebase App Hosting was Selected:
1. **Next.js 14 Native Support:** Built specifically to build, deploy, and scale Next.js App Router applications serverlessly on Google Cloud Run and Cloud Build.
2. **Unified Project Boundary:** The Next.js web application, Firebase Authentication (protecting `/admin`), and Firebase Firestore database all reside under the identical project (`nbs-project-7deac`), avoiding cross-cloud authentication delays and external vendor dependencies.
3. **Automated Enterprise Security:** Automated HTTPS certificate issuance and renewal via Google Trust Services, HTTP/2 and HTTP/3 support, and DDoS mitigation.
4. **Zero Server Maintenance:** Serverless scaling automatically adjusts to traffic spikes during donor briefings and civic press releases with zero sysadmin overhead.

### Managing & Deploying Updates:
Firebase App Hosting automatically deploys when code is pushed to your connected GitHub repository:
```bash
# 1. Commit and push your changes to GitHub:
git add .
git commit -m "Update SUNCASA indicator data and maps"
git push origin main

# Firebase App Hosting automatically triggers Cloud Build, creates an immutable build container, and rolls out zero-downtime updates.
```

### Custom Domain Configuration (e.g. `suncasa.rfa.gov.rw`):
1. Open the [Firebase Console](https://console.firebase.google.com/) → Select `nbs-project-7deac`.
2. Navigate to **App Hosting** → Select backend `nbs-455962` → **Custom Domains**.
3. Add `suncasa.rfa.gov.rw` (or `suncasa-kigali.iisd.org`).
4. Configure the provided DNS CNAME and TXT verification records with RFA's domain registrar / AOS National Data Centre.
5. Google Cloud automatically provisions and binds a managed SSL certificate within minutes.

---

## 2. Running Locally for Development & Testing

```bash
# 1. Install project dependencies
npm install

# 2. Verify environment configuration (.env.local is preconfigured for nbs-project-7deac)
# NEXT_PUBLIC_FIREBASE_PROJECT_ID=nbs-project-7deac
# NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=nbs-project-7deac.firebaseapp.com

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
Vercel automatically detects Next.js 14 and deploys to the Vercel Edge Network with an instant HTTPS URL (e.g., `https://suncasa-kigali.vercel.app`).

### Option B: Netlify
```bash
npx netlify-cli deploy --prod
```

### Option C: Static Export Mode (GitHub Pages / Static Web Server)
1. Add `output: 'export'` to `next.config.js`:
   ```javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     output: 'export',
     images: { unoptimized: true },
   };
   module.exports = nextConfig;
   ```
2. Run `npm run build` to generate the fully static `out/` folder.
3. Deploy the `out/` folder to GitHub Pages or any standard static file hosting. *(Note: Dynamic `/admin` Firebase routes and API routes require a full server or client-side runtime).*

---

## 4. Long-Term Transfer to Rwanda Forestry Authority (RFA) / National Data Centre (AOS)

As part of Deliverable 4 handover, the platform can be transferred directly to Rwanda's national infrastructure:

### Method 1: Node.js 18+ Application Server (Recommended)
1. Provision an Ubuntu 22.04 LTS VM at the AOS National Data Centre.
2. Install Node.js 18+ and PM2 process manager:
   ```bash
   sudo apt update && sudo apt install -y nodejs npm
   sudo npm install -g pm2
   ```
3. Clone repository and install dependencies:
   ```bash
   git clone -b NBS-Live https://github.com/tharushyamagara-boop/NBS.git /var/www/suncasa
   cd /var/www/suncasa
   npm install
   npm run build
   ```
4. Start Next.js with PM2:
   ```bash
   pm2 start npm --name "suncasa-dashboard" -- start -- -p 3000
   pm2 save
   pm2 startup
   ```
5. Configure Nginx reverse proxy with SSL:
   ```nginx
   server {
       listen 80;
       server_name suncasa.rfa.gov.rw;
       return 301 https://$host$request_uri;
   }

   server {
       listen 443 ssl http2;
       server_name suncasa.rfa.gov.rw;

       ssl_certificate /etc/letsencrypt/live/suncasa.rfa.gov.rw/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/suncasa.rfa.gov.rw/privkey.pem;

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

### Method 2: Static Nginx Hosting
If RFA IT prefers zero server-side Node.js execution:
1. Build with `output: 'export'` as detailed in Section 3.
2. Copy the `out/` folder directly to `/var/www/html/suncasa/`.
3. Serve via standard Nginx with caching headers for static assets.
