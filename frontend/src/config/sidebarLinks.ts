import {
  FavouriteIcon,
  HomeIcon,
  UserIcon,
  PlusSignIcon,
} from '@hugeicons/core-free-icons';

export const sidebarLinks = [
  { label: 'Recipes', to: '/', icon: HomeIcon },
  { label: 'Add Recipe', to: '/recipes/create', icon: PlusSignIcon },
  { label: 'Liked', to: '/liked', icon: FavouriteIcon },
  { label: 'Profile', to: '/users', icon: UserIcon },
];
