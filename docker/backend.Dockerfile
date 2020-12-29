# Build from Node image
FROM node:14 as builder

WORKDIR /repo
ENV CI=true

# Copy package.jsons
COPY ./package.json ./package-lock.json ./lerna.json ./
COPY ./packages/backend/package.json ./packages/backend/package-lock.json ./packages/backend/

# Install dependencies
RUN npm ci && npx lerna bootstrap --ci

# Copy all backend files and build
COPY ./tsconfig.json ./.eslintrc ./.prettierrc ./
WORKDIR /repo/packages/backend
COPY ./packages/backend ./
RUN npm run build

# Final Node image
FROM node:14 as release
USER node

# Add tini
ENV TINI_VERSION v0.19.0
ADD --chown=node https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini

WORKDIR /app

# Copy package.jsons and install production dependencies
COPY --chown=node --from=builder /repo/packages/backend/package.json /repo/packages/backend/package-lock.json ./
RUN npm ci --only=production

# Copy the built files
COPY --chown=node --from=builder /repo/packages/backend/build ./build/

EXPOSE 7000

ENTRYPOINT [ "/tini", "--", "node", "./build/index.js" ]
