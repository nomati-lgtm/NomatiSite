'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { MoreVertical, X } from 'lucide-react';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Se estiver em qualquer página que comece com /admin, esconde a Navbar
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const itens = [
    { nome: 'Sobre Nós', link: '#sobre' },
    { nome: 'Nossa Equipe', link: '#equipe' },
    { nome: 'Especialidades', link: '#especialidades' },
    { nome: 'Publicações', link: '#publicacoes' },
    { nome: 'Documentos', link: '#documentos' },
    { nome: 'Em Números', link: '#numeros' },
    { nome: 'Notícias', link: 'noticias' },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm w-full">
      <div className="max-w-[92rem] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex flex-col">
          
          {/* Linha da Logo + Botão de 3 pontinhos no celular */}
          <div className="flex items-center justify-between gap-6 py-6">
            <div className="flex items-center gap-6">
              <img
                src="logo.jpg"
                alt="NOMATI"
                className="h-16 md:h-24 w-auto object-contain"
              />
              <div>
                <h1 className="text-3xl md:text-5xl font-bold text-[#0D3B66]">
                  NOMATI
                </h1>
                <p className="text-sm md:text-xl text-slate-600 mt-1">
                  Núcleo de Otimização da Manufatura e Tecnologia da Inovação
                </p>
              </div>
            </div>

            {/* Botão de 3 Pontinhos (Aparece só no Celular) */}
            <button
              className="md:hidden p-3 text-slate-700 hover:text-[#0D3B66] transition rounded-xl bg-slate-50 border"
              onClick={() => setOpen(!open)}
            >
              {open ? <X size={32} /> : <MoreVertical size={32} />}
            </button>
          </div>

          {/* Menu Desktop (Fica oculto no celular e aparece centralizado no PC) */}
          <nav className="hidden md:flex flex-wrap justify-center gap-8 lg:gap-10 py-5 border-t">
            {itens.map((item) => (
              <a
                key={item.nome}
                href={item.link}
                className="font-medium text-lg lg:text-xl text-slate-700 hover:text-[#0D3B66] transition"
              >
                {item.nome}
              </a>
            ))}
          </nav>

        </div>
      </div>

      {/* Menu Mobile (Abre ao clicar nos 3 pontinhos) */}
      {open && (
        <div className="md:hidden bg-white border-t border-slate-200 shadow-xl">
          {itens.map((item) => (
            <a
              key={item.nome}
              href={item.link}
              className="block px-8 py-5 border-b border-slate-100 font-medium text-lg text-slate-700 hover:bg-slate-50 transition"
              onClick={() => setOpen(false)}
            >
              {item.nome}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}