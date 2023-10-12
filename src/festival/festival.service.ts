import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FestivalEntity } from './entities/festival.entity';
import { Repository } from 'typeorm';
import { FestivalGetDto } from './dto/out/festival-get.dto';
import { FestivalGetManyDto } from './dto/in/festival-get-many.dto';
import { FestivalCreateDto } from './dto/in/festival-create.dto';

@Injectable()
export class FestivalService {
  constructor(
    @InjectRepository(FestivalEntity)
    private festivalsRepository: Repository<FestivalEntity>,
  ) { }

  async getMany(festivalAnyDto: FestivalGetManyDto): Promise<FestivalGetDto[]> {
    let whereOpt: any = undefined;
    if (festivalAnyDto.categoryId) {
      whereOpt = {idCategory : festivalAnyDto.categoryId};
    }
    if (festivalAnyDto.region) {
      if (!whereOpt) {
        whereOpt = {region : festivalAnyDto.region};
      }
      else {
        whereOpt.region = festivalAnyDto.region;
      }
    }

    const festivalEntity: FestivalEntity[] = await this.festivalsRepository.find(
      {
        skip: festivalAnyDto.offset ?? 0,
        take: festivalAnyDto.limit ?? 10,
        ...(whereOpt ? {where: whereOpt} : {})
      }
    );
    const results: FestivalGetDto[] = [];

    festivalEntity.forEach(async (festivalEntity: FestivalEntity) => {
      results.push(new FestivalGetDto(festivalEntity));
    });

    return results;
  }

  async getById(festivalId: number): Promise<FestivalGetDto | null> {
    const festivalEntity: FestivalEntity | null = await this.festivalsRepository.findOneBy({
      id: festivalId
    });

    return festivalEntity ? new FestivalGetDto(festivalEntity) : null;
  }

  async create(festivalCreateDto: FestivalCreateDto): Promise<FestivalGetDto> {
    const newFestival: FestivalEntity = this.festivalsRepository.create(festivalCreateDto);
    await this.festivalsRepository.save(newFestival);
    return new FestivalGetDto(newFestival);
  }
}
