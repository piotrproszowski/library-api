import { Module, Global } from '@nestjs/common';
import { ConfigModule } from './infrastructure/config/config.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { MailerModule } from './infrastructure/mailer/mailer.module';

@Global()
@Module({
  imports: [ConfigModule, DatabaseModule, MailerModule],
  exports: [ConfigModule, DatabaseModule, MailerModule],
})
export class SharedModule {}
