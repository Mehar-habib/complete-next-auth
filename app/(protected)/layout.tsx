import { Navbar } from "./_components/navbar";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return (
    <div className="w-full h-full flex flex-col gap-y-10 items-center justify-center bg-sky-500">
      <Navbar />
      {children}
    </div>
  );
}
