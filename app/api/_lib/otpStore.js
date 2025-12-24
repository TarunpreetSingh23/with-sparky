// app/api/_lib/otpStore.js

export const otpStore = new Map();

/* Normalize phone numbers to avoid mismatch */
export function normalizePhone(phone) {
  return phone
    .replace("whatsapp:", "")
    .replace(/\D/g, "")
    .slice(-10); // last 10 digits
}
