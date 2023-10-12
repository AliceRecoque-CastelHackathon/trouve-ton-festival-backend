import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
  idCategory: number;

  @Column({ name: 'id_sub_category' })
  idSubCategory: number;

  /** prénom */
  @Column({ type: 'varchar', length: 100 })
  region: string;

  /** nom */
  @Column({ type: 'varchar', length: 100 })
  department: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'int' })
  zipcode: number;

  @Column({ type: 'varchar' })
  adress: string;

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
