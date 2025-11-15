import React, { useRef, useState, useEffect } from "react";
import { Undo2, Trash2, Save, PenTool, Circle, Square, Minus, Eraser } from "lucide-react";
import PatientInfor from "../components/PatientInfor";
import { useNavigate } from "react-router-dom";

export default function Draw() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [paths, setPaths] = useState([]);
  const [currentTool, setCurrentTool] = useState("pen");
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(2);
  const [tempImage, setTempImage] = useState(null);

  // initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.lineJoin = "round";
    setCtx(context);
  }, []);

  // start drawing
  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setStartPos({ x, y });
    setIsDrawing(true);

    if (currentTool === "pen" || currentTool === "eraser") {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }

    // save current canvas image for shape preview
    if (["line", "rect", "circle"].includes(currentTool)) {
      const snapshot = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
      setTempImage(snapshot);
    }
  };

  // drawing in progress
  const handleMouseMove = (e) => {
    if (!isDrawing) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = currentTool === "eraser" ? "#FFFFFF" : strokeColor;

    if (currentTool === "pen" || currentTool === "eraser") {
      ctx.lineTo(x, y);
      ctx.stroke();
    } else {
      ctx.putImageData(tempImage, 0, 0);
      ctx.beginPath();
      if (currentTool === "line") {
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(x, y);
      } else if (currentTool === "rect") {
        ctx.rect(startPos.x, startPos.y, x - startPos.x, y - startPos.y);
      } else if (currentTool === "circle") {
        const radius = Math.sqrt(
          Math.pow(x - startPos.x, 2) + Math.pow(y - startPos.y, 2)
        );
        ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
      }
      ctx.stroke();
    }
  };

  // stop drawing
  const handleMouseUp = () => {
    if (isDrawing) {
      const snapshot = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
      setPaths([...paths, snapshot]);
    }
    setIsDrawing(false);
  };

  // Undo
  const handleUndo = () => {
    if (paths.length === 0) return;
    const newPaths = paths.slice(0, -1);
    setPaths(newPaths);
    ctx.putImageData(newPaths[newPaths.length - 1], 0, 0);
  };

  // Clear all
  const clearCanvas = () => {
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setPaths([]);
  };

  // Save as image
  const saveDrawing = () => {
    const image = canvasRef.current.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = `EyeDrawing_${new Date().toISOString()}.png`;
    link.click();
  };

  const tools = [
    { name: "pen", icon: <PenTool size={18} />, label: "Pen" },
    { name: "line", icon: <Minus size={18} />, label: "Line" },
    { name: "rect", icon: <Square size={18} />, label: "Rect" },
    { name: "circle", icon: <Circle size={18} />, label: "Circle" },
    { name: "eraser", icon: <Eraser size={18} />, label: "Eraser" },
  ];

  const tabs = [
    { label: "Readings", path: "/Reading" },
    { label: "Examination", path: "/examinationDoc" },
    { label: "Case History", path: "/CaseHistory" },
    { label: "Draw", path: "/Draw" },
  ];

  return (
    <div className="max-w-8xl mx-auto p-6 space-y-6">
      <PatientInfor />

      {/* Tabs */}
      <div className="flex gap-4 mb-6 justify-start">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => navigate(tab.path)}
            className={`px-10 py-3 rounded-full  font-medium ${
              tab.label === "Draw"
                ? "bg-[#F7DACD] "
                : " border-2 border-gray-500  hover:bg-[#F7DACD] "
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Drawing Panel */}
      <div className="p-6  rounded-2xl  space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">Draw History</h2>

        <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
          {/* Tools */}
          <div className="flex items-center gap-3">
            {tools.map((tool) => (
              <button
                key={tool.name}
                onClick={() => setCurrentTool(tool.name)}
                className={`flex items-center gap-1 px-3 py-2 rounded-md border ${
                  currentTool === tool.name
                    ? "bg-red-200 "
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                {tool.icon} <span className="text-sm">{tool.label}</span>
              </button>
            ))}
          </div>

          {/* Color and Line Width */}
          <div className="flex items-center gap-4">
            <label className="text-sm text-gray-700">Color:</label>
            <input
              type="color"
              value={strokeColor}
              onChange={(e) => setStrokeColor(e.target.value)}
              className="w-10 h-10 border rounded"
            />

            <label className="text-sm text-gray-700">Width:</label>
            <input
              type="range"
              min="1"
              max="15"
              value={lineWidth}
              onChange={(e) => setLineWidth(Number(e.target.value))}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleUndo}
              className="px-3 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 flex items-center"
            >
              <Undo2 size={18} className="mr-1" /> Undo
            </button>

            <button
              onClick={clearCanvas}
              className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center"
            >
              <Trash2 size={18} className="mr-1" /> Clear
            </button>

            <button
              onClick={saveDrawing}
              className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
            >
              <Save size={18} className="mr-1" /> Save
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex justify-center">
          <canvas
            ref={canvasRef}
            width={1000}
            height={600}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="border border-gray-400 rounded-xl bg-white shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}
