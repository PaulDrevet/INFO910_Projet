# Étape 1 : Build de l'application Angular
# Utilisation de l'image Node.js comme image de base pour construire l'application
FROM node:18 AS build

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier le fichier package.json et package-lock.json pour installer les dépendances
COPY package*.json ./

# Installer les dépendances Angular
RUN npm install

# Copier le reste des fichiers de l'application dans le conteneur
COPY . .

# Construire l'application pour l'environnement de production
RUN npm run build --prod

# Étape 2 : Serveur Nginx pour servir l'application
# Utilisation de l'image Nginx comme serveur pour servir les fichiers statiques
FROM nginx:alpine

# Copier les fichiers de build Angular dans le répertoire Nginx
COPY --from=build /app/dist/your-angular-app /usr/share/nginx/html

# Copier la configuration personnalisée Nginx (facultatif)
# Si vous avez une configuration spécifique pour Nginx, ajoutez-la ici
# COPY nginx.conf /etc/nginx/nginx.conf

# Exposer le port sur lequel l'application Angular sera servie
EXPOSE 80

# Démarrer Nginx (par défaut, la commande CMD de l'image Nginx est déjà présente, donc pas besoin de la redéfinir)
