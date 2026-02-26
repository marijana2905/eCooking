export const API_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  REFRESH_TOKEN: '/auth/refresh',
  LOGOUT: '/auth/logout',

  RECIPES: '/recipes', // paginted with search and filter for category
  RECIPE_DETAILS: (recipeId: string) => `/recipes/${recipeId}`,
};
