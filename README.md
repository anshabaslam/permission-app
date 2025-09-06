# Permission Pro - Test Submission

A permission management application built with React Native and Expo, demonstrating permission handling, responsive UI design, and cross-platform compatibility.

## 📋 Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Expo CLI (`npm install -g @expo/cli`)
- EAS CLI (`npm install -g eas-cli`)
- Android Studio (for Android development)
- Xcode (for iOS development - macOS only)

### Installation & Development

1. **Clone and Install Dependencies**
   ```bash
   git clone https://github.com/anshabaslam/permission-app.git
   cd permission-app
   npm install
   ```

2. **Development Server**
   ```bash
   npx expo start
   ```

3. **Run on Platforms**
   ```bash
   # Android
   npx expo run:android
   
   # iOS
   npx expo run:ios
   
   # Web
   npx expo start --web
   ```

### Production Builds

#### Android APK (EAS Build - Recommended)
```bash
# Generate APK for testing
npx eas build --platform android --profile preview

# Production build
npx eas build --platform android --profile production
```

#### Local Android Build (Alternative)
```bash
cd android
./gradlew assembleRelease
```

#### iOS Build
```bash
npx eas build --platform ios --profile production
```

## 📦 Libraries & Packages Used

### Core Framework
- **React Native**: `0.79.5` - Cross-platform mobile framework
- **Expo SDK**: `~52.0.0` - Development platform and native APIs
- **TypeScript**: `~5.3.3` - Type safety and development experience
- **React**: `18.3.1` - UI library

### Permission Management
- **expo-camera**: `~16.0.0` - Camera permission handling
- **expo-location**: `~18.0.0` - Location services and permissions  
- **expo-media-library**: `~17.0.0` - Photos/media access permissions
- **React Native Permissions API**: Native Android SMS permission handling

### UI & Navigation
- **react-native-safe-area-context**: `4.12.0` - Safe area handling across devices
- **@expo/vector-icons**: `^14.0.4` - Comprehensive icon library
- **React Native Dimensions API**: Responsive design and screen adaptation

### Development & Build Tools
- **EAS CLI**: Cloud-based builds and deployments
- **Expo CLI**: Development server and local tooling
- **TypeScript**: Static type checking
- **Metro Bundler**: JavaScript bundling and optimization

## 🏗️ Project Architecture

```
src/
├── components/
│   └── MainScreen.tsx              # Main container with global permission logic
└── screens/
    ├── Permissions/
    │   ├── index.tsx               # Permission management interface
    │   └── styles.ts               # Isolated styling
    ├── Profile/
    │   ├── index.tsx               # User profile configuration
    │   └── styles.ts               # Component-specific styles
    └── Email/
        ├── index.tsx               # Email provider connections
        └── styles.ts               # Styled components

assets/
├── logo.png                        # App icon (used for installation icon)
├── logo2.png                       # Splash screen logo

configuration/
├── app.json                        # Expo configuration
├── eas.json                        # EAS Build configuration
├── package.json                    # Dependencies and scripts
└── tsconfig.json                   # TypeScript configuration
```

## Features Implemented

### Core Permission Management
- **Real-time Permission Monitoring**: Continuous tracking of camera, location, photos, SMS permissions
- **Cross-platform Compatibility**: Android and iOS support with platform-specific handling
- **Visual Status Indicators**: Green/red toggle switches with immediate feedback
- **Smart Permission Requests**: Intelligent handling of denied, granted, and "ask again" states
- **Automatic Status Updates**: 30-second interval checks + app state change detection
- **Permission Persistence**: Efficient caching to minimize redundant system calls

### Advanced UI Features
- **Responsive Design**: Adaptive layout for different screen sizes and orientations
- **Conditional ScrollView**: Dynamic scrolling only when content exceeds screen height
- **Custom Logo Integration**: 
  - `logo.png` for app icon and installation icon
  - `logo2.png` for splash screen
- **Platform-specific Styling**: iOS and Android design pattern compliance
- **Smooth Animations**: Debounced updates prevent UI flickering

### Technical Implementation
- **TypeScript Integration**: Full type safety across components and APIs
- **Modular Architecture**: Separated concerns with component-based structure
- **Performance Optimization**: 
  - Debounced permission checks (2-second delay)
  - Efficient state management
  - Minimal re-renders through proper dependency arrays
- **Error Handling**: Comprehensive error boundaries and fallback states
- **Cross-platform Native Modules**: Direct Android API integration for SMS permissions

### Build & Deployment
- **EAS Build Integration**: Cloud-based build system
- **Multiple Build Profiles**: Preview (APK) and Production configurations
- **Automated Version Management**: Auto-incrementing version codes
- **CI/CD Ready**: Scriptable builds with expect automation

## Known Limitations

### Platform-Specific Constraints

#### iOS Limitations
- **SMS Permissions**: Not available due to iOS security restrictions
- **Background Permission Checks**: Limited by iOS app lifecycle management
- **System Settings Integration**: Cannot programmatically open specific permission settings

#### Android Limitations
- **Android Version Fragmentation**: Permission behavior varies across Android 6+ versions
- **Custom ROM Compatibility**: Non-standard Android distributions may behave differently  
- **Expo Go Restrictions**: Some native features limited in development client
- **SMS Permission Complexity**: Requires multiple permission types and careful handling


## 🔧 Technical Implementation Details

### Permission Checking Strategy
```typescript
// Multi-layered permission checking approach
1. App Launch: Immediate check
2. App State Changes: Focus/background transition checks  
3. Periodic Updates: 30-second interval monitoring
4. User Interaction: On-demand permission requests
5. Stability Checks: 2-second debouncing prevents rapid toggling
```

### Performance Optimizations
- **Debounced API Calls**: Prevents excessive system permission queries
- **Efficient State Management**: Minimal component re-renders
- **Memory Management**: Proper cleanup of intervals and listeners

---

**Submission Notes**: This application demonstrates mobile development skills including native API integration, cross-platform compatibility, responsive UI design, and production-ready build processes. The implementation showcases both React Native/Expo understanding of mobile platform-specific constraints.