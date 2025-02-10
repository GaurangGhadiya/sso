// const expiresInMinutes = 60;  // Set expiration time in minutes
const expiresInMinutes = 480;  // Set expiration time in minutes
const expirationDate = new Date();
expirationDate.setMinutes(expirationDate.getMinutes() + expiresInMinutes);

export default expirationDate