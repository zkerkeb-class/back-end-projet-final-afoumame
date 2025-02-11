import { Router } from 'express';
import {
  createAlbum,
  deleteAlbum,
  getAlbumById,
  getAlbums,
  updateAlbum,
} from '../controllers/albumController';

const router = Router();

router.post('/', createAlbum);
router.get('/', getAlbums);
router.get('/:id', getAlbumById);
router.put('/:id', updateAlbum);
router.delete('/:id', deleteAlbum);

export default router;
