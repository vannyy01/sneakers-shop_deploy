/**
 * @param {string} name
 * @returns {[any]}
 */
export function getStorage(name: string) {
    const matches = localStorage.getItem(name) || '[]';
    return JSON.parse(matches);
}

export function setStorage(name: string, item: string): boolean {
    const matches = getStorage(name);
    if (!matches.includes(item)) {
        matches.push(item);
        localStorage.setItem(name, JSON.stringify(matches));
        return true;
    }
    return false;
}

export function checkStorage(name: string, item: string): boolean {
    const matches = getStorage(name);
    return !matches.includes(item);
}

export function removeStorage(name: string, item: string):void {
    const matches = getStorage(name);
    const newStorage = matches.filter((thing: string) => thing !== item);
    localStorage.setItem(name, JSON.stringify(newStorage));
}