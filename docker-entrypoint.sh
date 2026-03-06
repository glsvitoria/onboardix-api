#!/bin/sh
set -e

echo "🚀 Iniciando container..."

# 1. Rodar migrações do banco (Deploy)
# Usamos npx para garantir que ele use o binário local instalado
echo "🔄 Rodando migrations (prisma migrate deploy)..."
npx prisma migrate deploy

# 2. Iniciar a API
echo "🟢 Iniciando API NestJS..."
node dist/src/main.js