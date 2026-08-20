import { publicacoes } from "@/data/publicacoes";

export default function Publicacoes() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-20 w-full">
      <h1 className="text-5xl font-bold text-[#0D3B66] mb-12">
        Publicações
      </h1>

      {/* Seção Graduação */}
      <section className="mb-12 w-full">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          Graduação
        </h2>
        <div className="flex flex-col gap-4 w-full">
          {publicacoes.graduacao.map((item) => (
            <div 
              key={item.titulo} 
              className="w-full bg-white p-6 rounded-lg shadow-sm border border-gray-100 break-words"
            >
              <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                {item.titulo}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Seção Mestrado */}
      <section className="mb-12 w-full">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          Mestrado
        </h2>
        <div className="flex flex-col gap-4 w-full">
          {publicacoes.mestrado.map((item) => (
            <div 
              key={item.titulo} 
              className="w-full bg-white p-6 rounded-lg shadow-sm border border-gray-100 break-words"
            >
              <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                {item.titulo}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Seção Doutorado */}
      <section className="w-full">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          Doutorado
        </h2>
        <div className="flex flex-col gap-4 w-full">
          {publicacoes.doutorado.map((item) => (
            <div 
              key={item.titulo} 
              className="w-full bg-white p-6 rounded-lg shadow-sm border border-gray-100 break-words"
            >
              <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                {item.titulo}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}