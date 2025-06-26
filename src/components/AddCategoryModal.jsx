import { useState } from "react";

export default function AddCategoryModal({ isOpen, onClose, onSave }) {
    const [name, setName] = useState("");
    const [color, setColor] = useState("#1978e5"); // default blue
  
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Blurred background */}
        <div
          className="absolute inset-0 backdrop-blur-sm bg-white/30"
          onClick={onClose}
        ></div>
  
        {/* Modal box */}
        <div className="relative z-10 bg-white rounded-lg p-6 shadow-xl w-full max-w-md border border-slate-200">
          <h2 className="text-xl font-bold mb-4 text-[#0e141b]">Add New Category</h2>
          
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter category name"
            className="w-full mb-4 px-4 py-2 border rounded-lg"
          />
  
          <label className="block text-sm font-medium mb-2 text-[#0e141b]">Pick a color</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full h-10 rounded-lg"
          />
  
          <div className="flex justify-end mt-6 space-x-4">
            <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
              Cancel
            </button>
            <button
              onClick={() => {
                if (name) {
                  onSave({ name, color });
                  setName("");
                  setColor("#1978e5");
                }
              }}
              className="bg-[#1978e5] text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Add Category
            </button>
          </div>
        </div>
      </div>
    );
  }
  
