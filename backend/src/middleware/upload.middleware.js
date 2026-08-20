import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { config } from '../config/env.js';

// Ensure upload directory exists
if (!fs.existsSync(config.upload.dir)) {
  fs.mkdirSync(config.upload.dir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.upload.dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.pdf', '.doc', '.docx', '.txt', '.md', '.json'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedExtensions.includes(ext) || file.mimetype.includes('pdf') || file.mimetype.includes('word') || file.mimetype.includes('text')) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${ext}. Please upload PDF, Word (.doc, .docx), or text files.`));
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: config.upload.maxFileSizeMb * 1024 * 1024 },
  fileFilter
});

export default upload;
