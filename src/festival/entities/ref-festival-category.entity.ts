import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'festival_category',
  orderBy: {
    id: 'ASC',
  },
})
export class FestivalCategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({ type: 'varchar', length: 50 })
  label: string;
  
}
