import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { FestivalCategoryEntity } from './ref-festival-category.entity copy';
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

  @Column({ name: 'id_category' })
  @ManyToOne(()=> FestivalCategoryEntity)
  idCategory: number;

  @Column({ name: 'id_sub_category' })
  @ManyToMany(()=>FestivalSubCategoryEntity)
  @JoinTable({name : 'J_estival_subcategory'})
  idSubCategory: number[];

  @Column({ type: 'varchar', length: 100 })
  region: string;

  @Column({ type: 'varchar', length: 100 })
  department: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'int' })
  zipcode: number;

  @Column({ type: 'varchar' })
  address: string|null;

  @Column({ type: 'varchar', nullable: true })
  website: string | null;

  @Column({ type: 'varchar', length: '64' })
  email: string;

  @Column({ name: 'creation_date', type: 'date', nullable: true })
  creationDate: Date | null;

  @Column({ name: 'geo_pos_x', type: 'float', nullable: true })
  geoPosX: number | null;

  @Column({ name: 'geo_pos_y', type: 'float', nullable: true })
  geoPosY: number | null;

  @Column({ name: 'external_id', type: 'varchar', length: '30', nullable: true })
  externalId: string | null;
}
