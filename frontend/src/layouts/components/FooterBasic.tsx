const FooterBasic = () => {
  return (
    <footer className="text-muted-foreground mt-auto w-full py-4 text-center text-sm">
      &copy; {new Date().getFullYear()}{' '}
      <a
        href="https://github.com/marijana2905/eCooking"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-primary underline underline-offset-4"
      >
        eCooking
      </a>
    </footer>
  );
};

export default FooterBasic;
