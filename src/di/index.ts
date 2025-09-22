export const AppModule = {
  /* Services */
  HTTP: Symbol.for('HttpClient'),
  I18N: Symbol.for('I18nService'),
  LOG: Symbol.for('LogService'),
  ROUTER: Symbol.for('RouterService'),
  PROCESS_INFO: Symbol.for('ProcessInfoService'),
  LOCATION: Symbol.for('LocationService'),
  MODAL: Symbol.for('ModalService'),

  /* Screens */
  SPLASH_SCREEN: Symbol.for('SplashScreen'),
  LOCATION_PERMISSION: Symbol.for('LocationPermissionScreen'),
  MAP_SCREEN: Symbol.for('MapScreen'),
};
