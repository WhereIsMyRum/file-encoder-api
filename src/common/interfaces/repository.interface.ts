export interface RepositoryInterface<T> {
  save(data: T): Promise<T | null>;
  insert(data: T): Promise<string>;
  getById(id: string): Promise<T | null>;
  getAll(): Promise<T[]>;
  delete(id: string): Promise<void>;
}
