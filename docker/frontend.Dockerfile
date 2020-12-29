# Build from Node image
FROM node:14 as builder

WORKDIR /repo
ENV CI=true

# Copy package.jsons
COPY ./package.json ./package-lock.json ./lerna.json ./
COPY ./packages/frontend/package.json ./packages/frontend/package-lock.json ./packages/frontend/

# Install dependencies
RUN npm ci && npx lerna bootstrap --ci

# Copy all frontend files and build
COPY ./tsconfig.json ./.eslintrc ./.prettierrc ./
WORKDIR /repo/packages/frontend
COPY ./packages/frontend ./
RUN npm run build

# Final nginx image
FROM nginx:1.19-alpine as release

# Copy files from builder
COPY --from=builder /repo/packages/frontend/build /usr/share/nginx/html/
