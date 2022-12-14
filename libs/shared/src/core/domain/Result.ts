export type Result<O, N = Error> = NotOk<N> | Ok<O>;

export class Ok<O> {
  constructor(public readonly value: O) {}

  isNotOk(): this is NotOk<never> {
    return false;
  }

  isOk(): this is Ok<O> {
    return true;
  }

  mapOk<P>(fn: (o: O) => P): Result<P, never> {
    return new Ok(fn(this.value));
  }

  mapNotOk<M>(_: (n: never) => M): Result<O, M> {
    return this;
  }

  expect(message?: string): O {
    return this.value;
  }
}

export class NotOk<N> {
  constructor(public readonly value: N) {}

  isNotOk(): this is NotOk<N> {
    return true;
  }

  isOk(): this is Ok<never> {
    return false;
  }

  mapOk<P>(_: (o: never) => P): Result<P, N> {
    return this;
  }

  mapNotOk<M>(fn: (n: N) => M): Result<never, M> {
    return new NotOk(fn(this.value));
  }

  expect(message?: string): never {
    throw new Error(message ?? "Result.expect() failed");
  }
}

export const ok = <O>(value: O) => new Ok(value);
export const notOk = <N>(value: N) => new NotOk(value);

export const fromThrowable = <T>(fn: () => T): Result<T> => {
  try {
    return ok(fn());
  } catch (err) {
    return notOk(err instanceof Error ? err : new Error(String(err)));
  }
};
