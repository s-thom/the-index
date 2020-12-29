# Build from Node image
FROM node:14
USER node

# Add tini
ENV TINI_VERSION v0.19.0
ADD --chown=node https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini

WORKDIR /app

# Copy backend package.json for npm scripts
COPY --chown=node ./packages/backend/package.json ./packages/backend/package-lock.json ./
RUN npm install

# Copy migrations
COPY --chown=node ./packages/backend/migrations/ ./migrations/

ENTRYPOINT [ "/tini", "--", "npm", "run", "execute-migrations", "--" ]
