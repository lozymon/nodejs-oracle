######################################
# Base Container for all 
# INSTALL ORACLE INSTANSE
######################################
FROM node:18 as download

RUN apt-get update \
    && apt-get install -y unzip wget \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /instantclient

RUN wget -O instantclient.zip https://download.oracle.com/otn_software/linux/instantclient/2110000/instantclient-basiclite-linux.x64-21.10.0.0.0dbru.zip
RUN unzip instantclient.zip

FROM node:18 as base

RUN apt-get update \
    && apt-get install -y tzdata \
    && apt-get install -y libaio1 \
    && rm -rf /var/lib/apt/lists/*

# INSTALL ORACLE CLIENT
COPY --from=download /instantclient/instantclient_21_10 /opt/oracle/instantclient
RUN echo /opt/oracle/instantclient > /etc/ld.so.conf.d/oracle-instantclient.conf
RUN ldconfig
ENV LD_LIBRARY_PATH "/opt/oracle/instantclient:$LD_LIBRARY_PATH"

######################################
# BUILD FOR LOCAL DEVELOPMENT
######################################

FROM base as development

# Use the node user from the image (instead of the root user)
USER node

# Create app directory
WORKDIR /app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.
COPY --chown=node:node package*.json ./

# Install app dependencies using the `npm ci` command instead of `npm install`
RUN npm i

# Bundle app source
COPY --chown=node:node . .

######################################
# BUILD FOR PRODUCTION
######################################

FROM base as build

WORKDIR /app

COPY --chown=node:node package*.json ./

# In order to run `npm run build` we need access to the Nest CLI.
# The Nest CLI is a dev dependency,
# In the previous development stage we ran `npm ci` which installed all dependencies.
# So we can copy over the node_modules directory from the development image into this build image.
COPY --chown=node:node --from=development /app/node_modules ./node_modules

COPY --chown=node:node . .

# Run the build command which creates the production bundle
RUN npm run build

# Set NODE_ENV environment variable
ENV NODE_ENV production

# Running `npm ci` removes the existing node_modules directory.
# Passing in --only=production ensures that only the production dependencies are installed.
# This ensures that the node_modules directory is as optimized as possible.
RUN npm ci --only=production && npm cache clean --force

USER node

######################################
# PRODUCTION
######################################

FROM base as production

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=build /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/dist ./dist

# Start the server using the production build
CMD [ "node", "dist/main.js" ]