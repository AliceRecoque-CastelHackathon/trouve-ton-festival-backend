import { Module } from '@nestjs/common';
import { FestivalController } from './festival.controller';
import { FestivalService } from './festival.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FestivalEntity } from './entities/festival.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FestivalEntity])],
  controllers: [FestivalController],
  providers: [FestivalService],
  exports: [FestivalService]
})
export class FestivalModule {}
