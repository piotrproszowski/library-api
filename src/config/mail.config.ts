import { registerAs } from '@nestjs/config';

export default registerAs('mail', () => ({
  host: process.env.MAIL_SMTP_HOST || 'localhost',
  port: process.env.MAIL_SMTP_PORT || 465,
  secure: process.env.MAIL_SMTP_SECURE === 'true' ? true : false,

  user: process.env.MAIL_AUTH_USER || 'postgres',
  pass: process.env.MAIL_AUTH_PASS || '1234',

  from: process.env.MAIL_FROM || '"Saveer" <no-reply@example.com>',
}));
