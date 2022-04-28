export PGHOST=localhost
export PGPORT=5432
export PGUSER=postgres
export PGPASSWORD=postgres
export PGDATABASE=gpao

if [ "$(docker ps -aq -f name=api-gpao)" ]; then
    echo "Suppression du container api-gpao"
    docker rm -f api-gpao
fi

npm start
