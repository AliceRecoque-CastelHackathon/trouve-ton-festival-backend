import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FestivalEntity } from './entities/festival.entity';
import { Entity, Repository } from 'typeorm';
import { FestivalGetDto } from './dto/out/festival-get.dto';
import { FestivalGetManyDto } from './dto/in/festival-get-many.dto';
import { FestivalCreateDto } from './dto/in/festival-create.dto';

import { I_open_data_festival_response } from 'src/api-consumer/interface/i_open_data_festival_response';
import { I_open_data_festival } from 'src/api-consumer/interface/i_open_data_festival';
import { FestivalCategoryEntity } from './entities/ref-festival-category.entity';
import { FestivalSubCategoryEntity } from './entities/ref-festival-subcategory.entity';


@Injectable()
export class FestivalService {
  constructor(
    @InjectRepository(FestivalEntity)
    private festivalsRepository: Repository<FestivalEntity>,
    @InjectRepository(FestivalCategoryEntity)
    private categoryRepository: Repository<FestivalCategoryEntity>,
    @InjectRepository(FestivalSubCategoryEntity)
    private subcategoryRepository: Repository<FestivalSubCategoryEntity>,

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

  async populateFestivals(data: I_open_data_festival_response) {

    data.results.forEach(async (element: I_open_data_festival) => {
      let newfestival: boolean = false;
      let festival: FestivalEntity = new FestivalEntity();
      await this.festivalsRepository.findOneBy({
        externalId: element.identifiant
      }).then(response => {
        if (response != null)
          festival = response;
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
      festival.category = await this.getOrCreateCategory(element.discipline_dominante);
      festival.subCategory = [];
      // if (element.sous_categorie_arts_visuels_et_arts_numeriques) {
      //   festival.subCategory.push(
      //     await this.getOrCreateSubcategory(element.sous_categorie_arts_visuels_et_arts_numeriques));
      // }
      // await this.getOrCreateSubcategory(element.sous_categorie_cinema_et_audiovisuel),
      //   await this.getOrCreateSubcategory(element.sous_categorie_livre_et_litterature),
      //   await this.getOrCreateSubcategory(element.sous_categorie_musique),
      //   await this.getOrCreateSubcategory(element.sous_categorie_musique_cnm),
      //   await this.getOrCreateSubcategory(element.sous_categorie_spectacle_vivant)
    });
  }
  /**
   * 
   * @param name 
   * @returns 
   */
  private async getOrCreateCategory(name: string | null): Promise<FestivalSubCategoryEntity | null> {
    if (name == null) {
      return null;
    }
    let category = await this.categoryRepository.findOneBy({
      label: name
    })
    if (!category) {
      category = new FestivalCategoryEntity();
      category.label = name;
      category = await this.categoryRepository.save(category);
    }
    return category;
  }
  /**
   * 
   * @param name 
   * @returns 
   */
  private async getOrCreateSubcategory(name: string | null): Promise<FestivalSubCategoryEntity | null> {
    if (name == null) {
      return null;
    }
    let category = await this.subcategoryRepository.findOneBy({
      label: name
    })
    if (!category) {
      category = new FestivalSubCategoryEntity();
      category.label = name;
      category = await this.subcategoryRepository.save(category);
    }
    return category;
  }



  async create(festivalCreateDto: FestivalCreateDto): Promise<FestivalGetDto> {
    const newFestival: FestivalEntity = this.festivalsRepository.create(festivalCreateDto);
    await this.festivalsRepository.save(newFestival);
    return new FestivalGetDto(newFestival);
  }
}
