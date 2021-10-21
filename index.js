import registerRootComponent from 'expo/src/launch/registerRootComponent';

import 'core-js/proposals/reflect-metadata';
import { App } from './src/app';

registerRootComponent(App);
