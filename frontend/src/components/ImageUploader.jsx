import React, { useRef, useState } from 'react';
import { Upload, Camera, X } from 'lucide-react';

const ImageUploader = ({ onImageSelected, isLoading }) => {
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            processFile(file);
        }
    };

    const processFile = (file) => {
        setPreview(URL.createObjectURL(file));
        onImageSelected(file);
    };

    const clearImage = () => {
        setPreview(null);
        onImageSelected(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (cameraInputRef.current) cameraInputRef.current.value = '';
    };

    return (
        <div className="w-full max-w-md mx-auto mb-8">
            {preview ? (
                <div className="relative rounded-lg overflow-hidden shadow-lg border-2 border-blue-200 dark:border-blue-800">
                    <img src={preview} alt="Preview" className="w-full h-64 object-cover" />
                    <button
                        onClick={clearImage}
                        disabled={isLoading}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 disabled:opacity-50"
                        aria-label="Remove image"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            ) : (
                <div className="flex flex-col space-y-4">
                    <button
                        onClick={() => fileInputRef.current.click()}
                        disabled={isLoading}
                        className="flex items-center justify-center w-full p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:border-gray-700 dark:hover:border-blue-400 dark:hover:bg-gray-800 transition-all cursor-pointer group"
                    >
                        <div className="flex flex-col items-center">
                            <Upload className="w-10 h-10 text-gray-400 group-hover:text-blue-500 mb-3" />
                            <span className="text-gray-500 group-hover:text-blue-600 font-medium">Upload an Image</span>
                        </div>
                    </button>

                    <button
                        onClick={() => cameraInputRef.current.click()}
                        disabled={isLoading}
                        className="flex items-center justify-center p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg transform transition-transform hover:scale-105"
                    >
                        <Camera className="w-6 h-6 mr-2" />
                        <span className="font-semibold">Take Photo</span>
                    </button>
                </div>
            )}

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />

            {/* Mobile Camera input specific attributes */}
            <input
                type="file"
                ref={cameraInputRef}
                onChange={handleFileChange}
                accept="image/*"
                capture="environment"
                className="hidden"
            />
        </div>
    );
};

export default ImageUploader;
