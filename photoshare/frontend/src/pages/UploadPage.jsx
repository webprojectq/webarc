import React, { useState } from 'react';  
import { useAuth } from '../contexts/AuthContext';  
import api from '../services/api';  

const UploadPage = () => {  
  const [file, setFile] = useState(null);  
  const [caption, setCaption] = useState('');  
  const [preview, setPreview] = useState(null);  
  const [isUploading, setIsUploading] = useState(false);  
  const { user } = useAuth();  

  const handleFileChange = (e) => {  
    const selectedFile = e.target.files[0];  
    setFile(selectedFile);  
    setPreview(URL.createObjectURL(selectedFile));  
  };  

  const handleSubmit = async (e) => {  
    e.preventDefault();  
    if (!file) return;  

    setIsUploading(true);  
    const formData = new FormData();  
    formData.append('image', file);  
    formData.append('caption', caption);  

    try {  
      await api.post('/photos/', formData, {  
        headers: {  
          'Content-Type': 'multipart/form-data',  
          'Authorization': `Bearer ${user.token}`  
        }  
      });  
      // Reset form  
      setFile(null);  
      setCaption('');  
      setPreview(null);  
      alert('Photo uploaded successfully!');  
    } catch (err) {  
      console.error('Upload failed:', err);  
    } finally {  
      setIsUploading(false);  
    }  
  };  

  return (  
    <div className="max-w-2xl mx-auto p-4">  
      <h1 className="text-2xl font-bold mb-6">Upload Photo</h1>  
      <form onSubmit={handleSubmit} className="space-y-4">  
        <div>  
          {preview ? (  
            <img  
              src={preview}  
              alt="Preview"  
              className="w-full h-64 object-cover rounded-lg mb-4"  
            />  
          ) : (  
            <div className="border-2 border-dashed rounded-xl w-full h-64 flex items-center justify-center">  
              <span>No image selected</span>  
            </div>  
          )}  
          <input  
            type="file"  
            accept="image/*"  
            onChange={handleFileChange}  
            className="w-full p-2 border rounded"  
          />  
        </div>  
        
        <div>  
          <textarea  
            value={caption}  
            onChange={(e) => setCaption(e.target.value)}  
            placeholder="Add a caption..."  
            className="w-full p-3 border rounded min-h-[100px]"  
          />  
        </div>  
        
        <button  
          type="submit"  
          disabled={isUploading || !file}  
          className="w-full bg-indigo-600 text-white py-3 rounded-lg disabled:opacity-50"  
        >  
          {isUploading ? 'Uploading...' : 'Upload Photo'}  
        </button>  
      </form>  
    </div>  
  );  
};  

export default UploadPage;  