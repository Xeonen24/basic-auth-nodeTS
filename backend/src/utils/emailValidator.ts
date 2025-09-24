export function isValidEmail(email: string): boolean {
  const re = /^[\w.!#$%&'*+/=?^_`{|}~-]+@[\w-]+(\.[\w-]+)+$/;
  return re.test(email);
}
