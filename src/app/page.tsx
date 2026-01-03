"use client";
import { useState } from "react";
import { 
  SandpackProvider, 
  SandpackLayout, 
  SandpackCodeEditor, 
  SandpackPreview 
} from "@codesandbox/sandpack-react";
import { Play, Code2, Eye, Box, Download } from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"code" | "preview">("preview");
  
  const [files, setFiles] = useState<Record<string, string>>({
    "/App.js": `export default function App() {
  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: '#0a0a0a', 
      color: '#fff',
      fontFamily: 'system-ui' 
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', margin: 0, color: '#ff4444' }}>Redbox</h1>
        <p style={{ color: '#666' }}>Sua IA de criação web.</p>
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
        body: JSON.stringify({ prompt }),
      });
      const newFiles = await response.json();
      setFiles(newFiles);
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
    saveAs(blob, "projeto-redbox.zip");
  };

  return (
    <div style={{ display: "flex", height: "100vh", flexDirection: "column", background: "#000", color: "white" }}>
      
      <div style={{ 
        padding: "12px 16px", 
        borderBottom: "1px solid #222", 
        display: "flex", 
        justifyContent: "space-between",
        alignItems: "center", 
        background: "#0a0a0a"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ background: "#ff4444", padding: "6px", borderRadius: "6px" }}>
            <Box size={18} color="white" />
          </div>
          <span style={{ fontWeight: "bold", letterSpacing: "1px" }}>REDBOX</span>
        </div>
        
        <div style={{ display: "flex", gap: "10px" }}>
          <button 
            onClick={handleDownload}
            title="Baixar Projeto"
            style={{ 
              background: "#222", 
              border: "1px solid #333", 
              color: "white", 
              padding: "8px", 
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            <Download size={18} />
          </button>

          <div style={{ display: "flex", background: "#1a1a1a", borderRadius: "8px", padding: "2px" }}>
            <button 
              onClick={() => setActiveTab("code")}
              style={{ 
                padding: "8px 12px", 
                borderRadius: "6px", 
                background: activeTab === "code" ? "#333" : "transparent",
                color: activeTab === "code" ? "white" : "#666",
                border: "none"
              }}
            >
              <Code2 size={18} />
            </button>
            <button 
              onClick={() => setActiveTab("preview")}
              style={{ 
                padding: "8px 12px", 
                borderRadius: "6px", 
                background: activeTab === "preview" ? "#ff4444" : "transparent",
                color: activeTab === "preview" ? "white" : "#666",
                border: "none"
              }}
            >
              <Eye size={18} />
            </button>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        <SandpackProvider 
          template="react" 
          theme="dark" 
          files={files}
          options={{
            externalResources: ["https://cdn.tailwindcss.com"]
          }}
        >
          <SandpackLayout style={{ height: "100%", border: "none", background: "#000" }}>
            <div style={{ display: activeTab === "code" ? "block" : "none", height: "100%", width: "100%" }}>
              <SandpackCodeEditor showTabs showLineNumbers showInlineErrors wrapContent style={{ height: "100%" }} />
            </div>
            <div style={{ display: activeTab === "preview" ? "block" : "none", height: "100%", width: "100%" }}>
              <SandpackPreview showNavigator showRefreshButton style={{ height: "100%" }} />
            </div>
          </SandpackLayout>
        </SandpackProvider>
      </div>

      <div style={{ padding: "16px", background: "#0a0a0a", borderTop: "1px solid #222" }}>
        <div style={{ 
          display: "flex", 
          gap: "10px", 
          background: "#1a1a1a", 
          padding: "8px", 
          borderRadius: "12px",
          border: "1px solid #333"
        }}>
          <input 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ex: Landing page de café..."
            style={{ 
              flex: 1, 
              background: "transparent", 
              border: "none", 
              color: "white", 
              outline: "none",
              padding: "0 8px"
            }}
          />
          <button 
            onClick={handleGenerate} 
            disabled={loading}
            style={{ 
              background: loading ? "#333" : "#ff4444", 
              color: "white", 
              border: "none", 
              width: "40px",
              height: "40px",
              borderRadius: "8px", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center"
            }}
          >
            {loading ? "⏳" : <Play size={20} fill="white" />}
          </button>
        </div>
      </div>
    </div>
  );
}
