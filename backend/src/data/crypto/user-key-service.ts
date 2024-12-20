import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto'
import { Injectable } from '@nestjs/common'

@Injectable()
export class UserKeyService {
  readonly CIPHER_ALGORITHM = 'aes-256-ecb'
  readonly PASSWORD_HASH_ALGORITHM = 'sha256'

  constructor() {
  }

  public createEncryptedUserDataKey(userPassword: string) {
    // Create a random key for the user (32 bytes so that data can be encrypted via aes-256)
    const userDataKey = randomBytes(32).toString('hex').substring(0, 32)
    return this.encryptUserDataKey(userDataKey, userPassword)

  }

  private encryptUserDataKey(userDataKey: string, userPassword: string): string {
    const userPasswordHash = this.createUserPasswordHash(userPassword)

    // Encrypt the user key with the password hash
    const cipher = createCipheriv(this.CIPHER_ALGORITHM, userPasswordHash, null)
    let encryptedUserDataKey = cipher.update(userDataKey, 'utf8', 'hex')
    encryptedUserDataKey += cipher.final('hex')

    return encryptedUserDataKey
  }


  public decryptUserDataKey(encryptedUserDataKey: string, userPassword: string) {
    const userPasswordHash =
      this.createUserPasswordHash(userPassword)

    // decryption
    const decipher = createDecipheriv(this.CIPHER_ALGORITHM, userPasswordHash, null)
    let decryptedUserDataKey = decipher.update(encryptedUserDataKey, 'hex', 'utf-8')
    decryptedUserDataKey += decipher.final('utf-8')

    return decryptedUserDataKey
  }

  public reencryptUserDataKey(currentUserDataKeyEncrypted: string, currentPassword: string, newPassword: string) {
    const decryptedUserDataKey = this.decryptUserDataKey(currentUserDataKeyEncrypted, currentPassword)
    return this.encryptUserDataKey(decryptedUserDataKey, newPassword)
  }

  public encryptData(data: string, decryptedUserDataKey: string): string {
    const cipher = createCipheriv(this.CIPHER_ALGORITHM, decryptedUserDataKey, null)
    let encrypted = cipher.update(data, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    return encrypted
  }

  public decryptData(data: string, decryptedUserDataKey: string) {
    const decipher = createDecipheriv(this.CIPHER_ALGORITHM, decryptedUserDataKey, null)
    let decrypted = decipher.update(data, 'hex', 'utf-8')
    decrypted += decipher.final('utf-8')
    return decrypted
  }

  // Create a hash from the users password, used to encrypt the user key, 32 bytes for aes-256
  private createUserPasswordHash(userPassword: string) {
    return createHash(this.PASSWORD_HASH_ALGORITHM, { outputLength: 32 })
      .update(userPassword).digest()
  }
}