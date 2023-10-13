import { I_open_data_festival } from "src/api-consumer/interface/i_open_data_festival";
import { FestivalCategoryEntity } from "src/festival/entities/ref-festival-category.entity";
import { FestivalSubCategoryEntity } from "src/festival/entities/ref-festival-subcategory.entity";

interface IFestivalGetDto {
  id: number;
  category: FestivalCategoryEntity|null;
  subCategory: FestivalSubCategoryEntity[]|null;
  name: string;
  region: string;
  department: string;
  zipcode: string;
  address?: string | null;
  website?: string | null;
  email: string;
  creationDate?: string | null;
  geoPosX: number;
  geoPosY: number;
  externalId?: string | null;
  dateStart: Date;
  dateEnd: Date;
}

export class FestivalGetDto {
  id: number;
  category: FestivalCategoryEntity|null;
  subCategory: FestivalSubCategoryEntity[]|null;
  name: string;
  region: string;
  department: string;
  zipcode: string;
  address?: string | null;
  website?: string | null;
  email: string;
  creationDate?: string | null;
  geoPosX: number;
  geoPosY: number;
  externalId?: string | null;
  dateStart: Date;
  dateEnd: Date;

  constructor(data?: IFestivalGetDto) {
    if (data) {
      this.id = data.id;
      this.category = data.category
      this.subCategory = data.subCategory;
      this.name = data.name
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
    }
  }
}
