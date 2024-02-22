import { registerAs } from '@nestjs/config';

export default registerAs('upload', () => ({
  destination: process.env.UPLOAD_DESTINATION || './uploads',
}));
