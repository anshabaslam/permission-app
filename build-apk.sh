#!/bin/bash

echo "🚀 Building Android APK for Permission App"
echo "=========================================="
echo ""

# Check if we're in the right directory
if [ ! -f "app.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    echo "   cd /Users/apple/Desktop/test/permission-app"
    echo "   ./build-apk.sh"
    exit 1
fi

echo "📋 Project: Permission App"
echo "📦 Build Profile: preview (APK format)"
echo "🏗️  Platform: Android"
echo ""

# Start the build
echo "🚀 Starting EAS build..."
echo "   You'll be prompted to:"
echo "   1. Create EAS project (answer: y)"
echo "   2. Create keystore (answer: y)"
echo ""

npx eas build --platform android --profile preview

echo ""
echo "✅ Build complete! Your APK download link will be shown above."
echo "📱 Install the APK on your Android device to test all permissions."
echo ""
echo "🧪 Features to test:"
echo "   - Camera permission (real device camera access)"
echo "   - Location permission (real GPS access)" 
echo "   - Photos permission (real photo library access)"
echo "   - SMS/Messages permission (real SMS reading access)"
echo "   - Real-time permission status updates"
echo ""