import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { FestivalCategoryEntity } from './ref-festival-category.entity';
import { FestivalSubCategoryEntity } from './ref-festival-subcategory.entity';
import { I_open_data_festival } from 'src/api-consumer/interface/i_open_data_festival';

@Entity({
  name: 'festival',
  orderBy: {
    id: 'ASC',
  },
})
export class FestivalEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => FestivalCategoryEntity, { eager: true })
  category: FestivalCategoryEntity | null;

  @ManyToMany(() => FestivalSubCategoryEntity, { eager: true })
  @JoinTable({ name: 'j_festival_subcategory' })
  subCategory: FestivalSubCategoryEntity[] | null;

  @Column({ type: 'varchar', length: 100 })
  region: string;

  @Column({ type: 'varchar', length: 100 })
  department: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', length: 5 })
  zipcode: string;

  @Column({ type: 'varchar', nullable: true })
  address: string | null;

  @Column({ type: 'varchar', nullable: true })
  website: string | null;

  @Column({ type: 'varchar', nullable: true })
  email: string | null;

  @Column({ name: 'creation_date', type: 'varchar', nullable: true })
  creationDate: string | null;
  /**
   * @TODO 
   * séparer les date du festival pour permettre 
   * un tri
   */
  @Column({ name: 'date', type: 'varchar', nullable: true })
  period: string | null;

  @Column({ name: 'date_start', type: 'date', nullable: true })
  dateStart: Date;

  @Column({ name: 'date_end', type: 'date', nullable: true })
  dateEnd: Date;

  @Column({ name: 'geo_pos_x', type: 'float' })
  geoPosX: number;

  @Column({ name: 'geo_pos_y', type: 'float' })
  geoPosY: number;

  @Column({ name: 'external_id', type: 'varchar', length: '30', nullable: true })
  externalId: string | null;



  /**
    initialise l'entité avec les valeur
    implique de nombreux controles d'intégrité
    sur les valeurs obligatoires
    il est dans l'entité
      - il faut bien le mettre  qu'elle que part
      - pour ne pas éparpiller le code
      - l'entité est bien ce qui permet le mieux de définir ce que sont des valeurs valides
    la logique de controle est inversé en coparaison du code originel
      - le test est faite sur l'entité passé à la fonction
      - les nouvelles données ne sont insérées dans l'entitée que APRES la validation
  * @param data : I_open_data_festival
   */
  initFromOpenData(data: I_open_data_festival): void {

    if (!data.identifiant) {
      throw new Error('externalId non défini');
    }
    this.externalId = data.identifiant;

    if (!data.nom_du_festival) {
      throw new Error('nom du festival non défini');
    }
    this.name = data.nom_du_festival;

    if (!data.region_principale_de_deroulement) {
      throw new Error('région non définie');
    }
    this.region = data.region_principale_de_deroulement;

    if (!data.departement_principal_de_deroulement) {
      throw new Error('département non défini');
    }
    this.department = data.departement_principal_de_deroulement;

    if (!data.code_postal_de_la_commune_principale_de_deroulement) {
      throw new Error('zipcode non défini');
    }
    this.zipcode = data.code_postal_de_la_commune_principale_de_deroulement;

    this.address = data.adresse_postale;

    if (!data.geocodage_xy.lon) {
      throw new Error('geoposition longitude manquante non définie');
    }
    this.geoPosX = data.geocodage_xy.lon;

    if (!data.geocodage_xy.lat) {
      throw new Error('geoposition latitude manquante non définie');
    }
    this.geoPosY = data.geocodage_xy.lat;

    this.email = data.adresse_e_mail;
    this.website = data.site_internet_du_festival;

    this.creationDate = data.annee_de_creation_du_festival;
    this.period = data.periode_principale_de_deroulement_du_festival;
    // les dates     
    /**
    festival.dateEnd = new Date();
    if(!festival.dateEnd){
    throw new Error("date end non définie");
    }
    */
    /**
    l'erreur pour le défaut de discipline dominante 
    est lancé ici car c'est un controle d'intégrité sur le DTO
    */

    if (!data.discipline_dominante) {
      throw new Error("catégorie non définie");
    }
  }
  /**
  * ajoute une sous-categorie à l'entité
    controle la pré-existance d'une collection
    controle que les données insérées ne soient pas nulles
    controle qu'il n'y pas de doublon dans les entitées ajoutées à la collection
  * @param data 
  */
  addSubcategory(data: FestivalSubCategoryEntity | null): void {
    // controle collection initialisée
    if (this.subCategory == undefined) this.subCategory = [];
    // controle non null
    if (data != null) {
      // controle des doublon
      if (!this.subCategory.find(e => e.id == data.id)) {
        this.subCategory.push(data);
      }
    }
  }
}
