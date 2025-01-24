import crypto from 'crypto';

// Constants
const key = 'SarvatraServiceAESEncryptDecrypt';
const algorithm = 'aes-256-cbc';
const ivLength = 16; // AES block size

// Function to encrypt text
export function encrypt(plainText) {
    try {
        const keyBytes = Buffer.from(key, 'utf-8');
        const iv = crypto.randomBytes(ivLength);
        const cipher = crypto.createCipheriv(algorithm, keyBytes, iv);

        let encrypted = cipher.update(plainText, 'utf-8', 'base64');
        encrypted += cipher.final('base64');

        // Combine IV and encrypted data
        const ivAndEncrypted = Buffer.concat([iv, Buffer.from(encrypted, 'base64')]);

        return ivAndEncrypted.toString('base64');
    } catch (e) {
        throw new Error('Encryption failed: ' + e.message);
    }
}

// Function to decrypt text
export function decrypt(encryptedText) {
    try {
        const keyBytes = Buffer.from(key, 'utf-8');
        const encryptedBytes = Buffer.from(encryptedText, 'base64');
        
        const iv = encryptedBytes.slice(0, ivLength);
        const encryptedData = encryptedBytes.slice(ivLength);

        const decipher = crypto.createDecipheriv(algorithm, keyBytes, iv);

        let decrypted = decipher.update(encryptedData, 'base64', 'utf-8');
        decrypted += decipher.final('utf-8');

        return decrypted;
    } catch (e) {
        throw new Error('Decryption failed: ' + e.message);
    }
}
