import { Meta } from "@/layout/meta";

const Custom500 = () => {
  return (
    <>
      <Meta
        title={"Pagamentos 350 - Erro 500"}
        description={"Problemas no Servidor"}
      />
      <div className="flex flex-col justify-center items-center gap-4">
        <h2>Erro 500: Problemas internos do Servidor</h2>
        <p>
          Desculpe tivemos um problema nos nossos servidores, tente novamente
          mais tarde ou tente recarregar a página
        </p>
        <button className="btn max-w-[150px] text-white" onClick={() => location.reload()}>Recarregar</button>
      </div>
    </>
  );
};

export default Custom500;
