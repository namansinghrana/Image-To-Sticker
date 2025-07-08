import React from 'react';
import { Download, Sparkles } from 'lucide-react';
import { downloadBlob, generateFilename } from '../utils/imageHelpers';

interface DownloadSectionProps {
  processedBlob?: Blob;
  originalFileName?: string;
  onProcess: () => void;
  isProcessing: boolean;
  hasImage: boolean;
}

export const DownloadSection: React.FC<DownloadSectionProps> = ({
  processedBlob,
  originalFileName,
  onProcess,
  isProcessing,
  hasImage,
}) => {
  const handleDownload = () => {
    if (processedBlob && originalFileName) {
      const filename = generateFilename(originalFileName);
      downloadBlob(processedBlob, filename);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {/* Process Button */}
      <button
        onClick={onProcess}
        disabled={!hasImage || isProcessing}
        className={`
          w-full flex items-center justify-center space-x-3 py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform
          ${!hasImage || isProcessing
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:scale-105 shadow-lg hover:shadow-xl'
          }
        `}
      >
        <Sparkles className={`w-6 h-6 ${isProcessing ? 'animate-spin' : ''}`} />
        <span>
          {isProcessing ? 'Processing...' : 'Create Sticker'}
        </span>
      </button>

      {/* Download Button */}
      {processedBlob && (
        <button
          onClick={handleDownload}
          className="w-full flex items-center justify-center space-x-3 py-3 px-6 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <Download className="w-5 h-5" />
          <span>Download Sticker</span>
        </button>
      )}
    </div>
  );
};