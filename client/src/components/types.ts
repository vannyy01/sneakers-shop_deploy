export interface ItemDataType {
    __isNew__?: boolean;
    count?: number,
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

export type Order = 'asc' | 'desc';
export type OrderBy = 'priceAsc' | 'priceDesc' | 'title';
