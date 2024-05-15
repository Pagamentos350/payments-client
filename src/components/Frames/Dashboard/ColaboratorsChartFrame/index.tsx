import { useUsers } from "@/context/UsersContext";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Chart, GoogleChartWrapperChartType } from "react-google-charts";

const ColaboratorsChartsFrame = () => {
  const { getUsersByOccupation, getUsersByProjects } = useAnalytics();

  const dataBars = [
    [
      "Colaboradores",
      "Numero de projetos",
      { role: "style" },
      {
        sourceColumn: 0,
        role: "annotation",
        type: "string",
        calc: "stringify",
      },
    ],
    ...getUsersByProjects(),
  ];

  const dataPie = [
    ["Colaboradores", "Área de atuação"],
    ...getUsersByOccupation(),
  ];

  const options = {
    title: `Distribuição de Colaboradores`,
    titlePosition: "none",
    titleTextStyle: {
      textAlignment: "center",
      fontSize: 18,
      bold: true,
    },
    backgroundColor: "transparent",
    legend: { position: "bottom" },
  };

  return (
    <div className="flex flex-col md:flex-row mx-auto md:w-[90%] dark:text-white justify-between w-full items-center shadow-lg">
      {[
        {
          data: dataPie,
          options,
          className: "h-[600px] md:h-[85vh] dark:text-white ",
          type: "PieChart",
        },
        {
          data: dataBars,
          options,
          className: "h-[600px] md:h-[85vh] ",
          type: "BarChart",
        },
      ].map(({ data, options, className, type }, index) => {
        return (
          <div key={index} className="w-full dark:!text-white">
            <Chart
              chartType={type as GoogleChartWrapperChartType}
              data={data}
              options={options}
              width={"100%"}
              className={className}
            />
          </div>
        );
      })}
    </div>
  );
};

export default ColaboratorsChartsFrame;
