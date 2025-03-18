import React, { useState, useRef, useEffect } from "react";
import {
  Download,
  Palette,
  Edit,
  Undo,
  Redo,
  Save,
  Image,
  Trash2,
  Type,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { RotateCw } from "lucide-react";
import { getFirestore, collection, addDoc, doc, setDoc } from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

// Mock data for shirt colors
const shirtColors = [
  { name: "White", value: "#FFFFFF" },
  { name: "Black", value: "#000000" },
  { name: "Navy Blue", value: "#0A1172" },
  { name: "Red", value: "#CB0000" },
  { name: "Green", value: "#008631" },
  { name: "Yellow", value: "#FFD700" },
  { name: "Purple", value: "#800080" },
  { name: "Gray", value: "#808080" },
  { name: "Pink", value: "#FFC0CB" },
  { name: "Orange", value: "#FFA500" },
  { name: "Brown", value: "#8B4513" },
  { name: "Teal", value: "#008080" },
];

// Mock design elements
const designElements = [
  { id: "design1", name: "Facebook Logo", src: "/fb.svg" },
  { id: "design2", name: "Stripes", src: "/vite.svg" },
  { id: "design3", name: "Pattern 1", src: "/google.svg" },
  { id: "design4", name: "Pattern 2", src: "/Logo.svg" },
  { id: "design5", name: "Abstract", src: "/wave.jpeg" },
];

// Available shirt categories and products
const shirtCategories = [
  {
    id: "tshirt",
    name: "T-Shirt",
    products: [
      { id: "basic-tee", name: "Basic Tee", image: "/T-shirt.svg" },
      { id: "v-neck", name: "V-Neck", image: "/Home Assets/TShirts/Polo_sample.jpg" },
      { id: "long-sleeve", name: "Long Sleeve", image: "/Home Assets/red shirt.png" },
    ],
  },
  {
    id: "polo",
    name: "Polo",
    products: [
      { id: "classic-polo", name: "Polo", image: "/Home Assets/TShirts/blue shirt.png" },
      { id: "slim-fit", name: "Polo", image: "/Home Assets/TShirts/Polo_sample.jpg" },
      { id: "striped-polo", name: "Striped Polo", image: "/Home Assets/TShirts/yet-another-image.png" },
    ],
  },
  {
    id: "hoodie",
    name: "Hoodie",
    products: [
      { id: "pullover", name: "Pullover Hoodie", image: "/Home Assets/TShirts/yellow shirt.png" },
      { id: "zip-up", name: "Zip-up Hoodie", image: "/Home Assets/TShirts/another-image.png" },
      { id: "sleeveless", name: "Sleeveless Hoodie", image: "/Home Assets/TShirts/yet-another-image.png" },
    ],
  },
];

const CustomProduct = () => {
  const [shirtColor, setShirtColor] = useState(shirtColors[0].value);
  const [shirtStyle, setShirtStyle] = useState(shirtCategories[0].id);
  const [selectedProduct, setSelectedProduct] = useState(
    shirtCategories[0].products[0].id
  );
  const [designs, setDesigns] = useState([]);
  const [activeDesign, setActiveDesign] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState("");
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [activeTab, setActiveTab] = useState("shirt");
  const [text, setText] = useState("");

  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const textInputRef = useRef(null);

  const navigate = useNavigate(); // Ensure this is present

  // Add a design element to the shirt
  const addDesign = (design) => {
    const newDesign = {
      id: `placed-${design.id}-${Date.now()}`,
      src: design.src,
      name: design.name,
      x: 200,
      y: 200,
      width: 100,
      height: 100,
      rotation: 0,
      scale: 1,
      type: "image",
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
      name: "Text Element",
      x: 200,
      y: 200,
      width: 150,
      height: 50,
      rotation: 0,
      scale: 1,
      type: "text",
      fontSize: 24,
      fontFamily: "Arial",
      color: "#000000",
    };

    const newDesigns = [...designs, newText];
    setDesigns(newDesigns);
    setActiveDesign(newText.id);
    setText("");

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
    // If the design is already active, don't deselect it
    // This allows resize handles to remain visible after clicking
    if (designId !== activeDesign) {
      setActiveDesign(designId);
    }
  };

  // Handle mouse down on design for dragging
  const handleMouseDown = (e, designId) => {
    if (designId !== activeDesign) {
      setActiveDesign(designId);
    }

    const design = designs.find((d) => d.id === designId);
    if (design) {
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const offsetX = e.clientX - canvasRect.left - design.x;
      const offsetY = e.clientY - canvasRect.top - design.y;
      setDragOffset({ x: offsetX, y: offsetY });
      setIsDragging(true);
      e.stopPropagation();
    }
  };

  // Handle resize start
  const handleResizeStart = (e, handle, designId) => {
    e.stopPropagation();
    e.preventDefault();

    setActiveDesign(designId);
    setIsResizing(true);
    setResizeHandle(handle);

    const design = designs.find((d) => d.id === designId);
    if (design) {
      setResizeStart({
        width: design.width,
        height: design.height,
        x: design.x,
        y: design.y,
      });

      const canvasRect = canvasRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - canvasRect.left,
        y: e.clientY - canvasRect.top,
      });
    }
  };

  // Handle mouse move for dragging and resizing
  const handleMouseMove = (e) => {
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - canvasRect.left;
    const mouseY = e.clientY - canvasRect.top;

    if (isDragging && activeDesign && !isResizing) {
      // Handle dragging
      const x = mouseX - dragOffset.x;
      const y = mouseY - dragOffset.y;

      const newDesigns = designs.map((design) =>
        design.id === activeDesign ? { ...design, x, y } : design
      );

      setDesigns(newDesigns);
    } else if (isResizing && activeDesign) {
      // Handle resizing
      const design = designs.find((d) => d.id === activeDesign);
      if (!design) return;

      const deltaX = mouseX - dragOffset.x;
      const deltaY = mouseY - dragOffset.y;

      let newWidth = resizeStart.width;
      let newHeight = resizeStart.height;
      let newX = resizeStart.x;
      let newY = resizeStart.y;

      // Resize based on which handle is being dragged
      if (resizeHandle.includes("e")) {
        newWidth = Math.max(30, resizeStart.width + deltaX);
      }
      if (resizeHandle.includes("w")) {
        const dx = Math.min(deltaX, resizeStart.width - 30);
        newWidth = resizeStart.width - dx;
        newX = resizeStart.x + dx;
      }
      if (resizeHandle.includes("s")) {
        newHeight = Math.max(30, resizeStart.height + deltaY);
      }
      if (resizeHandle.includes("n")) {
        const dy = Math.min(deltaY, resizeStart.height - 30);
        newHeight = resizeStart.height - dy;
        newY = resizeStart.y + dy;
      }

      const newDesigns = designs.map((d) =>
        d.id === activeDesign
          ? { ...d, width: newWidth, height: newHeight, x: newX, y: newY }
          : d
      );

      setDesigns(newDesigns);
    }
  };

  // Handle mouse up
  const handleMouseUp = () => {
    if (isDragging || isResizing) {
      setIsDragging(false);
      setIsResizing(false);
      setResizeHandle("");
      addToHistory([...designs]);
    }
  };

  // Handle canvas click (deselect)
  const handleCanvasClick = () => {
    setActiveDesign(null);
  };

  // Upload custom image
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          // Upload to Hostinger
          const formData = new FormData();
          formData.append("file", file);

          const response = await fetch(
            "https://davidsonathletics.scarlet2.io/api/upload_request_design.php",
            {
              method: "POST",
              body: formData,
            }
          );

          if (!response.ok) {
            throw new Error("Failed to upload image to Hostinger");
          }

          const data = await response.json();
          if (!data.imageUrl) {
            throw new Error("Error uploading image: " + data.error);
          }

          const newDesign = {
            id: `custom-${Date.now()}`,
            src: data.imageUrl,
            name: "Custom Image",
            x: 200,
            y: 200,
            width: 100,
            height: 100,
            rotation: 0,
            scale: 1,
            type: "image",
          };

          const newDesigns = [...designs, newDesign];
          setDesigns(newDesigns);
          setActiveDesign(newDesign.id);

          addToHistory(newDesigns);
        } catch (error) {
          console.error("Error uploading image:", error);
          alert("Failed to upload image. Please try again.");
        }
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
      const newDesigns = designs.filter((design) => design.id !== activeDesign);
      setDesigns(newDesigns);
      setActiveDesign(null);

      addToHistory(newDesigns);
    }
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e) => {
    if (e.key === "Delete" || e.key === "Backspace") {
      if (document.activeElement === textInputRef.current) return;
      deleteActiveDesign();
    } else if (e.ctrlKey || e.metaKey) {
      if (e.key === "z") {
        e.preventDefault();
        handleUndo();
      } else if (e.key === "y" || (e.shiftKey && e.key === "z")) {
        e.preventDefault();
        handleRedo();
      }
    }
  };

  // Bring design forward
  const bringForward = () => {
    if (!activeDesign) return;

    const activeIndex = designs.findIndex((d) => d.id === activeDesign);
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

    const activeIndex = designs.findIndex((d) => d.id === activeDesign);
    if (activeIndex > 0) {
      const newDesigns = [...designs];
      const temp = newDesigns[activeIndex];
      newDesigns[activeIndex] = newDesigns[activeIndex - 1];
      newDesigns[activeIndex - 1] = temp;
      setDesigns(newDesigns);
      addToHistory(newDesigns);
    }
  };

  // Select product and update shirt style
  const selectProduct = (categoryId, productId) => {
    setShirtStyle(categoryId);
    setSelectedProduct(productId);
  };

  // Update shirt style and set default product
  const setShirtStyleAndDefaultProduct = (categoryId) => {
    setShirtStyle(categoryId);
    const category = shirtCategories.find(category => category.id === categoryId);
    if (category && category.products.length > 0) {
      setSelectedProduct(category.products[0].id);
    } else {
      setSelectedProduct(null);
    }
  };

  const addToCart = async (item) => {
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (!user) {
      console.error("No user is currently logged in.");
      return;
    }
  
    const userId = user.uid; // Get the current user's ID
    try {
      const cartCollectionRef = collection(db, "users", userId, "cart");
      await addDoc(cartCollectionRef, item);
      console.log("Item added to cart:", item);
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  const drawDesignElements = async (ctx) => {
    const promises = designs.map((design) => {
      return new Promise((resolve) => {
        if (design.type === "image") {
          const img = new window.Image();
          img.src = design.src;
          img.onload = () => {
            ctx.drawImage(img, design.x, design.y, design.width, design.height);
            resolve();
          };
        } else if (design.type === "text") {
          ctx.font = `${design.fontSize}px ${design.fontFamily}`;
          ctx.fillStyle = design.color;
          ctx.fillText(design.content, design.x, design.y);
          resolve();
        }
      });
    });

    await Promise.all(promises);
  };

  const exportDesign = async () => {
    try {
      const canvas = canvasRef.current.querySelector("canvas");
      if (!canvas || typeof canvas.toDataURL !== "function") {
        throw new Error("Canvas element is not valid");
      }

      // Ensure the canvas is properly rendered
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the selected shirt style
      const selectedCategory = shirtCategories.find((category) => category.id === shirtStyle);
      const selectedProductObj = selectedCategory?.products.find((product) => product.id === selectedProduct);

      if (!selectedProductObj) {
        throw new Error("Selected product not found");
      }

      const shirtImage = new window.Image();
      shirtImage.src = selectedProductObj.image; // Use the selected product's image
      shirtImage.onload = async () => {
        ctx.drawImage(shirtImage, 0, 0, canvas.width, canvas.height);

        // Draw the design elements
        await drawDesignElements(ctx);

        // Capture the canvas image data
        const dataUrl = canvas.toDataURL("image/png");

        // Prompt the user for a filename
        const filename = prompt("Enter a filename for your design:", "design.png");
        if (!filename) {
          alert("Filename is required.");
          return;
        }

        // Convert data URL to Blob
        fetch(dataUrl)
          .then((res) => res.blob())
          .then((blob) => {
            const formData = new FormData();
            formData.append("file", blob, filename);

            // Upload to Hostinger
            return fetch(
              "https://davidsonathletics.scarlet2.io/api/upload_request_design.php",
              {
                method: "POST",
                body: formData,
              }
            );
          })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Failed to upload image to Hostinger");
            }
            return response.json();
          })
          .then(({ imageUrl }) => {
            // Add to cart
            const newCartItem = {
              id: Date.now().toString(),
              name: "Custom Shirt",
              variation: shirtStyle,
              quantity: 1,
              basePrice: 550,
              imageUrl,
              selected: false,
            };
            addToCart(newCartItem);

            alert("Design saved and added to cart!");
            navigate("/cart"); // Navigate to the cart page
          })
          .catch((error) => {
            console.error("Error exporting design:", error);
            alert("Failed to save design. Please try again.");
          });
      };
    } catch (error) {
      console.error("Error exporting design:", error);
      alert("Failed to save design. Please try again.");
    }
  };

  const handleProceed = async () => {
    try {
      const canvas = canvasRef.current.querySelector("canvas");
      if (!canvas || typeof canvas.toDataURL !== "function") {
        throw new Error("Canvas element is not valid");
      }

      // Ensure the canvas is properly rendered
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the selected shirt style
      const selectedCategory = shirtCategories.find((category) => category.id === shirtStyle);
      const selectedProductObj = selectedCategory?.products.find((product) => product.id === selectedProduct);

      if (!selectedProductObj) {
        throw new Error("Selected product not found");
      }

      const shirtImage = new window.Image();
      shirtImage.src = selectedProductObj.image; // Use the selected product's image
      shirtImage.onload = async () => {
        // Adjust the x coordinate to move the image to the right
        const xOffset = 50; // Adjust this value as needed
        ctx.drawImage(shirtImage, xOffset, 0, canvas.width, canvas.height);

        // Draw the design elements
        await drawDesignElements(ctx);

        // Capture the canvas image data with smaller width
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = 300; // Smaller width
        tempCanvas.height = 300; // Adjust height accordingly
        const tempCtx = tempCanvas.getContext("2d");
        tempCtx.drawImage(canvas, 0, 0, 300, 300);

        const dataUrl = tempCanvas.toDataURL("image/png");

        // Convert data URL to Blob
        const blob = await fetch(dataUrl).then((res) => res.blob());

        // Upload to Hostinger
        const formData = new FormData();
        formData.append("file", blob, `design-${Date.now()}.png`);

        const response = await fetch(
          "https://davidsonathletics.scarlet2.io/api/upload_request_design.php",
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error("Failed to upload image.");
        }

        const data = await response.json();
        if (!data.imageUrl) {
          throw new Error("Error uploading image: " + data.error);
        }

        const imageUrl = data.imageUrl;

        // Store the image URL in Firestore
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
          throw new Error("No user is currently logged in.");
        }
        const userId = user.uid;
        const db = getFirestore();
        const requestRef = doc(db, "users", userId, "requests", `request-${Date.now()}`);
        await setDoc(requestRef, { imageUrl });

        // Navigate to RequestForm with the uploaded image URL
        navigate('/ShopPages/RequestForm', { state: { uploadedImages: [imageUrl], selectedProduct } });
      };

      // Handle image loading error
      shirtImage.onerror = () => {
        alert("Failed to load the shirt image. Please try again.");
      };
    } catch (error) {
      console.error("Error exporting design:", error);
      alert("Failed to save design. Please try again.");
    }
  };

  // Get the active design object
  const activeDesignObj = activeDesign
    ? designs.find((d) => d.id === activeDesign)
    : null;

  // Get the current category
  const currentCategory = shirtCategories.find(
    (category) => category.id === shirtStyle
  );

  // Render resize & rotate handles for active design
  const handleRotateStart = (e, design) => {
    if (e.button !== 2) return; // Only trigger on right-click

    e.preventDefault(); // Prevent context menu

    const centerX = design.x + design.width / 2;
    const centerY = design.y + design.height / 2;
    const startAngle = design.rotation || 0;
    const startX = e.clientX;
    const startY = e.clientY;

    const handleMouseMove = (event) => {
      const dx = event.clientX - centerX;
      const dy = event.clientY - centerY;
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);

      design.rotation = angle;
      updateDesign(design);
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const renderResizeHandles = (design) => {
    const handles = [
      { position: "nw", cursor: "nwse-resize" },
      { position: "n", cursor: "ns-resize" },
      { position: "ne", cursor: "nesw-resize" },
      { position: "e", cursor: "ew-resize" },
      { position: "se", cursor: "nwse-resize" },
      { position: "s", cursor: "ns-resize" },
      { position: "sw", cursor: "nesw-resize" },
      { position: "w", cursor: "ew-resize" },
    ];

    return (
      <>
        {/* Display "Resize Mode" indicator */}
        <div
          className="absolute -top-6 left-0 right-0 text-center  text-white text-xs py-1 rounded"
          style={{ zIndex: 101 }}
        ></div>

        {/* Render all resize handles */}
        {handles.map(({ position, cursor }) => (
          <div
            key={position}
            className="absolute w-3 h-3 bg-white border-2 border-blue-500 rounded-full"
            style={{
              cursor: cursor,
              top: position.includes("n")
                ? -4
                : position.includes("s")
                ? design.height - 4
                : design.height / 2 - 4,
              left: position.includes("w")
                ? -4
                : position.includes("e")
                ? design.width - 4
                : design.width / 2 - 4,
              zIndex: 100,
            }}
            onMouseDown={(e) => handleResizeStart(e, position, design.id)}
          />
        ))}

        {/* 🔄 Rotate Handle with Icon */}
        <div
          className="absolute bg-green-500 w-6 h-6 flex items-center justify-center rounded-full top-[-30px] left-1/2 transform -translate-x-1/2 cursor-pointer"
          onContextMenu={(e) => e.preventDefault()} // Prevent default right-click menu
          onMouseDown={(e) => handleRotateStart(e, design)}
        >
          <RotateCw className="text-white w-4 h-4" />
        </div>
      </>
    );
  };

  return (
    <>
      <div
        className="w-full h-screen flex flex-col"
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        {/* Top Navbar */}
        <div className="bg-black h-20 mt-30"></div>

        <div className="bg-white  border-gray-200 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center"></div>
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
              onClick={handleProceed}
            >
              Proceed
            </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Left Canvas */}

          <div className="flex-1 bg-white p-8 flex flex-col items-center justify-center overflow-auto">
            <div className="items-start">
              <h1 className="text-6xl font-bold  mr-20">Custom Design</h1>
              <p className="text-2xl font-normal mb-4 mr-20">
                Create your own design here
              </p>
            </div>
            <div
              ref={canvasRef}
              className="relative w-700 h-700 rounded-lg mt-20 shadow-lg"
              style={{ width: "600px", height: "700px" }}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onClick={handleCanvasClick}
            >
              <canvas width="500" height="500" />
              {/* Shirt Background */}
              <div className="absolute inset-0 flex items-center w-full justify-center">
                <svg viewBox="0 0 600 600" className="w-full h-full">
                  {/* Basic T-shirt shape */}
                  {shirtStyle === "tshirt" && (
                    <>
                      <image
                        href="/T-shirt.svg"
                        x="0"
                        y="0"
                        width="600"
                        height="600"
                      />
                    </>
                  )}

                  {/* Polo shirt shape */}
                  {shirtStyle === "polo" && (
                    <>
                      <image
                        href="/Home Assets/TShirts/blue shirt.png"
                        x="0"
                        y="0"
                        width="600"
                        height="600"
                      />
                    </>
                  )}

                  {/* Hoodie shape */}
                  {shirtStyle === "hoodie" && (
                    <>
                      <image
                        href="/Home Assets/TShirts/yellow shirt.png"
                        x="0"
                        y="0"
                        width="600"
                        height="600"
                      />
                    </>
                  )}
                </svg>
              </div>

              {/* Design Elements */}
              {designs.map((design) => (
                <div
                  key={design.id}
                  className={`absolute cursor-move ${
                    activeDesign === design.id ? "ring-2 ring-blue-500" : ""
                  }`}
                  style={{
                    left: `${design.x}px`,
                    top: `${design.y}px`,
                    width: `${design.width}px`,
                    height: `${design.height}px`,
                    transform: `rotate(${design.rotation}deg)`,
                    zIndex: designs.indexOf(design) + 1,
                    cursor: activeDesign === design.id ? "move" : "pointer",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDesignSelect(design.id);
                  }}
                  onMouseDown={(e) => handleMouseDown(e, design.id)}
                >
                  <div className="relative w-full h-full">
                    {design.type === "image" ? (
                      <img
                        src={design.src}
                        alt={design.name}
                        className="w-full h-full object-contain"
                        draggable="false"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-start justify-center"
                        style={{
                          fontSize: `${design.fontSize}px`,
                          fontFamily: design.fontFamily,
                          color: design.color,
                        }}
                      >
                        {design.content}
                      </div>
                    )}
                  </div>

                  {/* Render resize handles for active design */}
                  {activeDesign === design.id && renderResizeHandles(design)}
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-110 bg-white border-l border-gray-200 mt-2 flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-t border-gray-200">
              <button
                className={`flex-1 py-3 font-medium text-sm ${
                  activeTab === "shirt" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"
                }`}
                onClick={() => setActiveTab("shirt")}
              >
                Shirt
              </button>
              <button
                className={`flex-1 py-3 font-medium text-sm ${
                  activeTab === "designs" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"
                }`}
                onClick={() => setActiveTab("designs")}
              >
                Designs
              </button>
              <button
                className={`flex-1 py-3 font-medium text-sm ${
                  activeTab === "text" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"
                }`}
                onClick={() => setActiveTab("text")}
              >
                Text
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* Shirt Styles Tab */}
              {activeTab === "shirt" && (
                <div>
                  {/* Categories */}
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Categories</h3>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {shirtCategories.map((category) => (
                      <button
                        key={category.id}
                        className={`p-2 text-center border rounded ${
                          shirtStyle === category.id ? "border-blue-500 bg-blue-50" : "border-gray-200"
                        }`}
                        onClick={() => setShirtStyleAndDefaultProduct(category.id)}
                      >
                        <div className="w-full aspect-square bg-gray-100 flex items-center justify-center mb-1">
                          {/* Simplified icon representations */}
                          {category.id === "tshirt" && <span className="text-2xl">👕</span>}
                          {category.id === "polo" && <span className="text-2xl">👔</span>}
                          {category.id === "hoodie" && <span className="text-2xl">🧥</span>}
                        </div>
                        <span className="text-xs">{category.name}</span>
                      </button>
                    ))}
                  </div>

                  {/* Products for selected category */}
                  {currentCategory && (
                    <>
                      <h3 className="text-sm font-medium text-gray-700 mt-4 mb-2">
                        {currentCategory.name} Products
                      </h3>
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {currentCategory.products.map((product) => (
                          <button
                            key={product.id}
                            className={`p-2 text-center border rounded ${
                              selectedProduct === product.id ? "border-blue-500 bg-blue-50" : "border-gray-200"
                            }`}
                            onClick={() => selectProduct(currentCategory.id, product.id)}
                          >
                            <div className="w-full aspect-square bg-gray-100 flex items-center justify-center mb-1">
                              <img src={product.image} alt={product.name} className="max-w-full max-h-full" />
                            </div>
                            <span className="text-xs">{product.name}</span>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Designs Tab */}
              {activeTab === "designs" && (
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
              {activeTab === "text" && (
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
                        if (e.key === "Enter") {
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

                  {activeDesignObj?.type === "text" && (
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
                          const newDesigns = designs.map((d) =>
                            d.id === activeDesign ? { ...d, fontSize } : d
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
                          const newDesigns = designs.map((d) =>
                            d.id === activeDesign ? { ...d, fontFamily } : d
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

                      <h3 className="text-sm font-medium text-gray-700 mt-4 mb-2">Text Color</h3>
                      <div className="grid grid-cols-8 gap-1">
                        {[
                          "#000000",
                          "#FFFFFF",
                          "#FF0000",
                          "#00FF00",
                          "#0000FF",
                          "#FFFF00",
                          "#FF00FF",
                          "#00FFFF",
                        ].map((color) => (
                          <button
                            key={color}
                            className={`w-8 h-8 rounded border ${
                              activeDesignObj.color === color ? "border-blue-500" : "border-gray-200"
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() => {
                              const newDesigns = designs.map((d) =>
                                d.id === activeDesign ? { ...d, color } : d
                              );
                              setDesigns(newDesigns);
                              addToHistory(newDesigns);
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {activeDesignObj && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Size</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs text-gray-500">Width</label>
                          <input
                            type="number"
                            min="20"
                            max="400"
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                            value={Math.round(activeDesignObj.width)}
                            onChange={(e) => {
                              const width = Math.max(
                                20,
                                Math.min(400, parseInt(e.target.value) || 20)
                              );
                              const newDesigns = designs.map((d) =>
                                d.id === activeDesign ? { ...d, width } : d
                              );
                              setDesigns(newDesigns);
                            }}
                            onBlur={() => addToHistory([...designs])}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">
                            Height
                          </label>
                          <input
                            type="number"
                            min="20"
                            max="400"
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                            value={Math.round(activeDesignObj.height)}
                            onChange={(e) => {
                              const height = Math.max(
                                20,
                                Math.min(400, parseInt(e.target.value) || 20)
                              );
                              const newDesigns = designs.map((d) =>
                                d.id === activeDesign ? { ...d, height } : d
                              );
                              setDesigns(newDesigns);
                            }}
                            onBlur={() => addToHistory([...designs])}
                          />
                        </div>
                      </div>
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
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Footer Section */}
      <div className="w-full py-20 px-10 bg-gray-800"></div>
    </>
  );
};

export default CustomProduct;
