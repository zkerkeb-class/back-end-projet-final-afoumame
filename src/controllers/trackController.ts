import { Request, Response } from 'express';
import Track from '../models/Track';

export const createTrack = async (req: Request, res: Response) => {
  try {
    const track = await Track.create(req.body);
    res.status(201).json(track);
  } catch (error: Error | unknown) {
    res.status(400).json({ message: error instanceof Error ? error.message : 'An error occurred' });
  }
};

export const getTracks = async (req: Request, res: Response) => {
  try {
    const tracks = await Track.find().populate('album').populate('artist');
    res.status(200).json(tracks);
  } catch (error: Error | unknown) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'An error occurred' });
  }
};

export const getTrackById = async (req: Request, res: Response) => {
  try {
    const track = await Track.findById(req.params.id).populate('album').populate('artist');

    if (!track) {
      return res.status(404).json({ message: 'Track not found' });
    }

    res.status(200).json(track);
  } catch (error: Error | unknown) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'An error occurred' });
  }
};

export const updateTrack = async (req: Request, res: Response) => {
  try {
    const track = await Track.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!track) {
      return res.status(404).json({ message: 'Track not found' });
    }

    res.status(200).json(track);
  } catch (error: Error | unknown) {
    res.status(400).json({ message: error instanceof Error ? error.message : 'An error occurred' });
  }
};

export const deleteTrack = async (req: Request, res: Response) => {
  try {
    const track = await Track.findByIdAndDelete(req.params.id);

    if (!track) {
      return res.status(404).json({ message: 'Track not found' });
    }

    res.status(200).json({ message: 'Track deleted successfully' });
  } catch (error: Error | unknown) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'An error occurred' });
  }
};
