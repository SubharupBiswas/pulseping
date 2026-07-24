#!/bin/bash
set -e

echo "📦 Pulling latest changes from main..."
git pull origin main

echo "📥 Installing dependencies..."
npm install

echo "🗄️ Syncing Prisma Database Schema..."
npx prisma generate
npx prisma db push

echo "🏗️ Building Next.js Standalone..."
npm run build

echo "📂 Copying Static Assets & Environment to Standalone Directory..."
cp .env .next/standalone/.env || true
cp .env.local .next/standalone/.env.local || true
cp -r public .next/standalone/ || true
cp -r .next/static .next/standalone/.next/

echo "🔄 Reloading PM2 Cluster..."
pm2 reload ecosystem.config.js || pm2 start ecosystem.config.js
pm2 save

echo "✨ Deployment Complete & Live!"
