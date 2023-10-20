import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'festival_subcategory',
  orderBy: {
    label: 'ASC',
  },
})
export class FestivalSubCategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  label: string;

}
