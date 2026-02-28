export const API_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  REFRESH_TOKEN: '/auth/refresh',
  LOGOUT: '/auth/logout',

  RECIPES: '/recipes',
  RECIPE_DETAILS: (recipeId: string) => `/recipes/${recipeId}`,
  RECIPE_LIKE: (recipeId: string) => `/recipes/${recipeId}/like`,

  CATEGORIES: '/recipes/categories',

  LIKED_RECIPES: '/users/me/liked-recipes',
  UPDATE_ME: '/users/me',
  USER_AVATAR: '/users/avatar',
  USER_PROFILE: (userId: string) => `/users/${userId}`,
  USER_RECIPES: (userId: string) => `/users/${userId}/recipes`,
};
