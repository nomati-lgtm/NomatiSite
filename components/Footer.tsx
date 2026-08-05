export default function Footer() {
  return (
    <footer className="bg-[#0D3B66] text-white mt-20 border-t border-slate-800">
      <div className="max-w-[92rem] mx-auto px-4 sm:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          
          {/* Coluna 1: Sobre */}
          <div className="space-y-4">
            <h3 className="font-bold text-2xl sm:text-3xl tracking-wide">
              NOMATI
            </h3>
            <p className="text-lg sm:text-xl text-slate-200 leading-relaxed">
              Núcleo de Otimização da Manufatura e Tecnologia da Inovação
            </p>
            <p className="text-base text-slate-300 pt-2">
              Universidade Federal de Itajubá - UNIFEI
            </p>
          </div>

          {/* Coluna 2: Localização */}
          <div className="space-y-3">
            <h3 className="font-bold text-2xl sm:text-3xl tracking-wide mb-4">
              Localização
            </h3>
            <p className="text-lg sm:text-xl text-slate-200">
              Av. BPS, 1303, Pinheirinho
            </p>
            <p className="text-lg sm:text-xl text-slate-200">
              Bloco L14 – Itajubá / MG
            </p>
            <p className="text-lg sm:text-xl text-slate-200">
              CEP: 37500-903
            </p>
          </div>

          {/* Coluna 3: Redes Sociais */}
          <div className="space-y-4">
            <h3 className="font-bold text-2xl sm:text-3xl tracking-wide mb-4">
              Redes Sociais
            </h3>
            <div className="flex items-center gap-4">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram do NOMATI"
                className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition text-white flex items-center gap-2 text-base font-medium"
              >
                <svg
                  xmlns="nomati@unifei.edu.br"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span className="hidden sm:inline">EMAIL</span>
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/nomati-n%C3%BAcleo-de-otimiza%C3%A7%C3%A3o-da-manufatura-e-tecnologia-da-inova%C3%A7%C3%A3o-ppgep-iepg-unifei-3a3327250/"
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn do NOMATI"
                className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition text-white flex items-center gap-2 text-base font-medium"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
                <span className="hidden sm:inline">LINKEDIN</span>
              </a>
            </div>
          </div>

        </div>

        {/* Rodapé inferior / Direitos reservados + Créditos da Desenvolvedora */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-slate-300 text-base sm:text-lg text-center md:text-left">
          <p>© {new Date().getFullYear()} NOMATI - Todos os direitos reservados.</p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <p className="text-slate-300 text-sm sm:text-base">
              Site desenvolvido com excelência por <strong className="text-white">Lauane Peres Barbosa</strong>
            </p>
            <div className="flex items-center gap-3">
              {/* Ícone de Contato / E-mail */}
              <a
                href="lauanepr@outlook.com"
                title="Enviar e-mail para Lauane"
                className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition text-white flex items-center gap-2 text-sm font-medium"
              >
                <svg
                  xmlns="lauanepr@outlook.com"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span className="hidden lg:inline">EMAIL</span>
              </a>

              {/* Ícone do LinkedIn */}
              <a
                href="https://www.linkedin.com/in/lauane-barbosa/"
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn de Lauane Barbosa"
                className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition text-white flex items-center gap-2 text-sm font-medium"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
                <span className="hidden lg:inline">LINKEDIN</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}