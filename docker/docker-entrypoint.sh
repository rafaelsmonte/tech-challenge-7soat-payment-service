# Production application entry-point
echo "Stating Application"

# Exit immediately if a command exits with a non-zero status.
set -e

# Migrate Database State
echo "Running: prisma migrate deploy"
yarn run prisma migrate deploy

# Run application
echo "Running: yarn start:prod"
yarn start:prod