# Interactive 2D & 3D Vastu Residential Floor Plan Designer

A high-performance, standalone, zero-dependency interactive 2D Blueprint and 3D WebGL Floor Plan Designer tailored for residential G+3 building construction with strict Vastu Shastra compliance.

![Floor Plan System Overview](https://img.shields.io/badge/Vastu%20Shastra-Compliant-success?style=for-the-badge)
![Plot Dimensions](https://img.shields.io/badge/Plot%20Dimensions-27%27%20x%2023%27%20(621%20sq%20ft)-blue?style=for-the-badge)
![Floors](https://img.shields.io/badge/Floors-Ground%20%2B%203%20Floors-violet?style=for-the-badge)

---

## 📌 Project Overview

This project provides a complete architectural planning solution for a **27' × 23' (621 sq ft)** plot with road access on the **East**. It features real-time 2D SVG room editing, grid snapping, custom area target sizing, Vastu Shastra zone mapping, service riser conduits (Water, Sewage, Electrical), and an animated Three.js 3D WebGL engine with floor isolation and exploded view capabilities.

---

## 📐 Plot Specifications & Orientation

- **Dimensions**:
  - **West Wall**: 27' (Rear wall)
  - **East Wall**: 27' (Frontage facing Main Road)
  - **South Wall**: 23' (Left boundary)
  - **North Wall**: 23' (Right boundary)
- **Total Plot Area**: 621 sq. ft. per floor (G+3 Total Built-up: ~2,484 sq. ft.)
- **Orientation**: East-facing Plot (Entrance & Main Access Road on East).

---

## 🏗️ Structural Fixed Features (Single Source of Truth)

All structural infrastructure elements are permanently fixed with exact hand-drawn blueprint dimensions:

| Feature | Dimensions | Exact Location | Vastu & Engineering Rationale |
| :--- | :--- | :--- | :--- |
| **Staircase** | 6' × 7' | **South Wall** (10' from West, 6' from East Road) | Heavy structure placed on South wall to maintain Vastu energy balance. |
| **West Shaft (Shaft 1)** | 8' × 2' | **West Wall** (10' from SW, 9' from NW) | Primary vertical drop shaft for plumbing supply, graywater, and soil waste. |
| **Septic Tank** | 8' × 5' | **West Wall** (Attached directly behind Shaft 1) | Positioned in West/NW zone for optimal waste disposal without polluting Ishan energy. |
| **North Shaft (Shaft 2)** | 4' × 2' | **North Wall** (10' from NW, 9' from NE Road) | Primary electrical riser, floor DB conduits, and AC refrigerant line trunk. |
| **Borewell (Boring)** | 4' × 4' | **North-East Corner** | Located in NE (Ishan) zone for maximum purity and positive water energy. |

---

## ⚙️ Service Utility Layers & Conduit Routing

### 🚰 Water Supply (Blue Layer)
- **Sump to Riser**: Underground water supply pumped from NE Borewell ($22'\times 18'$) along perimeter lines to **Shaft 1** (West) and **Shaft 2** (North).
- **Gravity Down-Feed**: Overhead storage tank down-feed lines drop vertically through Shaft 1 directly supplying Master Bathroom, Toilets, and Kitchen.

### 🌀 Sewage & Drainage (Cyan Layer)
- **Soil & Graywater Drop**: All bathroom and kitchen waste pipes route with a 1:40 gravity slope directly into **Shaft 1**.
- **Septic Connection**: Main vertical stack in Shaft 1 drops straight into the attached $8'\times 5'$ Septic Tank on the West Wall.

### ⚡ Electrical & AC Conduits (Yellow Layer)
- **Service Entrance**: Main service wire from East Road feeds into the SE Agneya meter panel.
- **Riser Trunk**: Main power cable runs up through **Shaft 2** (North Wall) to distribute floor distribution boxes (DBs) on Ground, 1st, 2nd, and 3rd floors.

---

## 🏢 Floor-by-Floor Layout (G+3)

1. **Ground Floor**:
   - Covered Car Parking Bay ($11'\times 11'$)
   - East Entrance Lobby facing Road ($10'\times 5'$)
   - Utility / Storage Room ($6'\times 7'$) in SW
   - Septic Tank, Borewell, Shaft 1 & Shaft 2

2. **1st Floor (Primary Residence)**:
   - Master Bedroom ($10'\times 10'$) in SW
   - Living Room ($8'\times 10'$) in North/East
   - Agneya Kitchen ($6'\times 6'$) in SE
   - Dining Hall ($12'\times 5'$)
   - Bathroom / Toilet ($6'\times 6'$) in West/NW

3. **2nd Floor (Family Residence)**:
   - Bedroom 2 ($10'\times 10'$) in SW
   - Bedroom 3 ($9'\times 10'$) in NW
   - Central Family Lounge ($14'\times 13'$)
   - Bathroom ($6'\times 6'$)

4. **3rd Floor (Terrace & Guest)**:
   - Guest Bedroom 4 ($10'\times 10'$) in SW
   - Open Sky Roof Terrace ($15'\times 23'$) facing North-East

---

## 💻 Tech Stack & Features

- **Frontend Core**: Vanilla HTML5, JavaScript (ES6+), Vanilla CSS (Neomorphism Dark Theme).
- **2D Canvas Engine**: SVG Vector Graphics with 1-foot grid snapping, drag-and-drop room repositioning, interactive corner resizing, and target sq. ft. auto-scaling.
- **3D WebGL Engine**: Three.js (r128) + OrbitControls with soft shadow mapping, 3D extruded room walls, translucent utility shaft columns, 3D stair steps, and animated floor explosion stack (`💥 Explode`).
- **Offline / Zero Network Dependency**: Three.js and OrbitControls are fully bundled inline directly inside `index.html` for instant local execution via `file:///` URLs without requiring a local web server or internet connection.

---

## 🚀 How to Run Locally

1. Double-click [index.html](file:///C:/Users/shkr9/Documents/antigravity/sharp-darwin/floor-plan/index.html) directly in any web browser (Chrome, Edge, Firefox, Safari).
2. Alternatively, build from template using Node.js:
   ```bash
   node build_clean.js
   ```

---

## 📜 Version Control & Branch

- **Branch**: `feature/vastu-floor-plan-3d`
- **Author**: Architectural Agentic Assistant
