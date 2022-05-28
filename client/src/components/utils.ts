export const inArray = <T>(item: T, label:string, items: T[]): boolean =>
    items.findIndex(value => value[label] === item[label]) >= 0;
// export const modifyURLSearchParams = (key: string, value: string) => {
//     const params = new URL(window.location.href);
//     if (filterArr[0].selectedOption !== null) {
//         params.searchParams.set(filterArr[0].filterName.id, filterArr[0].selectedOption.value as string);
//     } else {
//         params.searchParams.delete(filterArr[0].filterName.id);
//     }
//     window.history.pushState(null, null, params);
//     console.log(params.toString());
// }