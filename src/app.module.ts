import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MongooseConfigModule } from './database/mongoose.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { EmailService } from './email/email.service';
import { ConfigModule } from '@nestjs/config';
import { CleanupService } from './cleanup/cleanup.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ProfileController } from './profile/profile.controller';
import { ProfileService } from './profile/profile.service';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // Specify the path to the public directory
    }),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    MongooseConfigModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController, ProfileController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    EmailService,
    CleanupService,
    ProfileService,
  ],
})
export class AppModule {}
