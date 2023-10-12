import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FestivalEntity } from './entities/festival.entity';
import { Repository } from 'typeorm';
import { FestivalGetDto } from './dto/out/festival-get.dto';
import { FestivalGetAnyDto } from './dto/in/festival-get-any.dto';

@Injectable()
export class FestivalService {
  constructor(
    @InjectRepository(FestivalEntity)
    private festivalsRepository: Repository<FestivalEntity>,
  ) { }

  async getAll(festivalAnyDto: FestivalGetAnyDto): Promise<FestivalGetDto[]> {
    let selectOpt: any = undefined;
    if (festivalAnyDto.categoryId) {
      selectOpt = {idCategory : festivalAnyDto.categoryId};
    }
    if (festivalAnyDto.region) {
      if (!selectOpt) {
        selectOpt = {region : festivalAnyDto.region};
      }
      else {
        selectOpt.region = festivalAnyDto.region;
      }
    }

    const festivalEntity: FestivalEntity[] = await this.festivalsRepository.find(
      {
        skip: festivalAnyDto.offset ?? 0,
        take: festivalAnyDto.limit ?? 10,
        ...(selectOpt ? {select: selectOpt} : {})
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

}
