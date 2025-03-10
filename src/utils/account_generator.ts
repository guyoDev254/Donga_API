export function generateAccNumber(userId: string) {
  const randomNumber = Math.floor(100000 + Math.random() * 900000).toString();
  const user = userId ? userId.slice(-4) : '';
  const accountNumber = `ACC-${user}-${randomNumber}`;
  return accountNumber;
}
