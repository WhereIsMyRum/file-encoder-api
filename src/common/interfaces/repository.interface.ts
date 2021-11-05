export interface RepositoryInterface<T> {
  insert(t: T): Promise<string>;
  getById(id: string): Promise<T>;
  getAll(): Promise<T[]>;
}
