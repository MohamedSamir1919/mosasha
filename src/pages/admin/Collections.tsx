import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { Search, Upload, Trash2, Filter, CheckCircle, XCircle, Image as ImageIcon, Send } from 'lucide-react';
import Cookies from 'js-cookie'
const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [filters, setFilters] = useState({ name: '', arabicName: '', slug: '', active: 'all' });
  const [selectedIds, setSelectedIds] = useState([]);
  
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  // --- 1. Handle Excel Upload ---
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws);
      
      const formattedData = data.map((item, index) => ({
        id: Date.now() + index,
        name: item.name || '',
        arabicName: item.arabicName || '',
        // Store the file object here eventually, defaults to placeholder
        imgFile: null, 
        imgPreview: 'https://via.placeholder.com/40',
        active: String(item.active).toLowerCase() === 'true',
        slug: item.slug || ''
      }));
      setCollections([...collections, ...formattedData]);
    };
    reader.readAsBinaryString(file);
  };

  // --- 2. Handle Bulk Image Upload ---
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    setCollections(prev => prev.map(col => {
      // Find a file where the name (minus extension) matches the collection name or slug
      const matchedFile = files.find(f => 
        f.name.split('.')[0].toLowerCase() === col.name.toLowerCase() || 
        f.name.split('.')[0].toLowerCase() === col.slug.toLowerCase()
      );

      if (matchedFile) {
        return {
          ...col,
          imgFile: matchedFile,
          imgPreview: URL.createObjectURL(matchedFile) // Create local URL for preview
        };
      }
      return col;
    }));
  };

  // --- 3. Send to API (The "نجوم v3" Sync) ---
  const syncWithApi = async () => {
    const formData = new FormData();
    
    // Create a simplified version of the text data
    const textData = collections.map(({ id, name, arabicName, slug, active }) => ({
      id, name, arabicName, slug, active
    }));

    formData.append('collectionsData', JSON.stringify(textData));

    // Append each image file
    collections.forEach((col) => {
      if (col.imgFile) {
        // Append with a unique key or field name
        formData.append(`images`, col.imgFile, `${col.slug}.jpg`);
      }
    });

    try {
      const response = await  axios.post(`${import.meta.env.VITE_SERVER}/collection/add-collection`,formData
            ,{ headers: { 'Authorization': `Bearer ${Cookies.get('token')}` } }
          )
      if (response.ok) alert("Sync Complete!");
    } catch (err) {
      console.error("Sync failed", err);
    }
  };

  // ... (Keep your toggleActive, handleSelectAll, toggleSelect logic here) ...

  const filteredCollections = collections.filter(item => {
    return (
      item.name.toLowerCase().includes(filters.name.toLowerCase()) &&
      item.arabicName.toLowerCase().includes(filters.arabicName.toLowerCase()) &&
      item.slug.toLowerCase().includes(filters.slug.toLowerCase()) &&
      (filters.active === 'all' || String(item.active) === filters.active)
    );
  });

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Updated Header with Image Upload & Sync */}
        <div className="p-6 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Collection Management</h1>
          
          <div className="flex gap-3">
            <button 
              onClick={() => fileInputRef.current.click()}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-all"
            >
              <Upload size={18} /> Excel
            </button>

            <button 
              onClick={() => imageInputRef.current.click()}
              className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-4 py-2 rounded-lg transition-all"
            >
              <ImageIcon size={18} /> Match Images
            </button>

            <button 
              onClick={syncWithApi}
              disabled={collections.length === 0}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all shadow-md disabled:opacity-50"
            >
              <Send size={18} /> Sync to Server
            </button>
          </div>

          <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".xlsx, .xls" />
          <input type="file" ref={imageInputRef} onChange={handleImageUpload} className="hidden" multiple accept="image/*" />
        </div>

        {/* ... (Keep your Filters Grid) ... */}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Preview</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Status</th>
                {/* ... other headers ... */}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCollections?.map((item) => (
                <tr key={item.id} className="hover:bg-blue-50/50">
                  <td className="px-6 py-4">
                    <div className="relative w-10 h-10">
                        <img src={item.imgPreview} alt={item.name} className="w-10 h-10 rounded-full object-cover border" />
                        {item.imgFile && <div className="absolute -top-1 -right-1 bg-green-500 w-3 h-3 rounded-full border-2 border-white"></div>}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium">{item.name}</td>
                  {/* ... rest of your rows ... */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Collections;