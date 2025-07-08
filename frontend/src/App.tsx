import React, { useState, useCallback } from 'react';
import { FileUpload } from './components/FileUpload';
import { ImagePreview } from './components/ImagePreview';
import { BorderControls } from './components/BorderControls';
import { ProcessingStatus } from './components/ProcessingStatus';
import { DownloadSection } from './components/DownloadSection';
import { processImage } from './services/api';
import { createPreviewUrl, revokePreviewUrl } from './utils/fileValidation';
import { Sparkles, Wand2 } from 'lucide-react';

interface AppState {
  selectedFile: File | null;
  originalImageUrl: string | null;
  processedImageUrl: string | null;
  processedBlob: Blob | null;
  isProcessing: boolean;
  status: 'idle' | 'processing' | 'success' | 'error';
  statusMessage: string;
  borderThickness: number;
  borderColor: { r: number; g: number; b: number; a: number };
  backgroundColor: { r: number; g: number; b: number };
}

function App() {
  const [state, setState] = useState<AppState>({
    selectedFile: null,
    originalImageUrl: null,
    processedImageUrl: null,
    processedBlob: null,
    isProcessing: false,
    status: 'idle',
    statusMessage: '',
    borderThickness: 5,
    borderColor: { r: 255, g: 255, b: 255, a: 1 },
    backgroundColor: { r: 255, g: 255, b: 255 },
  });

  const handleFileSelect = useCallback((file: File) => {
    // Clean up previous URLs
    if (state.originalImageUrl) {
      revokePreviewUrl(state.originalImageUrl);
    }
    if (state.processedImageUrl) {
      revokePreviewUrl(state.processedImageUrl);
    }

    const previewUrl = createPreviewUrl(file);
    setState(prev => ({
      ...prev,
      selectedFile: file,
      originalImageUrl: previewUrl,
      processedImageUrl: null,
      processedBlob: null,
      status: 'idle',
      statusMessage: '',
    }));
  }, [state.originalImageUrl, state.processedImageUrl]);

  const handleError = useCallback((error: string) => {
    setState(prev => ({
      ...prev,
      status: 'error',
      statusMessage: error,
    }));
  }, []);

  const handleProcess = useCallback(async () => {
    if (!state.selectedFile) return;

    setState(prev => ({
      ...prev,
      isProcessing: true,
      status: 'processing',
      statusMessage: 'Processing your image...',
    }));

    try {
      const blob = await processImage({
        image: state.selectedFile,
        borderThickness: state.borderThickness,
        borderColor: state.borderColor,
        backgroundColor: state.backgroundColor,
      });

      const processedUrl = URL.createObjectURL(blob);
      
      setState(prev => ({
        ...prev,
        processedBlob: blob,
        processedImageUrl: processedUrl,
        isProcessing: false,
        status: 'success',
        statusMessage: 'Image processed successfully!',
      }));
    } catch (error) {
      console.error('Processing failed:', error);
      setState(prev => ({
        ...prev,
        isProcessing: false,
        status: 'error',
        statusMessage: 'Failed to process image. Please try again.',
      }));
    }
  }, [state.selectedFile, state.borderThickness, state.borderColor, state.backgroundColor]);

  const updateBorderThickness = useCallback((value: number) => {
    setState(prev => ({ ...prev, borderThickness: value }));
  }, []);

  const updateBorderColor = useCallback((color: { r: number; g: number; b: number; a: number }) => {
    setState(prev => ({ ...prev, borderColor: color }));
  }, []);

  const updateBackgroundColor = useCallback((color: { r: number; g: number; b: number }) => {
    setState(prev => ({ ...prev, backgroundColor: color }));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl">
              <Wand2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Sticker Maker
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your images into beautiful stickers with transparent backgrounds and custom borders
          </p>
        </div>

        <div className="space-y-8">
          {/* File Upload */}
          {!state.selectedFile && (
            <section>
              <FileUpload
                onFileSelect={handleFileSelect}
                onError={handleError}
                isProcessing={state.isProcessing}
              />
            </section>
          )}

          {/* Status */}
          {state.status !== 'idle' && (
            <section>
              <ProcessingStatus
                status={state.status}
                message={state.statusMessage}
              />
            </section>
          )}

          {/* Main Content */}
          {state.selectedFile && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Image Preview - Takes up 2 columns on xl screens */}
              <div className="xl:col-span-2">
                <ImagePreview
                  originalImage={state.originalImageUrl || undefined}
                  processedImage={state.processedImageUrl || undefined}
                  isProcessing={state.isProcessing}
                />
              </div>

              {/* Controls - Takes up 1 column on xl screens */}
              <div className="space-y-6">
                <BorderControls
                  borderThickness={state.borderThickness}
                  borderColor={state.borderColor}
                  backgroundColor={state.backgroundColor}
                  onBorderThicknessChange={updateBorderThickness}
                  onBorderColorChange={updateBorderColor}
                  onBackgroundColorChange={updateBackgroundColor}
                  isProcessing={state.isProcessing}
                />

                <DownloadSection
                  processedBlob={state.processedBlob || undefined}
                  originalFileName={state.selectedFile?.name}
                  onProcess={handleProcess}
                  isProcessing={state.isProcessing}
                  hasImage={!!state.selectedFile}
                />
              </div>
            </div>
          )}

          {/* New Upload Button */}
          {state.selectedFile && (
            <div className="text-center">
              <button
                onClick={() => {
                  if (state.originalImageUrl) revokePreviewUrl(state.originalImageUrl);
                  if (state.processedImageUrl) revokePreviewUrl(state.processedImageUrl);
                  setState({
                    selectedFile: null,
                    originalImageUrl: null,
                    processedImageUrl: null,
                    processedBlob: null,
                    isProcessing: false,
                    status: 'idle',
                    statusMessage: '',
                    borderThickness: 5,
                    borderColor: { r: 255, g: 255, b: 255, a: 1 },
                    backgroundColor: { r: 255, g: 255, b: 255 },
                  });
                }}
                className="flex items-center space-x-2 mx-auto px-6 py-3 bg-white border-2 border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 text-gray-700 font-medium"
              >
                <Sparkles className="w-5 h-5" />
                <span>Upload New Image</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;