# Voyage

An Android-first, plain JavaScript Expo SDK 54 app for the SIH hyper-local tourism flow.

## Run it

Install dependencies once:

```sh
npm install
```

MapLibre is a native module, so it cannot run inside Expo Go. Build a development client on an Android device/emulator:

```sh
npm run android
npm start
```

## Connect the backend

The app starts with local sample responses so all five screens can be demonstrated. Once Spring Boot is available, set these before starting Expo:

```sh
EXPO_PUBLIC_API_URL=http://YOUR_LAN_IP:8080
EXPO_PUBLIC_USE_MOCK_DATA=false
```

All network calls live in `src/api/`; no endpoint URLs, API keys, or credentials are placed in screen components.

## Included flow

1. Open an animated Voyage landing screen and begin a personalised discovery flow.
2. Request foreground location only after the discovery CTA is tapped; fall back to a Kolkata city guide when unavailable.
3. Animate location lock, crowd-signal mapping, and destination curation before showing picks.
4. Render image-led recommendations, place stories, and preference controls.
5. Show origin/destination markers, crowd heat zones, and drive/walk/cycle time estimates on the route map.
