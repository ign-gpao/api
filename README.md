# API

[![Coverage Status](https://coveralls.io/repos/github/ign-gpao/api/badge.svg)](https://coveralls.io/github/ign-gpao/api)

IGN GPAO API est une brique logicielle de la GPAO développée en [Node.js](https://nodejs.org/en) qui interagit avec les base de données et le reste des briques de la GPAO.

## Déploiement et exécution via Docker

Pour faciliter son déploiement, une image api-gpao est déjà construite et accessible depuis [DockerHub](https://hub.docker.com/r/gpao/api-gpao) via la commande :
``` shell
docker pull gpao/api-gpao
```
et peut être lancée avec :
``` shell
docker run -ti --rm -p 8080:8080 -e SERVER_HOSTNAME=`hostname` gpao/api-gpao
```

L'installation et l’exécution d'une GPAO complète (database, api, monitor, etc...) via Docker est décrite [ici](https://github.com/ign-gpao/docker).

## Déploiement et exécution local

### Prérequis

1. Installer [nodejs](https://nodejs.org/en) et [npm](https://www.npmjs.com/) en suivant les procédures officielles propres à votre OS.
2. L'api nécessite d'avoir un serveur postgres installé avec le modèle de données pour fonctionner, vous trouverez plus d'informations sur ce module [ici](https://github.com/ign-gpao/database).

### Installation

1. Cloner le dépôt ign-gpao/api ou récupérer les sources depuis la page des [releases](https://github.com/ign-gpao/api/releases).
2. Exécuter la commande `npm install` depuis le répertoire des sources afin de récupérer les dépendances du projet.

### Exécution

1. Dans le répertoire de l'api, lancer le script : `start.sh` qui contient la commande de lancement et les paramètres de connexion au serveur postgres (ceux-ci sont à adapter en fonction de l'installation de votre serveur postgres).

Une fois lancé vous pouvez tester le bon fonctionnement depuis la documentation swagger de l'API à l'adresse : http://localhost:8080/api/doc

## Pour les développeurs

### Analyse du code

Le code doit être analysé avec [ESLint](https://eslint.org/) avant d'être mergé sur la branche main. Voici la commande à exécuter avant de pousser votre code depuis le répertoire des sources : `npm run lint`

### Exécution des tests unitaires

Pour lancer les tests unitaires de l'api :

1. Tuer l'api en cours si nécessaire
2. Dans un terminal exporter les variables suivantes :
``` shell
export PGHOST=host
export PGPORT=port
export PGUSER=user
export PGPASSWORD=password
export PGDATABASE=gpao
```
3. Lancer la commande `npm run test-coveralls`

## Licence

Ce projet est sous licence CECILL-B (voir [LICENSE.md](https://github.com/ign-gpao/.github/blob/main/LICENSE.md)).

[![IGN](https://github.com/ign-gpao/.github/blob/main/images/logo_ign.png)](https://www.ign.fr)
