# Include all from bashrc
source ~/.bashrc

# EXTRACT ENV VARIABLES FROM .env FILE
if [ -z "$WEBSERVICE_NAME" ]
then
    echo "Extract variables"
    source ../.env
    export $(cut -d= -s -f1 ../.env)
fi


if [ "$1" == "dump" ];
then
  # EXPORT POSTGRESQL
  ${DOCKER_COMPOSE_EXEC_FILE} compose --file ${DOCKER_COMPOSE_FILE} exec ${PSQL_NAME} pg_dump -U tellos --column-inserts tellos > ./_all_dump.sql

  # EXPORT POSTGRESQL
  ${DOCKER_COMPOSE_EXEC_FILE} compose --file ${DOCKER_COMPOSE_FILE} exec ${PSQL_NAME} pg_dump -U tellos --data-only --disable-triggers --superuser=${PSQL_USER} --column-inserts -t tellos_section_code -t tellos_expense_post -t tellos_medium_size_centre tellos > ./_some_tables_dump.sql

  # EXPORT POSTGRESQL
  ${DOCKER_COMPOSE_EXEC_FILE} compose --file ${DOCKER_COMPOSE_FILE} exec ${PSQL_NAME} pg_dump -U tellos --data-only --disable-triggers --superuser=${PSQL_USER} --exclude-table migrations_versions --column-inserts --exclude-table tellos_expense_post --exclude-table tellos_section_code tellos --exclude-table-data tellos_section_code_id_seq --exclude-table-data tellos_expense_post_id_seq > ./_all_inserted_data.sql

  echo "All is exported"
fi


if [ "$1" == "restore" ];
then
  # COPY EXPORTED FILE POSTGRESQL
  ${DOCKER_COMPOSE_EXEC_FILE} compose --file ${DOCKER_COMPOSE_FILE} cp ./_all_inserted_data.sql ${PSQL_NAME}:/

  # CREATE BASH FILE AND COPY IT
  echo "psql -U tellos --set ON_ERROR_STOP=off tellos < /_all_inserted_data.sql;" > _execute.sh
  echo "rm -rf _all_inserted_data.sql _execute.sh;" >> _execute.sh
  ${DOCKER_COMPOSE_EXEC_FILE} compose --file ${DOCKER_COMPOSE_FILE} cp ./_execute.sh ${PSQL_NAME}:/

  # RESTORE POSTGRESQL
  ${DOCKER_COMPOSE_EXEC_FILE} compose --file ${DOCKER_COMPOSE_FILE} exec ${PSQL_NAME} bash _execute.sh

  # REMOVE EXECUTE FILE
  rm -rf _execute.sh

  echo "All is restored"
fi