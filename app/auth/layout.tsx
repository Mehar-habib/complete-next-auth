export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full flex items-center justify-center bg-sky-500">
      {children}
    </div>
  );
}
