import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FestivalEntity } from './entities/festival.entity';
import { Repository } from 'typeorm';
import { FestivalGetDto } from './dto/out/festival-get.dto';

@Injectable()
export class FestivalService {
  constructor(
    @InjectRepository(FestivalEntity)
    private festivalsRepository: Repository<FestivalEntity>,
  ) { }

  async getAll(limit: number, offset: number): Promise<FestivalGetDto[]> {
    const entities: FestivalEntity[] = await this.festivalsRepository.find({
      skip: offset,
      take: limit
    });
    const results: FestivalGetDto[] = [];

    entities.forEach(async (festivalEntity: FestivalEntity) => {
      results.push(new FestivalGetDto(festivalEntity));
    });

    return results;
  }

}
