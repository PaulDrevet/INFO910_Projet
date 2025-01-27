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

```sh
./
├── .github/workflows/ # Déploiements Github Actions
|   ├── docker-push-build-angular.yml
|   └── docker-push-build-rest.yml
|
├── imgs # Images du Readme
|
├── k8s/                
│   ├── front/ # Fichiers de déploiements du front
|   |   ├── angular-deployment.yaml
|   |   └── angular-service.yaml   
|   |  
│   ├── mongo/ # Fichiers de déploiements de mongo
|   |   ├── mongodb-pvc.yaml
|   |   ├── mongodb-secrets.yaml     
|   |   ├── mongodb-service.yaml  
|   |   └── mongodb-statefulset.yaml 
|   |  
│   └── rest/ # Fichiers de déploiements de la rest
|       ├── rest-deployment.yaml
|       └── rest-service.yaml   
|
├── services/                
│   ├── front/ # Fichiers de déploiements du front
|   |   ├── ... # Fichiers sources
|   |   └── Dockerfile   
|   |  
│   └── rest/ # Fichiers de déploiements de mongo
|       ├── ... # Fichiers sources 
|       └── Dockerfile   
|
|
└── README.md 
```

## 📄 Description du projet

Nous sommes partis sur une application web (très simple) qui nous permet de générer des mots de passe: Aegis.

Il y a donc 3 containeurs, pour chaque service que nous utilisons:
- Un pour le front (Angular/NodeJS)
- Un pour le back (NodeJS)
- Un pour la base de données (MongoDB)

Nous avons utilisé les GitHub Actions, à chaque push sur la branch `main`, cela va build & push une image du front et de la rest sur [Docker Hub](https://hub.docker.com/repositories/realdragonma):
- [RestAPI](https://hub.docker.com/r/realdragonma/aegis-rest)
- [Front](https://hub.docker.com/r/realdragonma/aegis-front)

Ce sont les images dont on se sert pour construire notre Front RestAPI avec Kubernetes.

Afin de faire communiquer les containers entre eux, nous avons mis en place un système très simple de création/connexion à un compte.

Le front communique avec la restAPI, et la RestAPI communique avec la base de données.

## 💻 Liste des commandes (en local)

Voici la liste des commandes que l'on a utilisées pour faire ce TP : 


(Optionnel)
```sh
# Nous utilisions cette commande pour tout reprendre de 0 (retélécharger les images docker, etc)
kubectl delete all --all -n default
```

```sh

# Lancer Minikube
minikube start --driver=docker

# Déployer les services
kubectl apply -f ./k8s/front
kubectl apply -f ./k8s/mongo
kubectl apply -f ./k8s/rest

kubectl port-forward svc/restapi-service 3000:3000 # Pour une raison inconnu, le NodePort ne semble pas fonctionner, nous utilisons alors un port-forward
```

Dans un autre terminal
```sh
# Lancer le projet
minikube service aegis-web-service
```

## Déploiement à distance

Nous avons également déployer le site web sur un serveur personnel (accessible via [https://aegis.mathis-mazoyer.fr](https://aegis.mathis-mazoyer.fr)).

On redirige un de nos noms de domaine [https://mathis-mazoyer.fr](https://aegis.mathis-mazoyer.fr) (avec Cloudflare) :
> On fait pointer (via zone DNS) le nom de domaine [https://mathis-mazoyer.fr](https://aegis.mathis-mazoyer.fr) sur l'IP du serveur (type A) et on fait la même chose avec le sous domaine [aegis](https://aegis.mathis-mazoyer.fr).

Nos domaine/sous-domaine pointent vers le serveur.

![Cloudflare DNS](imgs/cloudflare_dns.png)

La partie kubernetes est exactement la même sur le serveur, on ajoute simplement un Ingress pour qu'on puisse utiliser notre nom de domaine : 

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: aegis-web-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /   
spec:
  rules:
  - host: aegis.mathis-mazoyer.fr
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: aegis-web-service                     
            port:
              number: 8080
```

On exécute ensuite :

```sh
kubectl apply -f ./front/
```
