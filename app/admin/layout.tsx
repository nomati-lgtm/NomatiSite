'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Se o usuário estiver na tela de login, renderiza apenas o conteúdo sem a estrutura do painel
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Layout padrão para as páginas internas do admin (/admin, /admin/professores, etc.)
  return (
    <div className="min-h-screen bg-slate-100 font-sans flex flex-col">

      {/* Conteúdo da página */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}