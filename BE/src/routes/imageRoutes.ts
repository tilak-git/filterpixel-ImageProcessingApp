import express from 'express';
import multer from 'multer';
import { downloadImage, processImage, uploadImage } from '../controller/imageController';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('image'), uploadImage);
router.post('/process', processImage);
router.get('/download', downloadImage);

export default router;