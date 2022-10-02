export declare type ClassType<T = any> = {
    new (...args: any[]): T;
};
export declare type RecursivePartial<T> = {
    [K in keyof T]?: RecursivePartial<T[K]>;
};
export declare type PartialRecord<K extends keyof any, T> = {
    [P in K]?: T;
};
export declare type KeysMatching<T, V> = {
    [K in keyof T]-?: T[K] extends V ? K : never;
}[keyof T];
