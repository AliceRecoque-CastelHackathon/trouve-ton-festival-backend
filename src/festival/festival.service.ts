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
import { error, log, warn } from 'console';
;


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
  /**
   * convertit les donnée de l'interface I_open_data_festival_response
   * recupére les entitées déjà existante (réduire les doublons)
   * insére un nouveau festival 
   * met à jour l'existant
   * @param data 
   */
  async populateFestivals(data: I_open_data_festival_response, offset: number = 0) {
    let added: number = 0;
    data.results.forEach(async (element: I_open_data_festival, count: number) => {
      count += 1;

      let festival: FestivalEntity = new FestivalEntity();
      await this.festivalsRepository.findOneBy({
        externalId: element.identifiant
      }).then((response: FestivalEntity) => {
        if (response != null)
          festival = response;
      }).catch((e: Error) => { });
      try {

        festival.initFromOpenData(element);
        festival.category = await this.getOrCreateCategory(element.discipline_dominante);
        festival = await this.festivalsRepository.save(festival);

        this.festivalsRepository.save(festival)
          .then(async data_festival => {
            added += 1;
            await this.import_add_subCategory(data_festival, element).catch(
              (er: Error) => {
                console.log(`N° ${count + offset}/${data.total_count}: ${festival.name}\n\t${error.name}\t${er.message}`);
              });
          })
      } catch (error) {
        console.log(`N° ${count + offset}/${data.total_count}: ${festival.name}\n\t${error.name}\t${error.message}`);
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
        return await this.categoryRepository.save(newCategory)
          .catch((error: Error) => {
            console.error(`impossible d'insérer la catégorie ${name}`);
            throw error;
          })
          ;
      });
  }
  /**
   * creer ou récupére une entité catégory
   * @param name
   * @returns une entité ou null
   */
  private async getOrCreateSubcategory(name: string | null): Promise<FestivalSubCategoryEntity | null> {
    if (name == null || name.match('null')) return null;

    let category: FestivalSubCategoryEntity | null = new FestivalSubCategoryEntity();
    await this.subCategoryRepository.findOneByOrFail({
      label: Like(`%${name.trim().toLowerCase()}%`)
    })
      .then((data: FestivalSubCategoryEntity) => category = data)
      .catch(async () => {
        category = new FestivalSubCategoryEntity()
        category.label = name.trim().toLowerCase();
        category = (await this.subCategoryRepository.save(category).catch((error: Error) => {
          log(`impossible d'ajouter la sous-catégorie ${name}`);
          return null;
        }));

      }
      )
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
  /**
   * importe et ajoute des sous-catégories à une entité de festival
  oui c'est de la spaguertification du code
  je n'ai fait cela que pour reduire et clarifier le code de la methode 
  populatefestival

   * @param festival 
   * @param element 
   */
  private async import_add_subCategory(festival: FestivalEntity, element: I_open_data_festival): Promise<FestivalEntity> {
    let subCategory = "";
    let datas = [];

    subCategory += `${element.sous_categorie_arts_visuels_et_arts_numeriques}`;
    subCategory += `; ${element.sous_categorie_cinema_et_audiovisuel}`;
    subCategory += `; ${element.sous_categorie_livre_et_litterature}`;
    subCategory += `; ${element.sous_categorie_musique}`;
    subCategory += `; ${element.sous_categorie_musique_cnm}`;
    subCategory += `; ${element.sous_categorie_spectacle_vivant}`;

    datas = subCategory.split(/\(|\/| et | ou |,|;/)
      .filter((item, index, elements) => elements[elements.indexOf(item)])
      ;
    // recupération ou ajout de la sous-catégorie
    datas.forEach(async sub => {
      festival.addSubcategory(await this.getOrCreateSubcategory(sub));
    });

    return this.festivalsRepository.save(festival);
  }
}
