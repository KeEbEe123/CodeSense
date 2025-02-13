// import React, { useEffect, useRef, useState } from "react";
// import * as monaco from "monaco-editor";
// import axios from "axios";

// const Judge0_API = "https://judge0-ce.p.rapidapi.com/submissions";
// const API_KEY = "your-judge0-api-key"; // Replace with your API key if needed

// const CodeEditor: React.FC = () => {
//   const editorRef = useRef<HTMLDivElement>(null);
//   const monacoInstance = useRef<monaco.editor.IStandaloneCodeEditor | null>(
//     null
//   );
//   const [output, setOutput] = useState<string | null>(null);

//   useEffect(() => {
//     if (editorRef.current) {
//       monacoInstance.current = monaco.editor.create(editorRef.current, {
//         value: `print("Hello, World!")`, // Default Python code
//         language: "python",
//         theme: "vs-dark",
//         automaticLayout: true,
//       });
//     }

//     return () => {
//       monacoInstance.current?.dispose();
//     };
//   }, []);

//   const runCode = async () => {
//     if (!monacoInstance.current) return;
//     const sourceCode = monacoInstance.current.getValue();

//     try {
//       const response = await axios.post(
//         `${Judge0_API}?base64_encoded=false&fields=*`,
//         {
//           language_id: 71, // Python (change based on need)
//           source_code: sourceCode,
//           stdin: "",
//         },
//         {
//           headers: {
//             "X-RapidAPI-Key": API_KEY,
//             "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       const token = response.data.token;
//       setTimeout(async () => {
//         const result = await axios.get(`${Judge0_API}/${token}`, {
//           headers: {
//             "X-RapidAPI-Key": API_KEY,
//             "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
//           },
//         });

//         if (result.data.stdout) {
//           setOutput(result.data.stdout);
//         } else if (result.data.stderr) {
//           setOutput(result.data.stderr);
//         } else if (result.data.compile_output) {
//           setOutput(result.data.compile_output);
//         }
//       }, 3000);
//     } catch (error) {
//       console.error("Error executing code:", error);
//       setOutput("Failed to compile/run code.");
//     }
//   };

//   return (
//     <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
//       <div ref={editorRef} className="w-3/4 h-80 border border-gray-600"></div>
//       <button
//         onClick={runCode}
//         className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded"
//       >
//         Run Code
//       </button>
//       {output && (
//         <div className="mt-4 w-3/4 p-3 bg-gray-800 border border-gray-600 rounded">
//           <pre>{output}</pre>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CodeEditor;
