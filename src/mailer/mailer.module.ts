import { Module } from '@nestjs/common';
import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'node:path';

@Module({
  imports: [
    NestMailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const templatesDir = join(__dirname, 'templates');

        return {
          preview:
            process.env.NODE_ENV === 'development' ? { open: true } : false,
          transport: {
            host: configService.get('mail.host'),
            port: configService.get('mail.port'),
            ignoreTLS: true,
            secure: configService.get('mail.secure'),
            auth: {
              user: configService.get('mail.user'),
              pass: configService.get('mail.pass'),
            },
          },
          defaults: {
            from: configService.get('mail.from'),
          },
          template: {
            dir: templatesDir,
            adapter: new HandlebarsAdapter(undefined, {
              inlineCssEnabled: true,
            }),
            options: {
              strict: false,
            },
          },
        };
      },
    }),
  ],
})
export class MailerModule {}
