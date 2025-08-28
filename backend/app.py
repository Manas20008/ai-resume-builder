from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import json
import PyPDF2
import docx

app = FastAPI()

# Allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load jobs.json at startup
with open("jobs.json", "r") as f:
    jobs = json.load(f)

@app.get("/jobs")
def get_jobs():
    """
    Return all jobs from jobs.json
    """
    return jobs

def extract_text(file: UploadFile):
    """
    Extract text from PDF or DOCX file
    """
    text = ""
    if file.filename.endswith(".pdf"):
        reader = PyPDF2.PdfReader(file.file)
        for page in reader.pages:
            text += page.extract_text() or ""
    elif file.filename.endswith(".docx"):
        doc = docx.Document(file.file)
        for para in doc.paragraphs:
            text += para.text + " "
    return text.lower()

@app.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    """
    Upload a resume, extract skills, and return matched jobs with score
    """
    # Extract text from uploaded resume
    text = extract_text(file)
    file.file.close()

    # Simple skill matching
    results = []
    for job in jobs:
        required_skills = [skill.lower() for skill in job.get("skills", [])]
        matched = [skill for skill in required_skills if skill in text]
        score = len(matched) / len(required_skills) * 100 if required_skills else 0
        results.append({
            "title": job.get("title", "No Title"),
            "score": score,
            "matched_skills": matched
        })

    # Sort results by descending score
    results.sort(key=lambda x: x["score"], reverse=True)

    return {"matches": results}
