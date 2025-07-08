import React from 'react';
import { Image as ImageIcon, Sparkles } from 'lucide-react';

interface ImagePreviewProps {
  originalImage?: string;
  processedImage?: string;
  isProcessing: boolean;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  originalImage,
  processedImage,
  isProcessing,
}) => {
  if (!originalImage) {
    return null;
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Original Image */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <ImageIcon className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-800">Original</h3>
          </div>
          <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
            <img
              src={originalImage}
              alt="Original"
              className="w-full h-auto max-h-96 object-contain"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>

        {/* Processed Image */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-800">Processed</h3>
          </div>
          <div className="relative bg-white rounded-xl shadow-lg overflow-hidden min-h-[200px] flex items-center justify-center">
            {isProcessing ? (
              <div className="flex flex-col items-center space-y-4 p-8">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-blue-600 animate-pulse" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-lg font-medium text-gray-800">Processing your image...</p>
                  <p className="text-sm text-gray-600 mt-1">This may take a few moments</p>
                </div>
              </div>
            ) : processedImage ? (
              <>
                <img
                  src={processedImage}
                  alt="Processed"
                  className="w-full h-auto max-h-96 object-contain"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-600/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
              </>
            ) : (
              <div className="flex flex-col items-center space-y-3 text-gray-400">
                <Sparkles className="w-12 h-12" />
                <p>Processed image will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};