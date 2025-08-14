import { ptBR } from "date-fns/locale";

// Configuração centralizada de locale para português brasileiro
export const localeConfig = {
  // Locale do date-fns
  dateFns: ptBR,
  
  // Configuração para toLocaleString
  toLocaleString: {
    locale: 'pt-BR',
    options: {
      month: 'long',
      year: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
  },
  
  // Configuração para formatação de datas
  dateFormat: {
    short: "dd/MM/yyyy",
    long: "dd 'de' MMMM 'de' yyyy",
    withTime: "dd 'de' MMMM 'de' yyyy 'às' HH:mm",
    monthYear: "MMMM yyyy",
    monthYearShort: "MMM yyyy"
  }
};

// Função helper para formatar datas em português
export const formatDate = (date, format = 'long') => {
  const { format: dateFnsFormat } = require('date-fns');
  
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  return dateFnsFormat(date, localeConfig.dateFormat[format], {
    locale: localeConfig.dateFns
  });
};

// Função helper para formatar números em português
export const formatNumber = (number, options = {}) => {
  return number.toLocaleString(localeConfig.toLocaleString.locale, {
    ...localeConfig.toLocaleString.options,
    ...options
  });
};

// Função helper para formatar moeda em português
export const formatCurrency = (amount, currency = 'Kz') => {
  return `${formatNumber(amount)} ${currency}`;
};

export default localeConfig; 