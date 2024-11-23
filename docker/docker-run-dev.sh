#!/bin/bash
echo "STARTING PAYMENT SERVICE"
# rm -rf node_modules
# Install the project dependencies
yarn install --network-concurrency 1
# yarn install
# Generate Prisma Client
echo "run prisma generate"
yarn run prisma generate
# Create migrations from Prisma schema, apply them to the database, generate artifacts
echo "run prisma migrate dev"
yarn run prisma migrate dev --name init
echo "run prisma migrate deploy"
yarn run prisma migrate deploy
# Start the API server on development mode
echo "run start:dev"
yarn run start:dev