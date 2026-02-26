export const APP_ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',

  HOME: '/',

  RECIPE_DETAILS: (recipeId: string) => `/recipes/${recipeId}`,
  ADD_RECIPE: '/recipes/add',

  USER_PROFILE: (userId: string) => `/users/${userId}`,
};
