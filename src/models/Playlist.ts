import mongoose, { Document, Schema } from 'mongoose';
import { ITrack } from './Track';

export interface IPlaylist extends Document {
  name: string;
  description?: string;
  tracks: ITrack['_id'][];
  duration: number;
  createdAt: Date;
  updatedAt: Date;
  trackCount: number;
  popularity: number;
}

const PlaylistSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  tracks: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Track',
    },
  ],
  coverUrl: {
    type: String,
  },
  trackCount: {
    type: Number,
    default: 0,
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
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

PlaylistSchema.pre('save', async function (next) {
  if (this.isModified('tracks')) {
    this.trackCount = this.tracks.length;
  }
  next();
});

PlaylistSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate() as { tracks?: mongoose.Types.ObjectId[] };
  if (update?.tracks) {
    const trackCount = update.tracks.length;
    this.setUpdate({ ...update, trackCount });
  }
  next();
});

export default mongoose.model<IPlaylist>('Playlist', PlaylistSchema);
