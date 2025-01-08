export function Card({
  className = "",
  children,
}: {
  className?: string | undefined;
  children: any;
}) {
  return (
    <div
      className={
        "flex flex-col bg-slate-200 p-4 rounded-md shadow-md text-black " +
        className
      }
    >
      {children}
    </div>
  );
}
