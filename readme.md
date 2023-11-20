# Fastify Node.js API avec PostgreSQL, JWT, et Bcrypt

Cette API est construite avec Fastify, un framework web rapide et efficace pour Node.js. Elle utilise PostgreSQL comme base de données, JWT pour l'authentification des utilisateurs, et Bcrypt pour le hachage sécurisé des mots de passe.

## Configuration requise

Avant de commencer, assurez-vous d'avoir les éléments suivants installés sur votre machine :

- Node.js (version recommandée : 14.x)
- npm (le gestionnaire de paquets pour Node.js)
- PostgreSQL

## Installation

1. Clonez ce dépôt sur votre machine :

   ```bash
   git clone https://github.com/jeancharlescano/gestion-galerie-couteau-backend.git
   ```

2. Accédez au répertoire du projet :

    ```bash
    cd votre-projet
    ```

3. Installez les dépendances nécessaires avec npm :

    ```bash
    npm install
    ```

## Configuration de la base de données

1. Créez une base de données PostgreSQL.

2. Copiez le fichier .env.example en un nouveau fichier .env et configurez les variables d'environnement telles que la connexion à la base de données, la clé secrète JWT, et tout autre paramètre nécessaire.

    ```bash
    cp .env.example .env
    ```

3. Modifiez le fichier .env avec vos paramètres.

## Execution de l'application

Une fois la configuration terminée, vous pouvez démarrer l'API avec la commande :

```bash
npm run dev
```

L'API sera accessible à l'adresse http://localhost:5000.

## Endpoints

* **POST /api/auth/register:** Créer un nouvel utilisateur.
* **POST /api/auth/login:** Authentifier un utilisateur et recevoir un token JWT.
* **GET /api/knife:** Récupérer des données sur les couteaux

## Sécurité

L'API utilise JWT pour l'authentification et Bcrypt pour le hachage sécurisé des mots de passe.
