export function Center({ children }: { children: any }) {
  return (
    <div className="flex h-screen w-screen flex-row flex-wrap items-center justify-center gap-4 bg-gray-900">
      {children}
    </div>
  );
}
