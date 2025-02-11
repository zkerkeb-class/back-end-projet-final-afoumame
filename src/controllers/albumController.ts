import { Request, Response } from 'express';
import Album from '../models/Album';

export const createAlbum = async (req: Request, res: Response) => {
  try {
    const album = await Album.create(req.body);
    res.status(201).json(album);
  } catch (error: Error | unknown) {
    res.status(400).json({ message: error instanceof Error ? error.message : 'An error occurred' });
  }
};

export const getAlbums = async (req: Request, res: Response) => {
  try {
    const albums = await Album.find().populate('artist').populate('tracks');
    res.status(200).json(albums);
  } catch (error: Error | unknown) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'An error occurred' });
  }
};

export const getAlbumById = async (req: Request, res: Response) => {
  try {
    const album = await Album.findById(req.params.id).populate('artist').populate('tracks');

    if (!album) {
      return res.status(404).json({ message: 'Album not found' });
    }

    res.status(200).json(album);
  } catch (error: Error | unknown) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'An error occurred' });
  }
};

export const updateAlbum = async (req: Request, res: Response) => {
  try {
    const album = await Album.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!album) {
      return res.status(404).json({ message: 'Album not found' });
    }

    res.status(200).json(album);
  } catch (error: Error | unknown) {
    res.status(400).json({ message: error instanceof Error ? error.message : 'An error occurred' });
  }
};

export const deleteAlbum = async (req: Request, res: Response) => {
  try {
    const album = await Album.findByIdAndDelete(req.params.id);

    if (!album) {
      return res.status(404).json({ message: 'Album not found' });
    }

    res.status(200).json({ message: 'Album deleted successfully' });
  } catch (error: Error | unknown) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'An error occurred' });
  }
};
