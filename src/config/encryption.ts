import crypto from 'crypto';
import config from './config';

export class CryptoService {
  static encrypt(text: string) {
    const iv = crypto.randomBytes(config.encryption.ivLength);
    const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      Buffer.from(config.encryption.encryptionKey),
      iv,
    );
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  }

  static decrypt(text: string) {
    const [ivHex, encryptedHex] = text.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const encryptedText = Buffer.from(encryptedHex, 'hex');
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      Buffer.from(config.encryption.encryptionKey),
      iv,
    );
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }
}
