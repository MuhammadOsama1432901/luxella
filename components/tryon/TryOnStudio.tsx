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
  Image as ImageIcon,
  Loader2,
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
  "Loading MediaPipe Hand models...",
  "Analyzing your photo structure...",
  "Detecting hand & wrist landmarks...",
  "Measuring wrist proportions...",
  "Calculating perspective angle...",
  "Applying volumetric 3D cylinder wrapping...",
  "Generating realistic shadows...",
  "Blending metallic light reflections...",
  "Almost ready...",
];

// ── Default placements (client-side fallback) ─────────────────────────────────
const PLACEMENT_DEFAULTS: Record<JewelryCategory, Placement[]> = {
  necklace: [{ x: 0.50, y: 0.52, width: 0.55, rotation: 0 }],
  earring:  [{ x: 0.35, y: 0.44, width: 0.07, rotation: 0 }, { x: 0.65, y: 0.44, width: 0.07, rotation: 0 }],
  ring:     [{ x: 0.60, y: 0.62, width: 0.13, rotation: -10 }],
  bracelet: [{ x: 0.50, y: 0.62, width: 0.28, rotation: 0 }],
  watch:    [{ x: 0.50, y: 0.62, width: 0.28, rotation: 0 }],
  anklet:   [{ x: 0.50, y: 0.65, width: 0.40, rotation: 10 }],
  nosepin:  [{ x: 0.48, y: 0.50, width: 0.08, rotation: 0 }],
};

// ── Compress image to max 900px for fast processing ───────────────────────────
function compressImage(dataUrl: string, maxWidth = 900): Promise<string> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => {
      const ratio = Math.min(1, maxWidth / img.width);
      const canvas = document.createElement("canvas");
      canvas.width  = Math.round(img.width  * ratio);
      canvas.height = Math.round(img.height * ratio);
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.src = dataUrl;
  });
}

// ─────────────────────────────────────────────────────────────────────────────
export default function TryOnStudio() {
  const { addToCart } = useCart();
  const router = useRouter();

  // Load real products from the database for Try-On integration
  const [dbProducts, setDbProducts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          setDbProducts(data.products || []);
        }
      } catch (err) {
        console.error("Failed to load products for try-on mapping:", err);
      }
    }
    fetchProducts();
  }, []);

  // Map SVGs to real DB products
  const getMappedDbProduct = useCallback((item: JewelryItem) => {
    let targetId: number | null = null;
    if (item.id === "n1") targetId = 1;
    else if (item.id === "n2") targetId = 5;
    else if (item.id === "e1") targetId = 2;
    else if (item.id === "e2") targetId = 6;
    else if (item.id === "r1") targetId = 3;
    else if (item.id === "r2") targetId = 3;
    else if (item.id === "b1") targetId = 4;
    else if (item.id === "b2") targetId = 4;

    if (targetId !== null) {
      const found = dbProducts.find((p) => p.id === targetId);
      if (found) return found;
    }
    
    return {
      id: parseFloat(item.id.replace(/\D/g, "") || "1") + 100,
      name: item.name,
      price: parseInt(item.price.replace(/[^\d]/g, "")) || 1499,
      oldPrice: (parseInt(item.price.replace(/[^\d]/g, "")) || 1499) + 400,
      rating: 5,
      sale: true,
      image: item.category === "earring" ? "/images/products/product2.jpg" : "/images/products/product1.jpg",
      category: item.category,
      description: item.description,
      stock: 10,
    };
  }, [dbProducts]);

  // ── Core states ─────────────────────────────────────────────────────────────
  const [userImage,     setUserImage]     = useState<string | null>(null);
  const [category,      setCategory]      = useState<JewelryCategory>("necklace");
  const [selected,      setSelected]      = useState<JewelryItem>(JEWELRY_BY_CATEGORY["necklace"][0]);
  const [placements,    setPlacements]    = useState<Placement[] | null>(null);
  const [detectedCat,   setDetectedCat]   = useState<JewelryCategory | null>(null);
  
  // Custom uploaded jewelry list
  const [customJewelry, setCustomJewelry] = useState<Record<JewelryCategory, JewelryItem[]>>({
    necklace: [], earring: [], ring: [], bracelet: [], watch: [], anklet: [], nosepin: []
  });

  // ── Processing & Model states ────────────────────────────────────────────────
  const [isProcessing,  setIsProcessing]  = useState(false);
  const [msgIndex,      setMsgIndex]      = useState(0);
  const [progress,      setProgress]      = useState(0);
  const [landmarker,    setLandmarker]    = useState<any>(null);
  const [isModelLoading, setIsModelLoading] = useState(false);

  // ── UI phase: "upload" | "pick" | "result" ─────────────────────────────────
  const [phase, setPhase] = useState<"upload" | "pick" | "result">("upload");

  // ── Advanced panel ─────────────────────────────────────────────────────────
  const [showAdvanced, setShowAdvanced]   = useState(false);
  const [offsetX,      setOffsetX]        = useState(0);
  const [offsetY,      setOffsetY]        = useState(0);
  const [rotation,     setRotation]       = useState(0);
  const [scale,        setScale]          = useState(1.0);

  // ── Before/After & Drag states ──────────────────────────────────────────────
  const [sliderPos, setSliderPos]         = useState(0.5);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);
  const [isDraggingJewelry, setIsDraggingJewelry] = useState(false);

  // ── Refs ────────────────────────────────────────────────────────────────────
  const fileInputRef       = useRef<HTMLInputElement>(null);
  const camInputRef        = useRef<HTMLInputElement>(null);
  const customJewelryRef   = useRef<HTMLInputElement>(null);
  const canvasRef          = useRef<HTMLCanvasElement>(null);
  const containerRef       = useRef<HTMLDivElement>(null);
  const dragStartRef       = useRef({ x: 0, y: 0, startOffsetX: 0, startOffsetY: 0 });

  // ── Load MediaPipe Hand Landmarker dynamically on mount ─────────────────────
  useEffect(() => {
    async function loadMediaPipe() {
      setIsModelLoading(true);
      try {
        const { FilesetResolver, HandLandmarker } = await import("@mediapipe/tasks-vision");
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.8/wasm"
        );
        const marker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
            delegate: "GPU",
          },
          runningMode: "IMAGE",
          numHands: 1,
        });
        setLandmarker(marker);
      } catch (err) {
        console.error("Failed to load MediaPipe Hand Landmarker:", err);
      } finally {
        setIsModelLoading(false);
      }
    }
    loadMediaPipe();
  }, []);

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

  // ── Handle custom jewelry upload ────────────────────────────────────────────
  function onCustomJewelryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/png")) {
      toast.error("Please upload a transparent PNG for the best try-on experience.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      const customItem: JewelryItem = {
        id: `custom-${Date.now()}`,
        name: file.name.replace(/\.[^/.]+$/, ""), // remove extension
        price: "Bespoke Design",
        category: category,
        src: dataUrl,
        description: "User-uploaded transparent accessory",
      };

      setCustomJewelry((prev) => ({
        ...prev,
        [category]: [...prev[category], customItem],
      }));
      setSelected(customItem);
      toast.success("Custom accessory loaded successfully!");
    };
    reader.readAsDataURL(file);
  }

  // ── Drag & drop handlers ───────────────────────────────────────────────────
  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) handleImageFile(f);
  }

  // ── Generate AI Try-On ─────────────────────────────────────────────────────
  const runGeneration = useCallback(async (imgUrl: string, item: JewelryItem) => {
    if (!imgUrl) return;
    setIsProcessing(true);
    setMsgIndex(0);
    setProgress(0);

    // Rotating messages
    const msgTimer = setInterval(() => {
      setMsgIndex((i) => (i + 1) % AI_MESSAGES.length);
    }, 700);

    // Progress bar animation
    const totalMs = 4000;
    const tick = 80;
    let elapsed = 0;
    const progTimer = setInterval(() => {
      elapsed += tick;
      setProgress(Math.min(95, Math.round((elapsed / totalMs) * 100)));
    }, tick);

    try {
      // Compress image first
      const compressed = await compressImage(imgUrl, 900);

      // Load image object to run MediaPipe on client side
      const tempImg = new window.Image();
      tempImg.crossOrigin = "anonymous";
      
      const mpResultPromise = new Promise<any>((resolve) => {
        tempImg.onload = () => {
          if (landmarker && item.category === "bracelet") {
            try {
              const mpData = landmarker.detect(tempImg);
              resolve(mpData);
            } catch (err) {
              console.error("MediaPipe detection error:", err);
              resolve(null);
            }
          } else {
            resolve(null);
          }
        };
        tempImg.onerror = () => resolve(null);
        tempImg.src = compressed;
      });

      // Run MediaPipe and standard vision detection concurrently
      const [mpData, apiRes] = await Promise.all([
        mpResultPromise,
        fetch("/api/try-on", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageBase64: compressed,
            jewelryType: item.category,
          }),
        }).then((res) => (res.ok ? res.json() : null)).catch(() => null),
      ]);

      clearInterval(msgTimer);
      clearInterval(progTimer);
      setProgress(100);

      // ── MediaPipe Hand Landmark Placement mapping ───────────────────────────
      if (item.category === "bracelet" && mpData && mpData.landmarks && mpData.landmarks.length > 0) {
        const hand = mpData.landmarks[0];
        const wrist = hand[0];
        const middleKnuckle = hand[9];
        const pinkyBase = hand[17];
        const indexBase = hand[5];

        // 1. Calculate wrist tilt angle (perpendicular to center hand axis)
        const dx = middleKnuckle.x - wrist.x;
        const dy = middleKnuckle.y - wrist.y;
        const handAngleRad = Math.atan2(dy, dx);
        const wristAngleDeg = ((handAngleRad + Math.PI / 2) * 180) / Math.PI;

        // 2. Estimate wrist width scale relative to hand scale
        const distPinky = Math.hypot(pinkyBase.x - wrist.x, pinkyBase.y - wrist.y);
        const distIndex = Math.hypot(indexBase.x - wrist.x, indexBase.y - wrist.y);
        const estimatedWristWidth = (distPinky + distIndex) * 0.76;

        // Place bracelet slightly above landmark 0 (wrist) towards the palm
        const wristCenterX = wrist.x + dx * 0.08;
        const wristCenterY = wrist.y + dy * 0.08;

        setPlacements([
          {
            x: wristCenterX,
            y: wristCenterY,
            width: estimatedWristWidth,
            rotation: wristAngleDeg,
          },
        ]);
        setDetectedCat("bracelet");
        toast.success("AI detected wrist perfectly!");
      } 
      // ── API Vision Fallback ────────────────────────────────────────────────
      else if (apiRes && apiRes.placements) {
        if (apiRes.category) {
          setDetectedCat(apiRes.category);
          if (apiRes.category !== item.category) {
            setCategory(apiRes.category);
            const baseCatList = JEWELRY_BY_CATEGORY[apiRes.category as JewelryCategory] || [];
            setSelected(baseCatList[0] || item);
          }
        }
        setPlacements(apiRes.placements);
      } 
      // ── Static Fallback ────────────────────────────────────────────────────
      else {
        setPlacements(PLACEMENT_DEFAULTS[item.category]);
        toast.info("Fallback placement applied.");
      }

      setPhase("result");
    } catch (err) {
      console.error(err);
      clearInterval(msgTimer);
      clearInterval(progTimer);
      setProgress(100);
      setPlacements(PLACEMENT_DEFAULTS[item.category]);
      setPhase("result");
      toast.error("Using default manual placement.");
    } finally {
      setIsProcessing(false);
    }
  }, [landmarker]);

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

  // ── Canvas draw (Volumetric 3D Cylinder Wrap Renderer) ──────────────────────
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

      // 1. Draw user background photo
      ctx.drawImage(userImg, 0, 0, canvas.width, canvas.height);

      // 2. Draw each jewelry piece
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

          // ── Volumetric Cylinder Wrap for Bracelet / Watch ─────────────────
          if (selected.category === "bracelet" || selected.category === "watch") {
            const N = 64; // number of vertical strips for smooth rendering
            const sW = jImg.width;
            const sH = jImg.height;
            const sliceSW = sW / N;

            // Perspective Curvature (creates elliptical cylinder illusion)
            const curvature = 0.22; 

            // A. Draw Curved Drop Shadow first
            ctx.save();
            ctx.shadowColor = "rgba(0, 0, 0, 0.42)";
            ctx.shadowBlur = 16;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 8;
            ctx.beginPath();
            for (let i = 0; i <= N; i++) {
              const r = i / N;
              const angle = -Math.PI / 2 + r * Math.PI;
              const x_proj = Math.sin(angle);
              const z_proj = Math.cos(angle);
              
              const sx = x_proj * (w / 2);
              const sy = (1 - z_proj) * curvature * (w / 2);
              
              if (i === 0) ctx.moveTo(sx, sy);
              else ctx.lineTo(sx, sy);
            }
            ctx.lineWidth = h * 0.95;
            ctx.strokeStyle = "rgba(0,0,0,0.55)";
            ctx.lineCap = "round";
            ctx.stroke();
            ctx.restore();

            // B. Draw Foreshortened Slices
            for (let i = 0; i < N; i++) {
              const r = i / N;
              const angle = -Math.PI / 2 + r * Math.PI;
              
              const x_proj = Math.sin(angle);
              const z_proj = Math.cos(angle); // Depth factor (1 at front center, 0 at sides)
              
              const sx = x_proj * (w / 2);
              const sy = (1 - z_proj) * curvature * (w / 2);
              
              // Squeeze slice horizontal width near the edges (foreshortening)
              const sliceW = (w / 2) * Math.cos(angle) * (Math.PI / N) * 1.08;
              
              // Scale height based on depth (closest is slightly thicker)
              const sliceH = h * (0.94 + 0.06 * z_proj);
              const sourceX = i * sliceSW;

              ctx.save();
              ctx.translate(sx, sy);
              
              ctx.globalAlpha = 0.98;
              ctx.drawImage(
                jImg,
                sourceX,
                0,
                sliceSW,
                sH,
                -sliceW / 2,
                -sliceH / 2,
                sliceW,
                sliceH
              );

              // C. Dynamic Side Shading (creates 3D volume/lighting)
              const sideFactor = 1 - z_proj; // 0 at center, 1 at edges
              if (sideFactor > 0.05) {
                ctx.fillStyle = `rgba(0, 0, 0, ${sideFactor * 0.45})`;
                ctx.globalCompositeOperation = "source-atop";
                ctx.fillRect(-sliceW / 2, -sliceH / 2, sliceW, sliceH);
              }

              ctx.restore();
            }
          } 
          // ── Flat Overlay (Necklaces / Earrings / Nosepins) ──────────────────
          else {
            ctx.shadowColor = "rgba(0,0,0,0.35)";
            ctx.shadowBlur  = 14;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 6;
            ctx.globalAlpha = 0.95;
            ctx.drawImage(jImg, -w / 2, -h / 2, w, h);
          }

          ctx.restore();
        });

        // 3. Before/After Split comparison slider
        if (sliderPos < 0.99) {
          const divX = canvas.width * sliderPos;

          // Clip left side with original background
          ctx.save();
          ctx.beginPath();
          ctx.rect(0, 0, divX, canvas.height);
          ctx.clip();
          ctx.drawImage(userImg, 0, 0, canvas.width, canvas.height);
          ctx.restore();

          // Divider bar
          ctx.save();
          ctx.strokeStyle = "#C8A96A";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(divX, 0);
          ctx.lineTo(divX, canvas.height);
          ctx.stroke();

          // Gold Handle circle
          ctx.beginPath();
          ctx.arc(divX, canvas.height / 2, 18, 0, Math.PI * 2);
          ctx.fillStyle = "#C8A96A";
          ctx.fill();
          ctx.strokeStyle = "#111";
          ctx.lineWidth = 1;
          ctx.stroke();
          
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

  // ── Drag & Swipe Interaction Manager ───────────────────────────────────────
  const getCoordinates = (clientX: number, clientY: number) => {
    if (!containerRef.current) return { x: 0, y: 0, width: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
      width: rect.width,
    };
  };

  const handleDragStart = (clientX: number, clientY: number) => {
    const coords = getCoordinates(clientX, clientY);
    const sliderLineX = coords.width * sliderPos;

    // A. Drag Before/After slider if cursor is close to the dividing line
    if (Math.abs(coords.x - sliderLineX) < 30) {
      setIsDraggingSlider(true);
    } 
    // B. Otherwise, drag-to-adjust jewelry coordinates directly
    else {
      setIsDraggingJewelry(true);
      dragStartRef.current = {
        x: clientX,
        y: clientY,
        startOffsetX: offsetX,
        startOffsetY: offsetY,
      };
    }
  };

  const handleDragMove = (clientX: number, clientY: number) => {
    if (isDraggingSlider) {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const pos = Math.max(0.01, Math.min(0.99, (clientX - rect.left) / rect.width));
      setSliderPos(pos);
    } else if (isDraggingJewelry) {
      const dx = clientX - dragStartRef.current.x;
      const dy = clientY - dragStartRef.current.y;
      setOffsetX(dragStartRef.current.startOffsetX + dx);
      setOffsetY(dragStartRef.current.startOffsetY + dy);
    }
  };

  const handleDragEnd = () => {
    setIsDraggingSlider(false);
    setIsDraggingJewelry(false);
  };

  function handleAddToCart() {
    const dbProd = getMappedDbProduct(selected);
    addToCart(dbProd);
    toast.success(`${dbProd.name} added to cart!`, {
      style: { background: "#111", color: "#C8A96A", border: "1px solid rgba(200,169,106,0.3)" },
    });
  }

  function handleBuyNow() {
    const dbProd = getMappedDbProduct(selected);
    addToCart(dbProd);
    router.push("/checkout");
  }

  function handleDownload() {
    const c = canvasRef.current;
    if (!c) return;
    const a = document.createElement("a");
    a.download = `luxella-fitting-${selected.name.toLowerCase().replace(/\s+/g, "-")}.png`;
    a.href = c.toDataURL("image/png");
    a.click();
  }

  function handleSave() {
    toast.success("Look saved to your Luxella Lookbook!", {
      style: { background: "#111", color: "#C8A96A", border: "1px solid rgba(200,169,106,0.3)" },
    });
  }

  const categoryItems = JEWELRY_BY_CATEGORY[category] || [];
  const customItemsForCategory = customJewelry[category] || [];
  const allItems = [...customItemsForCategory, ...categoryItems];

  return (
    <section
      style={{ background: "var(--bg-base)" }}
      className="min-h-screen py-14 px-4 md:px-8 relative"
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
            Upload a photo. Pick your jewelry. Our MediaPipe computer vision fits & wraps it naturally.
          </p>
        </div>

        {/* ── MODEL LOAD INDICATOR ────────────────────────────────────────── */}
        {isModelLoading && (
          <div className="max-w-sm mx-auto p-4 rounded-2xl border text-center flex items-center justify-center gap-3 bg-white/5 border-[#C8A96A]/20">
            <Loader2 className="animate-spin text-[#C8A96A]" size={16} />
            <span className="text-xs text-gray-300 font-bold uppercase tracking-wider">
              Caching MediaPipe hand-tracker WASM...
            </span>
          </div>
        )}

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

              <p className="text-[11px] text-gray-500 leading-relaxed px-2">
                💡 Try taking a picture of your wrist flat on a tabletop for the best bracelet tracking simulation.
              </p>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            PHASE: PICK JEWELRY
        ═══════════════════════════════════════════════════════════════════════ */}
        {phase === "pick" && (
          <div className="space-y-6">
            {/* Uploaded photo info banner */}
            <div
              className="flex items-center gap-4 rounded-2xl p-4 border"
              style={{ background: "var(--bg-elevated)", borderColor: "rgba(200,169,106,0.15)" }}
            >
              <div className="w-16 h-16 rounded-xl overflow-hidden border flex-shrink-0" style={{ borderColor: "rgba(200,169,106,0.2)" }}>
                <img src={userImage!} alt="Your photo" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm">Image Imported</p>
                <p className="text-gray-500 text-[11px] mt-0.5">MediaPipe is ready to analyze landmarks</p>
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
                      const baseCatList = JEWELRY_BY_CATEGORY[cat.key] || [];
                      const customCatList = customJewelry[cat.key] || [];
                      const totalList = [...customCatList, ...baseCatList];
                      setSelected(totalList[0] || baseCatList[0]);
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

            {/* Accessory Selector Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {/* Card 1: Custom upload button */}
              <div
                onClick={() => customJewelryRef.current?.click()}
                className="rounded-2xl p-4 text-center cursor-pointer transition-all duration-300 border border-dashed flex flex-col items-center justify-center gap-3 bg-white/5 border-[#C8A96A]/20 hover:border-[#C8A96A]/50"
              >
                <input
                  ref={customJewelryRef}
                  type="file"
                  accept="image/png"
                  className="hidden"
                  onChange={onCustomJewelryUpload}
                />
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#C8A96A]/10 border border-[#C8A96A]/20">
                  <ImageIcon size={20} style={{ color: "#C8A96A" }} />
                </div>
                <div>
                  <p className="text-white text-xs font-bold">Custom PNG</p>
                  <p className="text-[9px] text-gray-500 mt-0.5">Transparent bracelet</p>
                </div>
              </div>

              {/* Render items */}
              {allItems.map((item) => {
                const isActive = selected.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelected(item)}
                    className="rounded-2xl p-4 text-left cursor-pointer transition-all duration-300 border flex flex-col gap-3 relative"
                    style={{
                      background: isActive ? "rgba(200,169,106,0.08)" : "var(--bg-elevated)",
                      borderColor: isActive ? "#C8A96A" : "rgba(255,255,255,0.06)",
                    }}
                  >
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

                    <div>
                      <p className="text-white text-[12px] font-bold leading-tight truncate">{item.name}</p>
                      <p className="text-[11px] mt-0.5 font-semibold" style={{ color: "#C8A96A" }}>{item.price}</p>
                    </div>

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

            {/* Generate try on */}
            <button
              onClick={handleGenerate}
              className="w-full py-5 rounded-2xl font-bold text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 cursor-pointer transition-all duration-300 shadow-lg"
              style={{
                background: "linear-gradient(135deg,#C8A96A,#8B6914)",
                color: "#111",
                boxShadow: "0 8px 30px rgba(200,169,106,0.25)",
              }}
            >
              <Sparkles size={18} />
              Fit with MediaPipe Tracking
            </button>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            LOADING SCREEN
        ═══════════════════════════════════════════════════════════════════════ */}
        {isProcessing && (
          <div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 px-8 text-center"
            style={{ background: "rgba(8,8,8,0.97)" }}
          >
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
                className="absolute inset-0 m-auto animate-pulse"
                style={{ color: "#C8A96A" }}
              />
            </div>

            <div className="space-y-2 max-w-xs">
              <p
                key={msgIndex}
                className="text-white font-bold text-lg transition-all duration-500"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {AI_MESSAGES[msgIndex]}
              </p>
              <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold">
                Bespoke Fitting Room Engine
              </p>
            </div>

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

            <div className="flex items-center justify-between flex-wrap gap-3">
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider"
                style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)" }}
              >
                <Check size={13} />
                MediaPipe 3D Wrapped Rendered
              </div>
              {detectedCat && (
                <div
                  className="text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-xl"
                  style={{ background: "rgba(200,169,106,0.08)", color: "#C8A96A", border: "1px solid rgba(200,169,106,0.15)" }}
                >
                  Target: {detectedCat}
                </div>
              )}
            </div>

            {/* Interactive Canvas */}
            <div
              ref={containerRef}
              className="w-full rounded-3xl overflow-hidden relative border touch-none"
              style={{
                background: "var(--bg-elevated)",
                borderColor: "rgba(200,169,106,0.15)",
                minHeight: 320,
              }}
              onMouseDown={(e) => handleDragStart(e.clientX, e.clientY)}
              onMouseMove={(e) => handleDragMove(e.clientX, e.clientY)}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
              onTouchStart={(e) => handleDragStart(e.touches[0].clientX, e.touches[0].clientY)}
              onTouchMove={(e) => handleDragMove(e.touches[0].clientX, e.touches[0].clientY)}
              onTouchEnd={handleDragEnd}
            >
              <canvas
                ref={canvasRef}
                className="w-full h-auto block"
              />
            </div>

            <div className="flex justify-between text-[9px] text-gray-500 uppercase tracking-widest font-bold px-1 select-none">
              <span>← Slide to Reveal Original</span>
              <span className="text-[#C8A96A]">Drag Canvas to Move Jewelry</span>
              <span>Slide to See Fit →</span>
            </div>

            <input
              type="range"
              min="0.01"
              max="0.99"
              step="0.01"
              value={sliderPos}
              onChange={(e) => setSliderPos(parseFloat(e.target.value))}
              className="w-full cursor-ew-resize mt-2"
              style={{ accentColor: "#C8A96A" }}
            />

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
                <p className="text-[11px] mt-0.5 font-bold" style={{ color: "#C8A96A" }}>{selected.price}</p>
              </div>
            </div>

            {/* Action panel */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={handleSave}
                className="flex items-center justify-center gap-2 py-4 rounded-2xl text-[11px] font-bold uppercase tracking-wider cursor-pointer transition-all duration-300 border"
                style={{ borderColor: "rgba(255,255,255,0.08)", color: "#ccc", background: "rgba(255,255,255,0.03)" }}
              >
                <Heart size={14} /> Save Look
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 py-4 rounded-2xl text-[11px] font-bold uppercase tracking-wider cursor-pointer transition-all duration-300 border"
                style={{ borderColor: "rgba(255,255,255,0.08)", color: "#ccc", background: "rgba(255,255,255,0.03)" }}
              >
                <Download size={14} /> Download
              </button>
              <button
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-2 py-4 rounded-2xl text-[11px] font-bold uppercase tracking-wider cursor-pointer transition-all duration-300"
                style={{ background: "linear-gradient(135deg,#C8A96A,#8B6914)", color: "#111" }}
              >
                <ShoppingBag size={14} /> Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex items-center justify-center gap-2 py-4 rounded-2xl text-[11px] font-bold uppercase tracking-wider cursor-pointer transition-all duration-300 border"
                style={{ borderColor: "rgba(200,169,106,0.35)", color: "#C8A96A", background: "rgba(200,169,106,0.05)" }}
              >
                <CreditCard size={14} /> Buy Now
              </button>
            </div>

            <div className="flex items-center justify-center gap-6 pt-2">
              <button
                onClick={() => {
                  setPlacements(null);
                  setPhase("pick");
                }}
                className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest cursor-pointer transition-colors"
                style={{ color: "#C8A96A" }}
              >
                <RotateCw size={13} /> Try Another Accessory
              </button>
              <span className="text-gray-700">|</span>
              <button
                onClick={handleReset}
                className="text-[12px] font-bold uppercase tracking-widest text-gray-500 hover:text-white cursor-pointer transition-colors"
              >
                New Photo
              </button>
            </div>

            {/* Advanced adjustments panel */}
            <div
              className="rounded-2xl border overflow-hidden"
              style={{ borderColor: "rgba(255,255,255,0.06)" }}
            >
              <button
                onClick={() => setShowAdvanced((v) => !v)}
                className="w-full flex items-center justify-between px-5 py-4 text-[11px] uppercase tracking-widest font-bold cursor-pointer transition-colors"
                style={{ color: "#555", background: "rgba(255,255,255,0.02)" }}
              >
                <span>Nudge Adjustments</span>
                {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              {showAdvanced && (
                <div
                  className="px-5 pb-6 pt-2 space-y-5 border-t"
                  style={{ borderColor: "rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.015)" }}
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold" style={{ color: "#C8A96A" }}>
                      <Move size={11} /> Nudge Position
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between text-[10px] text-gray-500 mb-1.5">
                          <span>Left / Right</span>
                          <span style={{ color: "#C8A96A" }}>{offsetX > 0 ? "+" : ""}{offsetX}px</span>
                        </div>
                        <input type="range" min="-180" max="180" step="1" value={offsetX}
                          onChange={(e) => setOffsetX(parseInt(e.target.value))}
                          className="w-full" style={{ accentColor: "#C8A96A" }} />
                      </div>
                      <div>
                        <div className="flex justify-between text-[10px] text-gray-500 mb-1.5">
                          <span>Up / Down</span>
                          <span style={{ color: "#C8A96A" }}>{offsetY > 0 ? "+" : ""}{offsetY}px</span>
                        </div>
                        <input type="range" min="-180" max="180" step="1" value={offsetY}
                          onChange={(e) => setOffsetY(parseInt(e.target.value))}
                          className="w-full" style={{ accentColor: "#C8A96A" }} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold" style={{ color: "#C8A96A" }}>
                      <RotateCcw size={11} /> Twist Rotation
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-500 mb-1.5">
                      <span>Angle</span>
                      <span style={{ color: "#C8A96A" }}>{rotation}°</span>
                    </div>
                    <input type="range" min="-90" max="90" step="1" value={rotation}
                      onChange={(e) => setRotation(parseInt(e.target.value))}
                      className="w-full" style={{ accentColor: "#C8A96A" }} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold" style={{ color: "#C8A96A" }}>
                      <Maximize2 size={11} /> Resize Scale
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-500 mb-1.5">
                      <span>Size Scale</span>
                      <span style={{ color: "#C8A96A" }}>{Math.round(scale * 100)}%</span>
                    </div>
                    <input type="range" min="0.3" max="2.2" step="0.02" value={scale}
                      onChange={(e) => setScale(parseFloat(e.target.value))}
                      className="w-full" style={{ accentColor: "#C8A96A" }} />
                  </div>

                  <button
                    onClick={() => { setOffsetX(0); setOffsetY(0); setRotation(0); setScale(1.0); }}
                    className="text-[10px] uppercase tracking-widest font-bold cursor-pointer transition-colors text-gray-400 hover:text-white"
                  >
                    Reset to AI defaults
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
