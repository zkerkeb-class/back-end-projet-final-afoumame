import mongoose, { Document, Schema } from 'mongoose';

export interface IArtist extends Document {
  name: string;
  genre: string;
  biography?: string;
  popularity: number;
  createdAt: Date;
  updatedAt: Date;
  phoneticName: string;
}

const ArtistSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      unique: true,
      trim: true,
    },
    phoneticName: {
      type: String,
    },
    genres: {
      type: [String],
      required: true,
      default: [],
    },
    biography: {
      type: String,
      required: [true, 'Biography is required'],
      trim: true,
    },
    imageUrl: {
      type: String,
    },
    popularity: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

ArtistSchema.index({ name: 1 }, { unique: true });

ArtistSchema.post('save', function (error: any, doc: any, next: any) {
  if (error.code === 11000) {
    next(new Error('Un artiste avec ce nom existe déjà'));
  } else {
    next(error);
  }
});

export default mongoose.model<IArtist>('Artist', ArtistSchema);
