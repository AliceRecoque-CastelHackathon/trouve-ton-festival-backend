import { FestivalCategoryEntity } from 'src/festival/entities/ref-festival-category.entity';
import { FestivalSubCategoryEntity } from 'src/festival/entities/ref-festival-subcategory.entity';

interface IFestivalGetDto {
  id: number;
  category: FestivalCategoryEntity | null;
  subCategory: FestivalSubCategoryEntity[] | null;
  name: string;
  region: string;
  department: string;
  zipcode: string;
  address?: string | null;
  website?: string | null;
  email: string | null;
  creationDate?: string | null;
  geoPosX: number;
  geoPosY: number;
  externalId?: string | null;
  dateStart: Date;
  dateEnd: Date;
  period: string | null;
}

export class FestivalGetDto {
  id: number;
  category: FestivalCategoryEntity | null;
  subCategory: FestivalSubCategoryEntity[] | null;
  name: string;
  region: string;
  department: string;
  zipcode: string;
  address?: string | null;
  website?: string | null;
  email: string | null;
  creationDate?: string | null;
  geoPosX: number;
  geoPosY: number;
  externalId?: string | null;
  dateStart: Date | null;
  dateEnd: Date | null;
  period: string | null;

  constructor(data?: IFestivalGetDto) {
    if (data) {
      this.id = data.id;
      this.category = data.category;
      this.subCategory = data.subCategory;
      this.name = data.name;
      this.region = data.region;
      this.department = data.department;
      this.zipcode = data.zipcode;
      this.address = data.address;
      this.website = data.website;
      this.email = data.email;
      this.creationDate = data.creationDate;
      this.geoPosX = data.geoPosX;
      this.geoPosY = data.geoPosY;
      this.externalId = data.externalId;
      this.dateStart = data.dateStart;
      this.dateEnd = data.dateEnd;
      this.period = data.period;
    }
  }

}
