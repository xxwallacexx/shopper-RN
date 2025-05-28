# Shopper React Native App

A React Native mobile application for shopping with features including product browsing, reservations, coupon management, and more.

## Technologies

- **React Native**: Cross-platform mobile framework
- **Expo**: Development toolchain for React Native
- **Tamagui**: UI component library for consistent styling
- **React Query**: Data fetching and state management
- **Jest**: Testing framework

## Getting Started

### Prerequisites

- Node.js (v22+ recommended)
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd shopper-RN
```

2. Install dependencies

```bash
npm install
```

3. Start the development server

```bash
npm start
```

## Expo Prebuild

Expo prebuild generates native iOS and Android projects from your Expo project, allowing you to add custom native code.

### Running Prebuild

1. Run the prebuild command:

```bash
npx expo prebuild
```

#### Adding Native Modules

1. For iOS, install CocoaPods dependencies:

```bash
cd ios
pod install
cd ..
```

#### Debugging Native Code

After prebuild, you can debug native code issues:

- For iOS:

  - Open the project in Xcode and use the debugging tools
  - Check Console.app for device logs

- For Android:
  - Use Android Studio's debugging tools
  - Run `adb logcat` to view device logs

## API Integration

The app connects to backend services through REST APIs:

## Project Structure

- `/components`: Reusable UI components
- `/screens`: App screens and navigation
- `/hooks`: Custom React hooks
- `/types`: TypeScript type definitions
- `/assets`: Images, fonts, and other static assets
- `/i18n`: Internationalization files
- `/api`: API client and services
- `/utils`: Utility functions
- `/contexts`: React context providers
- `/constants`: App constants and configuration
