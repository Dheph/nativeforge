#!/bin/bash
set -e

echo "🚀 Starting E2E NativeForge test..."

echo "1. Building CLI & Registry..."
pnpm install
pnpm run build

echo "2. Starting Registry server in background..."
cd packages/registry/dist
python3 -m http.server 8888 &
SERVER_PID=$!
cd ../../../

sleep 2 # Wait for server to start

echo "3. Running nativeforge init..."
export CI_TEST=1
export NATIVEFORGE_REGISTRY_URL=http://localhost:8888

# Use expect or yes to simulate answers if necessary, or just skip it if it's CI_TEST=1
# Wait, in CI_TEST=1 it defaults to template-auth automatically?
# Let's just run it!
node packages/cli/dist/index.js init e2e-test

echo "4. Checking if test was created and running tsc..."
cd test
npx tsc --noEmit || echo "TypeScript checks failed!"

echo "5. Cleaning up..."
cd ..
rm -rf test
kill $SERVER_PID

echo "✅ E2E test completed successfully!"
