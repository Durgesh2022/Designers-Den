"use client";
import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { fabric } from "fabric";
import {
  Pen,
  Type,
  Eraser,
  Circle,
  Square,
  ImagePlus,
  Palette,
} from "lucide-react";

interface Tool {
  name: string;
  icon: React.ReactNode;
}

const ClothingEditor: React.FC = () => {
  const canvasRef = useRef<fabric.Canvas | null>(null);
  const [activeTab, setActiveTab] = useState("front");
  const [activeColor, setActiveColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [activeTool, setActiveTool] = useState<string>("pen");

  const tools: Tool[] = [
    { name: "pen", icon: <Pen className="w-5 h-5" /> },
    { name: "text", icon: <Type className="w-5 h-5" /> },
    { name: "eraser", icon: <Eraser className="w-5 h-5" /> },
    { name: "circle", icon: <Circle className="w-5 h-5" /> },
    { name: "rectangle", icon: <Square className="w-5 h-5" /> },
    { name: "image", icon: <ImagePlus className="w-5 h-5" /> },
    { name: "fill", icon: <Palette className="w-5 h-5" /> },
  ];

  useEffect(() => {
    if (typeof window !== "undefined") {
      const canvas = new fabric.Canvas("clothingCanvas", {
        width: window.innerWidth * 0.7,
        height: window.innerHeight * 0.8,
        backgroundColor: "#ffffff",
      });
      canvasRef.current = canvas;

      loadTshirtOutline(activeTab);

      const handleResize = () => {
        canvas.setDimensions({
          width: window.innerWidth * 0.7,
          height: window.innerHeight * 0.8,
        });
        loadTshirtOutline(activeTab);
      };

      window.addEventListener("resize", handleResize);

      return () => {
        canvas.dispose();
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [activeTab]);

  const loadTshirtOutline = (view: string) => {
    const outlineUrl =
      view === "front"
        ? "/images/front.svg"
        : "/images/back.svg";

    fabric.loadSVGFromURL(outlineUrl, (objects, options) => {
      const tshirtOutline = fabric.util.groupSVGElements(objects, options);
      canvasRef.current?.clear();
      tshirtOutline.set({
        selectable: false,
        evented: false,
        stroke: "#6b46c1",
        strokeWidth: 2,
      });
      canvasRef.current?.add(tshirtOutline);
      canvasRef.current?.centerObject(tshirtOutline);
    });
  };

  const handleToolClick = (toolName: string) => {
    setActiveTool(toolName);

    if (canvasRef.current) {
      canvasRef.current.isDrawingMode = false;

      if (toolName === "pen") {
        canvasRef.current.isDrawingMode = true;
        canvasRef.current.freeDrawingBrush.color = activeColor;
        canvasRef.current.freeDrawingBrush.width = brushSize;
      } else if (toolName === "eraser") {
        canvasRef.current.isDrawingMode = true;
        canvasRef.current.freeDrawingBrush.color = "#ffffff";
        canvasRef.current.freeDrawingBrush.width = brushSize * 2;
      } else if (toolName === "text") {
        const text = new fabric.IText("Enter text", {
          left: canvasRef.current.width! / 2,
          top: canvasRef.current.height! / 2,
          fill: activeColor,
          fontFamily: fontFamily,
          fontSize: 20,
        });
        canvasRef.current.add(text);
        canvasRef.current.setActiveObject(text);
      } else if (toolName === "circle") {
        const circle = new fabric.Circle({
          radius: 50,
          fill: "transparent",
          stroke: activeColor,
          strokeWidth: brushSize,
          left: canvasRef.current.width! / 2 - 50,
          top: canvasRef.current.height! / 2 - 50,
        });
        canvasRef.current.add(circle);
      } else if (toolName === "rectangle") {
        const rectangle = new fabric.Rect({
          width: 100,
          height: 50,
          fill: "transparent",
          stroke: activeColor,
          strokeWidth: brushSize,
          left: canvasRef.current.width! / 2 - 50,
          top: canvasRef.current.height! / 2 - 25,
        });
        canvasRef.current.add(rectangle);
      } else if (toolName === "image") {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = (event: Event) => {
          const file = (event.target as HTMLInputElement).files![0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              fabric.Image.fromURL(e.target?.result as string, (img) => {
                if (canvasRef.current) {
                  img.set({
                    left: canvasRef.current.width! / 2 - img.width! / 2,
                    top: canvasRef.current.height! / 2 - img.height! / 2,
                  });
                  canvasRef.current.add(img);
                }
              });
            };
            reader.readAsDataURL(file);
          }
        };
        input.click();
      } else if (toolName === "fill") {
        canvasRef.current.backgroundColor = activeColor;
        canvasRef.current.renderAll();
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-6">
        {/* Top Navigation */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-purple-700">Designers Den</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("front")}
              className={`px-4 py-2 rounded-lg ${
                activeTab === "front"
                  ? "bg-purple-600 text-white"
                  : "bg-purple-100 text-purple-600"
              }`}
            >
              Front View
            </button>
            <button
              onClick={() => setActiveTab("back")}
              className={`px-4 py-2 rounded-lg ${
                activeTab === "back"
                  ? "bg-purple-600 text-white"
                  : "bg-purple-100 text-purple-600"
              }`}
            >
              Back View
            </button>
          </div>
        </div>

        {/* Tools Navigation */}
        <div className="fixed left-4 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-lg shadow-lg">
          <div className="flex flex-col gap-4">
            {tools.map((tool) => (
              <button
                key={tool.name}
                onClick={() => handleToolClick(tool.name)}
                className={`p-2 rounded-lg ${
                  activeTool === tool.name
                    ? "bg-purple-600 text-white"
                    : "bg-purple-100 text-purple-600"
                }`}
              >
                {tool.icon}
              </button>
            ))}
          </div>
        </div>

        {/* Canvas Container */}
        <div className="flex justify-center">
          <canvas
            id="clothingCanvas"
            className="border border-purple-200 rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(ClothingEditor), { ssr: false });