"use client";
import { useState } from "react";
import { Sandpack } from "@codesandbox/sandpack-react";
import { Play, Code2 } from "lucide-react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState({
    "/App.js": `export default function App() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', textAlign: 'center', padding: 50, color: '#333' }}>
      <h1 style={{ color: '#ff4444' }}>🟥 Redbox IA</h1>
      <p>O ambiente está pronto! Digite abaixo para criar.</p>
    </div>
  );
}`,
  });

  async function handleGenerate() {
    if (!prompt) return;
    setLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify({ prompt }),
      });
      const newFiles = await response.json();
      setFiles(newFiles);
    } catch (error) {
      alert("Erro ao gerar. Verifique sua chave API.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", height: "100vh", flexDirection: "column", background: "#111", color: "white" }}>
      {/* Header */}
      <div style={{ padding: "15px", borderBottom: "1px solid #333", display: "flex", alignItems: "center", gap: "10px", background: "#1a1a1a" }}>
        <Code2 color="#ff4444" />
        <h2 style={{ fontSize: 18, margin: 0 }}>Redbox IA</h2>
      </div>

      {/* Input */}
      <div style={{ padding: 15, display: "flex", gap: 10, background: "#222" }}>
        <input 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ex: Calculadora simples estilo iPhone..."
          style={{ flex: 1, padding: 12, borderRadius: 6, border: "none", outline: "none" }}
        />
        <button 
          onClick={handleGenerate} 
          disabled={loading} 
          style={{ background: "#ff4444", color: "white", border: "none", padding: "0 20px", borderRadius: 6, fontWeight: "bold" }}
        >
          {loading ? "Criando..." : <Play size={20} />}
        </button>
      </div>

      {/* Preview */}
      <div style={{ flex: 1 }}>
        <Sandpack
          template="react"
          theme="dark"
          files={files}
          options={{ showNavigator: true, editorHeight: "100%" }}
        />
      </div>
    </div>
  );
}
