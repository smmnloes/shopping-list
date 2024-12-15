## Encryption scheme

Goal: User data should be able to be encrypted with only the user having access, no one else (including admins)

How to achieve:
- Symmetric encryption/decryption key, encrypted with user password
- Gets created during registration / login (if not present) because that is where we have the user password in plaintext
- Gets delivered to user inside the JWT in plaintext form. This is not ideal obviously, but its the only way to have a good UX (not having to enter
   the password any time encryption is needed). But at least it makes it reasonably hard to intercept the plaintext key for admins (me)

How could data be lost?
- User loses their password (nothing to be done here)
- Encryption key is somehow lost from db (same ...)