import mongoose, { Document, Schema } from 'mongoose';
import { IArtist } from './Artist';

export interface IAlbum extends Document {
  title: string;
  artist: IArtist['_id'];
  releaseYear: number;
  genre: string;
  popularity: number;
  createdAt: Date;
  trackCount: number;
  duration: number;
  coverUrl: string;
}

const AlbumSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  artist: {
    type: Schema.Types.ObjectId,
    ref: 'Artist',
    required: [true, 'Artist is required'],
    trim: true,
  },
  releaseDate: {
    type: Date,
    required: [true, 'Release date is required'],
  },
  genres: {
    type: [String],
    required: [true, 'Genre is required'],
  },
  coverUrl: {
    type: String,
  },
  tracks: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Track',
    },
  ],
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
  },
  trackCount: {
    type: Number,
    default: 0,
  },

  popularity: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

AlbumSchema.pre('save', async function (next) {
  if (this.isModified('tracks')) {
    this.trackCount = this.tracks.length;
  }
  next();
});

AlbumSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate() as { tracks?: mongoose.Types.ObjectId[] };
  if (update?.tracks) {
    const trackCount = update.tracks.length;
    this.setUpdate({ ...update, trackCount });
  }
  next();
});

export default mongoose.model<IAlbum>('Album', AlbumSchema);
