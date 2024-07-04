export function generateRandomPassword() {
    const passwordLength = 12; // Adjust as needed
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_+={}[\]|;:<>,.?/`~';
    let password = '';
    for (let i = 0; i < passwordLength; i++) {
        password += characters[Math.floor(Math.random() * characters.length)];
    }
    return password;
}