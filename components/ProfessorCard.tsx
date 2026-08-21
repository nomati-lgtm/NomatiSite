'use client';

import { useState } from 'react';

type Professor = {
  nome: string;
  foto: string;
  email: string;
  site: string;
  lattes: string;
  linkedin: string;
  biografia?: string;
};

export default function ProfessorCard({
  professor
}: {
  professor: Professor
}) {
  const [modalAberto, setModalAberto] = useState(false);

  return (
    <>
      {/* CARD PRINCIPAL COMPACTO */}
      <div className="
        bg-white
        rounded-3xl
        shadow-lg
        p-8
        text-center
        hover:shadow-2xl
        transition
        flex
        flex-col
        items-center
        justify-between
      ">
        <div>
          <img
            src={professor.foto || 'https://via.placeholder.com/150'}
            alt={professor.nome}
            className="
              w-40
              h-40
              mx-auto
              rounded-full
              object-cover
              border-4
              border-[#0D3B66]
            "
          />

          <h3 className="mt-5 text-xl font-bold text-[#0D3B66]">
            {professor.nome}
          </h3>

          {/* E-mail logo abaixo da foto */}
          {professor.email ? (
            <a
              href={`mailto:${professor.email}`}
              className="inline-block text-slate-500 hover:text-[#0D3B66] transition mt-2 text-sm underline break-all"
            >
              {professor.email}
            </a>
          ) : (
            <p className="text-slate-400 mt-2 text-sm">
              E-mail não informado
            </p>
          )}
        </div>

        {/* Botão para abrir a biografia completa */}
        {professor.biografia && (
          <button
            onClick={() => setModalAberto(true)}
            className="mt-4 text-sm font-bold text-[#0D3B66] underline hover:text-[#0A2D4F] transition"
          >
            Ver Biografia Completa
          </button>
        )}

        {/* Links de Redes/Sites */}
        <div className="
          flex
          flex-wrap
          justify-center
          gap-2
          mt-5
        ">
          {professor.site && (
            <a
              href={professor.site}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#0D3B66] text-white px-3 py-2 rounded-lg text-sm"
            >
              Site
            </a>
          )}

          {professor.lattes && (
            <a
              href={professor.lattes}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#0D3B66] text-white px-3 py-2 rounded-lg text-sm"
            >
              Lattes
            </a>
          )}

          {professor.linkedin && (
            <a
              href={professor.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#0D3B66] text-white px-3 py-2 rounded-lg text-sm"
            >
              LinkedIn
            </a>
          )}
        </div>
      </div>

      {/* MODAL / CAIXA FLUTUANTE COM SCROLL PARA A BIOGRAFIA */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl max-h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Cabeçalho do Modal */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
              <h3 className="text-xl font-extrabold text-[#0D3B66] truncate pr-4">
                {professor.nome}
              </h3>
              <button
                onClick={() => setModalAberto(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-xl px-2 py-1 rounded-lg shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Conteúdo com Rolagem (Scroll) - min-h-0 e flex-1 corrigem o comportamento no mobile */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-left min-h-0 flex-1">
              <div className="flex items-center gap-4">
                <img
                  src={professor.foto || 'https://via.placeholder.com/150'}
                  alt={professor.nome}
                  className="w-20 h-20 rounded-full object-cover border-2 border-[#0D3B66] shrink-0"
                />
                <div>
                  <p className="text-sm font-semibold text-slate-600">E-mail:</p>
                  {professor.email ? (
                    <a href={`mailto:${professor.email}`} className="text-sm text-[#0D3B66] underline font-medium break-all">
                      {professor.email}
                    </a>
                  ) : (
                    <span className="text-sm text-slate-400">Não informado</span>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-[#0D3B66] uppercase tracking-wider mb-2">Biografia</h4>
                <div className="text-slate-700 leading-relaxed text-base whitespace-pre-line break-words overflow-x-hidden">
                  {professor.biografia}
                </div>
              </div>
            </div>

            {/* Rodapé do Modal */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
              <button
                onClick={() => setModalAberto(false)}
                className="bg-[#0D3B66] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#0A2D4F] transition text-sm"
              >
                Fechar
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}