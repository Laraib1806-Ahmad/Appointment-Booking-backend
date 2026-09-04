import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { DoctorsModule } from '../doctors/doctors.module';

@Module({
  imports: [DoctorsModule],
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}
