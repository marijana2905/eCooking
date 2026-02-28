import type { User } from './auth.types';

export type Recipe = {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  categories: string[];
  prepTime: number; // in minutes
  imageUrl: string | null;
  tags: string[];
  author: User;
  numOfLikes: number;
  isLiked: boolean;
};
