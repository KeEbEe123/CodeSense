'use client';

import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { cpp } from '@codemirror/lang-cpp';
import { python } from '@codemirror/lang-python';
import { javascript } from '@codemirror/lang-javascript';
import { java } from '@codemirror/lang-java';
import axios from 'axios';

const Compiler = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('54'); // Default: C++
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  // Map of language IDs to names & syntax highlighters
  const languages = {
    '54': { name: 'C++', mode: cpp() },
    '50': { name: 'C', mode: cpp() },
    '62': { name: 'Java', mode: java() },
    '71': { name: 'Python', mode: python() },
    '63': { name: 'JavaScript', mode: javascript() }
  };

  const NEXT_RAPIDAPI_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY; // Fixed here

  const executeCode = async () => {
    setLoading(true);
    setOutput(''); // Clear output before executing new code
    try {
      const response = await axios.post(
        'https://judge0-ce.p.rapidapi.com/submissions',
        {
          source_code: code,
          language_id: language,
          stdin: '', // Allow users to send input if needed
        },
        {
          headers: {
            'X-RapidAPI-Key': NEXT_RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
          },
        }
      );

      const token = response.data.token;

      // Poll for the result every 3 seconds
      const pollResult = setInterval(async () => {
        const result = await axios.get(
          `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
          {
            headers: {
              'X-RapidAPI-Key': NEXT_RAPIDAPI_KEY,
              'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
            },
          }
        );

        if (result.data.status.description === 'Accepted') {
          setOutput(result.data.stdout || 'No output');
          setLoading(false);
          clearInterval(pollResult); // Stop polling once the result is ready
        } else if (result.data.status.description === 'Time limit exceeded' || result.data.status.description === 'Memory limit exceeded') {
          setOutput('Code execution exceeded limits');
          setLoading(false);
          clearInterval(pollResult);
        } else if (result.data.status.description === 'Compilation Error' || result.data.status.description === 'Runtime Error') {
          setOutput(result.data.stderr || 'Error executing code');
          setLoading(false);
          clearInterval(pollResult);
        }
      }, 3000); // Poll every 3 seconds

    } catch (error) {
      console.error(error);
      setOutput('Error executing code.');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full p-4">
      <h1 className="text-2xl font-bold mb-4">Online Compiler</h1>
      <select
        className="mb-4 p-2 border rounded"
        onChange={(e) => setLanguage(e.target.value)}
        value={language}
      >
        {Object.entries(languages).map(([id, lang]) => (
          <option key={id} value={id}>{lang.name}</option>
        ))}
      </select>

      <CodeMirror
        value={code}
        height="250px"
        theme={dracula}
        extensions={[languages[language]?.mode]}
        onChange={(value) => setCode(value)}
        className="w-full border rounded"
      />

      <button
        className="mt-4 p-2 bg-blue-500 text-white rounded"
        onClick={executeCode}
        disabled={loading}
      >
        {loading ? 'Running...' : 'Run Code'}
      </button>

      <pre className="mt-4 p-2 bg-gray-800 text-white rounded w-full min-h-[100px]">
        {output || 'Output will appear here'}
      </pre>
    </div>
  );
};

export default Compiler;
