# SUNCASA Kigali NbS Dashboard: Publishing & Live Hosting Guide

This guide explains how to publish the **SUNCASA Kigali Nature-Based Solutions (NbS) Impact Dashboard** to the web so you can immediately share a live public link with stakeholders, funders (Global Affairs Canada), City of Kigali, and Rwanda Forestry Authority (RFA).

Because the dashboard is built as a zero-server, high-performance static web application, it can be hosted for **free** with global CDN caching and SSL encryption.

---

## Option 1: Instant Free Deployment via Netlify (Recommended - 1 Minute)

### Method A: Drag & Drop (No CLI needed)
1. Run `npm run build` in this repository to generate the `dist` folder.
2. Open your web browser and navigate to [app.netlify.com/drop](https://app.netlify.com/drop).
3. Drag and drop the `dist/` folder from:
   `C:\Users\tharushyamagara\.gemini\antigravity-ide\scratch\suncasa-kigali-nbs-dashboard\dist`
4. Netlify will instantly provide a live, shareable URL (e.g. `https://suncasa-kigali-nbs.netlify.app`).

### Method B: Via Netlify CLI
Run the following commands in powershell:
```powershell
npx netlify-cli deploy --prod --dir=dist
```

---

## Option 2: Free Deployment via Vercel (1 Command)

1. Open PowerShell inside the project directory:
   ```powershell
   cd C:\Users\tharushyamagara\.gemini\antigravity-ide\scratch\suncasa-kigali-nbs-dashboard
   ```
2. Run:
   ```powershell
   npx vercel --prod
   ```
3. Follow the quick terminal prompts. Vercel will output a live HTTPS URL (e.g. `https://suncasa-kigali.vercel.app`).

---

## Option 3: GitHub Pages (Directly from Git)

1. Initialize a git repository and push to GitHub:
   ```powershell
   git init
   git add .
   git commit -m "Initial commit of SUNCASA Kigali NbS Dashboard MVP"
   git branch -M main
   git remote add origin https://github.com/<YOUR_ORGANIZATION_OR_USERNAME>/suncasa-kigali-dashboard.git
   git push -u origin main
   ```
2. In your repository on GitHub:
   - Go to **Settings > Pages**.
   - Under **Build and deployment > Source**, select **GitHub Actions**.
3. Create `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages
   on:
     push:
       branches: [main]
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with:
             node-version: 20
         - run: npm ci
         - run: npm run build
         - uses: actions/upload-pages-artifact@v3
           with:
             path: ./dist
         - uses: actions/deploy-pages@v4
   ```
4. Your site will be published at `https://<YOUR_USERNAME>.github.io/suncasa-kigali-dashboard/`.

---

## Option 4: Hosting on Rwanda Forestry Authority (RFA) / Govt Servers (AOS)

1. Run `npm run build`.
2. Copy all files from the `dist/` directory directly to your web server root:
   - For **Nginx**: `/var/www/html/suncasa/`
   - For **Apache**: `/var/www/suncasa/`
3. Sample Nginx configuration:
   ```nginx
   server {
       listen 80;
       server_name nbs.rfa.gov.rw;
       root /var/www/html/suncasa;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```
