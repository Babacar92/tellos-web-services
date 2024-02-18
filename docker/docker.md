
# Environments variables to set for CI/CD

## Variables definitions
`GIT_CONFIG_EMAIL`: Global user email for git config
`GIT_CONFIG_NAME`: Global user name for git config
`WEBSERVICE_REGISTRY`: Registry gitlab for the docker images
`WEBSERVICE_VERSION`: Version of the application (**dev** for the dev branch and **commit name** for staging and main branches)
`WEBSERVICE_NODE_VERSION`: Node version used for the application **(18.13.0)**
`WEBSERVICE_CLI_VERSION`: Nest Cli version used for the application **(9.1.8)**
`WEBSERVICE_TYPEORM_CLI_VERSION`: Typeorm version used for the application **(0.3.11)**
`WEBSERVICE_TS_NODE_CLI_VERSION`: Typescript node version used for the application **(10.9.1)**
`WEBSERVICE_BUILD_TARGET`: The target to used for the docker build **(base / dev / build)**
`WEBSERVICE_BUILD_CONTEXT`: The context used for the docker build **(../)**
`WEBSERVICE_BUILD_DOCKERFILE`: The path to the dockerfile to used for the docker build **(docker/Dockerfile)**
`WEBSERVICE_ORMCONFIG_FILE`: The path for the ormconfig used for migration **(./dist/ormconfig.js)**
`WEBSERVICE_WORKDIR`: The working directory in the docker container **(/var/www/${WEBSERVICE_NAME})**

## Sample
> **GIT_CONFIG_EMAIL**=`example@tellos.be`
> **GIT_CONFIG_NAME**=`"User example"`
> **WEBSERVICE_REGISTRY**=`registry.gitlab.itdm-group.com/itdm-tellos/webservice`
> **WEBSERVICE_VERSION**=`1.0.0`
> **WEBSERVICE_NODE_VERSION**=`18.13.0`
> **WEBSERVICE_CLI_VERSION**=`9.1.8`
> **WEBSERVICE_TYPEORM_CLI_VERSION**=`0.3.11`
> **WEBSERVICE_TS_NODE_CLI_VERSION**=`10.9.1`
> **WEBSERVICE_BUILD_TARGET**=`dev`
> **WEBSERVICE_BUILD_CONTEXT**=`../`
> **WEBSERVICE_BUILD_DOCKERFILE**=`docker/Dockerfile`
> **WEBSERVICE_ORMCONFIG_FILE**=`./dist/ormconfig.js`
> **WEBSERVICE_WORKDIR**=`/var/www/${WEBSERVICE_NAME}`