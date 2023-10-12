import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FestivalEntity } from './entities/festival.entity';
import { Entity, Repository } from 'typeorm';
import { FestivalGetDto } from './dto/out/festival-get.dto';

import { FestivalGetAnyDto } from './dto/in/festival-get-any.dto';

import { I_open_data_festival_response } from 'src/api-consumer/interface/i_open_data_festival_response';
import { I_open_data_festival } from 'src/api-consumer/interface/i_open_data_festival';


@Injectable()
export class FestivalService {
  constructor(
    @InjectRepository(FestivalEntity)
    private festivalsRepository: Repository<FestivalEntity>,
  ) { }

  async getMany(festivalAnyDto: FestivalGetAnyDto): Promise<FestivalGetDto[]> {
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

    async populateFestivals(data :I_open_data_festival_response){
      
      data.results.forEach(async(element:I_open_data_festival )=> {
        let newfestival: boolean = false;
        let festival: FestivalEntity = new FestivalEntity();
        await this.festivalsRepository.findOneBy({
          externalId: element.identifiant
        }).then(response=>{
          if(response!=null)
          festival= response;
        });
        festival.externalId = element.identifiant;
        festival.name = element.nom_du_festival;
        //festival.creationDate = element.annee_de_creation_du_festival;
        festival.region = element.region_principale_de_deroulement;
        festival.department = element.departement_principal_de_deroulement;
        festival.zipcode = parseInt(element.code_postal_de_la_commune_principale_de_deroulement);
        festival.address = element.adresse_postale;
        festival.geoPosX = element.geocodage_xy.lon;
        festival.geoPosY = element.geocodage_xy.lat;
        festival.email = element.adresse_e_mail;
        festival.website = element.site_internet_du_festival;
      });
    }

    private async getOrCreateCategory(name: string ){

    }
    private async getOrCreateSubcategory(name: string){

    }



}
