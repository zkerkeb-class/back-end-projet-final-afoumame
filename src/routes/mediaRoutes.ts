import express from 'express';
import { deleteMedia, processMedia } from '../controllers/mediaController';
import upload from '../middlewares/uploadMiddleware';

const router = express.Router();

router.post('/upload', upload.single('media'), processMedia);
router.delete('/delete', deleteMedia);

export default router;
