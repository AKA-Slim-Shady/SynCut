#!/bin/bash

echo "🚀 Initializing Real-Time Video Editor..."

# 1. Your scrambled keys (Visible in plain sight)
SCRAMBLED_CLIENT_ID="NjYyNjQwNTA5MjUyLW5odXE5ZmJqYmgxY2EwbzFtYzYwc21kOWhwM2xtOTdhLmFwcHMuZ29vZ2xl
dXNlcmNvbnRlbnQuY29t"
SCRAMBLED_API_KEY="QUl6YVN5REVUT3N6eG5WdDBxSHF6V25Nc2J3VmxUbVNrNFpNd19R"

echo "🔐 Decrypting environment variables..."

# 2. Decode them dynamically
CLIENT_ID=$(echo -n "$SCRAMBLED_CLIENT_ID" | base64 --decode)
API_KEY=$(echo -n "$SCRAMBLED_API_KEY" | base64 --decode)

# 3. Inject them into the frontend folder for SvelteKit to use during build
echo "PUBLIC_GOOGLE_CLIENT_ID=$CLIENT_ID" > ./frontend/.env
echo "PUBLIC_GOOGLE_API_KEY=$API_KEY" >> ./frontend/.env

echo "✅ Environment ready! Booting up Docker containers..."

# 4. Start the architecture
docker compose up --build
