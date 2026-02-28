export const APP_ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',

  HOME: '/',

  RECIPE_DETAILS: (recipeId: string) => `/recipes/${recipeId}`,

  LIKED_RECIPES: '/liked',

  USER_PROFILE: (userId: string) => `/users/${userId}`,
};
