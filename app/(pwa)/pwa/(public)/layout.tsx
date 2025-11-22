export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-white dark:bg-gray-900">
      {/* Public pages have a website-like experience */}
      {/* No fixed navigation or app-like constraints */}
      <div className="w-full">
        {children}
      </div>
    </div>
  );
}