import { NestApplicationOptions } from '@nestjs/common';

export const AppOptions: NestApplicationOptions = {
  rawBody: true,
  cors: {
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
  },
};

export function calculatePercentage(amount: number, percentage: number) {
  return (amount * percentage) / 100;
}
export function formatCurrencyNoDecimal(num: number) {
  const p = num.toString();
  return p
    .split('')
    .reverse()
    .reduce(function (acc, num, i) {
      return num + (num != '-' && i && !(i % 3) ? ',' : '') + acc;
    }, '');
}

export function formatCurrency(numMM: any, toFixed = 2) {
  const num = parseInt(numMM) ? parseInt(numMM) : 0;
  const p = num.toFixed(toFixed).split('.');
  return (
    p[0]
      .split('')
      .reverse()
      .reduce(function (acc, num, i) {
        return num + (num != '-' && i && !(i % 3) ? ',' : '') + acc;
      }, '') +
    '.' +
    p[1]
  );
}
