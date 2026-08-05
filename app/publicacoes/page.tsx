import { publicacoes } from "@/data/publicacoes";

export default function Publicacoes(){

  return(

    <main className="max-w-7xl mx-auto px-6 py-20">

      <h1 className="
        text-5xl
        font-bold
        text-[#0D3B66]
        mb-12
      ">
        Publicações
      </h1>

      <section className="mb-12">

        <h2 className="text-3xl font-bold mb-6">
          Graduação
        </h2>

        {publicacoes.graduacao.map((item)=>(
          <p key={item.titulo}>
            {item.titulo}
          </p>
        ))}

      </section>

      <section className="mb-12">

        <h2 className="text-3xl font-bold mb-6">
          Mestrado
        </h2>

        {publicacoes.mestrado.map((item)=>(
          <p key={item.titulo}>
            {item.titulo}
          </p>
        ))}

      </section>

      <section>

        <h2 className="text-3xl font-bold mb-6">
          Doutorado
        </h2>

        {publicacoes.doutorado.map((item)=>(
          <p key={item.titulo}>
            {item.titulo}
          </p>
        ))}

      </section>

    </main>

  );

}