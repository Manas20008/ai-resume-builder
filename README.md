# 🚀 AI Resume Builder & Job Matcher

![GitHub repo size](https://img.shields.io/github/repo-size/Manas20008/ai-resume-builder)
![GitHub top language](https://img.shields.io/github/languages/top/Manas20008/ai-resume-builder)
![GitHub last commit](https://img.shields.io/github/last-commit/Manas20008/ai-resume-builder)
![GitHub issues](https://img.shields.io/github/issues/Manas20008/ai-resume-builder)
![GitHub license](https://img.shields.io/github/license/Manas20008/ai-resume-builder)

A full-stack web application that allows users to **upload their resumes**, extracts skills automatically, and matches them with job listings. The app also provides an **ATS-style dashboard** showing match scores and missing skills.

---

## 🌟 Features

- Upload resume (PDF or DOCX)
- Automatic skill extraction
- Job matching with **match percentages**
- ATS-style dashboard with **color-coded badges** and progress bars
- Missing skills highlighted with tooltips
- Interactive UI with hover animations and responsive design

---

## 🛠️ Tech Stack

**Frontend:**

![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)

**Backend:**

![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)

---

## 📂 Project Structure

AI Resume Builder/
├─ backend/
│ ├─ app.py
│ ├─ jobs.json
│ └─ requirements.txt
└─ frontend/
├─ src/
│ ├─ App.jsx
│ ├─ main.jsx
│ ├─ api.js
│ └─ index.css
├─ package.json
└─ index.html


---

## ⚡ Installation

### **Backend**

1. Open terminal in `backend/`
2. Create a virtual environment
3. Install dependencies:

pip install -r requirements.txt

4. Run the backend:

uvicorn app:app --reload

Open http://127.0.0.1:8000/jobs
 to verify jobs are served.

Frontend

1. Open terminal in frontend/

2. Install packages:
npm install

3. Start frontend:
npm run dev

Open http://localhost:5173
 to view the app.

📄 Usage

Upload your resume (PDF or DOCX).

Click Check All Jobs or Check ATS Score per job.

View match scores, matched skills, and missing skills in a beautiful card layout.

🔗 Demo

Backend: http://127.0.0.1:8000

Frontend: http://localhost:5173

💡 Future Enhancements

Add user authentication

Save resume history per user

Allow custom job listings upload

Add charts for skill match visualization

📄 License

This project is MIT Licensed. Feel free to use, modify, and distribute.
