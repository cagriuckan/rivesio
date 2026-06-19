export default function PageContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-5">
      {children}
    </div>
  );
}
