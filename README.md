# api-gpao
## Introduction

Brique logicielle utilisé dans le projet GPAO
## Docker

Récupérer la dernière version :

``` shell
docker pull gpao/api-gpao
```

Lancement :

``` shell
docker run -ti --rm -p 8080:8080 -e SERVER_HOSTNAME=`hostname` gpao/api-gpao
```
