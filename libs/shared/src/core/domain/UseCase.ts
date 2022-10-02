export interface UseCase<P, T> {
  execute(properties: P): T;
}
