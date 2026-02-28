import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type RecipeInstructionsCardProps = {
  instructions: string[];
};

const RecipeInstructionsCard = ({
  instructions,
}: RecipeInstructionsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Instructions</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {instructions.map((step, idx) => (
          <div key={idx} className="flex gap-4">
            <span className="bg-primary text-primary-foreground flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold">
              {idx + 1}
            </span>
            <p className="pt-1 text-sm leading-relaxed">{step}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RecipeInstructionsCard;
