# Schiffradar

[![Validate](https://github.com/artyorsh/schiffradar/actions/workflows/validate.yml/badge.svg?event=push&branch=main)](https://github.com/artyorsh/schiffradar/actions?query=branch%3Amain+event%3Apush)
[![Build](https://github.com/artyorsh/schiffradar/actions/workflows/build.yml/badge.svg?event=schedule&branch=main)](https://github.com/artyorsh/schiffradar/actions?query=branch%3Amain+event%3Aschedule)

## Description

Schiffradar (German for "Ship Radar") - a mobile application that tracks vessels in real-time using AIS data.
Works in combination with [aisstream.io ingestion server](https://github.com/artyorsh/schiffradar-api).

<img src="./screenshots/preview.png" />

## Stack

- [![expo](https://img.shields.io/badge/expo-55.0-blue)](https://github.com/expo/expo/blob/main/packages/expo/CHANGELOG.md)
- [![react-native](https://img.shields.io/badge/react--native-0.83-blue)](https://github.com/facebook/react-native/releases)
- [![react-navigation](https://img.shields.io/badge/react--navigation-7.1-blue)](https://github.com/react-navigation/react-navigation/releases)
- [![react-native-unistyles](https://img.shields.io/badge/react--native--unistyles-3.2-blue)](https://github.com/vitalets/react-native-unistyles/releases)
- [![mobx-react-lite](https://img.shields.io/badge/mobx--react--lite-4.1-blue)](https://github.com/mobxjs/mobx/releases)
- [![inversifyjs](https://img.shields.io/badge/inversifyjs-8.1-blue)](https://github.com/inversify/InversifyJS/releases)
- [![jest](https://img.shields.io/badge/jest-29.7-blue)](https://github.com/jestjs/jest/releases)
- [![react-native-testing-library](https://img.shields.io/badge/testing--library-13.3-blue)](https://github.com/callstack/react-native-testing-library/releases)
- [![@rnmapbox/maps](https://img.shields.io/badge/@rnmapbox/maps-10.1-blue)](https://github.com/rnmapbox/maps/releases)
- [![typescript](https://img.shields.io/badge/typescript-5.9-blue)](https://github.com/microsoft/TypeScript/releases)
- [![eslint](https://img.shields.io/badge/eslint-9.38-blue)](https://github.com/eslint/eslint/releases)

## Features

- AIS data polling with advanced configuration options (see [architecture components](#key-architecture-components)).
- Interactive map with markers and data clustering.
- Location permissions.
- Vessel details via [MarineTraffic.com](https://www.marinetraffic.com/).
- Splash Screen Animation, fully compatible with expo-splash-screen.
- Light and Dark themes with flexible customization.
- CI/CD with GitHub Actions and EAS.
- Localization and multi-language support via [lingui](https://lingui.dev).
- Modularized architecture with Dependency Injection.

## Setup

Install [Bun](https://github.com/oven-sh/homebrew-bun#install).

```bash
bun i
```

```bash
cp .env.example .env
# Update the:
# - EXPO_PUBLIC_HTTP_BASE_URL
# - EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN,
# - EXPO_PUBLIC_MAPBOX_RNMapboxMapsDownloadToken
```

## Running

Start Metro bundler and follow the instructions in terminal to run the app.

```bash
bun run start
```

## Location

Zuidpier IJmuiden: 52.4637027,4.5297216 (or anything within the ingestor bbox).

### Android

- Configure: Emulator > More > Location > Search
- Reset permissions:`adb shell pm reset-permissions`

### iOS

- Configure: Simulator > Features > Location > Custom Location
- Reset permissions: Reinstall the app or `xcrun simctl erase all`

## Other apps

[LiquidChat](https://github.com/artyorsh/liquid-chat)

## Author

[Artur Yersh](https://artyorsh.me)
