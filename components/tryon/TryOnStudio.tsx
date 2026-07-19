"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/providers/CartProvider";
import { toast } from "sonner";
import {
  CATEGORIES,
  JewelryCategory,
  JewelryItem,
  JEWELRY_BY_CATEGORY,
} from "@/components/tryon/jewelryData";
import {
  Upload,
  Camera,
  Sparkles,
  RotateCw,
  Download,
  ShoppingBag,
  Heart,
  CreditCard,
  ChevronDown,
  ChevronUp,
  Check,
  Move,
  RotateCcw,
  Maximize2,
} from "lucide-react";


// ── Types ─────────────────────────────────────────────────────────────────────
interface Placement {
  x: number;
  y: number;
  width: number;
  rotation: number;
}

// ── AI Loading messages ───────────────────────────────────────────────────────
const AI_MESSAGES = [
  "Analyzing your photo...",
  "Detecting body landmarks...",
  "Measuring proportions...",
  "Detecting skin tone...",
  "Matching jewelry scale...",
  "Applying realistic lighting...",
  "Calculating perspective...",
  "Blending jewelry naturally...",
  "Generating perfect fit...",
  "Almost done...",
];

// ── Default placements (client-side fallback) ─────────────────────────────────
const PLACEMENT_DEFAULTS: Record<JewelryCategory, Placement[]> = {
  necklace: [{ x: 0.50, y: 0.52, width: 0.55, rotation: 0 }],
  earring:  [{ x: 0.35, y: 0.44, width: 0.07, rotation: 0 }, { x: 0.65, y: 0.44, width: 0.07, rotation: 0 }],
  ring:     [{ x: 0.60, y: 0.62, width: 0.13, rotation: -10 }],
  bracelet: [{ x: 0.50, y: 0.52, width: 0.38, rotation: 0 }],
  watch:    [{ x: 0.50, y: 0.52, width: 0.38, rotation: 0 }],
  anklet:   [{ x: 0.50, y: 0.65, width: 0.40, rotation: 10 }],
  nosepin:  [{ x: 0.48, y: 0.50, width: 0.08, rotation: 0 }],
};

// ── Compress image to max 800px for fast API upload ───────────────────────────
function compressImage(dataUrl: string, maxWidth = 800): Promise<string> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => {
      const ratio = Math.min(1, maxWidth / img.width);
      const canvas = document.createElement("canvas");
      canvas.width  = Math.round(img.width  * ratio);
      canvas.height = Math.round(img.height * ratio);
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.82));
    };
    img.src = dataUrl;
  });
}

// ─────────────────────────────────────────────────────────────────────────────
export default function TryOnStudio() {
  const { addToCart } = useCart();

  // ── Core state ─────────────────────────────────────────────────────────────
  const [userImage,     setUserImage]     = useState<string | null>(null);
  const [category,      setCategory]      = useState<JewelryCategory>("necklace");
  const [selected,      setSelected]      = useState<JewelryItem>(JEWELRY_BY_CATEGORY["necklace"][0]);
  const [placements,    setPlacements]    = useState<Placement[] | null>(null);
  const [detectedCat,   setDetectedCat]   = useState<JewelryCategory | null>(null);

  // ── Processing ─────────────────────────────────────────────────────────────
  const [isProcessing,  setIsProcessing]  = useState(false);
  const [msgIndex,      setMsgIndex]      = useState(0);
  const [progress,      setProgress]      = useState(0);

  // ── UI phase: "upload" | "pick" | "result" ─────────────────────────────────
  const [phase, setPhase] = useState<"upload" | "pick" | "result">("upload");

  // ── Advanced panel ─────────────────────────────────────────────────────────
  const [showAdvanced, setShowAdvanced]   = useState(false);
  const [offsetX,      setOffsetX]        = useState(0);
  const [offsetY,      setOffsetY]        = useState(0);
  const [rotation,     setRotation]       = useState(0);
  const [scale,        setScale]          = useState(1.0);

  // ── Before/After slider ────────────────────────────────────────────────────
  const [sliderPos, setSliderPos]         = useState(0.5);
  const isDragging                        = useRef(false);

  // ── Refs ────────────────────────────────────────────────────────────────────
  const fileInputRef  = useRef<HTMLInputElement>(null);
  const camInputRef   = useRef<HTMLInputElement>(null);
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const containerRef  = useRef<HTMLDivElement>(null);

  // ── Reset everything ────────────────────────────────────────────────────────
  const handleReset = useCallback(() => {
    setUserImage(null);
    setPlacements(null);
    setDetectedCat(null);
    setPhase("upload");
    setShowAdvanced(false);
    setOffsetX(0);
    setOffsetY(0);
    setRotation(0);
    setScale(1.0);
    setSliderPos(0.5);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (camInputRef.current)  camInputRef.current.value  = "";
  }, []);

  // ── Handle file / camera pick ───────────────────────────────────────────────
  function handleImageFile(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image (JPG, PNG, WEBP).");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setUserImage(ev.target?.result as string);
      setPlacements(null);
      setPhase("pick");
    };
    reader.readAsDataURL(file);
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) handleImageFile(f);
  }

  // ── Drag & drop handlers ───────────────────────────────────────────────────
  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) handleImageFile(f);
  }

  // ── Generate AI Try-On ─────────────────────────────────────────────────────
  const runGeneration = useCallback(async (img: string, item: JewelryItem) => {
    if (!img) return;
    setIsProcessing(true);
    setMsgIndex(0);
    setProgress(0);

    // Rotating messages
    const msgTimer = setInterval(() => {
      setMsgIndex((i) => (i + 1) % AI_MESSAGES.length);
    }, 700);

    // Progress bar animation
    const totalMs = 4500;
    const tick = 80;
    let elapsed = 0;
    const progTimer = setInterval(() => {
      elapsed += tick;
      setProgress(Math.min(95, Math.round((elapsed / totalMs) * 100)));
    }, tick);

    try {
      // Compress image first
      const compressed = await compressImage(img, 800);

      const res = await fetch("/api/try-on", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: compressed,
          jewelryType: "auto",
        }),
      });

      clearInterval(msgTimer);
      clearInterval(progTimer);

      if (!res.ok) throw new Error("API error");
      const data = await res.json();

      setProgress(100);

      // AI returned detected category
      if (data.category) {
        const cat = data.category as JewelryCategory;
        setDetectedCat(cat);
        // Switch to the detected category and keep the chosen item if it matches; otherwise reset
        if (cat !== item.category) {
          setCategory(cat);
          setSelected(JEWELRY_BY_CATEGORY[cat][0]);
        }
      }

      setPlacements(data.placements ?? PLACEMENT_DEFAULTS[item.category]);
      setPhase("result");
    } catch {
      clearInterval(msgTimer);
      clearInterval(progTimer);
      setProgress(100);
      setPlacements(PLACEMENT_DEFAULTS[item.category]);
      setPhase("result");
      toast.error("AI detection used fallback placement.", {
        style: { background: "#111", color: "#C8A96A", border: "1px solid rgba(200,169,106,0.3)" },
      });
    } finally {
      setIsProcessing(false);
    }
  }, []);

  function handleGenerate() {
    if (userImage) runGeneration(userImage, selected);
  }

  // Auto-regenerate when jewelry switches while result is showing
  useEffect(() => {
    if (phase === "result" && userImage && !isProcessing) {
      runGeneration(userImage, selected);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected.id]);

  // ── Canvas draw ─────────────────────────────────────────────────────────────
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !userImage || !placements) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const userImg = new window.Image();
    userImg.onload = () => {
      const maxW = 900;
      const ratio = Math.min(1, maxW / userImg.width);
      canvas.width  = Math.round(userImg.width  * ratio);
      canvas.height = Math.round(userImg.height * ratio);

      // Draw user photo
      ctx.drawImage(userImg, 0, 0, canvas.width, canvas.height);

      // Draw each jewelry piece
      const jImg = new window.Image();
      jImg.onload = () => {
        placements.forEach((p) => {
          const cx = canvas.width  * p.x + offsetX;
          const cy = canvas.height * p.y + offsetY;
          const w  = canvas.width  * p.width * scale;
          const h  = jImg.height * (w / jImg.width);

          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(((p.rotation + rotation) * Math.PI) / 180);

          // Realistic shadow
          ctx.shadowColor = "rgba(0,0,0,0.35)";
          ctx.shadowBlur  = 14;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 6;

          ctx.globalAlpha = 0.95;
          ctx.drawImage(jImg, -w / 2, -h / 2, w, h);
          ctx.restore();
        });

        // Before/After divider
        if (sliderPos < 0.99) {
          const divX = canvas.width * sliderPos;

          // Left side (original) — overwrite with original photo clipped
          ctx.save();
          ctx.beginPath();
          ctx.rect(0, 0, divX, canvas.height);
          ctx.clip();
          ctx.drawImage(userImg, 0, 0, canvas.width, canvas.height);
          ctx.restore();

          // Divider line
          ctx.save();
          ctx.strokeStyle = "#C8A96A";
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(divX, 0);
          ctx.lineTo(divX, canvas.height);
          ctx.stroke();

          // Handle circle
          ctx.beginPath();
          ctx.arc(divX, canvas.height / 2, 16, 0, Math.PI * 2);
          ctx.fillStyle = "#C8A96A";
          ctx.fill();
          ctx.fillStyle = "#111";
          ctx.font = "bold 13px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("⟷", divX, canvas.height / 2);
          ctx.restore();
        }
      };
      jImg.src = selected.src;
    };
    userImg.src = userImage;
  }, [userImage, placements, selected, offsetX, offsetY, rotation, scale, sliderPos]);

  useEffect(() => {
    if (phase === "result") drawCanvas();
  }, [phase, drawCanvas]);

  // ── Before/After slider ─────────────────────────────────────────────────────
  function updateSlider(clientX: number) {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0.01, Math.min(0.99, (clientX - rect.left) / rect.width));
    setSliderPos(x);
  }

  // ── Add to cart ─────────────────────────────────────────────────────────────
  function handleAddToCart() {
    addToCart({
      id: parseFloat(selected.id.replace(/\D/g, "") || "1") + Math.random(),
      name: selected.name,
      price: parseInt(selected.price.replace(/[^\d]/g, "")) || 1499,
      oldPrice: (parseInt(selected.price.replace(/[^\d]/g, "")) || 1499) + 400,
      rating: 5,
      sale: true,
      image: "/images/products/product2.jpg",
      category: "Jewelry",
      description: selected.description,
    });
    toast.success(`${selected.name} added to cart!`, {
      style: { background: "#111", color: "#C8A96A", border: "1px solid rgba(200,169,106,0.3)" },
    });
  }

  function handleDownload() {
    const c = canvasRef.current;
    if (!c) return;
    const a = document.createElement("a");
    a.download = `luxella-${selected.name.toLowerCase().replace(/\s+/g, "-")}.png`;
    a.href = c.toDataURL("image/png");
    a.click();
  }

  function handleSave() {
    toast.success("Look saved to your Luxella Lookbook!", {
      style: { background: "#111", color: "#C8A96A", border: "1px solid rgba(200,169,106,0.3)" },
    });
  }

  const items = JEWELRY_BY_CATEGORY[category];

  // ────────────────────────────────────────────────────────────────────────────
  return (
    <section
      style={{ background: "var(--bg-base)" }}
      className="min-h-screen py-14 px-4 md:px-8"
    >
      <div className="max-w-5xl mx-auto space-y-10">

        {/* ── PAGE HEADER ──────────────────────────────────────────────────── */}
        <div className="text-center">
          <p
            className="text-[10px] uppercase tracking-[0.45em] font-bold mb-3"
            style={{ color: "#C8A96A" }}
          >
            ✦ AI Virtual Fitting Room
          </p>
          <h1
            className="text-4xl sm:text-5xl font-bold text-white"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Try On <span style={{ color: "#C8A96A" }}>Any Piece</span>
          </h1>
          <p className="mt-3 text-sm text-gray-400 max-w-md mx-auto">
            Upload a photo. Pick your jewelry. Our AI does the rest — perfectly fitted in seconds.
          </p>
        </div>

        {/* ── STEP INDICATORS ──────────────────────────────────────────────── */}
        <div className="flex items-center justify-center gap-4 select-none">
          {[
            { n: 1, label: "Upload Photo",    active: phase !== "upload" || true },
            { n: 2, label: "Choose Jewelry",  active: phase === "pick" || phase === "result" },
            { n: 3, label: "AI Try-On",       active: phase === "result" },
          ].map(({ n, label, active }, i) => (
            <div key={n} className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-300"
                  style={{
                    background: active ? "linear-gradient(135deg,#C8A96A,#8B6914)" : "rgba(255,255,255,0.06)",
                    color: active ? "#111" : "#555",
                    border: active ? "none" : "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {active && n < (phase === "result" ? 4 : phase === "pick" ? 3 : 2) ? (
                    <Check size={12} />
                  ) : n}
                </div>
                <span
                  className="text-[11px] font-semibold uppercase tracking-wider hidden sm:block"
                  style={{ color: active ? "#C8A96A" : "#444" }}
                >
                  {label}
                </span>
              </div>
              {i < 2 && (
                <div
                  className="w-10 h-px"
                  style={{ background: active ? "#C8A96A" : "rgba(255,255,255,0.08)" }}
                />
              )}
            </div>
          ))}
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            PHASE: UPLOAD
        ═══════════════════════════════════════════════════════════════════════ */}
        {phase === "upload" && (
          <div className="max-w-xl mx-auto">
            <div
              className="rounded-3xl p-8 border text-center space-y-6"
              style={{ background: "var(--bg-elevated)", borderColor: "rgba(200,169,106,0.18)" }}
            >
              {/* Drop zone */}
              <div
                onDrop={onDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed rounded-2xl py-16 px-8 cursor-pointer transition-all duration-300 group"
                style={{ borderColor: "rgba(200,169,106,0.25)", background: "rgba(200,169,106,0.02)" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(200,169,106,0.5)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(200,169,106,0.25)")}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onFileChange}
                />
                <div
                  className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: "linear-gradient(135deg,rgba(200,169,106,0.15),rgba(139,105,20,0.1))" }}
                >
                  <Upload size={28} style={{ color: "#C8A96A" }} />
                </div>
                <p className="text-white font-bold text-base mb-1">
                  Drop your photo here
                </p>
                <p className="text-gray-500 text-xs">
                  or click to browse — JPG, PNG, WEBP supported
                </p>
              </div>

              {/* Camera button */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
                <span className="text-[10px] text-gray-600 uppercase tracking-wider">or</span>
                <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
              </div>

              <button
                onClick={() => camInputRef.current?.click()}
                className="w-full py-4 rounded-2xl border font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2.5 cursor-pointer transition-all duration-300"
                style={{
                  borderColor: "rgba(200,169,106,0.3)",
                  color: "#C8A96A",
                  background: "rgba(200,169,106,0.04)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(200,169,106,0.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(200,169,106,0.04)")}
              >
                <input
                  ref={camInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={onFileChange}
                />
                <Camera size={18} />
                Use Camera
              </button>

              {/* Tip */}
              <p className="text-[11px] text-gray-500 leading-relaxed px-2">
                💡 Use a clear photo in good lighting for the most realistic results.
                Works with selfies, hand shots, ankle photos, and more.
              </p>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            PHASE: PICK JEWELRY
        ═══════════════════════════════════════════════════════════════════════ */}
        {phase === "pick" && (
          <div className="space-y-6">

            {/* Uploaded photo preview + change */}
            <div
              className="flex items-center gap-4 rounded-2xl p-4 border"
              style={{ background: "var(--bg-elevated)", borderColor: "rgba(200,169,106,0.15)" }}
            >
              <div className="w-16 h-16 rounded-xl overflow-hidden border flex-shrink-0" style={{ borderColor: "rgba(200,169,106,0.2)" }}>
                <img src={userImage!} alt="Your photo" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm">Photo ready</p>
                <p className="text-gray-500 text-[11px] mt-0.5">AI will analyze and fit jewelry automatically</p>
              </div>
              <button
                onClick={handleReset}
                className="text-[10px] text-gray-500 hover:text-white uppercase font-bold tracking-wider cursor-pointer transition-colors"
              >
                Change
              </button>
            </div>

            {/* Category tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {CATEGORIES.map((cat) => {
                const active = cat.key === category;
                return (
                  <button
                    key={cat.key}
                    onClick={() => {
                      setCategory(cat.key);
                      setSelected(JEWELRY_BY_CATEGORY[cat.key][0]);
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider flex-shrink-0 cursor-pointer transition-all duration-300 border"
                    style={
                      active
                        ? { background: "linear-gradient(135deg,#C8A96A,#8B6914)", color: "#111", borderColor: "transparent" }
                        : { background: "rgba(255,255,255,0.03)", color: "#666", borderColor: "rgba(255,255,255,0.06)" }
                    }
                  >
                    <span>{cat.icon}</span>
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Jewelry grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {items.map((item) => {
                const isActive = selected.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelected(item)}
                    className="rounded-2xl p-4 text-left cursor-pointer transition-all duration-300 border flex flex-col gap-3"
                    style={{
                      background: isActive ? "rgba(200,169,106,0.08)" : "var(--bg-elevated)",
                      borderColor: isActive ? "#C8A96A" : "rgba(255,255,255,0.06)",
                    }}
                  >
                    {/* Jewelry image */}
                    <div
                      className="w-full aspect-square rounded-xl flex items-center justify-center overflow-hidden"
                      style={{ background: "rgba(255,255,255,0.03)" }}
                    >
                      <img
                        src={item.src}
                        alt={item.name}
                        className="max-h-full max-w-full object-contain p-2"
                      />
                    </div>

                    {/* Info */}
                    <div>
                      <p className="text-white text-[12px] font-bold leading-tight">{item.name}</p>
                      <p className="text-[11px] mt-0.5" style={{ color: "#C8A96A" }}>{item.price}</p>
                    </div>

                    {/* Selected check */}
                    {isActive && (
                      <div
                        className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ background: "#C8A96A" }}
                      >
                        <Check size={11} color="#111" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              className="w-full py-5 rounded-2xl font-bold text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 cursor-pointer transition-all duration-300 shadow-lg"
              style={{
                background: "linear-gradient(135deg,#C8A96A,#8B6914)",
                color: "#111",
                boxShadow: "0 8px 30px rgba(200,169,106,0.25)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 12px 40px rgba(200,169,106,0.4)")}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 8px 30px rgba(200,169,106,0.25)")}
            >
              <Sparkles size={18} />
              Generate AI Try-On
            </button>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            LOADING OVERLAY (shown over phase transition)
        ═══════════════════════════════════════════════════════════════════════ */}
        {isProcessing && (
          <div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 px-8 text-center"
            style={{ background: "rgba(8,8,8,0.97)" }}
          >
            {/* Gold spinner */}
            <div className="relative">
              <div
                className="w-24 h-24 rounded-full animate-spin"
                style={{
                  background: "conic-gradient(from 0deg, transparent 0%, #C8A96A 100%)",
                  WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 4px), #000 0)",
                  mask: "radial-gradient(farthest-side, transparent calc(100% - 4px), #000 0)",
                }}
              />
              <Sparkles
                size={28}
                className="absolute inset-0 m-auto"
                style={{ color: "#C8A96A" }}
              />
            </div>

            {/* Rotating message */}
            <div className="space-y-2 max-w-xs">
              <p
                key={msgIndex}
                className="text-white font-bold text-lg transition-all duration-500"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {AI_MESSAGES[msgIndex]}
              </p>
              <p className="text-gray-500 text-xs uppercase tracking-widest">
                AI Virtual Fitting — 3–6 seconds
              </p>
            </div>

            {/* Progress bar */}
            <div
              className="w-64 h-1 rounded-full overflow-hidden"
              style={{ background: "rgba(255,255,255,0.08)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-200"
                style={{
                  width: `${progress}%`,
                  background: "linear-gradient(90deg,#8B6914,#C8A96A,#F0D68A)",
                }}
              />
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            PHASE: RESULT
        ═══════════════════════════════════════════════════════════════════════ */}
        {phase === "result" && !isProcessing && (
          <div className="space-y-6">

            {/* Confidence badge */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider"
                style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)" }}
              >
                <Check size={13} />
                AI Perfect Fit Generated
              </div>
              {detectedCat && (
                <div
                  className="text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-xl"
                  style={{ background: "rgba(200,169,106,0.08)", color: "#C8A96A", border: "1px solid rgba(200,169,106,0.15)" }}
                >
                  Category detected: {detectedCat}
                </div>
              )}
            </div>

            {/* Canvas preview */}
            <div
              ref={containerRef}
              className="w-full rounded-3xl overflow-hidden relative border"
              style={{
                background: "var(--bg-elevated)",
                borderColor: "rgba(200,169,106,0.15)",
                cursor: "ew-resize",
                minHeight: 300,
              }}
              onMouseDown={() => { isDragging.current = true; }}
              onMouseMove={(e) => { if (isDragging.current) updateSlider(e.clientX); }}
              onMouseUp={() => { isDragging.current = false; }}
              onMouseLeave={() => { isDragging.current = false; }}
              onTouchStart={() => { isDragging.current = true; }}
              onTouchMove={(e) => {
                isDragging.current = true;
                updateSlider(e.touches[0].clientX);
              }}
              onTouchEnd={() => { isDragging.current = false; }}
            >
              <canvas
                ref={canvasRef}
                className="w-full h-auto block"
              />

              {/* Auto re-fitting overlay */}
              {isProcessing && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center gap-2 z-10">
                  <Sparkles size={20} style={{ color: "#C8A96A" }} className="animate-spin" />
                  <span className="text-sm font-bold text-white">Re-fitting...</span>
                </div>
              )}
            </div>

            {/* Before/After slider label */}
            <div className="flex justify-between text-[10px] text-gray-500 uppercase tracking-widest font-bold px-1">
              <span>← Original</span>
              <span style={{ color: "#C8A96A" }}>Drag to Compare</span>
              <span>With Jewelry →</span>
            </div>
            <input
              type="range"
              min="0.01"
              max="0.99"
              step="0.01"
              value={sliderPos}
              onChange={(e) => setSliderPos(parseFloat(e.target.value))}
              className="w-full cursor-ew-resize"
              style={{ accentColor: "#C8A96A" }}
            />

            {/* Current piece summary */}
            <div
              className="flex items-center gap-4 rounded-2xl p-4 border"
              style={{ background: "var(--bg-elevated)", borderColor: "rgba(200,169,106,0.15)" }}
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(200,169,106,0.15)" }}
              >
                <img src={selected.src} alt={selected.name} className="max-h-full max-w-full object-contain p-1" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm">{selected.name}</p>
                <p className="text-[11px] mt-0.5" style={{ color: "#C8A96A" }}>{selected.price}</p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={handleSave}
                className="flex items-center justify-center gap-2 py-4 rounded-2xl text-[11px] font-bold uppercase tracking-wider cursor-pointer transition-all duration-300 border"
                style={{ borderColor: "rgba(255,255,255,0.08)", color: "#ccc", background: "rgba(255,255,255,0.03)" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#ccc"; }}
              >
                <Heart size={14} /> Save Look
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 py-4 rounded-2xl text-[11px] font-bold uppercase tracking-wider cursor-pointer transition-all duration-300 border"
                style={{ borderColor: "rgba(255,255,255,0.08)", color: "#ccc", background: "rgba(255,255,255,0.03)" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#ccc"; }}
              >
                <Download size={14} /> Download
              </button>
              <button
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-2 py-4 rounded-2xl text-[11px] font-bold uppercase tracking-wider cursor-pointer transition-all duration-300"
                style={{ background: "linear-gradient(135deg,#C8A96A,#8B6914)", color: "#111" }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                <ShoppingBag size={14} /> Add to Cart
              </button>
              <button
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-2 py-4 rounded-2xl text-[11px] font-bold uppercase tracking-wider cursor-pointer transition-all duration-300 border"
                style={{ borderColor: "rgba(200,169,106,0.35)", color: "#C8A96A", background: "rgba(200,169,106,0.05)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(200,169,106,0.12)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(200,169,106,0.05)")}
              >
                <CreditCard size={14} /> Buy Now
              </button>
            </div>

            {/* Try Another Jewelry link */}
            <div className="flex items-center justify-center gap-6 pt-2">
              <button
                onClick={() => {
                  setPlacements(null);
                  setPhase("pick");
                }}
                className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest cursor-pointer transition-colors"
                style={{ color: "#C8A96A" }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                <RotateCw size={13} /> Try Another Jewelry
              </button>
              <span className="text-gray-700">|</span>
              <button
                onClick={handleReset}
                className="text-[12px] font-bold uppercase tracking-widest text-gray-500 hover:text-white cursor-pointer transition-colors"
              >
                New Photo
              </button>
            </div>

            {/* ── ADVANCED ADJUSTMENT (hidden by default) ─────────────────── */}
            <div
              className="rounded-2xl border overflow-hidden"
              style={{ borderColor: "rgba(255,255,255,0.06)" }}
            >
              <button
                onClick={() => setShowAdvanced((v) => !v)}
                className="w-full flex items-center justify-between px-5 py-4 text-[11px] uppercase tracking-widest font-bold cursor-pointer transition-colors"
                style={{ color: "#555", background: "rgba(255,255,255,0.02)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#888")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
              >
                <span>Advanced Adjustment</span>
                {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              {showAdvanced && (
                <div
                  className="px-5 pb-6 pt-2 space-y-5 border-t"
                  style={{ borderColor: "rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.015)" }}
                >
                  {/* Move */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold" style={{ color: "#C8A96A" }}>
                      <Move size={11} /> Move Position
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between text-[10px] text-gray-500 mb-1.5">
                          <span>Left / Right</span>
                          <span style={{ color: "#C8A96A" }}>{offsetX > 0 ? "+" : ""}{offsetX}px</span>
                        </div>
                        <input type="range" min="-80" max="80" step="1" value={offsetX}
                          onChange={(e) => setOffsetX(parseInt(e.target.value))}
                          className="w-full" style={{ accentColor: "#C8A96A" }} />
                      </div>
                      <div>
                        <div className="flex justify-between text-[10px] text-gray-500 mb-1.5">
                          <span>Up / Down</span>
                          <span style={{ color: "#C8A96A" }}>{offsetY > 0 ? "+" : ""}{offsetY}px</span>
                        </div>
                        <input type="range" min="-80" max="80" step="1" value={offsetY}
                          onChange={(e) => setOffsetY(parseInt(e.target.value))}
                          className="w-full" style={{ accentColor: "#C8A96A" }} />
                      </div>
                    </div>
                  </div>

                  {/* Rotate */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold" style={{ color: "#C8A96A" }}>
                      <RotateCcw size={11} /> Rotate
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-500 mb-1.5">
                      <span>Rotation angle</span>
                      <span style={{ color: "#C8A96A" }}>{rotation}°</span>
                    </div>
                    <input type="range" min="-45" max="45" step="1" value={rotation}
                      onChange={(e) => setRotation(parseInt(e.target.value))}
                      className="w-full" style={{ accentColor: "#C8A96A" }} />
                  </div>

                  {/* Scale */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold" style={{ color: "#C8A96A" }}>
                      <Maximize2 size={11} /> Scale Size
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-500 mb-1.5">
                      <span>Jewelry size</span>
                      <span style={{ color: "#C8A96A" }}>{Math.round(scale * 100)}%</span>
                    </div>
                    <input type="range" min="0.5" max="1.8" step="0.02" value={scale}
                      onChange={(e) => setScale(parseFloat(e.target.value))}
                      className="w-full" style={{ accentColor: "#C8A96A" }} />
                  </div>

                  <button
                    onClick={() => { setOffsetX(0); setOffsetY(0); setRotation(0); setScale(1.0); }}
                    className="text-[10px] uppercase tracking-widest font-bold cursor-pointer transition-colors"
                    style={{ color: "#555" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
                  >
                    Reset to AI Default
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </section>
  );
}
