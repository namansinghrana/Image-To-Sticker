import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Clipboard, Image as ImageIcon } from 'lucide-react';
import { validateFile } from '../utils/fileValidation';
import { pasteFromClipboard } from '../utils/imageHelpers';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onError: (error: string) => void;
  isProcessing: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  onError,
  isProcessing,
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const validation = validateFile(file);
        
        if (validation.isValid) {
          onFileSelect(file);
        } else {
          onError(validation.error || 'Invalid file');
        }
      }
    },
    [onFileSelect, onError]
  );

  const handlePaste = async () => {
    try {
      const file = await pasteFromClipboard();
      if (file) {
        const validation = validateFile(file);
        if (validation.isValid) {
          onFileSelect(file);
        } else {
          onError(validation.error || 'Invalid file from clipboard');
        }
      } else {
        onError('No image found in clipboard');
      }
    } catch (error) {
      onError('Failed to paste from clipboard');
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
    disabled: isProcessing,
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300
          ${isDragActive
            ? 'border-blue-400 bg-blue-50 scale-105'
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          }
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
            <Upload className="w-8 h-8 text-white" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-800">
              {isDragActive ? 'Drop your image here' : 'Upload your image'}
            </h3>
            <p className="text-gray-600">
              Drag & drop an image, or click to browse
            </p>
            <p className="text-sm text-gray-500">
              Supports JPG, JPEG, PNG, WebP • Max 10MB
            </p>
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="mt-4 flex justify-center">
        <button
          onClick={handlePaste}
          disabled={isProcessing}
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Clipboard className="w-4 h-4" />
          <span>Paste from clipboard</span>
        </button>
      </div>
    </div>
  );
};