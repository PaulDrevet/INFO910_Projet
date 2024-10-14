# Étape 1 : Construction de l'application
FROM node:18 AS build

# Installer pnpm
RUN npm install -g pnpm

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier le fichier package.json et pnpm-lock.yaml pour installer les dépendances
COPY package*.json pnpm-lock.yaml* ./

# Installer les dépendances
RUN pnpm install

# Copier le reste des fichiers de l'application dans le conteneur
COPY . .

# Compiler le code TypeScript en JavaScript
RUN pnpm run build

# Étape 2 : Exécution de l'application en production
FROM node:18-alpine AS production

# Installer pnpm
RUN npm install -g pnpm

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier uniquement les fichiers nécessaires depuis l'étape de build
COPY --from=build /app/package*.json ./ 
COPY --from=build /app/pnpm-lock.yaml* ./ 
COPY --from=build /app/dist ./dist

# Réinstaller uniquement les dépendances nécessaires pour la production
RUN pnpm install --prod

# Exposer le port utilisé par Fastify (par défaut 3000)
EXPOSE 3000

# Lancer l'application
CMD ["node", "dist/src/index.js"]
