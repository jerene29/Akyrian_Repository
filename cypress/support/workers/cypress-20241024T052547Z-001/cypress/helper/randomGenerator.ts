import moment = require("moment");

export const randomAlphaNumeric = (length: number) => {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let result = '';
  for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

export const randomAlphabet = (length: number) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let result = '';
  for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

export const randomDate = () => {
  const start = new Date(2012, 0, 1)
  const end = new Date()
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  return moment(date);
}