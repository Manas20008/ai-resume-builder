from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import PyPDF2
import docx
import json
import re

app = FastAPI()

# Allow frontend (React) to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load job database
with open("jobs.json", "r", encoding="utf-8") as f:
    jobs = json.load(f)

# ----------- Helpers -------------
def extract_text_from_pdf(file):
    reader = PyPDF2.PdfReader(file)
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""
    return text

def extract_text_from_docx(file):
    doc = docx.Document(file)
    return " ".join([p.text for p in doc.paragraphs])

def clean_text(text):
    return re.sub(r"[^a-zA-Z0-9\s]", "", text).lower()

def extract_skills(text):
    common_skills = [
        "python","java","c++","javascript","react","node","express","mongodb",
        "sql","aws","docker","kubernetes","html","css","tensorflow","pandas",
        "numpy","scikit-learn","nlp","git","rest api","redux","typescript"
    ]
    text = clean_text(text)
    found = [skill for skill in common_skills if skill in text]
    return list(set(found))

# ----------- Routes -------------
@app.post("/parse-resume")
async def parse_resume(file: UploadFile = File(...)):
    ext = file.filename.split(".")[-1].lower()
    content = ""
    if ext == "pdf":
        content = extract_text_from_pdf(file.file)
    elif ext in ["docx", "doc"]:
        content = extract_text_from_docx(file.file)
    else:
        return {"error": "Unsupported file format"}
    skills = extract_skills(content)
    return {"text": content[:1000], "skills": skills}  # limit text preview

@app.get("/jobs")
async def get_jobs():
    return jobs

@app.post("/match-jobs")
async def match_jobs(data: dict):
    resume_text = data.get("resumeText", "")
    resume_skills = data.get("skills", [])
    matched = []
    for job in jobs:
        score = len(set(resume_skills).intersection(set(job["skills"])))
        if score > 0:
            matched.append({"job": job, "match_score": score})
    matched = sorted(matched, key=lambda x: x["match_score"], reverse=True)
    return matched

@app.post("/ats-score")
async def ats_score(data: dict):
    resume_skills = data.get("skills", [])
    job_id = data.get("jobId")
    job = next((j for j in jobs if j["id"] == job_id), None)
    if not job:
        return {"error": "Job not found"}
    required = set(job["skills"])
    found = set(resume_skills)
    score = round((len(found.intersection(required)) / len(required)) * 100, 2)
    return {"ats_score": score, "missing_skills": list(required - found)}
