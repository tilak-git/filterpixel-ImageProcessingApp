import { Request, Response } from 'express';
import { processImageFile, generatePreview } from '../utils/imageService';
import { MulterRequest, ProcessImageParams } from '../types';
import { deleteExpiredFiles, isValidFileType, setupFileCleanup } from '../utils/fileUtils';

export const uploadImage = (req: MulterRequest, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  if (!isValidFileType(req.file.mimetype)) {
    deleteExpiredFiles([req.file.path]);
    return res.status(400).json({ error: 'Invalid file type' });
  }

  const addUploadedFile = setupFileCleanup(5 * 60 * 1000, 15 * 60 * 1000);

  addUploadedFile(req.file.path);
  res.json({ filePath: req.file.path });
};

export const processImage = async (req: Request, res: Response) => {
  const params = req.body as ProcessImageParams;

  try {
    const preview = await generatePreview(params);
    res.json({ preview: `data:image/jpeg;base64,${preview.toString('base64')}` });
  } catch (error) {
    res.status(500).json({ error: 'Image processing failed' });
  }
};

export const downloadImage = async (req: Request, res: Response) => {
  const params = req.query as unknown as ProcessImageParams & { format: string };

  if (!params.filePath || typeof params.filePath !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing filePath' });
  }

  try {
    const { buffer, format } = await processImageFile(params);

    res.setHeader('Content-Disposition', `attachment; filename=processed_image.${format}`);
    res.setHeader('Content-Type', `image/${format}`);
    res.setHeader('Content-Length', buffer.length);
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ error: 'Image processing failed' });
  }
};