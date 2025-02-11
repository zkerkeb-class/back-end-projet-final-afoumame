import mongoose, { Document, Schema } from 'mongoose';
import { IAlbum } from './Album';
import { IArtist } from './Artist';

export interface ITrack extends Document {
  title: string;
  artist: IArtist['_id'];
  album: IAlbum['_id'];
  duration: number;
  genre: string;
  releaseYear: number;
  popularity: number;
  playCount: number;
  createdAt: Date;
  updatedAt: Date;
  audioUrls: {
    mp3: string;
    wav: string;
  };
  thumbnail: string;
}

const TrackSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  artist: {
    type: Schema.Types.ObjectId,
    ref: 'Artist',
    required: [true, 'Artist is required'],
  },
  album: {
    type: Schema.Types.ObjectId,
    ref: 'Album',
    required: [true, 'Album is required'],
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
  },
  genres: {
    type: [String],
    required: [true, 'Genre is required'],
  },
  releaseYear: {
    type: Date,
    required: [true, 'Release date is required'],
  },
  popularity: {
    type: Number,
    default: 0,
  },
  audioUrls: {
    mp3: {
      type: String,
      required: [true, 'MP3 URL is required'],
    },
    wav: {
      type: String,
      required: [true, 'WAV URL is required'],
    },
  },
  thumbnail: {
    type: String,
    required: [true, 'Thumbnail URL is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<ITrack>('Track', TrackSchema);
