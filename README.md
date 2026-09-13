# Javier Siliacay — Personal Portfolio & AI Engineering Lab

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-16.2.1-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-WebGL-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)](https://www.tensorflow.org/js)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

<br />

**High-performance personal portfolio, interactive computer vision lab, and engineering showcase.**  
Designed with a bespoke **Studio Light** & **Cyber Dark** aesthetic, zero-server-latency WebGL AI vision models, and streaming AI assistant integration.

[Live Demo](https://javiersiliacay.vercel.app) • [Multimodal Vision Lab](https://javiersiliacay.vercel.app/vision) • [Report Issue](https://javiersiliacay.vercel.app/#contact)

</div>

---

## ⚡ Highlights & Key Features

### 1. Dual-Theme Engine with Circular Splash Transition
- **Bespoke Design System**: Custom halftone dot matrices, ambient glows, dynamic contrast tokens, and sleek glassmorphism.
- **View Transitions API**: Implements native circular clip-path transitions (`circle(0px) -> circle(maxRadius)`) expanding dynamically from the user's click coordinates.
- **Tri-Mode Sync**: Seamless toggling between **Studio Light**, **Cyber Dark**, and **System Auto-Sync** preference with persistent state.

### 2. Interactive Video Dark Transformation
- **Live Avatar Engine**: Dynamic hero portrait that responds to theme toggles.
- **7.2s Cinematic Video Transition**: Switching to Cyber Dark triggers a full 7.2-second in-frame video transition (`javier-dark-transform.mp4`) that settles seamlessly on the final holographic workstation frame.

### 3. In-Browser Multimodal Vision Lab (`/vision`)
- **100% Client-Side WebGL Inference**: Zero server latency, complete privacy, zero video data transmitted over the network.
- **MediaPipe & TensorFlow.js Stack**:
  - **3D Face Mesh**: 468 vertex landmarks tracking micro-expressions in real-time.
  - **Multi-Hand Skeleton Tracking**: High-precision joint and palm tracking with cyan and pink coordinate meshes.
  - **17-Point Body Pose Detection**: Live pose analysis.
  - **Interactive Energy VFX**: Real-time particle synthesis for gestural easter eggs (*Kamehameha* and *Spirit Bomb*).
- **Floating Glass Telemetry HUD**: Real-time FPS counters, face landmark status, hand tracking telemetry, and active layer toggle console.

### 4. Commercial Engineering Showcase
- **Autoworx Enterprise System**: Multi-location automotive ERP platform managing repairs, AI diagnostics, customer portals, and real-time inventory.
- **ALK Commercial Freight Logistics**: Real-time fleet tracking, dispatch logistics, and billing architecture.
- **Autoworx Paint Center**: Formulation batching and mixing inventory engine.
- **Mekanik AI**: Offline LLM automotive diagnostic assistant with real-time OBDII sensor integration.
- **TaraFix**: Geo-spatial auto-repair shop locator across the Philippines.

### 5. Intelligent Conversational Assistant
- **Real-Time Streaming**: Integrated conversational chatbot trained on portfolio context, project architectures, and engineering experience.
- **Robust Model Orchestration**: Multi-provider fallback pipeline with streaming responses and markdown code rendering.

---

## 🛠️ Tech Stack

| Domain | Technology |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router, Server & Client Components) |
| **Runtime & UI** | React 19, TypeScript 5, Framer Motion |
| **Styling** | Tailwind CSS v4, Custom CSS Variables, Glassmorphism, Halftone Masks |
| **Machine Learning** | TensorFlow.js (WebGL Backend), MediaPipe Face Mesh, Hands, and Pose Detection |
| **Icons & Typography** | Lucide React, Geist Sans & Geist Mono |
| **Deployment** | Vercel Edge Network |

---

## 📁 Project Architecture

```
javiersiliacay-portfolio/
├── app/
│   ├── api/
│   │   └── chat/                 # AI Chatbot streaming endpoint with model fallbacks
│   ├── components/
│   │   ├── sections/             # Page sections (Hero, Projects, TechStack, Contact, Footer)
│   │   ├── AskOverlay.tsx        # Command palette & quick prompt modal
│   │   ├── Chatbot.tsx           # Floating streaming AI assistant
│   │   ├── GestureControl.tsx    # Gesture detection engine
│   │   ├── HeroAvatar.tsx        # Interactive hero portrait with video transformation
│   │   ├── Navbar.tsx            # Responsive navigation header
│   │   ├── Sidebar.tsx           # Persistent studio desktop sidebar with work status
│   │   ├── SpotlightDeck.tsx     # Interactive project highlight deck
│   │   ├── ThemeToggle.tsx       # Quick theme switchers
│   │   └── ThemeTriggerUX.tsx    # Circular splash and shockwave ripple controller
│   ├── context/
│   │   └── ThemeContext.tsx      # View Transitions API & tri-mode theme state provider
│   ├── vision/
│   │   └── page.tsx              # Multimodal Vision Lab (WebGL MediaPipe/TF.js)
│   ├── globals.css               # Design tokens, halftone textures, view transition rules
│   ├── layout.tsx                # Root layout with metadata and font definitions
│   └── page.tsx                  # Main portfolio single-page application
├── public/                       # Static mockups, videos, project branding, and assets
├── patch-mediapipe.js            # Postinstall patch for MediaPipe WebGL compatibility
└── package.json                  # Dependencies, scripts, and build pipeline
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.18+ or v20+ recommended)
- [pnpm](https://pnpm.io/) (or `npm`, `yarn`, `bun`)

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/JavierSiliacay/javiersiliacay-portfolio.git
cd javiersiliacay-portfolio
pnpm install
```

> **Note**: `pnpm install` automatically runs `patch-mediapipe.js` to patch MediaPipe WebGL bindings for seamless bundler execution.

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# AI Chatbot Integration (Optional - falls back gracefully if omitted)
OPENROUTER_API_KEY=your_openrouter_api_key
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗️ Building for Production

To validate types, verify bundle sizes, and compile the production build:

```bash
pnpm build
pnpm start
```

---

## 🔒 Privacy & Performance

- **Zero-Telemetry Camera Processing**: The `/vision` lab processes all camera video streams 100% inside GPU memory via WebGL. No video frames, landmark coordinates, or facial biometric data ever leave your machine.
- **Optimized Asset Delivery**: All project mockups and transformation videos use modern `.webp` and `.mp4` formats with responsive Next.js Image caching.

---

## 👨‍💻 Author

**Javier Siliacay**  
*Lead Software Developer & AI Engineer*  
- Portfolio: [javiersiliacay.vercel.app](https://javiersiliacay.vercel.app)  
- Email: [siliacay.javier@gmail.com](mailto:siliacay.javier@gmail.com)  
- Location: Cagayan de Oro City, Philippines
