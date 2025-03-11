import React, { useState, useRef } from 'react';
import { Download, Palette, Edit, Undo, Redo, Save, Image, Trash2, Type, ArrowLeft, ArrowRight } from 'lucide-react';

// Mock data for shirt colors
const shirtColors = [
  { name: 'White', value: '#FFFFFF' },
  { name: 'Black', value: '#000000' },
  { name: 'Navy Blue', value: '#0A1172' },
  { name: 'Red', value: '#CB0000' },
  { name: 'Green', value: '#008631' },
  { name: 'Yellow', value: '#FFD700' },
  { name: 'Purple', value: '#800080' },
  { name: 'Gray', value: '#808080' },
  { name: 'Pink', value: '#FFC0CB' },
  { name: 'Orange', value: '#FFA500' },
  { name: 'Brown', value: '#8B4513' },
  { name: 'Teal', value: '#008080' }
];

// Mock design elements
const designElements = [
  { id: 'design1', name: 'Simple Logo', src: '/api/placeholder/100/100' },
  { id: 'design2', name: 'Stripes', src: '/api/placeholder/100/100' },
  { id: 'design3', name: 'Pattern 1', src: '/api/placeholder/100/100' },
  { id: 'design4', name: 'Pattern 2', src: '/api/placeholder/100/100' },
  { id: 'design5', name: 'Abstract', src: '/api/placeholder/100/100' },
  { id: 'design6', name: 'Geometric', src: '/api/placeholder/100/100' }
];

// Available shirt styles
const shirtStyles = [
  { id: 'tshirt', name: 'T-Shirt' },
  { id: 'polo', name: 'Polo' },
  { id: 'hoodie', name: 'Hoodie' }
];

const ShirtDesignCanvas = () => {
  const [shirtColor, setShirtColor] = useState(shirtColors[0].value);
  const [shirtStyle, setShirtStyle] = useState(shirtStyles[0].id);
  const [designs, setDesigns] = useState([]);
  const [activeDesign, setActiveDesign] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [activeTab, setActiveTab] = useState('colors');
  const [text, setText] = useState('');
  
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const textInputRef = useRef(null);

  // Add a design element to the shirt
  const addDesign = (design) => {
    const newDesign = {
      id: `placed-${design.id}-${Date.now()}`,
      src: design.src,
      name: design.name,
      x: 150,
      y: 150,
      width: 100,
      height: 100,
      rotation: 0,
      scale: 1,
      type: 'image'
    };
    
    const newDesigns = [...designs, newDesign];
    setDesigns(newDesigns);
    setActiveDesign(newDesign.id);
    
    addToHistory(newDesigns);
  };

  // Add text to the design
  const addText = () => {
    if (!text.trim()) return;
    
    const newText = {
      id: `text-${Date.now()}`,
      content: text,
      name: 'Text Element',
      x: 150,
      y: 150,
      width: 150,
      height: 50,
      rotation: 0,
      scale: 1,
      type: 'text',
      fontSize: 24,
      fontFamily: 'Arial',
      color: '#000000'
    };
    
    const newDesigns = [...designs, newText];
    setDesigns(newDesigns);
    setActiveDesign(newText.id);
    setText('');
    
    addToHistory(newDesigns);
  };

  // Add to history
  const addToHistory = (newDesigns) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newDesigns);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Handle design selection
  const handleDesignSelect = (designId) => {
    setActiveDesign(designId === activeDesign ? null : designId);
  };

  // Handle mouse down on design
  const handleMouseDown = (e, designId) => {
    if (designId !== activeDesign) {
      setActiveDesign(designId);
    }
    
    const design = designs.find(d => d.id === designId);
    if (design) {
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const offsetX = e.clientX - canvasRect.left - design.x;
      const offsetY = e.clientY - canvasRect.top - design.y;
      setDragOffset({ x: offsetX, y: offsetY });
      setIsDragging(true);
      e.stopPropagation();
    }
  };

  // Handle mouse move
  const handleMouseMove = (e) => {
    if (isDragging && activeDesign) {
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - canvasRect.left - dragOffset.x;
      const y = e.clientY - canvasRect.top - dragOffset.y;
      
      const newDesigns = designs.map(design => 
        design.id === activeDesign 
          ? { ...design, x, y } 
          : design
      );
      
      setDesigns(newDesigns);
    }
  };

  // Handle mouse up
  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      addToHistory([...designs]);
    }
  };

  // Handle canvas click (deselect)
  const handleCanvasClick = () => {
    setActiveDesign(null);
  };

  // Upload custom image
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newDesign = {
          id: `custom-${Date.now()}`,
          src: e.target.result,
          name: 'Custom Image',
          x: 150,
          y: 150,
          width: 100,
          height: 100,
          rotation: 0,
          scale: 1,
          type: 'image'
        };
        
        const newDesigns = [...designs, newDesign];
        setDesigns(newDesigns);
        setActiveDesign(newDesign.id);
        
        addToHistory(newDesigns);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle undo
  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setDesigns(history[historyIndex - 1]);
    }
  };

  // Handle redo
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setDesigns(history[historyIndex + 1]);
    }
  };

  // Delete active design
  const deleteActiveDesign = () => {
    if (activeDesign) {
      const newDesigns = designs.filter(design => design.id !== activeDesign);
      setDesigns(newDesigns);
      setActiveDesign(null);
      
      addToHistory(newDesigns);
    }
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e) => {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      if (document.activeElement === textInputRef.current) return;
      deleteActiveDesign();
    } else if (e.ctrlKey || e.metaKey) {
      if (e.key === 'z') {
        e.preventDefault();
        handleUndo();
      } else if (e.key === 'y' || (e.shiftKey && e.key === 'z')) {
        e.preventDefault();
        handleRedo();
      }
    }
  };

  // Bring design forward
  const bringForward = () => {
    if (!activeDesign) return;
    
    const activeIndex = designs.findIndex(d => d.id === activeDesign);
    if (activeIndex < designs.length - 1) {
      const newDesigns = [...designs];
      const temp = newDesigns[activeIndex];
      newDesigns[activeIndex] = newDesigns[activeIndex + 1];
      newDesigns[activeIndex + 1] = temp;
      setDesigns(newDesigns);
      addToHistory(newDesigns);
    }
  };

  // Send design backward
  const sendBackward = () => {
    if (!activeDesign) return;
    
    const activeIndex = designs.findIndex(d => d.id === activeDesign);
    if (activeIndex > 0) {
      const newDesigns = [...designs];
      const temp = newDesigns[activeIndex];
      newDesigns[activeIndex] = newDesigns[activeIndex - 1];
      newDesigns[activeIndex - 1] = temp;
      setDesigns(newDesigns);
      addToHistory(newDesigns);
    }
  };

  // Mock function to export design
  const exportDesign = () => {
    alert('Design saved! In a real application, this would generate an image or save to a database.');
  };

  // Get the active design object
  const activeDesignObj = activeDesign ? designs.find(d => d.id === activeDesign) : null;

  return (
    <div 
      className="w-full h-screen flex flex-col"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Top Navbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">Shirt Designer</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            className="py-2 px-4 bg-gray-100 text-gray-700 rounded flex items-center justify-center hover:bg-gray-200 disabled:opacity-50"
            onClick={handleUndo}
            disabled={historyIndex <= 0}
          >
            <Undo className="w-4 h-4" />
          </button>
          <button 
            className="py-2 px-4 bg-gray-100 text-gray-700 rounded flex items-center justify-center hover:bg-gray-200 disabled:opacity-50"
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
          >
            <Redo className="w-4 h-4" />
          </button>
          <button 
            className="py-2 px-4 bg-blue-600 text-white rounded font-medium flex items-center justify-center hover:bg-blue-700"
            onClick={exportDesign}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Design
          </button>
        </div>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        {/* Left Canvas */}
        <div className="flex-1 bg-gray-100 p-8 flex items-center justify-center overflow-auto">
          <div 
            ref={canvasRef}
            className="relative w-96 h-96 bg-white rounded-lg shadow-lg"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={handleCanvasClick}
          >
            {/* Shirt Background */}
            <div 
              className="absolute inset-0 flex items-center justify-center"
            >
              <svg 
                viewBox="0 0 300 400" 
                className="w-full h-full"
              >
                {/* Basic T-shirt shape */}
                {shirtStyle === 'tshirt' && (
                  <>
                    <path 
                      d="M75,50 L125,20 L175,20 L225,50 L260,80 L240,120 L220,100 L220,350 L80,350 L80,100 L60,120 L40,80 Z" 
                      fill={shirtColor} 
                      stroke="#ddd" 
                      strokeWidth="2"
                    />
                    <path 
                      d="M125,20 L150,40 L175,20" 
                      fill="none" 
                      stroke="#ddd" 
                      strokeWidth="2"
                    />
                  </>
                )}
                
                {/* Polo shirt shape */}
                {shirtStyle === 'polo' && (
                  <>
                    <path 
                      d="M75,50 L125,20 L175,20 L225,50 L260,80 L240,120 L220,100 L220,350 L80,350 L80,100 L60,120 L40,80 Z" 
                      fill={shirtColor} 
                      stroke="#ddd" 
                      strokeWidth="2"
                    />
                    <path 
                      d="M125,20 L150,80 L175,20" 
                      fill={shirtColor} 
                      stroke="#ddd" 
                      strokeWidth="2"
                    />
                    <path 
                      d="M140,20 L150,70 L160,20" 
                      fill="#fff" 
                      stroke="#ddd" 
                      strokeWidth="1"
                    />
                    <circle cx="150" cy="50" r="5" fill="#ddd" />
                    <circle cx="150" cy="70" r="5" fill="#ddd" />
                  </>
                )}
                
                {/* Hoodie shape */}
                {shirtStyle === 'hoodie' && (
                  <>
                    <path 
                      d="M75,70 L125,40 L175,40 L225,70 L260,100 L240,140 L220,120 L220,350 L80,350 L80,120 L60,140 L40,100 Z" 
                      fill={shirtColor} 
                      stroke="#ddd" 
                      strokeWidth="2"
                    />
                    <path 
                      d="M125,40 C135,10 165,10 175,40" 
                      fill={shirtColor} 
                      stroke="#ddd" 
                      strokeWidth="2"
                    />
                    <path 
                      d="M115,60 C110,40 140,20 150,40 C160,20 190,40 185,60" 
                      fill={shirtColor} 
                      stroke="#ddd" 
                      strokeWidth="2"
                    />
                  </>
                )}
              </svg>
            </div>
            
            {/* Design Elements */}
            {designs.map((design) => (
              <div
                key={design.id}
                className={`absolute cursor-move ${activeDesign === design.id ? 'ring-2 ring-blue-500' : ''}`}
                style={{
                  left: `${design.x}px`,
                  top: `${design.y}px`,
                  width: `${design.width}px`,
                  height: `${design.height}px`,
                  transform: `rotate(${design.rotation}deg) scale(${design.scale})`,
                  zIndex: designs.indexOf(design) + 1,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDesignSelect(design.id);
                }}
                onMouseDown={(e) => handleMouseDown(e, design.id)}
              >
                {design.type === 'image' ? (
                  <img
                    src={design.src}
                    alt={design.name}
                    className="w-full h-full object-contain"
                    draggable="false"
                  />
                ) : (
                  <div 
                    className="w-full h-full flex items-center justify-center"
                    style={{
                      fontSize: `${design.fontSize}px`,
                      fontFamily: design.fontFamily,
                      color: design.color
                    }}
                  >
                    {design.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Right Sidebar */}
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button 
              className={`flex-1 py-3 font-medium text-sm ${activeTab === 'shirt' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('shirt')}
            >
              Shirt
            </button>
            <button 
              className={`flex-1 py-3 font-medium text-sm ${activeTab === 'colors' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('colors')}
            >
              Colors
            </button>
            <button 
              className={`flex-1 py-3 font-medium text-sm ${activeTab === 'designs' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('designs')}
            >
              Designs
            </button>
            <button 
              className={`flex-1 py-3 font-medium text-sm ${activeTab === 'text' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('text')}
            >
              Text
            </button>
          </div>
          
          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Shirt Styles Tab */}
            {activeTab === 'shirt' && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Shirt Style</h3>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {shirtStyles.map((style) => (
                    <button
                      key={style.id}
                      className={`p-2 text-center border rounded ${shirtStyle === style.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                      onClick={() => setShirtStyle(style.id)}
                    >
                      <div className="w-full aspect-square bg-gray-100 flex items-center justify-center mb-1">
                        {/* Simplified icon representations */}
                        {style.id === 'tshirt' && <span className="text-2xl">👕</span>}
                        {style.id === 'polo' && <span className="text-2xl">👔</span>}
                        {style.id === 'hoodie' && <span className="text-2xl">🧥</span>}
                      </div>
                      <span className="text-xs">{style.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Colors Tab */}
            {activeTab === 'colors' && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Shirt Colors</h3>
                <div className="grid grid-cols-4 gap-2">
                  {shirtColors.map((color) => (
                    <button
                      key={color.value}
                      title={color.name}
                      className={`w-14 h-14 rounded border-2 flex items-center justify-center ${shirtColor === color.value ? 'border-blue-500' : 'border-gray-200'}`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => setShirtColor(color.value)}
                    >
                      {shirtColor === color.value && (
                        <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white" />
                      )}
                    </button>
                  ))}
                </div>
                
                {activeDesignObj?.type === 'text' && (
                  <>
                    <h3 className="text-sm font-medium text-gray-700 mt-6 mb-2">Text Color</h3>
                    <div className="grid grid-cols-8 gap-1">
                      {['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'].map((color) => (
                        <button
                          key={color}
                          className={`w-8 h-8 rounded border ${activeDesignObj.color === color ? 'border-blue-500' : 'border-gray-200'}`}
                          style={{ backgroundColor: color }}
                          onClick={() => {
                            const newDesigns = designs.map(d => 
                              d.id === activeDesign 
                                ? { ...d, color } 
                                : d
                            );
                            setDesigns(newDesigns);
                            addToHistory(newDesigns);
                          }}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
            
            {/* Designs Tab */}
            {activeTab === 'designs' && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Design Elements</h3>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {designElements.map((design) => (
                    <div 
                      key={design.id}
                      className="p-2 border border-gray-200 rounded cursor-pointer hover:bg-gray-50"
                      onClick={() => addDesign(design)}
                    >
                      <div className="aspect-square bg-gray-100 flex items-center justify-center mb-1">
                        <img src={design.src} alt={design.name} className="max-w-full max-h-full" />
                      </div>
                      <p className="text-xs text-center">{design.name}</p>
                    </div>
                  ))}
                </div>
                
                <button 
                  className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded flex items-center justify-center hover:bg-gray-200 mb-4"
                  onClick={() => fileInputRef.current.click()}
                >
                  <Image className="w-4 h-4 mr-2" />
                  Upload Image
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                
                {activeDesign && (
                  <div className="mt-4 p-3 border rounded border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Element Actions</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        className="py-2 px-4 bg-gray-100 text-gray-700 rounded flex items-center justify-center hover:bg-gray-200"
                        onClick={deleteActiveDesign}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </button>
                      <button 
                        className="py-2 px-4 bg-gray-100 text-gray-700 rounded flex items-center justify-center hover:bg-gray-200"
                        onClick={bringForward}
                      >
                        <ArrowRight className="w-4 h-4 mr-1" />
                        Forward
                      </button>
                      <button 
                        className="py-2 px-4 bg-gray-100 text-gray-700 rounded flex items-center justify-center hover:bg-gray-200"
                        onClick={sendBackward}
                      >
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Backward
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Text Tab */}
            {activeTab === 'text' && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Add Text</h3>
                <div className="mb-4">
                  <input
                    ref={textInputRef}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter text..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        addText();
                      }
                    }}
                  />
                  <button 
                    className="w-full mt-2 py-2 px-4 bg-blue-600 text-white rounded font-medium flex items-center justify-center hover:bg-blue-700"
                    onClick={addText}
                    disabled={!text.trim()}
                  >
                    <Type className="w-4 h-4 mr-2" />
                    Add Text
                  </button>
                </div>
                
                {activeDesignObj?.type === 'text' && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Font Size</h3>
                    <input
                      type="range"
                      min="12"
                      max="48"
                      value={activeDesignObj.fontSize}
                      className="w-full"
                      onChange={(e) => {
                        const fontSize = parseInt(e.target.value);
                        const newDesigns = designs.map(d => 
                          d.id === activeDesign 
                            ? { ...d, fontSize } 
                            : d
                        );
                        setDesigns(newDesigns);
                      }}
                      onMouseUp={() => addToHistory([...designs])}
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>12px</span>
                      <span>{activeDesignObj.fontSize}px</span>
                      <span>48px</span>
                    </div>
                    
                    <h3 className="text-sm font-medium text-gray-700 mt-4 mb-2">Font Family</h3>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={activeDesignObj.fontFamily}
                      onChange={(e) => {
                        const fontFamily = e.target.value;
                        const newDesigns = designs.map(d => 
                          d.id === activeDesign 
                            ? { ...d, fontFamily } 
                            : d
                        );
                        setDesigns(newDesigns);
                        addToHistory(newDesigns);
                      }}
                    >
                      <option value="Arial">Arial</option>
                      <option value="Verdana">Verdana</option>
                      <option value="Helvetica">Helvetica</option>
                      <option value="Times New Roman">Times New Roman</option>
                      <option value="Courier New">Courier New</option>
                    </select>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShirtDesignCanvas;