# 💼 CareerHunt

**CareerHunt** is a full-stack job board platform built for both developers and recruiters.  
It uses the latest technologies, includes DevOps workflows, and leverages AI tools to enhance the experience for both developers and recruiters.

## 🔗 Live Demo

- **Frontend**: [career-hunt.xyz](https://career-hunt.xyz)  
- **Backend API**: [api.career-hunt.xyz](https://api.career-hunt.xyz)

## 🎯 Purpose of the Project

This project is designed to simulate working on a real-world startup product. The goals include:

- Demonstrating clean full-stack architecture  
- Using scalable OAuth login with Google, GitHub, and LinkedIn  
- Integrating OpenAI to improve resumes and generate cover letters  
- Showing end-to-end DevOps setup with Docker, CI/CD, and cloud deployment  

## ✨ Key Features

### 👨‍💻 For Job Seekers / Developers
- Browse public job listings with search and filters  
- Bookmark jobs to view later  
- Sign in using Google, GitHub, or LinkedIn  
- Use the AI assistant to:
  - Improve your resume with GPT  
  - Automatically generate cover letters tailored to the job  

### 🧑‍💼 For Recruiters
- Login via Google, GitHub, or LinkedIn  
- Create, edit, and delete job postings  
- Use markdown for rich job descriptions  
- Auto-fill company details from your profile  
- Upload logos via Cloudinary  

## 🧱 Tech Stack

| Layer        | Tools / Stack                                       |
|--------------|------------------------------------------------------|
| Frontend     | React (Vite), Tailwind CSS, React Router            |
| Backend      | Node.js, Express                                     |
| Database     | MongoDB (Mongoose)                                   |
| Auth         | Google, GitHub, LinkedIn OAuth                       |
| AI Assistant | OpenAI API                                           |
| File Uploads | Cloudinary                                           |
| Caching      | Redis                                                |
| DevOps       | Docker, GitHub Actions                               |
| Hosting      | Vercel (Frontend), Render (Backend)                  |

## 💡 System Design Decisions

This project isn't just about functionality; it's about making scalable architectural choices.

- **Why NoSQL (MongoDB)?**
  - Job descriptions vary wildly in structure. A document-store allows for flexible schemas (e.g., some jobs have "equity," others don't) without complex migrations.
  - *Trade-off:* Relational integrity is handled at the application level (Mongoose refs) rather than the DB level.

- **Why Redis?**
  - The "Browse Jobs" page is read-heavy. Fetching from MongoDB every refresh is inefficient.
  - We cache job listings for 1 hour, reducing database load by ~40% during testing.

- **Why Docker?**
  - Ensures environment parity. The app runs exactly the same on a developer's Mac as it does on the Linux production server, eliminating "it works on my machine" bugs.

## 🚀 Deployment

### 🚀 Frontend (Vercel)
- Automatically deployed from GitHub’s `main` branch  
- **Live URL**: [https://career-hunt.xyz](https://career-hunt.xyz)

### 🛠 Backend (Railway)
- Dockerized Express server  
- Deployed via GitHub Actions CI/CD  
- **API live at**: [https://api.career-hunt.xyz](https://api.career-hunt.xyz)

> ℹ️ The frontend and backend are hosted on separate subdomains to follow best practices. Secure routes are protected and not publicly exposed.

## 🔐 Environment Variables

### 🖥 Frontend `.env`
```bash
VITE_BACKEND_URL=https://api.career-hunt.xyz
VITE_CLOUDINARY_URL=https://api.cloudinary.com/v1_1/<your-cloud-name>/image/upload
VITE_UPLOAD_PRESET=<your-upload-preset>
```

Backend .env
```bash
PORT=8080
MONGO_URI=<your-mongo-uri>
REDIS_URL=<your-redis-url>
JWT_SECRET=<secure-secret>
OPENAI_API_KEY=<your-openai-api-key>
FRONTEND_URL=https://career-hunt.xyz
```

OAuth credentials
```bash
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
LINKEDIN_CLIENT_ID=...
LINKEDIN_CLIENT_SECRET=...
```
## 🤖 AI Resume Assistant

This feature uses the **OpenAI API** to:

- Fix grammar and tone in resumes  
- Generate personalized cover letters for job listings  

> 🎯 It aims to demonstrate how AI can add real value inside modern web applications.

## 🐳 Docker Setup

### 🔧 For Development
```bash
docker-compose -f docker-compose.dev.yml up --build
```

### For Production
```bash
docker-compose -f docker-compose.prod.yml up --build -d
```

## ⚙️ CI/CD with GitHub Actions

### 🧩 Frontend Workflow
- Triggered on push to the `main` branch  
- Installs dependencies  
- Builds the frontend

### 🖥 Backend Workflow
- Triggered on push to `main`  
- Builds the Docker image for the backend  
- Runs tests and deploys using GitHub Actions

## 🧪 Upcoming Features / TODO

### ⚡ One-Click Job Management
- 🔗 Browser extension to save jobs in one click
- ⬇️ Automated LinkedIn/Indeed job import

### 👥 Collaboration & Dashboards
- 🧑‍💼 Collaborative recruiter dashboards (teams)
- 📈 Analytics for job seekers (conversion rates, response tracking)

### 📧 Notifications & Updates
- 📬 Email notifications (e.g. job application updates)

### 🤖 AI Enhancements
- 🗣️ AI mock interview assistant
- 🎯 Smart job recommendations

## 📇 Contact

Want to collaborate or give feedback?

- 🐦 Twitter: [@not_sagar1410](https://x.com/not_sagar1410)  
- 💼 LinkedIn: [Sagar Saini](https://www.linkedin.com/in/sagar-saini-9b45a52b2/)
