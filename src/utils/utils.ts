export function formatDateString(dateString: string): string {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (secondsAgo < 60) {
    return `${secondsAgo} segundos atrás`;
  }

  const minutesAgo = Math.floor(secondsAgo / 60);
  if (minutesAgo < 60) {
    return `${minutesAgo} minutos atrás`;
  }

  const hoursAgo = Math.floor(minutesAgo / 60);
  if (hoursAgo < 24) {
    return `${hoursAgo} horas atrás`;
  }

  const daysAgo = Math.floor(hoursAgo / 24);
  return `${daysAgo} dias atrás`;
}

export function formatMoney(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

// Convert Date em "2026-08-22T15:07:13.000Z"
export function dateToISOString(date: Date): string {
  return date.toISOString();
}

export function formatCNPJ(cnpj: string): string {
  const cleanedCNPJ = cnpj.replace(/\D/g, ""); // Remove non-digit characters
  if (cleanedCNPJ.length !== 14) {
    return cnpj; // Return original if not 14 digits
  }
  return cleanedCNPJ.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    "$1.$2.$3/$4-$5",
  );
}
