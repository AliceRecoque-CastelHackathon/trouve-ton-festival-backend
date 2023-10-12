import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { FestivalCategoryEntity } from './ref-festival-category.entity';
import { FestivalSubCategoryEntity } from './ref-festival-subcategory.entity';

@Entity({
  name: 'festival',
  orderBy: {
    id: 'ASC',
  },
})
export class FestivalEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(()=>FestivalCategoryEntity, { eager: true })
  category: FestivalCategoryEntity|null;

  @ManyToMany(()=>FestivalSubCategoryEntity, { eager: true })
  @JoinTable({name : 'j_festival_subcategory'})
  subCategory: FestivalSubCategoryEntity[]|null;

  @Column({ type: 'varchar', length: 100 })
  region: string;

  @Column({ type: 'varchar', length: 100 })
  department: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', length: 5 })
  zipcode: string;

  @Column({ type: 'varchar' })
  address: string;

  @Column({ type: 'varchar', nullable: true })
  website: string | null;

  @Column({ type: 'varchar', length: '64' })
  email: string;

  @Column({ name: 'creation_date', type: 'varchar', length: 4, nullable: true })
  creationDate: string | null;

  @Column({ name: 'date_start', type: 'date' })
  dateStart: Date;

  @Column({ name: 'date_end', type: 'date' })
  dateEnd: Date;

  @Column({ name: 'geo_pos_x', type: 'float', nullable: true })
  geoPosX: number;

  @Column({ name: 'geo_pos_y', type: 'float', nullable: true })
  geoPosY: number;

  @Column({ name: 'external_id', type: 'varchar', length: '30', nullable: true })
  externalId: string | null;
}
