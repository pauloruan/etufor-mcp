export function formatBusNumber(numero: string): string {
  return numero.padStart(3, "0");
}

export function getCurrentFortalezaDate(): string {
  const now = new Date();

  const options: Intl.DateTimeFormatOptions = {
    timeZone: "America/Fortaleza",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };

  const formatter = new Intl.DateTimeFormat("pt-BR", options);
  const formattedDate = formatter.format(now);
  const parts = formattedDate.split("/");

  const replacedDate = parts.reverse().join("");
  return replacedDate;
}
