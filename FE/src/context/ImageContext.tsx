import React, { createContext, useState, useContext, ReactNode } from 'react';

interface ImageContextType {
  imagePath: string | null;
  setImagePath: (path: string | null) => void;
  brightness: number;
  setBrightness: (value: number) => void;
  contrast: number;
  setContrast: (value: number) => void;
  saturation: number;
  setSaturation: (value: number) => void;
  rotation: number;
  setRotation: (value: number) => void;
  format: 'png' | 'jpeg';
  setFormat: (format: 'png' | 'jpeg') => void;
}

const ImageContext = createContext<ImageContextType | undefined>(undefined);

interface ImageProviderProps {
  children: ReactNode;
}

export const ImageProvider: React.FC<ImageProviderProps> = ({ children }) => {
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [brightness, setBrightness] = useState(1);
  const [contrast, setContrast] = useState(1);
  const [saturation, setSaturation] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [format, setFormat] = useState<'png' | 'jpeg'>('jpeg');

  const value = {
    imagePath, setImagePath,
    brightness, setBrightness,
    contrast, setContrast,
    saturation, setSaturation,
    rotation, setRotation,
    format, setFormat
  };

  return <ImageContext.Provider value={value}>{children}</ImageContext.Provider>;
};

export const useImageContext = () => {
  const context = useContext(ImageContext);
  if (context === undefined) {
    throw new Error('useImageContext must be used within an ImageProvider');
  }
  return context;
};