import { UserKeyService } from './user-key-service'

it('Key encryption', async () => {
  const service = new UserKeyService()
  const encryptedKey = service.createEncryptedUserDataKey('password')
  console.log(encryptedKey)
  const data = ''
  const decryptedKey = service.decryptUserDataKey(encryptedKey, 'password')
  console.log(decryptedKey)
  const encryptedData = service.encryptData(data, decryptedKey)
  console.log(encryptedData)
  const decryptedData = service.decryptData(encryptedData, decryptedKey)
  console.log(decryptedData)
})
