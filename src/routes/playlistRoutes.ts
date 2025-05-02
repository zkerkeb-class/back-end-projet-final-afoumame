import { Router } from 'express';
import {
  createPlaylist,
  deletePlaylist,
  getPlaylistById,
  getPlaylists,
  updatePlaylist,
} from '../controllers/playlistController';

const router = Router();

router.post('/', createPlaylist);
router.get('/', getPlaylists);
router.get('/:id', getPlaylistById);
router.put('/:id', updatePlaylist);
router.delete('/:id', deletePlaylist);

export default router;
