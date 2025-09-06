# Permission Pro

A clean, intuitive permission management app for Android and iOS devices. Easily manage camera, location, photos, and SMS permissions with real-time status updates.

## 📱 Features

- **Real-time Permission Tracking**: Monitor camera, location, photos, and SMS permissions
- **Visual Status Indicators**: Green/red toggles show permission status at a glance
- **Smart Permission Requests**: Intelligent handling of permission states and user interactions
- **Cross-Platform Support**: Works on both Android and iOS (with platform-specific features)
- **SMS Permission Management**: Advanced SMS permission handling for Android devices
- **Automatic Status Updates**: Permissions are checked periodically and when app becomes active
- **Clean UI**: Modern, minimalist design with smooth animations

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- For Android: Android Studio and Android SDK
- For iOS: Xcode (macOS only)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd permission-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   npx expo start
   ```

4. **Run on device/simulator**
   - **Android**: `npx expo run:android`
   - **iOS**: `npx expo run:ios`
   - **Web**: `npx expo start --web`

### Building for Production

#### Android APK
```bash
# Using local build
cd android
./gradlew assembleRelease

# Using EAS Build
npx eas build --platform android --profile preview
```

#### iOS
```bash
npx eas build --platform ios
```

## 📦 Libraries & Packages Used

### Core Dependencies
- **React Native**: `0.79.5` - Mobile app framework
- **Expo SDK**: Latest - Development platform and tools
- **TypeScript**: Type safety and better development experience

### Permission Management
- **expo-camera**: Camera permission handling
- **expo-location**: Location permission management
- **expo-media-library**: Photos/media permissions
- **react-native**: Native Android SMS permission handling

### UI & Navigation
- **react-native-safe-area-context**: Safe area handling for different devices
- **@expo/vector-icons**: Icon library for UI elements

### Development Tools
- **EAS CLI**: Build and deployment
- **Expo CLI**: Development server and tools

## 🛠️ Project Structure

```
src/
├── components/
│   └── MainScreen.tsx              # Main app container with permission logic
└── screens/
    ├── Permissions/
    │   ├── index.tsx               # Permission management screen
    │   └── styles.ts               # Permission screen styles
    ├── Profile/
    │   ├── index.tsx               # Profile configuration screen
    │   └── styles.ts               # Profile screen styles
    └── Email/
        ├── index.tsx               # Email connection screen
        └── styles.ts               # Email screen styles

assets/
├── logo.png                        # Custom app logo (used for all visual elements)
├── icon.png                        # Original app icon (replaced with logo.png)
├── splash-screen.png               # Original splash (replaced with logo.png)
└── adaptive-icon.png               # Original adaptive icon (replaced with logo.png)
```

## ⚙️ Configuration

### App Configuration (`app.json`)
- **App Name**: Permission Pro
- **Package**: `com.permission.pro`
- **Icons**: Uses custom logo.png for all visual elements
- **Splash Screen**: Custom logo with purple background
- **Permissions**: Pre-configured for camera, location, photos, and SMS

### Build Configuration (`eas.json`)
- **Preview Profile**: Generates APK for testing
- **Production Profile**: App Store/Play Store builds

## 🎯 Features Implemented

### ✅ Core Features
- [x] Real-time permission status monitoring
- [x] Camera permission management
- [x] Location permission handling
- [x] Photos/media library permissions
- [x] SMS permission support (Android)
- [x] Visual toggle indicators
- [x] Automatic permission checking (30-second intervals)
- [x] App state change detection
- [x] Clean, modern UI design
- [x] Custom logo integration

### ✅ Technical Features
- [x] TypeScript implementation
- [x] Cross-platform compatibility
- [x] Efficient permission caching
- [x] Debounced permission checks
- [x] Error handling and user feedback
- [x] Performance optimizations

## ⚠️ Known Limitations

### Platform-Specific Limitations

#### iOS
- **SMS Permissions**: Not supported due to iOS restrictions
- **Background Permissions**: Limited by iOS app backgrounding

#### Android
- **Expo Go Limitations**: Some features may not work in Expo Go development client
- **Permission Variations**: Different Android versions handle permissions differently
- **Custom ROMs**: May behave differently on modified Android systems


## 🔧 Development Notes

### Permission Checking Strategy
- **Immediate Check**: When app loads or becomes active
- **Periodic Checks**: Every 30 seconds for status updates
- **Event-Driven**: When user interacts with permission toggles
- **Stability Checks**: Prevents rapid toggle flickering

### Performance Considerations
- Debounced permission checks to prevent excessive API calls
- Efficient state management with minimal re-renders
- Optimized UI updates only when status actually changes

## 🐛 Troubleshooting

### Common Issues

1. **Permissions not updating**
   - Close and reopen the app
   - Check device settings manually
   - Restart the permission checking service

2. **Build failures**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Clean Expo cache: `npx expo start --clear`
   - For Android: Clean gradle cache

3. **SMS permission issues (Android)**
   - Ensure device is running Android (not iOS)
   - Check if device supports SMS permissions
   - Manually enable in device settings if needed

### Getting Help
- Check the device logs for detailed error messages
- Test on a physical device rather than simulator when possible
- Ensure all dependencies are properly installed



Built with using React Native and Expo