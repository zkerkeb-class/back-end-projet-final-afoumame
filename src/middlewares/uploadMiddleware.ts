import multer from 'multer';
import path from 'path';

// Pour l'audio
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/temp');
  },
  filename: (req, file, cb) => {
    const prefix = file.mimetype.startsWith('audio/') ? 'audio' : 'image';
    const filename = `${prefix}-${Date.now()}-${path.basename(
      file.originalname,
      path.extname(file.originalname),
    )}${path.extname(file.originalname)}`;
    cb(null, filename);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'audio/mpeg',
      'audio/wav',
      'audio/x-m4a',
      'audio/aac',
      'audio/ogg',
      'audio/webm',
      'audio/flac',
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          'Format non supporté. Formats acceptés: JPG, PNG, WebP, GIF, MP3, WAV, M4A, AAC, OGG, WEBM, FLAC',
        ),
      );
    }
  },
});

export default upload;
