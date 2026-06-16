#!/bin/bash
set -e

echo "🚀 Deploying MarketMind Labs..."

# Load environment variables
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

# Build and start services
docker-compose -f docker-compose.yml build
docker-compose -f docker-compose.yml up -d

# Run database migrations
echo "📦 Running database migrations..."
docker-compose exec -T backend python -c "
from app.database import engine, Base
Base.metadata.create_all(bind=engine)
print('✅ Database schema created/verified')
"

echo "✅ Deployment complete!"
echo "🌐 Frontend: https://www.logictrade.site (Render: marketmind-frontend-s0zl.onrender.com)"
echo "🔧 API: https://api.logictrade.site/api/health (Render: marketmind-api-pdn0.onrender.com)"
