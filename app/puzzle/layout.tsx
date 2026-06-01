export default function PuzzleLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-puzzle className="min-h-screen">
      {children}
    </div>
  );
}
