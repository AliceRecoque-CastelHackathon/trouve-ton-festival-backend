<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src=assets/Alice-Recoque.png width="200" alt="alice recoque" /></a>

</p>



<p align="center">
backend de l'appli trouve ton festival
</p>
<p align="center">
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>  
  <a href="https://nestjs.com/" target="_blank"><img src="https://img.shields.io/badge/NestJs-red?link=https%3A%2F%2Fnestjs.com%2F" alt="CircleCI" /></a>
 
</p>

## Contexte

Connaissez-vous l'événement Castelhackathon ?  
 Non ?  
Cet évenement, organisé par le formidable personnel du pôle emploi de castelnau le lez, permet à des développeur en recherche d'emploi de se faire connaitre des entreprise au travers d'un hackathon de deux jours.

### l'évenement

Un sujet permettant suffisement de variations pour que les participants puissent y trouver leur bonheur leur est remis le premier jour.
--- --- 
Pour l'edition 2023
les participant devaient créer une application web, prenant des données depuis une API externe et permettant au utilisateurs de les visualiser, de les éditer et d'en ajouter.
--- ---
### Notre équipe

Nommé **[Alice Recoque][alice_recoque]** en hommage à l'ingénieur pionnière de l'informatique qui nous a hélas quitté en 2021.

les membres sont :  
[@github/Annayia][annayia]  notre capitaine et PM  
[@github/guzzy][guzzy]  notre lead developeur  
[@github/oliviekoe][olivier] notre developeur FrontEnd  
[@github/vincentprouchet][vincent] notre developpeur BackEnd  

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
vous devrez ensuite créer deux fichier dans le dossier environnement pour cela copiez directement le fichier  
.env.template.  

il vous faut :  
.env.development  
.env.production  

pensez à change la variable node_env pour l'adapter à chaque fichier, c'est normalement celle sur la première ligne du fichier  
development pour le .env.development
production pour le .env.production

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

## Remerciement

Un grand merci pour l'organisation de cet évenénement :  
- au personnel du [pôle emploi de castelnau le lez][pole_emlpoi]
pour l'organisation de cet événement. Celà leur a très certainement demandé beaucoup de travail pour nous offrir l'oportunité d'y participer et nous offrir un cadre aussi agréable que la salle du [Kiasma][le_kiasma].
- au personnel du [kiasma][le_kiasma] de nous avoir acceuillit pendnat ces deux jours.
- à l'équipe municipale de castelnau le lez.
- aux entreprises partenaires, sans vous cet événement n'aurait pas de but.
@TODO voir si on ajoute des liens vers les entreprises partenaires demander à pole emploi

## Soutenez NestJs

Nest est un projet OpenSource.
Il peut vivre et grandir grâce aux soutient de ses sponsors.
Si vous souhaitez les rejoindre, [regardez ici][support_nestJs].

## License

NestJs est sous licence [MIT][MITLICENSE].
et notre Projet [Aussi][MITLICENSE]

[api_des_festivals]: https://data.culture.gouv.fr/explore/dataset/festivals-global-festivals-_-pl/api/ "merci data.gouv"
[MITLICENSE]: MITLICENSE

[support_nestJs]: https://docs.nestjs.com/support
[alice_recoque]: https://fr.wikipedia.org/wiki/Alice_Recoque

[le_kiasma]: https://www.lekiasma.fr/ "slle de spectacle à castelnau le lez"
[pole_emlpoi]: https://www.pole-emploi.fr/accueil/ "toujours là pour nous soutenir"

[annayia]: https://github.com/Annayia
[guzzy]: https://github.com/Guuzii
[olivier]: https://github.com/olivierkoe
[vincent]: https://github.com/VincentProuchet