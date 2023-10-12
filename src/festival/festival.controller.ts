import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { FestivalGetDto } from './dto/out/festival-get.dto';
import { FestivalService } from './festival.service';
import { FestivalGetAnyDto } from './dto/in/festival-get-any.dto';
import { AllowAnonymous } from '../common/decorator/allow-anonymous.decorator';
import { FestivalCreateDto } from './dto/in/festival-create.dto';

@ApiTags('festival')
@AllowAnonymous()
@Controller('festival')
export class FestivalController {
  constructor(private readonly festivalService: FestivalService) {}

  @ApiResponse({
    description: 'A list of festival',
    type: [FestivalGetDto],
  })
  @Post('getMany')
  async findMany(@Body() festivalAnyDto: FestivalGetAnyDto): Promise<FestivalGetDto[]> {
    return await this.festivalService.getMany(festivalAnyDto);
  }

  @ApiResponse({
    description: 'The festival with specified id',
    type: FestivalGetDto,
  })
  @Get('/byId/:id')
  async findById(@Param('id', ParseIntPipe) festivalId: number,): Promise<FestivalGetDto | null> {
    return await this.festivalService.getById(festivalId);
  }

  @ApiResponse({
    description: 'The created festival',
    type: [FestivalGetDto],
  })
  @Post('create')
  async create(@Body() festivalCreateDto: FestivalCreateDto): Promise<FestivalGetDto> {
    return await this.festivalService.create(festivalCreateDto);
  }
}
