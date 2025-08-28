export const API_URL = "http://localhost:8000";

export async function parseResume(file) {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${API_URL}/parse-resume`, {
    method: "POST",
    body: form,
  });
  return res.json();
}

export async function fetchJobs() {
  const res = await fetch(`${API_URL}/jobs`);
  return res.json();
}

export async function matchJobs(resumeText, skills) {
  const res = await fetch(`${API_URL}/match-jobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resumeText, skills }),
  });
  return res.json();
}

export async function atsScore(resumeText, jobId, skills) {
  const res = await fetch(`${API_URL}/ats-score`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resumeText, jobId, skills }),
  });
  return res.json();
}
