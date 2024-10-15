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
- [Structure du projet](#structure-du-projet)
- [Description du projet](#description-du-projet)
- [Liste des commandes](#liste-des-commandes)

## 🛠️ Technologies utilisées

[![Kubernetes](https://skillicons.dev/icons?i=kubernetes,docker,nodejs,typescript,angular,mongo,githubactions)]()

------

### Pour le déploiement:

Pour le déploiement, nous avons utilisés les technologies suivantes :

- [Kubernetes](https://kubernetes.io/): Plateforme open-source de gestion automatisée du déploiement, de la mise à l'échelle et de l'exploitation d'applications conteneurisées.

- [Docker](https://www.docker.com/):  Plateforme open-source qui permet de créer, déployer et exécuter des applications dans des conteneurs légers et portables.

- [Docker Compose](https://docs.docker.com/compose/): Outil qui permet de définir et de gérer des applications multi-conteneurs à l'aide d'un fichier YAML pour simplifier leur déploiement et orchestration.

- [Github Actions](https://github.com/features/actions): Service d'intégration qui automatise les workflows de développement, comme les tests, les builds et les déploiements, directement dans les dépôts GitHub.

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


## 🌲 Structure du projet

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

## 📄 Description du projet

Nous sommes partis sur une application web qui nous développement actuellement: Pelliculum.
C'est un site web communautaire, réseau social où l'ont peut noter, commenter, voir les détails d'un film, etc.

Il y a donc 3 containeurs, pour chaque service que nous utilisons:
- Un pour le front (Angular)
- Un pour le back (NodeJS)
- Un pour la base de données (MongoDB)

Nous avons utilisé les GitHub Actions, à chaque push sur la branch `main`, cela va build & push une image de notre RestAPI sur [Docker Hub](https://hub.docker.com/r/realdragonma/pelliculum-rest).
C'est l'image dont on se sert pour construire notre RestAPI avec Kubernetes.

## 💻 Liste des commandes

Voici la liste des commandes que l'on a utilisées pour faire ce TP : 

Tout d'abord, lancer Minikube:
> minikube start

Déployer MongoDB: 
> kubetcl apply -f ./mongo/

Déployer la RestAPI:
> kubectl apply -f ./rest/

Mettre en place un tunnel Minikube
> minikube tunnel