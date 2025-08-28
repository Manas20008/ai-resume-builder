import React, { useEffect, useState } from "react";
import { fetchJobs } from "./api";

function App() {
  const [jobs, setJobs] = useState([]);
  const [file, setFile] = useState(null);
  const [matches, setMatches] = useState({});

  useEffect(() => {
    fetchJobs().then(setJobs).catch(console.error);
  }, []);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const fetchMatchForJob = async () => {
    if (!file) return alert("Please upload a resume first!");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:8000/upload-resume", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      const matchesByTitle = {};
      data.matches.forEach((m) => (matchesByTitle[m.title] = m));
      setMatches(matchesByTitle);
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  const handleCheckScore = async (jobTitle) => {
    if (!file) return alert("Please upload a resume first!");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:8000/upload-resume", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      const jobMatch = data.matches.find((m) => m.title === jobTitle);
      setMatches((prev) => ({ ...prev, [jobTitle]: jobMatch }));
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  const getBadge = (score) => {
    let color = "#f44336",
      text = "Low";
    if (score >= 75) {
      color = "#4CAF50";
      text = "High";
    } else if (score >= 50) {
      color = "#FF9800";
      text = "Medium";
    }
    return (
      <span
        style={{
          background: color,
          color: "white",
          padding: "2px 8px",
          borderRadius: "12px",
          fontSize: "12px",
          marginLeft: "10px",
          transition: "all 0.5s ease",
        }}
      >
        {text}
      </span>
    );
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>🚀 AI Resume Analyzer & Job Matcher</h1>

      {/* Resume Upload */}
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <input type="file" onChange={handleFileChange} />
      </div>

      {/* Check All Jobs Button */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <button
          onClick={fetchMatchForJob}
          style={{
            padding: "8px 20px",
            cursor: "pointer",
            background: "#FF5722",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontWeight: "bold",
            transition: "0.3s",
          }}
          onMouseEnter={(e) => (e.target.style.opacity = 0.8)}
          onMouseLeave={(e) => (e.target.style.opacity = 1)}
        >
          Check All Jobs
        </button>
      </div>

      {/* Job Cards */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "20px",
        }}
      >
        {jobs.map((job, index) => {
          const match = matches[job.title];
          const missingSkills = match
            ? (job.skills || []).filter(
                (skill) => !match.matched_skills.includes(skill.toLowerCase())
              )
            : [];

          let barColor = match ? "#f44336" : "#ccc";
          if (match) {
            if (match.score >= 75) barColor = "#4CAF50";
            else if (match.score >= 50) barColor = "#FF9800";
            else barColor = "#f44336";
          }

          return (
            <div
              key={index}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "20px",
                width: "300px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                transition: "transform 0.3s, box-shadow 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
              }}
            >
              <h3>{job.title}</h3>

              <button
                onClick={() => handleCheckScore(job.title)}
                style={{
                  padding: "5px 15px",
                  cursor: "pointer",
                  background: "#2196F3",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  marginBottom: "10px",
                  transition: "0.3s",
                }}
                onMouseEnter={(e) => (e.target.style.opacity = 0.8)}
                onMouseLeave={(e) => (e.target.style.opacity = 1)}
              >
                Check ATS Score
              </button>

              {match && (
                <div
                  style={{
                    animation: "fadeIn 0.5s",
                  }}
                >
                  <div style={{ marginBottom: "5px" }}>
                    <strong>Match Score:</strong> {match.score.toFixed(2)}%
                    {getBadge(match.score)}
                    <div
                      style={{
                        background: "#eee",
                        borderRadius: "5px",
                        overflow: "hidden",
                        marginTop: "5px",
                      }}
                    >
                      <div
                        style={{
                          width: `${match.score}%`,
                          background: barColor,
                          height: "10px",
                          transition: "width 0.5s",
                        }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <strong>Matched Skills:</strong>{" "}
                    {match.matched_skills.length
                      ? match.matched_skills.join(", ")
                      : "None"}
                  </div>

                  <div
                    style={{
                      color: "red",
                      cursor: missingSkills.length ? "help" : "default",
                    }}
                    title={
                      missingSkills.length
                        ? `Missing Skills: ${missingSkills.join(", ")}`
                        : ""
                    }
                  >
                    <strong>Missing Skills:</strong>{" "}
                    {missingSkills.length ? missingSkills.join(", ") : "None"}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Fade-in keyframes */}
      <style>
        {`
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(-10px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}

export default App;
