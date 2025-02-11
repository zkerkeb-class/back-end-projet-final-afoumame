import { Request, Response } from 'express';
import Artist from '../models/Artist';

export const createArtist = async (req: Request, res: Response) => {
  try {
    const { name, biography, genres, imageUrl } = req.body;

    const existingArtist = await Artist.findOne({ name });
    if (existingArtist) {
      return res.status(400).json({
        success: false,
        error: 'Un artiste avec ce nom existe déjà',
      });
    }

    if (!genres || !Array.isArray(genres) || genres.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'At least one genre is required',
      });
    }

    const artist = new Artist({
      name,
      biography,
      genres,
      imageUrl,
    });

    await artist.save();
    res.status(201).json(artist);
  } catch (error: Error | unknown) {
    res.status(400).json({ message: error instanceof Error ? error.message : 'An error occurred' });
  }
};

export const getArtists = async (req: Request, res: Response) => {
  try {
    const artists = await Artist.find();
    res.status(200).json(artists);
  } catch (error: Error | unknown) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'An error occurred' });
  }
};

export const getArtistById = async (req: Request, res: Response) => {
  try {
    const artist = await Artist.findById(req.params.id);

    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }

    res.status(200).json(artist);
  } catch (error: Error | unknown) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'An error occurred' });
  }
};

export const updateArtist = async (req: Request, res: Response) => {
  try {
    const artist = await Artist.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }

    res.status(200).json(artist);
  } catch (error: Error | unknown) {
    res.status(400).json({ message: error instanceof Error ? error.message : 'An error occurred' });
  }
};

export const deleteArtist = async (req: Request, res: Response) => {
  try {
    const artist = await Artist.findByIdAndDelete(req.params.id);

    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }

    res.status(200).json({ message: 'Artist deleted successfully' });
  } catch (error: Error | unknown) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'An error occurred' });
  }
};
