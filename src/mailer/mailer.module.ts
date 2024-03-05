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
      useFactory: (configService: ConfigService) => ({
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
          template: 'index',
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(undefined, {
            inlineCssEnabled: true,
            //@ts-expect-error kkk
            inlineCssOptions: { url: ' ', preserveMediaQueries: true },
          }),
          options: { strict: false },
        },
        options: {
          partials: {
            dir: join(__dirname, 'templates/partials'),
            options: { strict: false },
          },
        },
      }),
    }),
  ],
})
export class MailerModule {}
