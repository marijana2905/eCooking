import { useTheme } from '@/hooks/useTheme';

type RecipeImageProps = {
  imageUrl: string | null;
  title: string;
};

const RecipeImage = ({ imageUrl, title }: RecipeImageProps) => {
  const { theme } = useTheme();

  const placeholderImage = `/images/recipe_placeholder_${
    theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme
  }.png`;

  return (
    <div className="overflow-hidden rounded-xl">
      <img
        src={imageUrl || placeholderImage}
        alt={title}
        className="aspect-3/2 w-full object-cover transition-transform duration-300 hover:scale-105"
      />
    </div>
  );
};

export default RecipeImage;
