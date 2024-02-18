# **Versions**

[![Docker](https://img.shields.io/badge/Docker-24.0.2-bf2e49.svg)](https://docs.docker.com/)

[![Node](https://img.shields.io/badge/NodeJs-18.13.0-3a8786.svg)](https://nodejs.org/en/docs/)

[![NestJs CLI](https://img.shields.io/badge/NestJs-9.2.0-9169e0.svg)](https://angular.io/docs)

[![Postgres Sql](https://img.shields.io/badge/PostgresSQL-15.1-678a37.svg)](https://www.postgresql.org/docs/)

[![Mongo DB](https://img.shields.io/badge/MongoDB-6.0-b55c28.svg)](https://www.mongodb.com/docs/v4.4/tutorial/getting-started/)

<br>

# **Project launches**

#### **With NVM**
---
Install the Postgres SQL and MongoDB before

Installing the correct version of Node using NVVM

```shell
nvm install 18.13.0
```
Install in global the NestJs CLI with npm or yarn
```shell
yarn global add @nestjs/cli@9.2.0
```
Duplicate the file `.env.example` and rename it into `.env`. Change the empty value when you see `############# Complete before run`.

---
<h1 style="color: #a82828;">Before the next step, follow this link [<span style="color: #a82828;text-decoration: underline;text-transform:uppercase;">here</span>](#things-to-do-before-launching-the-project)</h1>
---

Now, Run the project

```shell
npm run start:dev
```
On your browser `http://localhost:3000/`

### **With Docker**
---



#### <span style="color: #a82828;">If you're using Windows, make sure you install Docker Desktop + WSL2 with Ubuntu 20|22.04 and place the project in this environment</span>

Copy the `.env.example` file to `.env`. <br>
In the `.env` file, fill in the variables that have `############# Complete before run` above them

```Properties
############# Complete before run
MY_ENV_VARIABLE=
```
Change the `base` value to `dev` at the `WEBSERVICE_BUILD_TARGET` variable

```Properties
#...
WEBSERVICE_BUILD_TARGET=dev
#...
```
Définition des clés d'environnement

```Properties
#...
# The environment of projet (local|dev|prod)
APP_ENV=<APP_ENV>

# The docker compose file name (ex: docker-compose.yml)
DOCKER_COMPOSE_FILE=<DOCKER_COMPOSE_FILE>

# The bin docker file (ex: /usr/bin/docker)
DOCKER_COMPOSE_EXEC_FILE=<DOCKER_COMPOSE_EXEC_FILE>

# The Git email
GIT_CONFIG_EMAIL=<GIT_CONFIG_EMAIL>

# The Git name
GIT_CONFIG_NAME=<GIT_CONFIG_NAME>

# The psql db name
WEBSERVICE_DB_NAME=<WEBSERVICE_DB_NAME>

# The mongodb db name
WEBSERVICE_MONGODB_NAME=<WEBSERVICE_MONGODB_NAME>

# The API hash to secure url (ex: api-<WEBSERVICE_API_HASH>)
WEBSERVICE_API_HASH=<WEBSERVICE_API_HASH>

# The name of table of generated migrations
WEBSERVICE_DB_MIGRATION_TABLE_NAME=<WEBSERVICE_DB_MIGRATION_TABLE_NAME>

# The db prefix name to protect table name (ex: <prefix>_my_table)
WEBSERVICE_DB_TABLE_PREFIX=<WEBSERVICE_DB_TABLE_PREFIX>

# The connection name for typeorm (ex: psql)
WEBSERVICE_PSQL_DB_CONN_NAME=<WEBSERVICE_PSQL_DB_CONN_NAME>

# The connection name for typeorm (ex: mongodb)
WEBSERVICE_MONGODB_DB_CONN_NAME=<WEBSERVICE_MONGODB_DB_CONN_NAME>

# Not used
REQUIRE_SOME_NOTIFICATION=<REQUIRE_SOME_NOTIFICATION>

# The schema name
PSQL_SCHEMA=<PSQL_SCHEMA>

# The schema username
PSQL_USER=<PSQL_USER>

# The schema password
PSQL_PASSWORD=<PSQL_PASSWORD>

# The mongodb root username
MONGODB_ROOT_USERNAME=<MONGODB_ROOT_USERNAME>

# The mongodb root password
MONGODB_ROOT_PASSWORD=<MONGODB_ROOT_PASSWORD>

# The mongodb username
MONGODB_USERNAME=<MONGODB_USERNAME>

# The mongodb password
MONGODB_PASSWORD=<MONGODB_PASSWORD>

# The mongo express username
MONGODB_AUTH_USERNAME=<MONGODB_AUTH_USERNAME>

# The mongo express passowrd
MONGODB_AUTH_PASSWORD=<MONGODB_AUTH_PASSWORD>

# The mongo express base url (ex: /)
MONGODB_SITE_BASEURL=<MONGODB_SITE_BASEURL>

# The default user dev infos
USER_DEV_EMAIL=<USER_DEV_EMAIL>
USER_DEV_USERNAME=<USER_DEV_USERNAME>
USER_DEV_PASSWORD=<USER_DEV_PASSWORD>

# The default user owner infos
USER_OWNER_EMAIL=<USER_OWNER_EMAIL>
USER_OWNER_USERNAME=<USER_OWNER_USERNAME>
USER_OWNER_PASSWORD=<USER_OWNER_PASSWORD>

# The smtp mailer infos
MAILER_PROTOCOLE=<MAILER_PROTOCOLE>
MAILER_USER=<MAILER_USER>
MAILER_PASS=<MAILER_PASS>
MAILER_HOST=<MAILER_HOST>
MAILER_PORT=<MAILER_PORT>
MAILER_IGNORE_TLS=<MAILER_IGNORE_TLS>
MAILER_SECURE=<MAILER_SECURE>
MAILER_FROM=<MAILER_FROM>

# The jwt secret hash of 30 characters
JWT_SECRET=<JWT_SECRET>

# The jwt default expire (ex: 1d)
JWT_EXPIRE=<JWT_EXPIRE>

# The default hash length (ex: 10)
CRYPTO_HASH_LENGTH=<CRYPTO_HASH_LENGTH>

# The default algo (ex: aes-256-ctr)
CRYPTO_ALGORITHM=<CRYPTO_ALGORITHM>

# The crypto secret of 32 characters
CRYPTO_SECRET_KEY=<CRYPTO_SECRET_KEY>

# The ws url (ex: http://localhost:<PROJECT_PORT>)
WS_URL=<WS_URL>
#...<#...>
```

Place yourself in the right folder

```shell
cd docker
```
---
## <span style="color: #a82828;">Before the next step, follow this link [<span style="color: #a82828;text-decoration: underline;text-transform:uppercase;">here</span>](#things-to-do-before-launching-the-project)</span>
---

In this folder is the file `docker-compose.yml`. Then do the following command

```shell
(sudo)? docker compose --env-file ../.env up -d --force-recreate --build
```
Explanation of the parameters used

    --env-file       : Specifies the .env file to be used
    -d               : For background execution
    --force-recreate : To force the container to be recreated
    --build          : Builds the image locally so as not to pull

On your browser `http://localhost:<ENV:WEBSERVICE_PORT>/`

---

<br>

# **Things to do before launching the project**

### **Setting up Mongo DB**
---

Connect to your MongoDB database.

---
If you're using `Docker`, connect to the container running your MongoDB and then connect to the database.

```shell
# Go to the folder containing the Docker logic
cd docker/
# Connect to your MongoDB container/service
(sudo)? docker compose --env-file ../.env exec <mongodb_service_name> bash
```
---

Log in using the following command (use root credentials)

```shell
mongo(sh)? -u <username> -p
```
You'll see this kind of view once you're logged in.

```shell
(current_dbname)?>
```
What we want to do is create the missing database for the project and the user linked to this database.

To begin, choose the database you want as follows

```shell
(current_dbname)?> use <database_name>
# Result output
switched to db <database_name>
```
At this point, your database has automatically been created, so we'll move on to creating the user linked to your database.

  1. Type the command `db.createUser({` then made `Enter`
  2. Type the command `user: "<username>",` then made `Enter`
  3. Type the command `pwd: "<password>",` then made `Enter`
  4. Type the command `roles: [ "readWrite", "dbAdmin" ]` then made `Enter`
  5. Type the command `});` then made `Enter`

The following will be displayed

```shell
(current_dbname)?> db.createUser({
... user: "<username>",
... pwd: "<password>",
... roles: [ "readWrite", "dbAdmin" ]
... });
# Result output. States that the user has been created
Succesfully user added
```
You can check this by typing the command `db.getUsers()`.