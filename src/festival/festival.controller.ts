import { Controller, Get, Param, ParseIntPipe, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { FestivalGetDto } from './dto/out/festival-get.dto';
import { FestivalService } from './festival.service';

@ApiBearerAuth()
@ApiTags('festival')
@Controller('festival')
export class FestivalController {
  constructor(private readonly festivalService: FestivalService) {}

  @ApiQuery({
    name: 'limit',
    style: 'simple',
    required: false
  })
  @ApiQuery({
    name: 'offset',
    style: 'simple',
    required: false
  })
  @ApiResponse({
    description: 'A list of festival',
    type: [FestivalGetDto],
  })
  @Get('many')
  async findAll(@Req() req: Request): Promise<FestivalGetDto[]> {
    const limit: number = req.query.limit ? parseInt(req.query.limit.toString()) : 10
    const offset: number = req.query.offset ? parseInt(req.query.offset.toString()) : 0
    return await this.festivalService.getAll(limit, offset);
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
