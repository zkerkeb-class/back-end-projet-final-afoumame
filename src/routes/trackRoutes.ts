import { Router } from 'express';
import {
  createTrack,
  deleteTrack,
  getTrackById,
  getTracks,
  updateTrack,
} from '../controllers/trackController';

const router = Router();

router.post('/', createTrack);
router.get('/', getTracks);
router.get('/:id', getTrackById);
router.put('/:id', updateTrack);
router.delete('/:id', deleteTrack);

export default router;
