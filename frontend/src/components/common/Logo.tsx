import { useNavigate } from 'react-router-dom';

import { APP_ROUTES } from '@/config/appRoutes';
import { cn } from '@/lib/utils';

type LogoProps = {
  size?: number;
  className?: string;
};

const Logo = ({ size = 40, className }: LogoProps) => {
  const navigate = useNavigate();

  return (
    <img
      src="/images/eCookingLogo.png"
      alt="eCooking Logo"
      className={cn('cursor-pointer', className)}
      width={size}
      height={size}
      onClick={() => navigate(APP_ROUTES.HOME)}
    />
  );
};

export default Logo;
