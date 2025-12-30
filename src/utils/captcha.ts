export const generateCaptcha = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let captcha = '';
  for (let i = 0; i < 6; i++) {
    captcha += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return captcha;
};

export const generateCode = (prefix: string, existingCodes: string[]): string => {
  let code: string;
  do {
    const randomNum = Math.floor(Math.random() * 90000) + 10000;
    code = `${prefix}${randomNum}`;
  } while (existingCodes.includes(code));
  return code;
};