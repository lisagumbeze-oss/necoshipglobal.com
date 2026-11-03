export function generateTrackingNumber(prefix = "NS") {
  const year = new Date().getFullYear();
  const rand = Math.floor(Math.random() * 1e7)
    .toString()
    .padStart(7, "0");
  return `${prefix}-${year}-${rand}`;
}

export function generateClaimNumber() {
  return `CLM-${Date.now().toString(36).toUpperCase()}`;
}

export function generateTicketNumber() {
  return `TKT-${Date.now().toString(36).toUpperCase()}`;
}

export function generateInvoiceNumber() {
  return `INV-${Date.now().toString(36).toUpperCase()}`;
}

export function generateRecipientToken() {
  return `rcpt_${cryptoRandom(32)}`;
}

function cryptoRandom(length: number) {
  const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let out = "";
  for (let i = 0; i < length; i += 1) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}
