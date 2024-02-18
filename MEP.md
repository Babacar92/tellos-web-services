# Server upload

---

On the DEV server, runners are in place for build and deployment. Once developments are pushed to the dev branch, 2 runners are triggered, the one that creates the image and the one that imports the image onto the dev server and relaunches the containers.

There are exceptions to this rule. When you're preparing a staging (production not yet completed), you'll have to compress your migrations. The idea is not to burden staging or prod with multiple migrations generated by devs.

### For this purpose

---

<span style="color: #a82828;">These operations can also be performed on a server if necessary (e.g. dev).</span>

Export your db data by going to the docker folder.

```shell
cd docker
```

Run the cronjobs file for dump database

```shell
bash cronjobs.sh dump
```

Files will be created for re-importing data.

- Go to your database tool, delete the schema and recreate a blank one.
- Delete any migrations you no longer wish to keep and run the rest.
- Your db will be in a certain state and this will allow you to generate a new migration that you will name "MigrationVersion<number>".
- Execute this migration and your db will be back to its last state with only the migrations executed.

Once these operations have been completed, your database will be brand new and, of course, empty. You will then need to re-import the previously exported data.

### Re-import data

---

Go to docker folder again and exec this command

```shell
bash cronjobs.sh restore
```

This command will reinsert all data.

---

## Server update (Staging | Prod)

---

Go to the server and go to the webservice folder

```shell
cd /var/www/webservice
```

Make a docker pull for to get last version

```shell
# webservice is the service name of docker compose file
(sudo)? docker compose pull webservice
```

When this is done, the cronjobs file should normally be in the server, otherwise re-import it to the root and modify the file if necessary.

Next, issue the command to dump the db

```shell
bash cronjobs.sh dump
```

You have just saved the db in case of problems and then you can restart the container.

```shell
(sudo)? docker compose up -d --force-recreate
```