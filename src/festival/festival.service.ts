import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Repository } from 'typeorm';

import { FestivalEntity } from './entities/festival.entity';
import { FestivalGetDto } from './dto/out/festival-get.dto';
import { FestivalGetManyDto } from './dto/in/festival-get-many.dto';
import { FestivalCreateDto } from './dto/in/festival-create.dto';
import { FestivalUpdateDto } from './dto/in/festival-update.dto';

import { I_open_data_festival_response } from 'src/api-consumer/interface/i_open_data_festival_response';
import { I_open_data_festival } from 'src/api-consumer/interface/i_open_data_festival';

import { FestivalCategoryEntity } from './entities/ref-festival-category.entity';
import { FestivalSubCategoryEntity } from './entities/ref-festival-subcategory.entity';
import { log, warn } from 'console';
;


@Injectable()
export class FestivalService {

  private api_count: number;
  private db_inserted: number = 0;
  private total_insertion_errror: number = 0;

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
  /**
   * convertit les donnée de l'interface I_open_data_festival_response
   * recupére les entitées déjà existante (réduire les doublons)
   * insére un nouveau festival 
   * met à jour l'existant
   * @param data 
   */
  async populateFestivals(data: I_open_data_festival_response) {
    data.results.forEach(async (element: I_open_data_festival) => {
      let inserttival: boolean = false;
      let festival: FestivalEntity = new FestivalEntity();
      await this.festivalsRepository.findOneBy({
        externalId: element.identifiant
      }).then((response: FestivalEntity) => {
        if (response != null)
          festival = response;
      }).catch((e: Error) => { });
      try {
        inserttival = false;
        festival.initFromOpenData(element);
        festival.category = await this.getOrCreateCategory(element.discipline_dominante);
        festival.subCategory = [];
        festival = await this.festivalsRepository.save(festival);
        festival.addSubcategory(await this.getOrCreateSubcategory(element.sous_categorie_arts_visuels_et_arts_numeriques));
        festival.addSubcategory(await this.getOrCreateSubcategory(element.sous_categorie_cinema_et_audiovisuel));
        festival.addSubcategory(await this.getOrCreateSubcategory(element.sous_categorie_livre_et_litterature));
        festival.addSubcategory(await this.getOrCreateSubcategory(element.sous_categorie_musique));
        festival.addSubcategory(await this.getOrCreateSubcategory(element.sous_categorie_musique_cnm));
        festival.addSubcategory(await this.getOrCreateSubcategory(element.sous_categorie_spectacle_vivant));

        inserttival = true;
      } catch (error) {
        this.total_insertion_errror += 1;
        console.log(`${festival.name}  non ajouté cause :\n\t${error.name}\n\t\t${error.message}`);
      }
      /** 
      les données ne sont insérées que si aucune erreurs n'est levé
      nous pourrions le placer dans le try and catch
      mais l'idée et de rendre le save asynchrone 
      et comme mon lead dev n'aime pas les then and catch (c'est vrai que c'est un peu moche)
      ben on le place ainsi
      c'est simple et ça fonctionne comme attendut
       */
      if (inserttival) {
        this.festivalsRepository.save(festival)
          .then(data => { this.db_inserted = this.db_inserted + 1; })
          .catch((error: Error) => {
            console.log(`${festival.name}\n\t${error.name}\n\t\t${error.message}`);
            this.total_insertion_errror = this.total_insertion_errror + 1;
          })
      }


    });
  }
  /**
   * récupére une entité catégory, lma créer si elle n'existe pas
   * @param name
   * @returns
   */
  private async getOrCreateCategory(name: string | null): Promise<FestivalCategoryEntity> {
    if (name == null) { throw Error('nom de catégorie null') };
    return await this.categoryRepository.findOneByOrFail({
      label: Like(`%${name.trim().toLowerCase()}%`)
    })
      // si aucune n'est trouvée pas on en créer une 
      .catch(async (e: Error) => {
        const newCategory = new FestivalCategoryEntity();
        newCategory.label = name.trim().toLowerCase();
        return await this.categoryRepository.save(newCategory);
      });
  }
  /**
   * creer ou récupére une entité catégory
   * @param name
   * @returns une entité ou null
   */
  private async getOrCreateSubcategory(name: string | null): Promise<FestivalSubCategoryEntity | null> {
    if (name == null) return null;

    let category = await this.subCategoryRepository.findOneBy({
      label: Like(`%${name.trim().toLowerCase()}%`)
    })
    // si aucune n'est trouvée on en créer une
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

  public set_Api_Count(qt: number): void {
    this.api_count = qt;
  }
  public get_Api_Count(): number {
    return this.api_count;
  }
  public get_db_inserted(): number {
    return this.db_inserted
  }
  public get_total_insertion_errror(): number {
    return this.total_insertion_errror;
  }
}
