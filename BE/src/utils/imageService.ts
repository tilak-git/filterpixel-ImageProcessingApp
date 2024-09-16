import sharp from 'sharp';
import fs from 'fs';
import { ProcessImageParams } from '../types';

export const processImageFile = async (params: ProcessImageParams & { format: string }) => {
  const { filePath, brightness, contrast, saturation, rotation, format } = params;

  if (!fs.existsSync(filePath)) {
    throw new Error('File not found');
  }

  const image = sharp(filePath)
    .rotate(Number(rotation))
    .modulate({
      brightness: Number(brightness),
      saturation: Number(saturation)
    })
    .linear(Number(contrast), -(128 * Number(contrast)) + 128);

  let buffer: Buffer;
  if (format === 'png') {
    buffer = await image.png({ compressionLevel: 9 }).toBuffer();
  } else {
    buffer = await image.jpeg({ quality: 90 }).toBuffer();
  }

  return { buffer, format };
};

export const generatePreview = async (params: ProcessImageParams) => {
  const { filePath, brightness, contrast, saturation, rotation } = params;

  const image = sharp(filePath)
    .rotate(rotation)
    .modulate({
      brightness: brightness,
      saturation: saturation
    })
    .linear(contrast, -(128 * contrast) + 128);

  return image
    .resize(300)
    .jpeg({ quality: 60 })
    .toBuffer();
};