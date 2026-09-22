#!/usr/bin/env bash
set -e

echo "=== Building iPhone Duo DevTools Simulator ==="
npm run build

VERSION=$(node -p "require('./manifest.json').version")
OUTPUT_ZIP="iphone-duo-simulator-v${VERSION}.zip"

echo "=== Packaging clean Chrome Web Store ZIP: ${OUTPUT_ZIP} ==="
rm -f "${OUTPUT_ZIP}"

zip -r "${OUTPUT_ZIP}" manifest.json dist icons \
  -x "*.DS_Store" \
  -x "*.map"

echo ""
echo "✅ Packaged successfully: ${OUTPUT_ZIP}"
echo "Package size: $(du -h "${OUTPUT_ZIP}" | cut -f1)"
echo "Ready for upload to Chrome Developer Dashboard: https://chrome.google.com/webstore/devconsole"
