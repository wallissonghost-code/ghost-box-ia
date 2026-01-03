"use client";
import { useState, useEffect } from "react";
import { 
  SandpackProvider, 
  SandpackLayout, 
  SandpackCodeEditor, 
  SandpackPreview 
} from "@codesandbox/sandpack-react";
import { Play, Code2, Eye, Ghost, Download, RefreshCw, Trash2, Mic, MicOff } from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { UserButton, SignInButton, SignedIn, SignedOut, useUser } from "@clerk/nextjs";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"code" | "preview">("preview");
  const [isListening, setIsListening] = useState(false);
  const { user } = useUser();
  
  // --- O SEGREDO DO VISUAL PROFISSIONAL ---
  // Este é o código inicial que aparece na "Segunda Página".
  // Configuramos para ser Dark Mode nativo e centralizado.
  const [files, setFiles] = useState<Record<string, string>>({
    "/App.js": `export default function App() {
  return (
    <div style={{ 
      height: '100vh', 
      width: '100vw',
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center', 
      background: '#020202', // Fundo Super Dark
      color: '#fff',
      fontFamily: 'Inter, system-ui, sans-serif',
      margin: 0,
      padding: 0,
      overflow: 'hidden'
    }}>
      <div style={{ 
        textAlign: 'center', 
        padding: '50px',
        border: '1px solid #1a1a1a',
        borderRadius: '24px',
        background: 'linear-gradient(180deg, #0a0a0a 0%, #050505 100%)',
        boxShadow: '0 0 60px rgba(168, 85, 247, 0.15)', // Glow Roxo Suave
        maxWidth: '90%',
        width: '400px'
      }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          margin: '0 0 15px 0',
          color: '#a855f7',
          textShadow: '0 0 30px rgba(168, 85, 247, 0.3)',
          fontWeight: '800'
        }}>
          Ghost Box
        </h1>
        <p style={{ color: '#666', fontSize: '1.1rem', margin: 0 }}>
          O que vamos materializar hoje?
        </p>
      </div>
    </div>
  );
}`,
  });

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'pt-BR';
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setPrompt(prev => prev ? prev + " " + transcript : transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } else {
      alert("Navegador sem suporte a voz.");
    }
  };

  async function handleGenerate() {
    if (!prompt) return;
    setLoading(true);
    setActiveTab("preview");
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify({ prompt, currentFiles: files }),
      });
      const newFiles = await response.json();
      setFiles(newFiles);
      setPrompt(""); 
    } catch (error) {
      alert("Erro na API.");
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
    saveAs(blob, "ghost-box-project.zip");
  };

  const handleReset = () => {
    if (confirm("Resetar projeto?")) {
       setFiles({
        "/App.js": `export default function App() {
  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center', 
      background: '#020202', 
      color: '#fff',
      fontFamily: 'system-ui' 
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', margin: 0, color: '#a855f7', textShadow: '0 0 20px rgba(168, 85, 247, 0.5)' }}>Ghost Box</h1>
        <p style={{ color: '#666' }}>Pronto para criar.</p>
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
    <div style={{ height: "100vh", background: "#000", color: "white", display: "flex", flexDirection: "column" }}>
      
      {/* --- TELA DE LOGIN (Centralizada) --- */}
      <SignedOut>
        <div style={{ 
          flex: 1, 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          justifyContent: "center", 
          background: "#050505",
          padding: "20px",
          textAlign: "center"
        }}>
          <div style={{ 
            background: "#0a0a0a", 
            padding: "40px", 
            borderRadius: "20px", 
            border: "1px solid #222",
            boxShadow: "0 0 40px rgba(124, 58, 237, 0.15)"
          }}>
            <div style={{ display: "inline-block", padding: "15px", background: "rgba(124, 58, 237, 0.1)", borderRadius: "50%", marginBottom: "20px" }}>
              <Ghost size={48} color="#a855f7" />
            </div>
            <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", color: "white", marginBottom: "10px" }}>
              Ghost Box IA
            </h1>
            <p style={{ color: "#888", marginBottom: "30px" }}>Entre para materializar suas ideias.</p>
            
            <div style={{ transform: "scale(1.2)" }}>
              <SignInButton mode="modal">
                <button style={{
                  background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                  color: "white",
                  border: "none",
                  padding: "12px 30px",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  borderRadius: "10px",
                  cursor: "pointer",
                  boxShadow: "0 0 20px rgba(124, 58, 237, 0.4)"
                }}>
                  Entrar no Sistema
                </button>
              </SignInButton>
            </div>
          </div>
        </div>
      </SignedOut>

      {/* --- APP PRINCIPAL (Só aparece se logado) --- */}
      <SignedIn>
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          
          {/* Header */}
          <div style={{ padding: "12px 16px", borderBottom: "1px solid #1f1f1f", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#0a0a0a" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", padding: "6px", borderRadius: "6px" }}>
                <Ghost size={18} color="white" />
              </div>
              <span style={{ fontWeight: "bold", letterSpacing: "1px" }}>GHOST BOX</span>
            </div>
            
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <button onClick={handleReset} style={{ background: "#1a1a1a", border: "1px solid #333", color: "#666", padding: "8px", borderRadius: "6px", cursor: "pointer" }}><Trash2 size={18} /></button>
              <button onClick={handleDownload} style={{ background: "#1a1a1a", border: "1px solid #333", color: "white", padding: "8px", borderRadius: "6px", cursor: "pointer" }}><Download size={18} /></button>
              <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: { width: 35, height: 35 }}}} />
            </div>
          </div>

          {/* Abas e Editor */}
          <div style={{ flex: 1, overflow: "hidden", position: "relative", display: "flex", flexDirection: "column" }}>
            
             {/* Controle de Abas Flutuante */}
             <div style={{ position: "absolute", top: 10, right: 10, zIndex: 10, background: "#1a1a1a", borderRadius: "8px", padding: "2px", border: "1px solid #333" }}>
                <button onClick={() => setActiveTab("code")} style={{ padding: "6px 10px", borderRadius: "6px", background: activeTab === "code" ? "#333" : "transparent", color: activeTab === "code" ? "white" : "#666", border: "none", cursor: "pointer" }}><Code2 size={16} /></button>
                <button onClick={() => setActiveTab("preview")} style={{ padding: "6px 10px", borderRadius: "6px", background: activeTab === "preview" ? "#7c3aed" : "transparent", color: activeTab === "preview" ? "white" : "#666", border: "none", cursor: "pointer" }}><Eye size={16} /></button>
              </div>

            <SandpackProvider template="react" theme="dark" files={files} options={{ externalResources: ["https://cdn.tailwindcss.com"] }}>
              <SandpackLayout style={{ height: "100%", border: "none", background: "#000" }}>
                <div style={{ display: activeTab === "code" ? "block" : "none", height: "100%", width: "100%" }}>
                  <SandpackCodeEditor showTabs showLineNumbers wrapContent style={{ height: "100%" }} />
                </div>
                <div style={{ display: activeTab === "preview" ? "block" : "none", height: "100%", width: "100%" }}>
                  <SandpackPreview showNavigator={false} showRefreshButton={false} style={{ height: "100%" }} />
                </div>
              </SandpackLayout>
            </SandpackProvider>
          </div>

          {/* Input Area */}
          <div style={{ padding: "16px", background: "#0a0a0a", borderTop: "1px solid #1f1f1f" }}>
            <div style={{ display: "flex", gap: "10px", background: "#111", padding: "8px", borderRadius: "12px", border: "1px solid #222", boxShadow: "0 0 20px rgba(0,0,0,0.5)" }}>
              <button onClick={startListening} style={{ background: isListening ? "#ef4444" : "#222", color: "white", border: "none", width: "40px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                {isListening ? <MicOff size={20} className="animate-pulse" /> : <Mic size={20} />}
              </button>
              <input 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={isListening ? "Ouvindo..." : `Olá, ${user?.firstName || 'Criador'}. O que vamos fazer?`}
                style={{ flex: 1, background: "transparent", border: "none", color: "white", outline: "none", padding: "0 8px" }}
              />
              <button onClick={handleGenerate} disabled={loading} style={{ background: loading ? "#333" : "linear-gradient(135deg, #7c3aed, #a855f7)", color: "white", border: "none", width: "40px", height: "40px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", cursor: loading ? "default" : "pointer" }}>
                {loading ? <RefreshCw className="animate-spin" size={20}/> : <Play size={20} fill="white" />}
              </button>
            </div>
          </div>
        </div>
      </SignedIn>
    </div>
  );
}
