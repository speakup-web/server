export interface UserRepository {
  getPasswordByEmail(email: string): Promise<string>;
  getRoleByEmail(email: string): Promise<string>;
}
