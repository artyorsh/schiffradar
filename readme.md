# Schiffradar

[![Build](https://github.com/artyorsh/schiffradar/actions/workflows/build.yml/badge.svg?event=push&branch=main)](https://github.com/artyorsh/schiffradar/actions?query=branch%3Amain)

## Description

Schiffradar (German for "Ship Radar") - a mobile application that tracks vessels in real-time using AIS data.
Works in combination with [aisstream.io ingestion server](https://github.com/artyorsh/schiffradar-api).

<img src="./screenshots/preview.png" />

## Stack

- [![expo](https://img.shields.io/badge/expo-53.0-blue)](https://github.com/expo/expo/blob/main/packages/expo/CHANGELOG.md)
- [![react-native](https://img.shields.io/badge/react--native-0.79-blue)](https://github.com/facebook/react-native/releases)
- [![react-navigation](https://img.shields.io/badge/react--navigation-7.0-blue)](https://github.com/react-navigation/react-navigation/releases)
- [![react-native-unistyles](https://img.shields.io/badge/react--native--unistyles-3.0-blue)](https://github.com/vitalets/react-native-unistyles/releases)
- [![mobx-react](https://img.shields.io/badge/mobx--react-9.2-blue)](https://github.com/mobxjs/mobx/releases)
- [![inversifyjs](https://img.shields.io/badge/inversifyjs-6.0-blue)](https://github.com/inversify/InversifyJS/releases)
- [![jest](https://img.shields.io/badge/jest-29.7-blue)](https://github.com/jestjs/jest/releases)
- [![react-native-testing-library](https://img.shields.io/badge/testing--library-12.4-blue)](https://github.com/callstack/react-native-testing-library/releases)
- [![@rnmapbox/maps](https://img.shields.io/badge/@rnmapbox/maps-10.1-blue)](https://github.com/rnmapbox/maps/releases)
- [![typescript](https://img.shields.io/badge/typescript-5.7-blue)](https://github.com/microsoft/TypeScript/releases)
- [![eslint](https://img.shields.io/badge/eslint-8.56-blue)](https://github.com/eslint/eslint/releases)

## Features

- AIS data polling with advanced configuration options (see [architecture components](#key-architecture-components)).
- Interactive map with markers and data clustering.
- Location permissions.
- Vessel details via [MarineTraffic.com](https://www.marinetraffic.com/).
- Splash Screen Animation, fully compatible with expo-splash-screen.
- Light and Dark themes with flexible customization.
- CI/CD with GitHub Actions and EAS.
- Modularized architecture with Dependency Injection.

## Setup

```bash
yarn
```

```bash
cp .env.example .env

# Update the:
# - EXPO_PUBLIC_API_URL
# - EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN,
# - EXPO_PUBLIC_MAPBOX_RNMapboxMapsDownloadToken
```

Then configure [ingestion server](https://github.com/artyorsh/schiffradar-api) (docker-compose setup) and [simulator location](#location).

## Running

Start the Metro bundler and follow the instructions in the terminal to run the app on your device or emulator.

```bash
yarn start
```

## Location

Zuidpier IJmuiden: 52.4637027,4.5297216 (or anything within the ingestor bbox).

### Android

- Configure: Emulator > More > Location > Search
- Reset permissions:`adb shell pm reset-permissions`

### iOS

- Configure: Simulator > Features > Location > Custom Location
- Reset permissions: Reinstall the app or `xcrun simctl erase all`

## Key architecture components

- [VesselsDataSource](./src/map/datasource/vessels-datasource.ts) - the data provider abstraction for the vessels displayed on the map.
Provides push and pull functionality for the vessel data via [VesselsAPI](./src/map/datasource/vessels-remote-repository.ts) and [VesselsMemStorage](./src/map/datasource/vessels-mem-repository.ts).
- [MapView](./src/map/map-view.component.tsx) - the map, rendering the vessels in [VesselsLayer](./src/map/vessels-layer.component.tsx).
- [MapViewVM](./src/map/map-view.vm.ts) - the ViewModel. Responsible for managing the state via the DataSource subscription.
- [The feature index](./src/map/index.ts) defines the configuration parameters for the DataSource and the Map.
- [LocationService](./src/location/index.ts) - a service for managing location permissions and retrieving the device's current location.

## Author

[Artur Yersh](https://github.com/artyorsh)