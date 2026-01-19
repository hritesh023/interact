"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { 
  RotateCw, 
  RotateCcw, 
  Crop, 
  Maximize2, 
  Minimize2, 
  Download, 
  Upload,
  Sun,
  Contrast,
  Palette,
  Move,
  Scissors,
  Check,
  X,
  RefreshCw,
  Save,
  Trash2,
  Zap,
  Eye,
  EyeOff,
  Sliders
} from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

interface ImageEditorProps {
  imageUrl: string;
  onImageEdited: (editedImageUrl: string) => void;
  onClose: () => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ imageUrl, onImageEdited, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Edit states
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [blur, setBlur] = useState(0);
  const [hue, setHue] = useState(0);
  const [grayscale, setGrayscale] = useState(0);
  const [sepia, setSepia] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  // Crop states
  const [cropMode, setCropMode] = useState(false);
  const [cropStart, setCropStart] = useState({ x: 0, y: 0 });
  const [cropEnd, setCropEnd] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setOriginalImage(img);
      drawCanvas();
    };
    img.onerror = () => {
      showError('Failed to load image');
      onClose();
    };
    img.src = imageUrl;
  }, [imageUrl]);

  const drawCanvas = () => {
    if (!canvasRef.current || !imageRef.current || !originalImage) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = originalImage.width;
    canvas.height = originalImage.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply filters
    const filters = [
      `brightness(${brightness}%)`,
      `contrast(${contrast}%)`,
      `saturate(${saturation}%)`,
      `blur(${blur}px)`,
      `hue-rotate(${hue}deg)`,
      `grayscale(${grayscale}%)`,
      `sepia(${sepia}%)`
    ];
    ctx.filter = filters.join(' ');

    // Save context state
    ctx.save();

    // Apply transformations
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(scale, scale);

    // Draw image
    ctx.drawImage(
      originalImage,
      -originalImage.width / 2,
      -originalImage.height / 2,
      originalImage.width,
      originalImage.height
    );

    // Restore context state
    ctx.restore();

    // Draw crop overlay if in crop mode
    if (cropMode) {
      drawCropOverlay(ctx, canvas.width, canvas.height);
    }
  };

  const drawCropOverlay = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, width, height);

    // Clear the crop area
    ctx.globalCompositeOperation = 'destination-out';
    const cropWidth = Math.abs(cropEnd.x - cropStart.x);
    const cropHeight = Math.abs(cropEnd.y - cropStart.y);
    const cropX = Math.min(cropStart.x, cropEnd.x);
    const cropY = Math.min(cropStart.y, cropEnd.y);
    ctx.fillRect(cropX, cropY, cropWidth, cropHeight);

    // Draw crop border
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(cropX, cropY, cropWidth, cropHeight);
    ctx.restore();
  };

  const handleRotate = (direction: 'cw' | 'ccw') => {
    const newRotation = direction === 'cw' ? rotation + 90 : rotation - 90;
    setRotation(newRotation % 360);
    setTimeout(drawCanvas, 0);
  };

  const handleScale = (newScale: number[]) => {
    setScale(newScale[0] / 100);
    setTimeout(drawCanvas, 0);
  };

  const handleBrightness = (value: number[]) => {
    setBrightness(value[0]);
    setTimeout(drawCanvas, 0);
  };

  const handleContrast = (value: number[]) => {
    setContrast(value[0]);
    setTimeout(drawCanvas, 0);
  };

  const handleSaturation = (value: number[]) => {
    setSaturation(value[0]);
    setTimeout(drawCanvas, 0);
  };

  const handleBlur = (value: number[]) => {
    setBlur(value[0]);
    setTimeout(drawCanvas, 0);
  };

  const handleHue = (value: number[]) => {
    setHue(value[0]);
    setTimeout(drawCanvas, 0);
  };

  const handleGrayscale = (value: number[]) => {
    setGrayscale(value[0]);
    setTimeout(drawCanvas, 0);
  };

  const handleSepia = (value: number[]) => {
    setSepia(value[0]);
    setTimeout(drawCanvas, 0);
  };

  const applyQuickFilter = (filterType: string) => {
    switch (filterType) {
      case 'vintage':
        setBrightness(110);
        setContrast(90);
        setSaturation(80);
        setSepia(30);
        break;
      case 'dramatic':
        setBrightness(90);
        setContrast(140);
        setSaturation(120);
        setGrayscale(0);
        setSepia(0);
        break;
      case 'blackwhite':
        setBrightness(100);
        setContrast(110);
        setGrayscale(100);
        setSaturation(0);
        break;
      case 'vivid':
        setBrightness(105);
        setContrast(120);
        setSaturation(150);
        setGrayscale(0);
        setSepia(0);
        break;
      case 'dreamy':
        setBrightness(115);
        setContrast(85);
        setSaturation(90);
        setBlur(1);
        break;
    }
    setTimeout(drawCanvas, 100);
    showSuccess(`${filterType.charAt(0).toUpperCase() + filterType.slice(1)} filter applied!`);
  };

  const resetEdits = () => {
    setRotation(0);
    setScale(1);
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setBlur(0);
    setHue(0);
    setGrayscale(0);
    setSepia(0);
    setCropMode(false);
    setCropStart({ x: 0, y: 0 });
    setCropEnd({ x: 0, y: 0 });
    setTimeout(drawCanvas, 0);
    showSuccess('All edits reset!');
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const saveImage = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const editedImageUrl = canvas.toDataURL('image/png');
    onImageEdited(editedImageUrl);
    showSuccess('Image saved successfully!');
    onClose();
  };

  const handleCropStart = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!cropMode) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    setCropStart({
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    });
    setCropEnd({
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    });
    setIsDragging(true);
  };

  const handleCropMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!cropMode || !isDragging) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    setCropEnd({
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    });
    drawCanvas();
  };

  const handleCropEnd = () => {
    setIsDragging(false);
  };

  const applyCrop = () => {
    if (!canvasRef.current || !originalImage) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cropWidth = Math.abs(cropEnd.x - cropStart.x);
    const cropHeight = Math.abs(cropEnd.y - cropStart.y);
    const cropX = Math.min(cropStart.x, cropEnd.x);
    const cropY = Math.min(cropStart.y, cropEnd.y);

    // Create temporary canvas for cropped image
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = cropWidth;
    tempCanvas.height = cropHeight;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    // Draw cropped portion
    tempCtx.drawImage(
      canvas,
      cropX, cropY, cropWidth, cropHeight,
      0, 0, cropWidth, cropHeight
    );

    // Convert to data URL
    const croppedImageUrl = tempCanvas.toDataURL('image/png');
    
    // Update the main image
    const img = new Image();
    img.onload = () => {
      setOriginalImage(img);
      setCropMode(false);
      drawCanvas();
      showSuccess('Image cropped successfully!');
    };
    img.src = croppedImageUrl;
  };

  const discardChanges = () => {
    showSuccess('Changes discarded');
    onClose();
  };

  const downloadImage = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `edited-image-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
    showSuccess('Image downloaded!');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Image Editor
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={resetEdits}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Reset
            </Button>
            <Button variant="outline" size="sm" onClick={downloadImage}>
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="h-4 w-4 mr-1" />
              Escape
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Canvas Area */}
            <div className="lg:col-span-2">
              <div className="bg-muted rounded-lg p-4 flex items-center justify-center min-h-[400px]">
                <canvas
                  ref={canvasRef}
                  className="max-w-full max-h-[500px] cursor-crosshair"
                  onMouseDown={handleCropStart}
                  onMouseMove={handleCropMove}
                  onMouseUp={handleCropEnd}
                  onMouseLeave={handleCropEnd}
                />
                <img
                  ref={imageRef}
                  src={imageUrl}
                  alt="Original"
                  className="hidden"
                />
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-4">
              {/* Transform Controls */}
              <div className="space-y-3">
                <h3 className="font-medium flex items-center gap-2">
                  <Move className="h-4 w-4" />
                  Transform
                </h3>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Rotation</label>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleRotate('ccw')}>
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleRotate('cw')}>
                      <RotateCw className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground self-center">{rotation}°</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Scale</label>
                  <Slider
                    value={[scale * 100]}
                    onValueChange={handleScale}
                    min={50}
                    max={200}
                    step={1}
                    className="w-full"
                  />
                  <span className="text-sm text-muted-foreground">{Math.round(scale * 100)}%</span>
                </div>
              </div>

              {/* Quick Filters */}
              <div className="space-y-3">
                <h3 className="font-medium flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Quick Filters
                </h3>
                
                <div className="grid grid-cols-2 gap-2">
                  {['vintage', 'dramatic', 'blackwhite', 'vivid', 'dreamy'].map((filter) => (
                    <Button
                      key={filter}
                      variant="outline"
                      size="sm"
                      onClick={() => applyQuickFilter(filter)}
                      className="text-xs"
                    >
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Filter Controls */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium flex items-center gap-2">
                    <Sun className="h-4 w-4" />
                    Filters
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="text-xs"
                  >
                    {showAdvanced ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    {showAdvanced ? 'Basic' : 'Advanced'}
                  </Button>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Brightness</label>
                  <Slider
                    value={[brightness]}
                    onValueChange={handleBrightness}
                    min={0}
                    max={200}
                    step={1}
                    className="w-full"
                  />
                  <span className="text-sm text-muted-foreground">{brightness}%</span>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Contrast</label>
                  <Slider
                    value={[contrast]}
                    onValueChange={handleContrast}
                    min={0}
                    max={200}
                    step={1}
                    className="w-full"
                  />
                  <span className="text-sm text-muted-foreground">{contrast}%</span>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Saturation</label>
                  <Slider
                    value={[saturation]}
                    onValueChange={handleSaturation}
                    min={0}
                    max={200}
                    step={1}
                    className="w-full"
                  />
                  <span className="text-sm text-muted-foreground">{saturation}%</span>
                </div>

                {showAdvanced && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Blur</label>
                      <Slider
                        value={[blur]}
                        onValueChange={handleBlur}
                        min={0}
                        max={10}
                        step={0.5}
                        className="w-full"
                      />
                      <span className="text-sm text-muted-foreground">{blur}px</span>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Hue Rotate</label>
                      <Slider
                        value={[hue]}
                        onValueChange={handleHue}
                        min={0}
                        max={360}
                        step={1}
                        className="w-full"
                      />
                      <span className="text-sm text-muted-foreground">{hue}°</span>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Grayscale</label>
                      <Slider
                        value={[grayscale]}
                        onValueChange={handleGrayscale}
                        min={0}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                      <span className="text-sm text-muted-foreground">{grayscale}%</span>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Sepia</label>
                      <Slider
                        value={[sepia]}
                        onValueChange={handleSepia}
                        min={0}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                      <span className="text-sm text-muted-foreground">{sepia}%</span>
                    </div>
                  </>
                )}
              </div>

              {/* Crop Controls */}
              <div className="space-y-3">
                <h3 className="font-medium flex items-center gap-2">
                  <Scissors className="h-4 w-4" />
                  Crop
                </h3>
                
                <Button
                  variant={cropMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCropMode(!cropMode)}
                  className="w-full"
                >
                  {cropMode ? (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      Crop Mode On
                    </>
                  ) : (
                    <>
                      <Crop className="h-4 w-4 mr-1" />
                      Enable Crop
                    </>
                  )}
                </Button>

                {cropMode && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={applyCrop}
                    className="w-full"
                  >
                    <Scissors className="h-4 w-4 mr-1" />
                    Apply Crop
                  </Button>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-4 border-t">
                <Button onClick={saveImage} className="w-full">
                  <Save className="h-4 w-4 mr-1" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={discardChanges} className="w-full">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Discard Changes
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageEditor;
