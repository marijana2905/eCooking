import { Badge } from '@/components/ui/badge';

type RecipeTagsProps = {
  categories: string[];
  tags: string[];
};

const RecipeTags = ({ categories, tags }: RecipeTagsProps) => {
  if (categories.length === 0 && tags.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Badge key={cat}>{cat}</Badge>
          ))}
        </div>
      )}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              #{tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipeTags;
