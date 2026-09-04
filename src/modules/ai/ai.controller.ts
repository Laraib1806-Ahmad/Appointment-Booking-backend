import { Controller, Post, Body, UseInterceptors } from '@nestjs/common';
import { AiService } from './ai.service';
import { RecommendSpecialtyDto } from './dto/recommend-specialty.dto';
import { DoctorsService } from '../doctors/doctors.service';
import { ResponseInterceptor } from '../../interceptors/response.interceptor';
import { FaqDto } from './dto/faq.dto';

@Controller('ai')
@UseInterceptors(ResponseInterceptor)
export class AiController {
  constructor(
    private aiService: AiService,
    private doctorsService: DoctorsService,
  ) {}

  @Post('recommend-specialty')
  async recommendSpecialty(@Body() dto: RecommendSpecialtyDto) {
    const specialties = await this.doctorsService.getDistinctSpecialties();

    // select distinct from doctors where status = 'verified'
    const recommendedSpecialty = await this.aiService.recommendSpecialty(
      dto.symptoms,
      specialties,
    );

    const matchingDoctors = await this.doctorsService.findAll(
      recommendedSpecialty,
    );

    const doctorsWithDetails = await Promise.all(
      matchingDoctors.map((doctor) =>
        this.doctorsService.findOneWithSchedule(doctor.id),
      ),
    );

    return {
      recommendedSpecialty,
      doctors: doctorsWithDetails,
    };
  }

  @Post('ingest-knowledge-base')
  async ingest() {
    return this.aiService.ingestKnowledgeBase();
  }

  @Post('ask-faq')
  async askFaq(@Body() dto: FaqDto) {
    const answer = await this.aiService.askFaq(dto.question);
    return { question: dto.question, answer };
  }
}
