import { Controller, Get } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { FestivalGetDto } from './dto/out/festival-get.dto';
import { FestivalService } from './festival.service';

@Controller('festival')
export class FestivalController {
  constructor(private readonly festivalService: FestivalService) {}

  @ApiResponse({
    description: 'A list of n festival',
    type: [FestivalGetDto],
  })
  @Get('all')
  async findAll(limit: number, startId: number): Promise<FestivalGetDto[]> {
    return [new FestivalGetDto()];
  }
}
