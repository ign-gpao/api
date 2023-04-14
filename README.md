# API

[![Coverage Status](https://coveralls.io/repos/github/ign-gpao/api/badge.svg)](https://coveralls.io/github/ign-gpao/api)

IGN GPAO API est une brique logicielle de la GPAO développée en [Node.js](https://nodejs.org/en) qui interagit avec les base de données.

## Installation via Docker

Pour faciliter son déploiement, une image api-gpao est déjà construite et accessible depuis [DockerHub](https://hub.docker.com/r/gpao/api-gpao) via la commande :
``` shell
docker pull gpao/api-gpao
```
et peut être lancée avec :
``` shell
docker run -ti --rm -p 8080:8080 -e SERVER_HOSTNAME=`hostname` gpao/api-gpao
```

L'installation d'une GPAO complète (database, api, monitor) via Docker est décrite [ici](https://github.com/ign-gpao/docker).

## Développement

Pour contribuer au développement de l'api :

1. Cloner le dépôt ign-gpao/api
2. Installer une GPAO locale via Docker en suivant la procédure  [ici](https://github.com/ign-gpao/docker)
3. Tuer le conteneur de l'api créé par Docker Compose avec : `docker rm -f api-gpao`
4. Dans le répertoire de l'api, lancer la commande : `./start.sh`
5. La documentation de l'API est alors accessible à l'adresse `localhost:8080/api/doc`

Le code peut-être analysé avec [ESLint](https://eslint.org/)

Pour lancer les tests unitaires de l'api :

1. Tuer l'api en cours
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
