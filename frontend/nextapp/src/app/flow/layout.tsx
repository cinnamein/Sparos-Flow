import Header from "@/components/Header";

export default function FlowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1 px-[var(--spacing-margin)] pt-[var(--spacing-space-md)] pb-48 flex flex-col gap-[var(--spacing-space-lg)]">
        {children}
      </main>
    </>
  );
}
