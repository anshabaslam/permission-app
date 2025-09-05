#!/bin/bash

echo "🚀 Building Android APK for HAI Permissions App"
echo "============================================="
echo ""

# Check if we're in the right directory
if [ ! -f "app.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    echo "   cd /Users/apple/Desktop/hai/hai-app"
    echo "   ./build-apk.sh"
    exit 1
fi

echo "📋 Project: HAI Permissions App"
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
echo "   - Storage permission (real file system access)"
echo "   - Demo mode toggle for UI testing"
echo ""