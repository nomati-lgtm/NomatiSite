type Props = {
  titulo:string;
  resumo:string;
  imagem:string;
  data:string;
};

export default function NoticiaCard({
  titulo,
  resumo,
  imagem,
  data
}:Props){

  return(

    <div className="
      bg-white
      rounded-3xl
      shadow-lg
      overflow-hidden
    ">

      <img
        src={imagem}
        alt={titulo}
        className="
          w-full
          h-56
          object-cover
        "
      />

      <div className="p-6">

        <span className="text-sm text-slate-500">
          {data}
        </span>

        <h3 className="
          mt-2
          text-xl
          font-bold
          text-[#0D3B66]
        ">
          {titulo}
        </h3>

        <p className="mt-3 text-slate-600">
          {resumo}
        </p>

      </div>

    </div>

  );

}