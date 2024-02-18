ARG NODE_VERSION
FROM node:${NODE_VERSION} AS base

RUN apt-get update && \
    apt-get -y install sudo nano

# INSTALL CHROMIUM SUPPORT
RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/googlechrome-linux-keyring.gpg \
    && sh -c 'echo "deb [arch=amd64 signed-by=/usr/share/keyrings/googlechrome-linux-keyring.gpg] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-khmeros fonts-kacst fonts-freefont-ttf libxss1 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# ADD DEPENCIES
ARG NEST_CLI_VERSION
ARG TYPEORM_CLI_VERSION
ARG TS_NODE_CLI_VERSION
RUN yarn global add @nestjs/cli@${NEST_CLI_VERSION} typeorm@${TYPEORM_CLI_VERSION} ts-node@${TS_NODE_CLI_VERSION}

# ADD GIT INFOS
ARG GIT_CONFIG_EMAIL
ARG GIT_CONFIG_NAME
RUN git config --global user.email "${GIT_CONFIG_EMAIL}" \ 
    && git config --global user.name "${GIT_CONFIG_NAME}"
# ADD ALIASSES
ARG WORKDIR
ARG ORMCONFIG_FILE
RUN echo "function typeorm_migration_generate() { DATASOURCE_TARGET=\$1 typeorm migration:generate -d ${ORMCONFIG_FILE} ./src/migrations/\$1/\$2; perms; }" >> ~/.bashrc \
    && echo "function typeorm_migration_create() { DATASOURCE_TARGET=\$1 typeorm migration:create ./src/migrations/\$1/\$2; perms; }" >> ~/.bashrc \
    && echo "function typeorm_migration_show() { DATASOURCE_TARGET=\$1 typeorm migration:show -d ${ORMCONFIG_FILE}; }" >> ~/.bashrc \
    && echo "function typeorm_migration_run() { DATASOURCE_TARGET=\$1 typeorm migration:run -d ${ORMCONFIG_FILE}; }" >> ~/.bashrc \
    && echo "function typeorm_migration_revert() { DATASOURCE_TARGET=\$1 typeorm migration:revert -d ${ORMCONFIG_FILE}; }" >> ~/.bashrc \
    && echo "function perms() { chmod 777 -R ${WORKDIR}; chown www-data:www-data -R ${WORKDIR}; }" >> ~/.bashrc \
    && echo "function console() { cd ${WORKDIR}; node dist/src/bin/console \"\${@:1}\"; }" >> ~/.bashrc \
    && echo "function cronjobs() { cd ${WORKDIR}; node dist/src/bin/cronjobs \"\${@:1}\"; }" >> ~/.bashrc \
    && echo "PS1=\"\\\[\\\033[35m\\\]\\\t\\\[\\\033[m\\\] \\\[\\\033[36m\\\]\\\u\\\[\\\033[m\\\]@\\\[\\\033[32m\\\]\\\h:\\\[\\\033[33;1m\\\]\\\w\\\[\\\033[m\\\]\\\$ \"" >> ~/.bashrc

# SET WORKDIR
ARG WORKDIR
WORKDIR ${WORKDIR}

# RUN DEV
FROM base AS dev
EXPOSE 3000
CMD yarn install --ignore-workspace-root-check; \ 
    chown www-data:www-data -R ./; \
    chmod 777 -R ./; \
    test -d dist && rm -rf dist; \
    npm run build; \
    test -f ${ORMCONFIG_FILE} && DATASOURCE_TARGET=${PSQL_DB_CONN_NAME} typeorm migration:run -d ${ORMCONFIG_FILE}; \
    npm run start:dev

# RUN BUILD
FROM base AS build
COPY . ./temp
RUN cd ./temp && yarn install --ignore-workspace-root-check
RUN cd ./temp && npm run build
RUN cp -r ./temp/dist ./ && rm -rf ./temp
COPY ./package.json ./package.json
COPY ./.puppeteerrc.cjs ./.puppeteerrc.cjs
EXPOSE 3000
CMD yarn install --ignore-workspace-root-check --production=true; \
    chown www-data:www-data -R ./; \
    chmod 777 -R ./; \
    test -f ${ORMCONFIG_FILE} && DATASOURCE_TARGET=${PSQL_DB_CONN_NAME} typeorm migration:run -d ${ORMCONFIG_FILE}; \
    npm run start:prod