export interface ViewBuilder<T> {
  build(data: T): string;
}
