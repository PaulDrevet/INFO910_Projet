# Étape 1 : Build de l'application Angular
FROM node:18-alpine AS build

# Définir le répertoire de travail
WORKDIR /app

# Copier le fichier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances avec --legacy-peer-deps pour ignorer les conflits de dépendances
RUN npm install --legacy-peer-deps

# Copier le reste des fichiers de l'application
COPY . .

# Build de l'application en mode production
RUN npm run build -- --output-path=dist/Aegis-web

# Étape 2 : Utiliser Nginx pour servir l'application
FROM nginx:alpine

# Copier les fichiers générés par Angular dans le répertoire où Nginx s'attend à les trouver
COPY --from=build /app/dist/Aegis-web /usr/share/nginx/html

# Exposer le port 80
EXPOSE 80

# Lancer Nginx
CMD ["nginx", "-g", "daemon off;"]
