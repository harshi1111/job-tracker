<div align="center">

  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/harshi1111/job-tracker/main/frontend/public/logoalone.png">
    <img src="https://raw.githubusercontent.com/harshi1111/job-tracker/main/frontend/public/logoalonewhite.png" width="120" alt="PATHGRID Logo">
  </picture>
  
  # PATHGRID
  ### Navigate Your Career Path
  
  [![Live Demo](https://img.shields.io/badge/Live_Demo-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://job-tracker-six-gamma.vercel.app)
  [![Demo Video](https://img.shields.io/badge/Demo_Video-46E3B7?style=for-the-badge&logo=youtube&logoColor=black)](https://youtu.be/R8QJgCV0_i0)
  
</div>

<br>

> **An AI-powered job application tracker that doesn't just store your applications — it helps you win them.**

---

## ✦ The Grid

PATHGRID transforms chaotic job searching into a **streamlined**, **intelligent workflow**. Paste any job description, and our **AI** extracts the essentials while generating **tailored resume bullets** that actually get noticed.

<br>

| | | |
|:-:|:-:|:-:|
| <img src="icons/ai.svg" width="32"><br>**AI Parsing**<br><sub>Extracts company, role, skills, seniority, location</sub> | <img src="icons/resume.svg" width="32"><br>**Resume Coach**<br><sub>3-5 tailored bullets with one-click copy</sub> | <img src="icons/kanban.svg" width="32"><br>**Kanban Pipeline**<br><sub>Drag & drop across 5 career stages</sub> |
| <img src="icons/reminder.svg" width="32"><br>**Smart Reminders**<br><sub>Never miss a follow-up again</sub> | <img src="icons/analytics.svg" width="32"><br>**Analytics Dashboard**<br><sub>Visualize your job search journey</sub> | <img src="icons/export.svg" width="32"><br>**Export & Backup**<br><sub>CSV export for your records</sub> |
## ✦ The Architecture

```mermaid
flowchart LR
    subgraph Frontend [Vercel]
        React[React + TypeScript]
        Tailwind[Tailwind CSS]
        Framer[Framer Motion]
    end
    
    subgraph Backend [Render]
        Node[Node.js + Express]
        Auth[JWT Auth]
        AI[AI Service Layer]
    end
    
    subgraph Database [MongoDB Atlas]
        Users[(Users)]
        Apps[(Applications)]
    end
    
    Frontend <--> Backend
    Backend <--> Database
    AI --> Groq[Groq Llama]
    AI --> Gemini[Google Gemini]
    AI --> OpenRouter[OpenRouter]
```
## ✦ Tech Stack Details

### Frontend
| Library | Version | Purpose |
|---------|---------|---------|
| React | 19.2.4 | UI framework |
| TypeScript | 5.3.3 | Type safety |
| Tailwind CSS | 3.4.19 | Styling |
| Framer Motion | 12.38.0 | Animations |
| @hello-pangea/dnd | 18.0.1 | Drag & drop |
| Chart.js | 4.5.1 | Analytics charts |
| Lucide React | 1.7.0 | Icons |
| Axios | 1.14.0 | API calls |

### Backend
| Library | Version | Purpose |
|---------|---------|---------|
| Node.js | 22.x | Runtime |
| Express | 4.18.2 | Web framework |
| TypeScript | 5.3.3 | Type safety |
| MongoDB | 9.4.1 | Database driver |
| Mongoose | 9.4.1 | ODM |
| JWT | 9.0.3 | Authentication |
| bcryptjs | 3.0.3 | Password hashing |

### AI Providers
| Provider | Model | Purpose |
|----------|-------|---------|
| Groq | Llama 3.3 70B | Primary AI (fastest) |
| Google Gemini | gemini-flash-latest | Fallback AI |
| OpenRouter | GPT-OSS-20B | Secondary fallback |

## ✦ Quick Start

```bash
# Clone the grid
git clone https://github.com/harshi1111/job-tracker.git

# Enter the workspace
cd job-tracker

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install

# Launch the grid (two terminals)
npm run dev  # Terminal 1: Backend
npm run dev  # Terminal 2: Frontend
```

<details>
<summary><b>✦ Environment Variables</b></summary>

**Backend (.env)**

```env
PORT=5001
MONGODB_URI=your_atlas_uri
JWT_SECRET=your_secret

GROQ_API_KEY_1=gsk_xxx
GROQ_API_KEY_2=gsk_xxx
GROQ_API_KEY_3=gsk_xxx

GEMINI_API_KEY_1=AIza_xxx
GEMINI_API_KEY_2=AIza_xxx

OPENROUTER_API_KEY_1=sk-or_xxx
OPENROUTER_API_KEY_2=sk-or_xxx
```

**Frontend (.env)**

```env
VITE_API_URL=http://localhost:5001/api
```
</details>

## ✦ Deployment

| Service | Platform | Purpose |
|---------|----------|---------|
| Frontend | Vercel | Static hosting, auto-deploys |
| Backend | Render | Node.js server, free tier |
| Database | MongoDB Atlas | Cloud database, 512MB free |

## ✦ API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/applications` | Get all applications |
| POST | `/api/applications` | Create application |
| PUT | `/api/applications/:id` | Update application |
| DELETE | `/api/applications/:id` | Delete application |
| POST | `/api/ai/parse-job` | Parse job description |
| POST | `/api/ai/resume-suggestions` | Generate suggestions |
| GET | `/api/stats` | Get global stats |

## ✦ Decisions & Trade-offs

| Decision | Why |
|----------|-----|
| **Multi-Key AI Rotation** | Free tier rate limits (100K tokens/day on Groq). Using 3 keys gives 300K tokens/day. |
| **Streaming AI Responses** | Better UX - users see AI working in real-time instead of waiting 5+ seconds. |
| **Groq as Primary AI** | Fastest inference speed (1000+ tokens/sec) compared to Gemini or OpenRouter. |
| **MongoDB Atlas** | Free 512MB cloud database, no local setup required for evaluators. |
| **Vercel + Render** | Best free combo: Vercel for static React, Render for persistent Node.js backend. |
| **Tailwind CSS** | Rapid UI development with built-in dark mode support. |
| **Framer Motion** | Smooth animations without heavy CSS keyframes. |
| **TypeScript** | Type safety across full stack, reduces runtime errors. |

## ✦ Database Schema

### User Model
```typescript
{
  email: string (unique)
  password: string (hashed)
  name: string
  createdAt: Date
}

## ✦ The Team Behind the Grid

<div align="center">
  <br>
  <sub>Built by <a href="https://github.com/harshi1111">Harshitha V</a></sub>
  <br>
  <sub>© 2026 PATHGRID — Navigate Your Career Path</sub>
</div>
```
