import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'festival_subcategory',
  orderBy: {
    id: 'ASC',
  },
})
export class FestivalSubCategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({ type: 'varchar' })
  label: string;
  
}
