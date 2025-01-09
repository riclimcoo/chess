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
        "flex flex-col rounded-md bg-slate-200 p-4 text-black shadow-md " +
        className
      }
    >
      {children}
    </div>
  );
}
