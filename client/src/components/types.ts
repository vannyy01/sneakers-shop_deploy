export interface ItemDataType {
    label: string,
    value: string | number
}

export interface ItemsType {
    [key: string | number]: ItemDataType;
}

export interface HeadCell<T> {
    disablePadding: boolean;
    id: keyof T;
    label: string;
    numeric: boolean;
}
