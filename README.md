# INFO910 - Introduction DevOps

## 🤼 Groupe

Paul Drevet<br>
Mathis Mazoyer


## 📖 Sommaire

- [Technologies utilisées](#-technologies-utilisées)
    - [Déploiement](#pour-le-déploiement)
    - [Services](#pour-les-services)
        - [Back-End](#back-end)
        - [Front-End](#front-end)

## 🛠️ Technologies utilisées

[![Kubernetes](https://skillicons.dev/icons?i=kubernetes,docker,nodejs,typescript,angular,mongo)]()

------

### Pour le déploiement:

Pour le déploiement, nous avons utilisés les technologies suivantes :

- [Kubernetes](https://kubernetes.io/): Plateforme open-source de gestion automatisée du déploiement, de la mise à l'échelle et de l'exploitation d'applications conteneurisées.

- [Docker](https://www.docker.com/):  Plateforme open-source qui permet de créer, déployer et exécuter des applications dans des conteneurs légers et portables.

- [Docker Compose](https://docs.docker.com/compose/): Outil qui permet de définir et de gérer des applications multi-conteneurs à l'aide d'un fichier YAML pour simplifier leur déploiement et orchestration.


-----

### Pour les services: 

#### Back-End

<u>> RestAPI</u>

- [NodeJS](https://nodejs.org/fr): Environnement d'exécution JavaScript open-source, basé sur le moteur V8 de Chrome, qui permet d'exécuter du code JavaScript côté serveur pour des applications rapides et évolutives.

- [Typescript](https://www.typescriptlang.org/): Sur-ensemble de JavaScript open-source qui ajoute le typage statique optionnel et des fonctionnalités avancées pour faciliter le développement de grandes applications maintenables et fiables.

- [Fastify](https://fastify.dev/): Framework web Node.js rapide et léger, conçu pour offrir des performances élevées tout en étant extensible et facile à utiliser pour la création d'API.

<u>> Base de données</u>

- [MongoDB](https://www.mongodb.com/fr-fr): Base de données NoSQL orientée document, qui stocke les données dans un format flexible de type JSON (BSON), permettant une grande évolutivité et la gestion efficace de données non structurées.

#### Front-End

- [Angular](https://angular.dev/): Framework open-source développé par Google, permettant de créer des applications web dynamiques et modulaires en utilisant TypeScript, avec un focus sur la performance et la maintenabilité.

- [NodeJS](https://nodejs.org/fr)

- [Typescript](https://www.typescriptlang.org/) 

------

## Structure du projet

```plaintext
./
├── docker-backup/                # Contient un exemple de ce que donnerait le projet avec du docker-compose
├── front/      
|
├── mongo/                
│   ├── mgonodb-pvc.yaml           
│   ├── mongodb-secrets.yaml       
│   ├── mongodb-service.yaml       
│   └── mongodb-statefulset.yaml   
|
├── rest/                 
│   ├── mgonodb-pvc.yaml           
│   ├── mongodb-secrets.yaml       
│   ├── mongodb-service.yaml       
│   └── mongodb-statefulset.yaml 
|
└── README.md            # Project documentation
```
