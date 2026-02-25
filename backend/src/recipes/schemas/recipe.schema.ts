import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export enum RecipeCategory {
  BREAKFAST = 'Breakfast',
  LUNCH = 'Lunch',
  DINNER = 'Dinner',
  DESSERT = 'Dessert',
  SNACK = 'Snack',
  APPETIZER = 'Appetizer',

  VEGAN = 'Vegan',
  VEGETARIAN = 'Vegetarian',
  GLUTEN_FREE = 'Gluten-Free',
  DAIRY_FREE = 'Dairy-Free',
  LENTEN = 'Lenten',
  KETO = 'Keto',
  LOW_CARB = 'Low-Carb',

  MEDITERRANEAN = 'Mediterranean',
  ITALIAN = 'Italian',
  MEXICAN = 'Mexican',
  ASIAN = 'Asian',
  MIDDLE_EASTERN = 'Middle Eastern',
  FRENCH = 'French',
}

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

  @Prop({
    type: [String],
    enum: Object.values(RecipeCategory),
    required: true,
    default: [],
  })
  categories: RecipeCategory[];

  @Prop({ required: true })
  prepTime: number;

  @Prop({ default: null })
  imageUrl: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  author: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  likes: Types.ObjectId[];
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);
