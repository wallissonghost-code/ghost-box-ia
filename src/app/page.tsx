"use client";
import { useState } from "react";
import { 
  SandpackProvider, 
  SandpackLayout, 
  SandpackCodeEditor, 
  SandpackPreview 
} from "@codesandbox/sandpack-react";
import { Play, Code2, Eye, Ghost, Download, RefreshCw, Trash2 } from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"code" | "preview">("preview");
  
  // Estado inicial com a marca Ghost Box
  const [files, setFiles] = useState<Record<string, string>>({
    "/App.js": `export default function App() {
  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center', 
      background: '#050505', 
      color: '#fff',
      fontFamily: 'system-ui' 
    }}>
      <div style={{ textAlign: 'center', animation: 'fadeIn 1s ease' }}>
        <h1 style={{ fontSize: '3.5rem', margin: 0, color: '#a855f7', textShadow: '0 0 20px rgba(168, 85, 247, 0.5)' }}>
          Ghost Box IA
        </h1>
        <p style={{ color: '#888', marginTop: '10px' }}>
          Materialize suas ideias com código.
        </p>
      </div>
    </div>
  );
}`,
  });

  async function handleGenerate() {
    if (!prompt) return;
    setLoading(true);
    setActiveTab("preview");
    
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify({ 
          prompt, 
          currentFiles: files 
        }),
      });
      
      const newFiles = await response.json();
      setFiles(newFiles);
      setPrompt(""); 
    } catch (error) {
      alert("Erro na IA. Verifique sua chave API.");
    } finally {
      setLoading(false);
    }
  }

  const handleDownload = async () => {
    const zip = new JSZip();
    Object.keys(files).forEach((path) => {
      const cleanPath = path.startsWith('/') ? path.slice(1) : path;
      zip.file(cleanPath, files[path]);
    });
    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, "projeto-ghostbox.zip");
  };

  const handleReset = () => {
    if (confirm("Resetar o Ghost Box? O projeto atual será perdido.")) {
       setFiles({
        "/App.js": `export default function App() {
  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center', 
      background: '#050505', 
      color: '#fff',
      fontFamily: 'system-ui' 
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '3.5rem', margin: 0, color: '#a855f7', textShadow: '0 0 20px rgba(168, 85, 247, 0.5)' }}>
          Ghost Box IA
        </h1>
        <p style={{ color: '#888', marginTop: '10px' }}>
          Materialize suas ideias com código.
        </p>
      </div>
    </div>
  );
}`,
      });
      setPrompt("");
      setActiveTab("preview");
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", flexDirection: "column", background: "#000", color: "white" }}>
      
      {/* Header Ghost Style */}
      <div style={{ 
        padding: "12px 16px", 
        borderBottom: "1px solid #1f1f1f", 
        display: "flex", 
        justifyContent: "space-between",
        alignItems: "center", 
        background: "#0a0a0a"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Ícone Fantasma */}
          <div style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", padding: "8px", borderRadius: "8px", boxShadow: "0 0 10px rgba(124, 58, 237, 0.3)" }}>
            <Ghost size={20} color="white" />
          </div>
          <span style={{ fontWeight: "bold", letterSpacing: "1px", fontSize: "1.1rem" }}>GHOST BOX</span>
        </div>
        
        <div style={{ display: "flex", gap: "10px" }}>
           {/* Botão Reset */}
           <button 
            onClick={handleReset}
            title="Novo Projeto"
            style={{ background: "#1a1a1a", border: "1px solid #333", color: "#666", padding: "8px", borderRadius: "6px", cursor: "pointer" }}
          >
            <Trash2 size={18} />
          </button>

          {/* Botão Download */}
          <button 
            onClick={handleDownload}
            title="Baixar Projeto"
            style={{ background: "#1a1a1a", border: "1px solid #333", color: "white", padding: "8px", borderRadius: "6px", cursor: "pointer" }}
          >
            <Download size={18} />
          </button>

          {/* Abas */}
          <div style={{ display: "flex", background: "#111", borderRadius: "8px", padding: "2px", border: "1px solid #222" }}>
            <button 
              onClick={() => setActiveTab("code")}
              style={{ 
                padding: "8px 12px", 
                borderRadius: "6px", 
                background: activeTab === "code" ? "#222" : "transparent",
                color: activeTab === "code" ? "white" : "#666",
                border: "none",
                cursor: "pointer"
              }}
            >
              <Code2 size={18} />
            </button>
            <button 
              onClick={() => setActiveTab("preview")}
              style={{ 
                padding: "8px 12px", 
                borderRadius: "6px", 
                background: activeTab === "preview" ? "#7c3aed" : "transparent",
                color: activeTab === "preview" ? "white" : "#666",
                border: "none",
                cursor: "pointer"
              }}
            >
              <Eye size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Editor Principal */}
      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        <SandpackProvider 
          template="react" 
          theme="dark" 
          files={files}
          options={{ externalResources: ["https://cdn.tailwindcss.com"] }}
        >
          <SandpackLayout style={{ height: "100%", border: "none", background: "#000" }}>
            <div style={{ display: activeTab === "code" ? "block" : "none", height: "100%", width: "100%" }}>
              <SandpackCodeEditor showTabs showLineNumbers wrapContent style={{ height: "100%" }} />
            </div>
            <div style={{ display: activeTab === "preview" ? "block" : "none", height: "100%", width: "100%" }}>
              <SandpackPreview showNavigator showRefreshButton style={{ height: "100%" }} />
            </div>
          </SandpackLayout>
        </SandpackProvider>
      </div>

      {/* Input Roxo */}
      <div style={{ padding: "16px", background: "#0a0a0a", borderTop: "1px solid #1f1f1f" }}>
        <div style={{ 
          display: "flex", 
          gap: "10px", 
          background: "#111", 
          padding: "8px", 
          borderRadius: "12px",
          border: "1px solid #222",
          boxShadow: "0 0 20px rgba(0,0,0,0.5)"
        }}>
          <input 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={Object.keys(files).length > 1 ? "Invoque uma alteração..." : "O que vamos materializar hoje?"}
            style={{ flex: 1, background: "transparent", border: "none", color: "white", outline: "none", padding: "0 8px" }}
          />
          <button 
            onClick={handleGenerate} 
            disabled={loading}
            style={{ 
              background: loading ? "#333" : "linear-gradient(135deg, #7c3aed, #a855f7)", 
              color: "white", 
              border: "none", 
              width: "40px", 
              height: "40px", 
              borderRadius: "8px", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              boxShadow: "0 0 10px rgba(124, 58, 237, 0.2)",
              cursor: loading ? "default" : "pointer"
            }}
          >
            {loading ? <RefreshCw className="animate-spin" size={20}/> : <Play size={20} fill="white" />}
          </button>
        </div>
      </div>
    </div>
  );
}
