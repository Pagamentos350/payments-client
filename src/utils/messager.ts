export function getDaysLate(
  dataInicial: Date,
  dataFinal = new Date(Date.now()),
): number {
  const umDiaEmMilissegundos = 1000 * 60 * 60 * 24;
  const diferencaEmMilissegundos = dataFinal.getTime() - dataInicial.getTime();

  return Math.floor(diferencaEmMilissegundos / umDiaEmMilissegundos);
}

export function getClosestDate(
  dates: Date[],
): { data: Date; posicao: number } | null {
  if (dates.length === 0) {
    return null;
  }

  const hoje = new Date();
  if (hoje.getTime() < new Date(dates[0]).getTime()) {
    return null;
  }
  let menorDiferenca = Math.abs(hoje.getTime() - new Date(dates[0]).getTime());
  let posicao = 0;

  for (let i = 1; i < dates.length; i++) {
    const diferenca = Math.abs(hoje.getTime() - new Date(dates[i]).getTime());
    if (
      hoje.getTime() < new Date(dates[i]).getTime() ||
      diferenca > menorDiferenca
    ) {
      break;
    }
    menorDiferenca = diferenca;
    posicao = i;
  }

  return {
    data: dates[posicao],
    posicao,
  };
}

export function getMessage(debt: any, allCosturmers: any[], type = "late") {
  const costumerInDebt = allCosturmers.find(
    e => e.costumer_id === debt.costumer_id,
  );

  const checkClosestDate = getClosestDate(debt.due_dates);
  const daysLateCheck = checkClosestDate?.data
    ? getDaysLate(new Date(checkClosestDate?.data)) <= 3
    : false;

  if (daysLateCheck && checkClosestDate?.data) {
    const msg = emailExample?.[type]({
      value: debt.value,
      date: new Date(checkClosestDate?.data)
        ?.toISOString()
        ?.split("T")?.[0]
        ?.split("-")
        .reverse()
        .join("/"),
      description: debt.description,
      name: costumerInDebt.last_name,
    });

    return msg;
  }
}

const emailExample: {
  [key: string]: (details: {
    [key: string]: string | number | Date | undefined;
  }) => string;
} = {
  late: ({ value, date, description, name }) =>
    `Prezado(a)%20Sr.%20${name}.+%0A+Esperamos%20que%20este%20e-mail%20o%20encontre%20bem.%20Estamos%20escrevendo%20para%20lembrá-lo(a)%20de%20que%20sua%20dívida%20conosco%20venceu.+%0A+Detalhes%20da%20dívida:+%0A+Novo%20Valor:%20R$${Number(
      value,
    ).toFixed(2)}+%0A+Data%20de%20Vencimento:%20${String(date)
      .split("T")[0]
      .split("-")
      .join(
        "/",
      )}+%0A+Descrição%20da%20Dívida:%20${description}+%0A+Por%20favor,%20tome%20as%20medidas%20necessárias%20para%20garantir%20que%20o%20pagamento%20seja%20feito%20até%20a%20data%20de%20vencimento%20mencionada%20acima.%20Se%20você%20já%20efetuou%20o%20pagamento,%20por%20favor,%20desconsidere%20esta%20mensagem.`,
};
