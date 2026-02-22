type LogoProps = {
  size?: number;
  className?: string;
};

const Logo = ({ size = 40, className }: LogoProps) => {
  return (
    <img
      src="/images/eCookingLogo.png"
      alt="eCooking Logo"
      className={className}
      width={size}
      height={size}
    />
  );
};

export default Logo;
