import { useNavigate } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft02Icon } from '@hugeicons/core-free-icons';

import { Button } from '@/components/ui/button';

const BackButtonLink = () => {
  const navigate = useNavigate();

  return (
    <Button variant="ghost" className="w-fit" onClick={() => navigate(-1)}>
      <HugeiconsIcon icon={ArrowLeft02Icon} />
      Back
    </Button>
  );
};

export default BackButtonLink;
