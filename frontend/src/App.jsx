import { useState, useEffect } from "react";
import { parseResume, fetchJobs, matchJobs, atsScore } from "./api";
import "./index.css";

function App() {
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeData, setResumeData] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [matchedJobs, setMatchedJobs] = useState([]);
  const [atsResult, setAtsResult] = useState(null);

  useEffect(() => {
    fetchJobs().then(setJobs);
  }, []);

  const handleUpload = async () => {
    if (!resumeFile) return;
    const data = await parseResume(resumeFile);
    setResumeData(data);
    const matches = await matchJobs(data.text, data.skills);
    setMatchedJobs(matches);
  };

  const handleATSCheck = async (jobId) => {
    if (!resumeData) return;
    const result = await atsScore(resumeData.text, jobId, resumeData.skills);
    setAtsResult(result);
  };

  return (
    <div className="app">
      <h1>AI Resume Analyzer & Job Matcher 🤖</h1>

      <div className="upload">
        <input type="file" onChange={(e) => setResumeFile(e.target.files[0])} />
        <button onClick={handleUpload}>Upload Resume</button>
      </div>

      {resumeData && (
        <div className="resume-preview">
          <h2>Extracted Skills:</h2>
          <p>{resumeData.skills.join(", ") || "No skills detected"}</p>
        </div>
      )}

      <h2>Matched Jobs</h2>
      <ul>
        {matchedJobs.map((m, i) => (
          <li key={i}>
            <b>{m.job.title}</b> at {m.job.company} ({m.match_score} skills match)
            <button onClick={() => handleATSCheck(m.job.id)}>Check ATS Score</button>
          </li>
        ))}
      </ul>

      {atsResult && (
        <div className="ats-result">
          <h3>ATS Score: {atsResult.ats_score}%</h3>
          <p>Missing Skills: {atsResult.missing_skills.join(", ") || "None 🎉"}</p>
        </div>
      )}
    </div>
  );
}

export default App;
