export type ClassType<T = any> = { new (...args: any[]): T };

export type RecursivePartial<T> = {
  [K in keyof T]?: RecursivePartial<T[K]>;
};

export type PartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
};

export type KeysMatching<T, V> = {
  [K in keyof T]-?: T[K] extends V ? K : never;
}[keyof T];
