# 🌲 Skogkontroll — Nordmarka Forest Dashboard

Real-time forest management dashboard for Nordmarka, Norway.  
All data is fetched live from public APIs — no mock data.

**Live demo:** `https://<your-username>.github.io/skogkontroll/`

![Skogkontroll](https://img.shields.io/badge/data-live_APIs-27ae60)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## Data Sources

| Source | API | What it provides |
|--------|-----|-----------------|
| **Element84 Earth Search** | `earth-search.aws.element84.com/v1` | Sentinel-2 L2A + Landsat C2L2 satellite scenes |
| **NIBIO SR16** | `wms.nibio.no/cgi-bin/sr16` | Norwegian forest resource maps (16×16m resolution) |
| **MET Norway** | `api.met.no/weatherapi` | Real-time weather + 48h forecast |

**LAI Calculation:** `LAI = 0.57 × exp(2.33 × NDVI)` — empirical formula validated for boreal forests (R² ≈ 0.55, RMSE ≈ 0.8).

---

## Run Locally

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ installed
- npm (comes with Node.js)

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/<your-username>/skogkontroll.git
cd skogkontroll

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
```

Open [http://localhost:5173/skogkontroll/](http://localhost:5173/skogkontroll/) in your browser.

> **Tip:** For local dev without the base path, temporarily change `base` in `vite.config.js` to `"/"`, then open `http://localhost:5173/`

---

## Deploy to GitHub Pages

### Option A: Automatic (GitHub Actions) — Recommended

1. **Create a GitHub repo** named `skogkontroll`

2. **Push this code:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/skogkontroll.git
   git push -u origin main
   ```

3. **Enable GitHub Pages:**
   - Go to your repo → **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**

4. **Done!** Every push to `main` will auto-deploy.  
   Your site will be at: `https://<your-username>.github.io/skogkontroll/`

### Option B: Manual deploy with gh-pages

```bash
# Install gh-pages if not already
npm install

# Build and deploy
npm run deploy
```

Then go to **Settings → Pages** and set source to `gh-pages` branch.

---

## Project Structure

```
skogkontroll/
├── index.html                    # Entry HTML
├── package.json                  # Dependencies & scripts
├── vite.config.js                # Vite config (base path for GH Pages)
├── src/
│   ├── main.jsx                  # React entry point
│   └── NordmarkaForest.jsx       # Main dashboard component (all logic)
├── .github/
│   └── workflows/
│       └── deploy.yml            # Auto-deploy on push to main
└── README.md
```

---

## Important Notes

- **NIBIO WMS** may be slow or occasionally unavailable — the dashboard handles this gracefully with fallback messages.
- **MET Norway API** requires a `User-Agent` header — already configured in the code.
- **Landsat data** on AWS is in requester-pays buckets. The STAC metadata is free, but downloading actual GeoTIFFs requires AWS credentials.
- **CORS:** Some APIs may have CORS restrictions. The STAC API and MET API support browser requests. NIBIO WMS images load via `<img>` tags which bypass CORS.

---

## License

MIT — Data from NIBIO is under [NLOD](https://data.norge.no/nlod/en/2.0), MET data under [Norwegian License for Open Government Data](https://data.norge.no/nlod).
