<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src=assets/Alice-Recoque.png width="200" alt="alice recoque" /></a>
</p>



<p align="center">
backend de l'appli trouve ton festival
</p>
<p align="center">
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
  <a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>

</p>

## Contexte

Connaissez-vous l'événement Castelhackathon ?  
 Non ?  
Cet évenement, organisé par le formidalbe personnel du pôle emploi de castelnau le lez, permet à des développeur en recherche d'emploi de se faire connaitre des entreprise au travers d'un hackathon de deux jours.

### l'évenement

Un sujet permettant suffisement de variations pour que les participants puissent y trouver leur bonheur leur est remis le premier jour.
--- --- 
Pour l'edition 2023
les participant devaient crée une application web (un peu la base du metier) prenant des données depuis une API externe et permettant au utilisateurs de les visualiser, de les éditer et d'en ajouter.
--- ---
### Notre équipe

Nommé **[Alice Recoque][alice_recoque]** en hommage à l'ingénieur pionnière de l'informatique qui nous a hélas quitté en 2021.

les membres sont :  
@github/Annayia  notre capitaine et PM  
@github/guzzy  notre lead developeur  
@github/oliviekoe notre developeur FrontEnd  
@github/vincentprouchet notre developpeur BackEnd  

### L'illusion du choix

Je plaisante,  
chaque équipe à reçu exactement le même sujet nous pouvions librmement choisit l'API à laquelle nous connecter les données fournies guidant naturellement le theme de l'application.

### le choix de notre équipe

Nous avons choisit [l'API des festivals][api_des_festivals]  
et apparement tous les autres groupe aussi...  
on aurait peut-être dû se concerter.


## Installation

faites un clone du projet
ouvrez un terminal (préferez bash)
et faite un :
```bash
$ yarn install
```
après l'installation des packages n'hésitez pas à faire un :
```bash
$ yarn upgrade
```
vous devrez ensuite créer deux fichier dans le dossier environnement pour cela copiez directement le fichie .env.template.  

il vous faut :  
.env.development  
.env.production  

pensez à change la première ligne node_env pour l'adapter à chaque fichier  
development
production

## démarrer le backend

```bash
# Development
$ yarn start

# Development watch mode
$ yarn start:dev

# Production mode
$ yarn start:prod
```

## lancer les tests

```bash
# Run unit tests
$ yarn test

# Run e2e tests
$ yarn test:e2e

# Run test coverage
$ yarn test:cov
```

## TypeORM

```bash
# Generate new migration
$ yarn typeorm migration:generate ./typeorm_migrations/<migration-name> -d ./typeorm_migrations/datasources/migrations-datasource.ts

# Apply migrations
$ yarn typeorm migration:run -d ./typeorm_migrations/datasources/migrations-datasource.ts

# Revert last migration applied
$ yarn typeorm migration:revert -d ./typeorm_migrations/datasources/migrations-datasource.ts

# Add migrations to migration table without applying it
$ yarn typeorm migration:run --fake -d ./typeorm_migrations/datasources/migrations-datasource.ts

# Remove migrations from migration table
$ yarn typeorm migration:revert --fake -d ./typeorm_migrations/datasources/migrations-datasource.ts
```

## Soutenez NestJs


Nest est un projet OpenSource.
Il peut vivre et grandir grâce aux soutient de ses sponsors.
Si vous souhaitez les rejoindre, [regardez ici][support_nestJs].

## License

Nest est sous licence [MIT][MITLICENSE].


[api_des_festivals]: https://data.culture.gouv.fr/explore/dataset/festivals-global-festivals-_-pl/api/ "merci data.gouv"
[MITLICENSE]: MITLICENSE
[doc_nestJS]: https://docs.nestjs.com
[support_nestJs]: https://docs.nestjs.com/support
[alice_recoque]: https://fr.wikipedia.org/wiki/Alice_Recoque
[alice_recoque_photo]: assets/Alice-Recoque.png

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest