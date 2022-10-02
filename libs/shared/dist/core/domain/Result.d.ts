export declare type Result<E, O> = NotOk<E> | Ok<O>;
export declare class Ok<O> {
    readonly value: O;
    constructor(value: O);
    isNotOk(): this is NotOk<unknown>;
    isOk(): this is NotOk<O>;
}
export declare class NotOk<N> {
    readonly value: N;
    constructor(value: N);
    isNotOk(): this is NotOk<N>;
    isOk(): this is NotOk<unknown>;
}
