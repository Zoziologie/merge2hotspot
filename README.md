# Merge2Hotspot

Find existing eBird hotspots for your personal locations and review which checklists can be merged.

## What It Does

- Imports your `MyEBirdData.csv` export from eBird.
- Finds personal locations that are not already hotspots.
- Loads hotspots by region.
- Shows the closest hotspot for each personal location.
- Lets you open the matching eBird pages directly.

## Demo

[Open the live demo](https://zoziologie.raphaelnussbaumer.com/merge2hotspot/)

## Local Setup

1. Install dependencies.
   ```bash
   npm install
   ```
2. Create a local env file.
   ```bash
   cp .env.example .env.local
   ```
3. Fill in your values in `.env.local`.
4. Start the dev server.
   ```bash
   npm run dev
   ```

## Environment Variables

The app expects these values at build time:

- `MAPBOX_ACCESS_TOKEN`
- `EBIRD_API_KEY`

Use `.env.local` for local development. Do not commit it.

## GitHub Pages Deploy

The GitHub Actions workflow builds the app and deploys it to GitHub Pages.

Set these repository or environment secrets:

- `MAPBOX_ACCESS_TOKEN`
- `EBIRD_API_KEY`

The workflow injects them during the build step so the static site can read them in the browser bundle.

## Build

```bash
npm run build
```

## Notes

- The Mapbox token should be a public token with URL restrictions for your site.
- The eBird file is processed locally in the browser.

![Exemple](/assets/m2h.gif)
