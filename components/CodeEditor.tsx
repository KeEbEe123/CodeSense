"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";

// Dynamically import Monaco Editor
const Editor = dynamic(() => import("monaco-editor"), { ssr: false });

const App = () => {
  const [code, setCode] = useState("// Write your code here");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const languageOptions = [
    { id: 63, name: "JavaScript" },
    { id: 71, name: "Python" },
    { id: 50, name: "C++" },
    { id: 62, name: "Java" },
  ];

  const handleRunCode = async () => {
    setIsLoading(true);
    setOutput("");

    const selectedLanguage = languageOptions.find(
      (lang) => lang.name === language
    );

    if (!selectedLanguage) {
      setOutput("Language not supported");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "https://judge0-ce.p.rapidapi.com/submissions",
        {
          source_code: code,
          language_id: selectedLanguage.id,
          stdin: "",
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-RapidAPI-Key": "YOUR_RAPIDAPI_KEY",
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          },
        }
      );

      const { token } = response.data;

      let result;
      do {
        result = await axios.get(
          `https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=false`,
          {
            headers: {
              "X-RapidAPI-Key": "YOUR_RAPIDAPI_KEY",
              "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            },
          }
        );
      } while (result.data.status.id <= 2);

      setOutput(
        result.data.stdout || result.data.stderr || "No output returned."
      );
    } catch (error) {
      setOutput("Error executing code: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Code Editor with Judge0</h1>

      <div style={{ marginBottom: "10px" }}>
        <label htmlFor="language">Select Language: </label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          {languageOptions.map((lang) => (
            <option key={lang.id} value={lang.name}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      <Editor
        height="400px"
        language={language.toLowerCase()}
        value={code}
        onChange={(value) => setCode(value)}
        theme="vs-dark"
      />

      <div style={{ marginTop: "10px" }}>
        <button
          onClick={handleRunCode}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
          disabled={isLoading}
        >
          {isLoading ? "Running..." : "Run Code"}
        </button>
      </div>

      <div
        style={{
          marginTop: "20px",
          padding: "10px",
          backgroundColor: "#f4f4f4",
          border: "1px solid #ddd",
          borderRadius: "4px",
        }}
      >
        <h3>Output:</h3>
        <pre>{output}</pre>
      </div>
    </div>
  );
};

export default App;
