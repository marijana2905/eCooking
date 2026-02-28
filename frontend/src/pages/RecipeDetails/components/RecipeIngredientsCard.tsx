import { HugeiconsIcon } from '@hugeicons/react';
import { CheckmarkCircle03Icon } from '@hugeicons/core-free-icons';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type RecipeIngredientsCardProps = {
  ingredients: string[];
};

const RecipeIngredientsCard = ({ ingredients }: RecipeIngredientsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Ingredients</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {ingredients.map((ingredient, idx) => (
          <div
            key={idx}
            className="bg-muted/50 flex items-start gap-3 rounded-lg px-3 py-2.5"
          >
            <span className="bg-primary/10 text-primary mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-xs">
              <HugeiconsIcon icon={CheckmarkCircle03Icon} />
            </span>
            <span className="text-sm leading-relaxed">{ingredient}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RecipeIngredientsCard;
