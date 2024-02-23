import * as crypto from 'crypto';

function generateUniqueToken(): [string, Date] {
  const expirationDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  const expirationDate = new Date(Date.now() + expirationDuration);

  return [crypto.randomBytes(32).toString('hex'), expirationDate];
}

export default generateUniqueToken;
