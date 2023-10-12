import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { FestivalGetDto } from './dto/out/festival-get.dto';
import { FestivalService } from './festival.service';
import { FestivalGetManyDto } from './dto/in/festival-get-many.dto';
import { AllowAnonymous } from '../common/decorator/allow-anonymous.decorator';
import { FestivalCreateDto } from './dto/in/festival-create.dto';
import { FestivalUpdateDto } from './dto/in/festival-update.dto';

@ApiTags('festival')
@AllowAnonymous()
@Controller('festival')
export class FestivalController {
  constructor(private readonly festivalService: FestivalService) {}

  @ApiResponse({
    description: 'A list of festival',
    type: [FestivalGetDto],
  })
  @HttpCode(HttpStatus.OK)
  @Post('getMany')
  async findMany(@Body() festivalAnyDto: FestivalGetManyDto): Promise<FestivalGetDto[]> {
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
  @HttpCode(HttpStatus.OK)
  @Post('create')
  async create(@Body() festivalCreateDto: FestivalCreateDto): Promise<FestivalGetDto> {
    return await this.festivalService.create(festivalCreateDto);
  }

  @ApiResponse({
    description: 'The created festival',
    type: [FestivalGetDto],
  })
  @Put('create')
  async update(@Body() festivalUpdateDto: FestivalUpdateDto): Promise<FestivalGetDto> {
    return await this.festivalService.create(festivalUpdateDto);
  }
}
