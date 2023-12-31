import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FestivalEntity } from './entities/festival.entity';
import { In, Repository } from 'typeorm';
import { FestivalGetDto } from './dto/out/festival-get.dto';
import { FestivalGetManyDto } from './dto/in/festival-get-many.dto';
import { FestivalCreateDto } from './dto/in/festival-create.dto';

import { I_open_data_festival_response } from 'src/api-consumer/interface/i_open_data_festival_response';
import { I_open_data_festival } from 'src/api-consumer/interface/i_open_data_festival';
import { FestivalCategoryEntity } from './entities/ref-festival-category.entity';
import { FestivalSubCategoryEntity } from './entities/ref-festival-subcategory.entity';
import { FestivalUpdateDto } from './dto/in/festival-update.dto';
import { error } from 'console';


@Injectable()
export class FestivalService {
  constructor(
    @InjectRepository(FestivalEntity)
    private festivalsRepository: Repository<FestivalEntity>,
    @InjectRepository(FestivalCategoryEntity)
    private categoryRepository: Repository<FestivalCategoryEntity>,
    @InjectRepository(FestivalSubCategoryEntity)
    private subCategoryRepository: Repository<FestivalSubCategoryEntity>,

  ) { }

  async getMany(festivalAnyDto: FestivalGetManyDto): Promise<FestivalGetDto[]> {
    let whereOpt: any = undefined;
    if (festivalAnyDto.categoryId) {
      whereOpt = { idCategory: festivalAnyDto.categoryId };
    }
    if (festivalAnyDto.region) {
      if (!whereOpt) {
        whereOpt = { region: festivalAnyDto.region };
      }
      else {
        whereOpt.region = festivalAnyDto.region;
      }
    }

    const festivalEntity: FestivalEntity[] = await this.festivalsRepository.find(
      {
        skip: festivalAnyDto.offset ?? 0,
        take: festivalAnyDto.limit ?? 10,
        ...(whereOpt ? { where: whereOpt } : {})
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

  async getByName(festivalName: string): Promise<FestivalGetDto | null> {
    const festivalEntity: FestivalEntity | null = await this.festivalsRepository.findOneBy({
      name: festivalName
    });

    return festivalEntity ? new FestivalGetDto(festivalEntity) : null;
  }

  async populateFestivals(data: I_open_data_festival_response) {

    data.results.forEach(async (element: I_open_data_festival) => {
      let inserttival: boolean = false;
      let festival: FestivalEntity = new FestivalEntity();
      await this.festivalsRepository.findOneBy({
        externalId: element.identifiant
      }).then(response => {
        if (response != null)
          festival = response;
      });
      try {
        inserttival = false;
        festival.externalId = element.identifiant;
        if (!festival.externalId) {
          throw new Error("externalId non définie");
        }
        festival.name = element.nom_du_festival;
        if (!festival.name) {
          throw new Error("nom du festival non définit");
        }
        festival.creationDate = element.annee_de_creation_du_festival;
        festival.region = element.region_principale_de_deroulement;
        if (!festival.region) {
          throw new Error("région non définie");
        }
        festival.department = element.departement_principal_de_deroulement;
        if (!festival.department) {
          throw new Error("département non définit");
        }
        festival.zipcode = element.code_postal_de_la_commune_principale_de_deroulement;
        if (!festival.zipcode) {
          throw new Error("zipcode non définit");
        }
        festival.address = element.adresse_postale;
        festival.geoPosX = element.geocodage_xy.lon;
        if (!festival.geoPosX) {
          throw new Error("geoposition longitude manquante non définie");
        }
        festival.geoPosY = element.geocodage_xy.lat;
        if (!festival.geoPosY) {
          throw new Error("geoposition latitude manquante non définie");
        }
        festival.email = element.adresse_e_mail;
        festival.website = element.site_internet_du_festival;
        if (!element.discipline_dominante) {
          throw new Error("catégorie non définie");
        }
        festival.category = await this.getOrCreateCategory(element.discipline_dominante);

        festival.subCategory = [];
        element.sous_categorie_arts_visuels_et_arts_numeriques ?
          festival.subCategory.push(await this.getOrCreateSubcategory(element.sous_categorie_arts_visuels_et_arts_numeriques)) : null;
        element.sous_categorie_cinema_et_audiovisuel ?
          festival.subCategory.push(await this.getOrCreateSubcategory(element.sous_categorie_cinema_et_audiovisuel)) : null;
        element.sous_categorie_livre_et_litterature ?
          festival.subCategory.push(await this.getOrCreateSubcategory(element.sous_categorie_livre_et_litterature)) : null;
        element.sous_categorie_musique ?
          festival.subCategory.push(await this.getOrCreateSubcategory(element.sous_categorie_musique)) : null;
        element.sous_categorie_musique_cnm ?
          festival.subCategory.push(await this.getOrCreateSubcategory(element.sous_categorie_musique_cnm)) : null;
        element.sous_categorie_spectacle_vivant ?
          festival.subCategory.push(await this.getOrCreateSubcategory(element.sous_categorie_spectacle_vivant)) : null;
        inserttival = true;
      } catch (error) {
        console.log(`${festival.name} ${error}`);
      }
      if (inserttival) {
        this.festivalsRepository.save(festival)
          .catch(error =>
            console.log(`${festival.name} ${error}`));
      }


    });
  }
  /**
   * creer ou récupére une entité catégory
   * @param name
   * @returns
   */
  private async getOrCreateCategory(name: string): Promise<FestivalCategoryEntity> {
    let response: FestivalCategoryEntity | null = await this.categoryRepository.findOneBy({
      label: name.trim().toLowerCase()
    });

    if (!response) {
      const newCategory = new FestivalCategoryEntity();
      newCategory.label = name.trim().toLowerCase();
      return await this.categoryRepository.save(newCategory);
    }
    else {
      return response;
    }
  }
  /**
   *  creer ou récupére une entité catégory
   * @param name
   * @returns
   */
  private async getOrCreateSubcategory(name: string): Promise<FestivalSubCategoryEntity> {
    let category = await this.subCategoryRepository.findOneBy({
      label: name.trim().toLowerCase()
    })
    if (!category) {
      category = new FestivalSubCategoryEntity();
      category.label = name.trim().toLowerCase();
      category = await this.subCategoryRepository.save(category);
    }
    return category;
  }

  async create(festivalCreateDto: FestivalCreateDto): Promise<FestivalGetDto> {
    const newFestival: FestivalEntity = this.festivalsRepository.create(festivalCreateDto);
    await this.festivalsRepository.save(newFestival);
    return new FestivalGetDto(newFestival);
  }

  async update(festivalUpdateDto: FestivalUpdateDto): Promise<FestivalGetDto> {
    const festival: FestivalEntity | null = await this.festivalsRepository.findOneBy({
      id: festivalUpdateDto.id
    })
    if (festival) {
      const festivalCategory: FestivalCategoryEntity | null = await this.categoryRepository.findOneBy({
        id: festivalUpdateDto.idCategory
      })
      const festivalSubCategory: FestivalCategoryEntity[] | null = await this.subCategoryRepository.findBy({
        id: In(festivalUpdateDto.idSubCategory)
      })

      if (festivalCategory) {
        festival.category = festivalCategory
      }
      if (festivalSubCategory) {
        festival.subCategory = festivalSubCategory;
      }

      festival.region = festivalUpdateDto.region;
      festival.department = festivalUpdateDto.department;
      festival.zipcode = festivalUpdateDto.zipcode;
      festival.address = festivalUpdateDto.address;
      if (festivalUpdateDto.website !== undefined)
        festival.website = festivalUpdateDto.website;
      festival.email = festivalUpdateDto.email;
      festival.geoPosX = festivalUpdateDto.geoPosX;
      festival.geoPosY = festivalUpdateDto.geoPosY;
      festival.dateStart = new Date(festivalUpdateDto.dateStart);
      festival.dateEnd = new Date(festivalUpdateDto.dateEnd);

      await this.festivalsRepository.save(festival);

      return new FestivalGetDto(festival);
    } else {
      throw new BadRequestException('festival to modify not found');
    }
  }
}
