# Interactive 2D & 3D Vastu Residential Floor Plan Designer

A high-performance, standalone, zero-dependency interactive **2D Blueprint & 3D WebGL Floor Plan Designer** tailored for residential G+3 building construction with strict Vastu Shastra compliance, custom doors & windows, full room interior furnishings, sanitaryware, and MEP plumbing/electrical engineering blueprints.

![Vastu Compliant](https://img.shields.io/badge/Vastu%20Shastra-Compliant-success?style=for-the-badge)
![Plot Dimensions](https://img.shields.io/badge/Plot%20Dimensions-27%27%20x%2023%27%20(621%20sq%20ft)-blue?style=for-the-badge)
![Floors](https://img.shields.io/badge/Floors-Ground%20%2B%203%20Floors-violet?style=for-the-badge)
![3D WebGL Engine](https://img.shields.io/badge/3D%20Engine-Three.js%20r128-orange?style=for-the-badge)

---

## 📥 Step-by-Step Instructions: How to Clone & Run Locally

### Step 1: Clone the Git Repository

Open your terminal or command prompt (PowerShell, Bash, or Git Bash) and run:

```bash
git clone https://github.com/your-username/floor-plan-designer.git
```

Then navigate into the project directory:

```bash
cd floor-plan-designer
```

*(Or navigate to `sharp-darwin/floor-plan` if inside a multi-package repository)*:

```bash
cd sharp-darwin/floor-plan
```

---

### Step 2: Run the Application Locally

You can run the application using **any of the 3 options below**:

#### 💡 Option A: Direct Open in Browser (Recommended - Zero Setup / Offline)
Since the application has zero network dependencies and all 3D WebGL engines (Three.js r128 & OrbitControls) are bundled inline:

1. Open **Windows File Explorer** (or macOS Finder).
2. Double-click on **`index.html`**.
3. The floor plan designer will instantly open in your default browser (Chrome, Edge, Firefox, or Safari) with full 2D interactive editing and 3D WebGL rendering!

**Or launch directly via Command Prompt / PowerShell:**
```powershell
# Windows PowerShell:
Start-Process index.html

# macOS Terminal:
open index.html

# Linux Terminal:
xdg-open index.html
```

---

#### 🌐 Option B: Local Node.js Web Server
If you prefer serving the application through HTTP:

1. Ensure **Node.js** is installed on your computer.
2. Open terminal in the project directory and run:
   ```bash
   node server.js
   ```
3. Open your web browser and go to:
   ```text
   http://localhost:3000
   ```

---

#### 🔌 Option C: VS Code Live Server Extension
1. Open the project folder in **Visual Studio Code**.
2. Install the **Live Server** extension (by Ritwick Dey).
3. Right-click on `index.html` and select **"Open with Live Server"**.

---

## 🛠️ Developer Guide: Rebuilding `index.html`

If you modify the source code inside `template.html`:

1. Open terminal inside the project directory.
2. Run the clean build script:
   ```bash
   node build_clean.js
   ```
3. This script automatically compiles `template.html`, `three.min.js`, and `OrbitControls.js` into a standalone production `index.html`.

---

## 📂 Project Structure Overview

```text
floor-plan/
├── index.html            # Compiled standalone production app (2D + 3D WebGL)
├── template.html         # Developer source template (HTML, CSS, JS)
├── mep_blueprint.html    # Interactive MEP Plumbing & Electrical Riser Blueprint
├── build_clean.js        # Node build compiler script
├── server.js             # Lightweight Node.js local dev server
├── three.min.js          # Three.js 3D WebGL engine library
├── OrbitControls.js      # Three.js 3D camera orbit controls
└── README.md             # Project documentation & setup guide
```

---

## ✨ Key Features & Capabilities

### 🛋️ 1. Full Interior Designer Furnishing & Sanitaryware
- **Bathrooms & Toilets**: Ceramic Western Toilet Commode (WC + Flush Tank), Vanity Wash Basin + Faucet Tap, and Glass Shower Enclosures.
- **Kitchen**: L-Shaped Granite Countertop, Stainless Steel Dual Basin Sink + Gooseneck Tap, 4-Burner Glass Top Gas Stove, and Double-Door Refrigerator.
- **Dining Area**: White Dining Table with Lime Green Runner + 6 Upholstered Lime Green Chairs + Dedicated Dining Corner Hand Wash Basin.
- **Bedrooms**: King/Queen Beds, Upholstered Headboards, Pillows, Duvets, Soft Rugs, Dual Nightstands with Lamps, and Full-Wall Wardrobes.
- **Pooja Room**: Wooden Mandir Altar + Brass Diya Oil Lamp.

---

### 🎲 2. 3D WebGL Architectural Renderer (Arden Estate Architectural Model)
- **High-Contrast 3D Studio Rendering**: Soft Architectural White Walls (`#F1F5F9`) with Dark Slate Top Cap Trims (`#1E293B`).
- **Natural Oak & Tile Flooring**: Scandinavian Light Oak Wood Planking (`#C4A482`) for living spaces and Soft Slate Tiles (`#94A3B8`) for wet areas.
- **3D Doors & Windows**: Pure white 3D door frames and panels swinging open at 45° into rooms + clear glass windows.
- **Multi-Floor Stack & Explode**: View individual floors or use `💥 Explode` mode to separate floors vertically.

---

### 💾 3. Project Backup & Cross-Device Transfer
- **`💾 Save File`**: Click to download a permanent `.json` backup file (`my-floor-plan-backup-2026-07-26.json`) directly to your computer.
- **`📂 Load File`**: Click to select and restore any saved `.json` blueprint backup file.
- **Auto-Save**: Automatic continuous saving to browser local memory (`localStorage`).
- **Self-Healing Fallback**: Automatically restores default room layouts if browser memory is cleared.

---

### 📐 4. Plot Dimensions & Vastu Alignment
- **Plot Size**: 27' (E-W) × 23' (S-N) = 621 sq. ft. per floor (G+3 Total: 2,484 sq. ft.).
- **Vastu Zone Placement**:
  - Master Bedroom: **South-West** (Earth/Stability)
  - Kitchen: **South-East** (Agneya/Fire)
  - Pooja Room: **North-East** (Ishan/Water)
  - Septic Tank & Utility: **West / North-West**
  - Staircase: **South Wall** (U-Shaped Clockwise Ascending)

---

## 🚀 Free Deployment Guide (Deploy Online 100% Free)

Since this application is a standalone Single-Page Application (SPA) with zero external server dependencies, you can host it **100% FREE forever** using any of the free cloud resources below:

---

### 🌐 Option 1: GitHub Pages (Recommended - 100% Free & Easiest)
1. Push your repository to **GitHub**.
2. On GitHub, navigate to your repository **Settings** -> **Pages** (in the left sidebar).
3. Under **Build and deployment** -> **Branch**, select `main` (or `master`) and `/ (root)` folder (or `/sharp-darwin/floor-plan`).
4. Click **Save**.
5. Within 1 minute, GitHub will give you a live HTTPS web link:
   `https://your-username.github.io/your-repository-name/`

---

### ⚡ Option 2: Vercel (100% Free - Fastest Deployment & Custom Domain Support)
1. Sign up for a free account at [Vercel](https://vercel.com) using your GitHub account.
2. Click **"Add New..."** -> **"Project"**.
3. Select your `floor-plan-designer` GitHub repository.
4. Set the Root Directory if needed (`sharp-darwin/floor-plan`), then click **Deploy**.
5. Vercel will instantly publish your app with a free SSL domain:
   `https://floor-plan-designer.vercel.app`

---

### 💧 Option 3: Netlify (100% Free)
1. Sign up for a free account at [Netlify](https://www.netlify.com).
2. Click **"Add new site"** -> **"Import an existing project"** -> Select **GitHub**.
3. Pick your repository, leave build command blank, set publish directory to `.` (or `sharp-darwin/floor-plan`).
4. Click **Deploy Site**.
5. Netlify will host your site live at:
   `https://your-app-name.netlify.app`

---

### ☁️ Option 4: Cloudflare Pages (100% Free - Unlimited Bandwidth)
1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com) -> Go to **Workers & Pages**.
2. Click **Create Application** -> **Pages** -> **Connect to Git**.
3. Select your repository and click **Save and Deploy**.

---

## 📱 Mobile Compatibility & Touch Controls

- **2-Finger Pinch-to-Zoom**: Pinch in or out anywhere on the 2D canvas to scale the layout seamlessly.
- **1-Finger Drag & Drop**: Tap and drag rooms, doors, windows, and staircases directly on mobile touchscreens.
- **Mobile Drawer Navigation**: Slide-up bottom sheets for **Plot & Tools** and **Structures & Layers** to maximize touchscreen drawing space.
- **3D Touch Orbit & Rotate**: Rotate, pan, and zoom 3D WebGL models smoothly using native touch gestures.

---

## 💾 Saving Manual Edits to Git Repository

To permanently save your manual floor plan layouts to your Git repository so any device pulling the code gets your exact custom setup:

1. Stage your changes:
   ```bash
   git add .
   ```
2. Commit your custom floor plan state:
   ```bash
   git commit -m "Save custom floor plan layout, doors, windows, and furnishings"
   ```
3. Push to your remote repository:
   ```bash
   git push origin main
   ```

---

## 📜 License & Acknowledgments

- Built with [Three.js](https://threejs.org/) (r128) and OrbitControls.
- Inspired by modern architectural estate rendering and Vastu Shastra design principles.
