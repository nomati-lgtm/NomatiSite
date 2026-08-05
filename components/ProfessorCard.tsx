type Professor = {
  nome:string;
  foto:string;
  sala:string;
  site:string;
  lattes:string;
  linkedin:string;
};

export default function ProfessorCard({
  professor
}:{
  professor:Professor
}){

  return(

    <div className="
      bg-white
      rounded-3xl
      shadow-lg
      p-8
      text-center
      hover:shadow-2xl
      transition
    ">

      <img
        src={professor.foto}
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

      <p className="text-slate-500 mt-2">
        {professor.sala}
      </p>

      <div className="
        flex
        flex-wrap
        justify-center
        gap-2
        mt-5
      ">

        <a
          href={professor.site}
          className="bg-[#0D3B66] text-white px-3 py-2 rounded-lg"
        >
          Site
        </a>

        <a
          href={professor.lattes}
          className="bg-[#0D3B66] text-white px-3 py-2 rounded-lg"
        >
          Lattes
        </a>

        <a
          href={professor.linkedin}
          className="bg-[#0D3B66] text-white px-3 py-2 rounded-lg"
        >
          LinkedIn
        </a>

      </div>

    </div>

  );

}