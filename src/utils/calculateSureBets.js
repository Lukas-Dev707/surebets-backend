export function findSureBets(games) {
  const sureBets = [];
  

  games.forEach((game) => {
    const { partida, odds } = game;
    const { casa, empate, fora } = odds;

    const oddCasa = parseFloat(casa);
    const oddEmpate = parseFloat(empate);
    const oddFora = parseFloat(fora);

    if (!oddCasa || !oddEmpate || !oddFora) return;

    const sum = (1 / oddCasa) + (1 / oddEmpate) + (1 / oddFora);

    if (sum < 1) {
      const lucroPercentual = ((1 - sum) * 100).toFixed(2);

      sureBets.push({
        partida,
        odds: {
          casa: oddCasa,
          empate: oddEmpate,
          fora: oddFora,
        },
        lucro: `${lucroPercentual}%`
      });
    }
  });

  return sureBets;
}
