#!/bin/bash
echo "STARTING PAYMENT SERVICE"

# Install the project dependencies
yarn install --network-concurrency 1

# Generate Prisma Client
echo "run prisma generate"
yarn run prisma generate

# Create migrations from Prisma schema, apply them to the database, generate artifacts
echo "run prisma migrate dev"
yarn run prisma migrate dev --name init

# Start the API server on development mode
echo "run prisma migrate deploy"
yarn run prisma migrate deploy

# Run end-to-end tests
yarn run test:e2e