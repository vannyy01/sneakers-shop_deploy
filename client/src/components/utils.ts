
export const inArray = <T>(item: T, label:string, items: T[]): boolean =>
    items.findIndex(value => value[label] === item[label]) >= 0;
