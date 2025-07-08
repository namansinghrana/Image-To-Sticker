import React from 'react';
import { SketchPicker } from 'react-color';
import { Palette, Settings } from 'lucide-react';

interface BorderControlsProps {
  borderThickness: number;
  borderColor: { r: number; g: number; b: number; a: number };
  backgroundColor: { r: number; g: number; b: number };
  onBorderThicknessChange: (value: number) => void;
  onBorderColorChange: (color: { r: number; g: number; b: number; a: number }) => void;
  onBackgroundColorChange: (color: { r: number; g: number; b: number }) => void;
  isProcessing: boolean;
}

export const BorderControls: React.FC<BorderControlsProps> = ({
  borderThickness,
  borderColor,
  backgroundColor,
  onBorderThicknessChange,
  onBorderColorChange,
  onBackgroundColorChange,
  isProcessing,
}) => {
  const [showBorderPicker, setShowBorderPicker] = React.useState(false);
  const [showBackgroundPicker, setShowBackgroundPicker] = React.useState(false);

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Settings className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">Customization</h3>
        </div>

        {/* Border Thickness */}
        <div className="space-y-3 mb-6">
          <label className="block text-sm font-medium text-gray-700">
            Border Thickness: {borderThickness}px
          </label>
          <input
            type="range"
            min="1"
            max="50"
            value={borderThickness}
            onChange={(e) => onBorderThicknessChange(Number(e.target.value))}
            disabled={isProcessing}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Border Color */}
        <div className="space-y-3 mb-6">
          <label className="block text-sm font-medium text-gray-700">
            Border Color
          </label>
          <div className="relative">
            <button
              onClick={() => setShowBorderPicker(!showBorderPicker)}
              disabled={isProcessing}
              className="flex items-center space-x-3 w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div
                className="w-8 h-8 rounded-lg border-2 border-gray-300"
                style={{
                  backgroundColor: `rgba(${borderColor.r}, ${borderColor.g}, ${borderColor.b}, ${borderColor.a})`,
                }}
              />
              <span className="text-gray-700">
                RGBA({borderColor.r}, {borderColor.g}, {borderColor.b}, {borderColor.a})
              </span>
            </button>
            
            {showBorderPicker && (
              <div className="absolute top-full left-0 mt-2 z-10">
                <div
                  className="fixed inset-0"
                  onClick={() => setShowBorderPicker(false)}
                />
                <SketchPicker
                  color={{
                    r: borderColor.r,
                    g: borderColor.g,
                    b: borderColor.b,
                    a: borderColor.a,
                  }}
                  onChange={(color) => onBorderColorChange(color.rgb)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Background Color */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Background Color
          </label>
          <div className="relative">
            <button
              onClick={() => setShowBackgroundPicker(!showBackgroundPicker)}
              disabled={isProcessing}
              className="flex items-center space-x-3 w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div
                className="w-8 h-8 rounded-lg border-2 border-gray-300"
                style={{
                  backgroundColor: `rgb(${backgroundColor.r}, ${backgroundColor.g}, ${backgroundColor.b})`,
                }}
              />
              <span className="text-gray-700">
                RGB({backgroundColor.r}, {backgroundColor.g}, {backgroundColor.b})
              </span>
            </button>
            
            {showBackgroundPicker && (
              <div className="absolute top-full left-0 mt-2 z-10">
                <div
                  className="fixed inset-0"
                  onClick={() => setShowBackgroundPicker(false)}
                />
                <SketchPicker
                  color={{
                    r: backgroundColor.r,
                    g: backgroundColor.g,
                    b: backgroundColor.b,
                  }}
                  onChange={(color) => onBackgroundColorChange(color.rgb)}
                  disableAlpha
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};