import { Request, Response } from 'express';
import Playlist from '../models/Playlist';

export const createPlaylist = async (req: Request, res: Response) => {
  try {
    const playlist = await Playlist.create(req.body);
    res.status(201).json(playlist);
  } catch (error: Error | unknown) {
    res.status(400).json({ message: error instanceof Error ? error.message : 'An error occurred' });
  }
};

export const getPlaylists = async (req: Request, res: Response) => {
  try {
    const playlists = await Playlist.find().populate('owner').populate('tracks');
    res.status(200).json(playlists);
  } catch (error: Error | unknown) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'An error occurred' });
  }
};

export const getPlaylistById = async (req: Request, res: Response) => {
  try {
    const playlist = await Playlist.findById(req.params.id).populate('owner').populate('tracks');

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    res.status(200).json(playlist);
  } catch (error: Error | unknown) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'An error occurred' });
  }
};

export const updatePlaylist = async (req: Request, res: Response) => {
  try {
    const playlist = await Playlist.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    res.status(200).json(playlist);
  } catch (error: Error | unknown) {
    res.status(400).json({ message: error instanceof Error ? error.message : 'An error occurred' });
  }
};

export const deletePlaylist = async (req: Request, res: Response) => {
  try {
    const playlist = await Playlist.findByIdAndDelete(req.params.id);

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    res.status(200).json({ message: 'Playlist deleted successfully' });
  } catch (error: Error | unknown) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'An error occurred' });
  }
};
