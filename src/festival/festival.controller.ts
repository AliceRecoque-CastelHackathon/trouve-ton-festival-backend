import { Body, Controller, Get, Param, ParseIntPipe, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { FestivalGetDto } from './dto/out/festival-get.dto';
import { FestivalService } from './festival.service';
import { FestivalGetAnyDto } from './dto/in/festival-get-any.dto';

@ApiBearerAuth()
@ApiTags('festival')
@Controller('festival')
export class FestivalController {
  constructor(private readonly festivalService: FestivalService) {}

  @ApiResponse({
    description: 'A list of festival',
    type: [FestivalGetDto],
  })
  @Get('many')
  async findAll(@Body() festivalAnyDto: FestivalGetAnyDto): Promise<FestivalGetDto[]> {
    return await this.festivalService.getAll(festivalAnyDto);
  }

  @ApiResponse({
    description: 'A list of festival',
    type: [FestivalGetDto],
  })
  @Get('/byId/:id')
  async findById(@Param('id', ParseIntPipe) festivalId: number,): Promise<FestivalGetDto | null> {
    return await this.festivalService.getById(festivalId);
  }
}
