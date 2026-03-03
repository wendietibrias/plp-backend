export function equal(
  key: string,
  value: string | boolean | number | Date | string[],
  betweenColumn: boolean = false,
) {
  if (betweenColumn) return `${key} = ${value}`;
  if (typeof value == 'boolean' && (process.env.DB_TYPE as any) == 'mysql')
    return `${key} = ${value == true ? 1 : 0}`;
  if (typeof value == 'boolean' && (process.env.DB_TYPE as any) == 'postgres')
    return `${key} = ${value == true}`;
  return `${key} = '${value}'`;
}

export function notEqual(
  key: string,
  value: string | number | boolean,
  betweenColumn: boolean = false,
) {
  if (betweenColumn) return `NOT ${key} = ${value}`;
  return `NOT ${key} = '${value}'`;
}

export function moreThanEqual(
  key: string,
  value: string | number,
  betweenColumn: boolean = false,
) {
  if (betweenColumn) return `${key} >= ${value}`;
  return `${key} >= '${value}'`;
}

export function lessThanEqual(
  key: string,
  value: string | number,
  betweenColumn: boolean = false,
) {
  if (betweenColumn) return `${key} <= ${value}`;
  return `${key} <= '${value}'`;
}

export function equalDate(key: string, value?: string) {
  const DateVal = value || new Date().getDate() + 1;
  return `EXTRACT(DAY FROM ${key}) = ${DateVal}`;
}

export function equalMonth(key: string, value?: string) {
  const month = value || new Date().getMonth() + 1;
  return `EXTRACT(MONTH FROM ${key}) = ${month}`;
}

export function equalYear(key: string, value?: string) {
  const year = value || new Date().getFullYear();
  return `EXTRACT(YEAR FROM ${key}) = ${year}`;
}

export function exactLike(key: string, value: string) {
  return `${key} LIKE '${value}%'`;
}

export function like(key: string, value: string) {
  return `${key} ILIKE '%${value.replaceAll('%', '\\%').split(' ').join('%')}%'`;
}

export function notLike(key: string, value: string) {
  return `${key} NOT LIKE '%${value}%'`;
}

export function isNull(key: string) {
  return `${key} IS NULL`;
}

export function isNotNull(key: string) {
  return `${key} IS NOT NULL`;
}

export function notIns(key: string, value: string[]) {
  const valueToString = value.map((val) => `'${val}'`).join(', ');
  return `${key} NOT IN (${valueToString})`;
}

export function Ins(key: string, value: string[] | number[]) {
  const valueToString = value.map((val) => `'${val}'`).join(', ');
  return `${key} IN (${valueToString})`;
}

export function betweenISOStringDate(key: string, first: Date, second: Date) {
  const startDate = first.toISOString().substr(0, 19).replace('T', ' ');
  const endDate = second.toISOString().substr(0, 19).replace('T', ' ');
  return `${key} BETWEEN '${startDate}' AND '${endDate}'`;
}

export function betweenStringDate(key: string, first: Date, second: Date) {
  return `${key} BETWEEN '${first}' AND '${second}'`;
}

export function moreThanStringDate(key: string, date: Date) {
  return `${key} > '${date.toISOString().slice(0, 10)}'`;
}

export function lessThanStringDate(key: string, date: Date) {
  return `${key} < '${date.toISOString().slice(0, 10)}'`;
}

export function moreThanEqualStringDate(key: string, date: Date) {
  return `${key} >= '${date.toISOString().slice(0, 10)}'`;
}

export function lessThanEqualISOStringDate(key: string, date: Date) {
  return `${key} <= '${date.toISOString().slice(0, 10)}'`;
}

export function lessThanEqualStringDate(key: string, date: Date) {
  return `${key} <= '${date}'`;
}
