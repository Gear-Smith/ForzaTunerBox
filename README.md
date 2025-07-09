# 🚗 Forza Tuner Box

A tuning utility for **Forza Motorsport 2023** that transforms car data and driving preferences into optimized handling setups.

---

## 📋 Table of Contents

- [🚗 Forza Tuner Box](#-forza-tuner-box)
  - [📋 Table of Contents](#-table-of-contents)
  - [About the Project](#about-the-project)
  - [Features](#features)
  - [Roadmap](#roadmap)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)

---

## About the Project

Forza Tuner Box helps Forza Motorsport players generate custom tuning configurations using real vehicle stats, driving style inputs, and track considerations. It provides:

- A sleek UI built with **React**, **Tailwind**, and **shadcn/ui**  
- Core tuning formulas based on weight distribution, drivetrain, power-to-weight  
- Phase-by-phase roadmap to extend features with telemetry and smart suggestions  

---

## Features

- Input form for vehicle stats and race preferences  
- Output tuning parameters: springs, damping, alignment, differential  
- Clean, responsive UI with dark theme and Forza-style accents  
- Roadmap-driven development for future advanced functionality  

---

## Roadmap

| Phase | Status | Details |
|-------|--------|---------|
| Core Tuner MVP | ✅ Complete | Vehicle stats form, tuning logic, and UI layout |
| Driving Behavior & Fine Tuning | 🔄 In Progress | Tire pressure model, ride height, save/share tunes |
| Telemetry Integration | ⚙️ Upcoming | UDP listener, handling comparison, in-game alerts overlay |
| Smart Recommendations | ⚙️ Upcoming | Feedback prompts, preset engine, driver tracking |

---

## Getting Started

### Prerequisites

- Node.js (v18+) or **Bun**  
- yarn or npm  

### Installation

```bash
git clone https://github.com/your-username/forza-tuner-box.git
cd forza-tuner-box
bun install
```
