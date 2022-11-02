export declare type Result<O, N = Error> = NotOk<N> | Ok<O>;
export declare class Ok<O> {
    readonly value: O;
    constructor(value: O);
    isNotOk(): this is NotOk<never>;
    isOk(): this is Ok<O>;
    mapOk<P>(fn: (o: O) => P): Result<P, never>;
    mapNotOk<M>(_: (n: never) => M): Result<O, M>;
    expect(message?: string): O;
}
export declare class NotOk<N> {
    readonly value: N;
    constructor(value: N);
    isNotOk(): this is NotOk<N>;
    isOk(): this is Ok<never>;
    mapOk<P>(_: (o: never) => P): Result<P, N>;
    mapNotOk<M>(fn: (n: N) => M): Result<never, M>;
    expect(message?: string): never;
}
export declare const ok: <O>(value: O) => Ok<O>;
export declare const notOk: <N>(value: N) => NotOk<N>;
export declare const fromThrowable: <T>(fn: () => T) => Result<T, Error>;
