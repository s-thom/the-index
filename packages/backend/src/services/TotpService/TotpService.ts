export default interface ITotpService {
  generateSecret(): string;
  validateCode(secret: string, code: string): boolean;
}
