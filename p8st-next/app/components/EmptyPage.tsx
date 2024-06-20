interface IEmptyPageProps {
  icon?: any;
  text: string;
  children?: any;
}

export const EmptyPage = ({ icon, text, children }: IEmptyPageProps) => {
  return (
    <section className="hero flex flex-col items-center justify-center min-h-96 card dark:bg-base-10">
      <div className="hero-content flex flex-col items-center text-center gap-y-4">
        <div className="text-gray-500">
          {/* - Bounce animation */}
          {icon}
        </div>
        <div>{text}</div>
        {children}
      </div>
    </section>
  );
};
