export function inr(amount: number) {
  return "₹" + amount.toLocaleString("en-IN");
}

export function orderId() {
  const s = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "EM-";
  for (let i = 0; i < 6; i++) out += s[Math.floor(Math.random() * s.length)];
  return out;
}
