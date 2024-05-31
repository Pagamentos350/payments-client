import { Meta } from "@/layout/meta";
import { useRouter } from "next/router";

const Custom404 = () => {
  const router = useRouter();

  return (
    <>
      <Meta
        title={"Pagamentos 350 - Erro 404"}
        description={"Página não encontrada"}
      />
      <div className="flex flex-col justify-center items-center gap-4">
        <h2>Erro 404: Página não encontrada</h2>
        <p>
          Desculpe mas a página que você está procurando não foi encontrada nos
          nossos servidores, volter para o painel
        </p>
        <button
          className="btn max-w-[150px] text-white"
          onClick={() => router.push("/colaborators")}
        >
          Voltar
        </button>
      </div>
    </>
  );
};

export default Custom404;
