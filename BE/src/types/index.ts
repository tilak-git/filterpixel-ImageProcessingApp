import { Request } from 'express';

export interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export interface ProcessImageParams {
  filePath: string;
  brightness: number;
  contrast: number;
  saturation: number;
  rotation: number;
}