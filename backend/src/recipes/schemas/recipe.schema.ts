import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type RecipeDocument = HydratedDocument<Recipe>;

@Schema({
  timestamps: true,
  toJSON: {
    transform: function (
      _,
      ret: { _id?: Types.ObjectId; id?: string; __v?: unknown },
    ) {
      delete ret.__v;
      if (ret._id) {
        ret.id = ret._id.toString();
        delete ret._id;
      }
      return ret;
    },
  },
})
export class Recipe {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [String], required: true })
  ingredients: string[];

  @Prop({ type: [String], required: true })
  instructions: string[];

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  prepTime: number;

  @Prop({ default: null })
  imageUrl: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  author: Types.ObjectId;
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);
