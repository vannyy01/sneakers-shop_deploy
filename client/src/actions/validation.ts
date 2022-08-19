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

// return true if value is absent in localStorage
export function checkStorage(name: string, item: string): boolean {
    const matches = getStorage(name);
    return !matches.includes(item);
}

export function removeStorage(name: string, item: string): void {
    const matches = getStorage(name);
    const newStorage = matches.filter((thing: string) => thing !== item);
    localStorage.setItem(name, JSON.stringify(newStorage));
}

/**
 * RFC 2822 standard email validation
 * @param mail
 */
export function validateEmail(mail: string): boolean {
    const mailFormat = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)])/;
    const checkFewAtSigns = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return mailFormat.test(mail) && checkFewAtSigns.test(mail);
}

/**
 * To check a password between 8 and 20 characters which contain at least one numeric digit, one uppercase and one lowercase letter
 * @param inputTxt
 */
export function checkPassword(inputTxt: string): boolean {
    const passwordCheck = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
    return passwordCheck.test(inputTxt);
}

export function validateNumberInput(value: string): number {
    return +value >= 0 ? +value : 0;
}