import { Router } from 'express';
import {
  createArtist,
  deleteArtist,
  getArtistById,
  getArtists,
  updateArtist,
} from '../controllers/artistController';

const router = Router();

router.post('/', createArtist);
router.get('/', getArtists);
router.get('/:id', getArtistById);
router.put('/:id', updateArtist);
router.delete('/:id', deleteArtist);

export default router;
