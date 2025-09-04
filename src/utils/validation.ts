export const validateEmail = (email: string): string => {
  if (email && !/\S+@\S+\.\S+/.test(email)) {
    return 'E-mail inválido.';
  }
  return '';
};

export const validatePhone = (phone: string): string => {
  if (phone && !/^\d{10,15}$/.test(phone)) {
    return 'Número de telefone inválido.';
  }
  return '';
};

/**
 * Valida o formato de um período de tempo.
 * Aceita os formatos "MM/AAAA - MM/AAAA" ou "MM/AAAA - Presente".
 * @param period O período a ser validado.
 * @returns Uma string de erro se o formato for inválido, caso contrário, uma string vazia.
 */
export const validatePeriod = (period: string): string => {
  if (!period) return ''; // Não valida se estiver vazio, deixa para o validador de campo obrigatório

  const periodRegex = /^(0[1-9]|1[0-2])\/\d{4} - ((0[1-9]|1[0-2])\/\d{4}|Presente)$/i;

  if (!periodRegex.test(period)) {
    return 'Formato de período inválido. Use "MM/AAAA - MM/AAAA" ou "MM/AAAA - Presente".';
  }

  return '';
};
