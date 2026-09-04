import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { ConfigurationService } from './configuration/configuration.service';
import { LoggerModule } from './logger/logger.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/auth.guard';
import { CaslModule } from './casl/casl.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { DoctorsModule } from './modules/doctors/doctors.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { ClinicsModule } from './modules/clinics/clinics.module';
import { SchedulesModule } from './modules/schedules/schedules.module';
import { AiModule } from './modules/ai/ai.module';

@Module({
  imports: [
    UserModule,
    AppointmentsModule,
    AiModule,
    DoctorsModule,
    ClinicsModule,
    SchedulesModule,
    ConfigurationModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigurationModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: Number(configService.get('DATABASE_PORT')),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),

        ssl: {
          rejectUnauthorized: false,
        },

        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    LoggerModule,

    AuthModule,
    CaslModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppModule],
})
export class AppModule {}
