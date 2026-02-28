export const APP_ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',

  HOME: '/',

  RECIPE_DETAILS: (recipeId: string) => `/recipes/${recipeId}`,
  ADD_RECIPE: '/recipes/add',
  EDIT_RECIPE: (recipeId: string) => `/recipes/${recipeId}/edit`,

  LIKED_RECIPES: '/liked',

  USER_PROFILE: (userId: string) => `/users/${userId}`,
};
