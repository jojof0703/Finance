# Mobile Setup Guide

Your Spending Tracker app is now configured to run as a native iOS app! Here's how to get it running on your iPhone.

## Prerequisites

1. **macOS Computer**: You need a Mac to build iOS apps
2. **Xcode**: Install Xcode from the Mac App Store
3. **iOS Device**: Your iPhone (or you can use the iOS Simulator)

## Quick Start

### 1. Build the App
```bash
npm run build:mobile
```

### 2. Open in Xcode
```bash
npm run open:ios
```

### 3. Run on Your Device

1. **Connect your iPhone** to your Mac with a USB cable
2. **In Xcode**:
   - Select your iPhone from the device dropdown (top-left)
   - Click the "Play" button (▶️) to build and run
3. **On your iPhone**:
   - Trust the developer certificate when prompted
   - The app will install and launch automatically

## Alternative: iOS Simulator

If you don't have a physical device:
1. In Xcode, select "iOS Simulator" from the device dropdown
2. Choose an iPhone model (e.g., "iPhone 15")
3. Click the "Play" button to run in the simulator

## Development Workflow

When you make changes to the web app:

1. **Build the updated app**:
   ```bash
   npm run build:mobile
   ```

2. **In Xcode**, click the "Play" button again to see your changes

## Troubleshooting

### "Untrusted Developer" Error
- Go to Settings > General > VPN & Device Management
- Tap on your developer certificate
- Tap "Trust"

### Build Errors
- Make sure Xcode is up to date
- Try cleaning the build: Product > Clean Build Folder in Xcode

### App Not Installing
- Check that your iPhone is unlocked
- Make sure you've trusted the developer certificate
- Try restarting both Xcode and your iPhone

## Features

Your mobile app includes:
- ✅ Native iOS performance
- ✅ Safe area support (notches, home indicators)
- ✅ Touch-optimized interface
- ✅ Offline functionality
- ✅ Native iOS animations and gestures

## Next Steps

Once you have the app running, you can:
- Add it to your home screen for easy access
- Use it offline - all data is stored locally
- Share it with family members (requires Apple Developer account)

The app will work exactly like the web version but with native iOS performance and feel!