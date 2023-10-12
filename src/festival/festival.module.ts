import { Module } from '@nestjs/common';
import { FestivalController } from './festival.controller';
import { FestivalService } from './festival.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FestivalEntity } from './entities/festival.entity';
import { FestivalCategoryEntity } from './entities/ref-festival-category.entity';
import { FestivalSubCategoryEntity } from './entities/ref-festival-subcategory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FestivalEntity,FestivalCategoryEntity,FestivalSubCategoryEntity])],
  controllers: [FestivalController],
  providers: [FestivalService],
  exports: [FestivalService]
})
export class FestivalModule {}
