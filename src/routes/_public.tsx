import { createFileRoute, Outlet } from '@tanstack/react-router';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';

export const Route = createFileRoute('/_public')({
  component: PublicLayout,
});

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
