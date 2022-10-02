export type Result<E, O> = NotOk<E> | Ok<O>;

export class Ok<O> {
  constructor(public readonly value: O) {}

  isNotOk(): this is NotOk<unknown> {
    return false;
  }

  isOk(): this is NotOk<O> {
    return true;
  }
}

export class NotOk<N> {
  constructor(public readonly value: N) {}

  isNotOk(): this is NotOk<N> {
    return true;
  }

  isOk(): this is NotOk<unknown> {
    return false;
  }
}
