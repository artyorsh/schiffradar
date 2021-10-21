export const AppModule = {
  /* Services */
  LOG: Symbol.for('LogService'),
  ROUTER: Symbol.for('RouterService'),
  PERMISSION: Symbol.for('PermissionService'),
  PROCESS_INFO: Symbol.for('ProcessInfoService'),
  PUSH_NOTIFICATION: Symbol.for('PushNotificationService'),
  MODAL: Symbol.for('ModalService'),
  LOCATION: Symbol.for('LocationService'),
  SESSION: Symbol.for('SessionService'),
  USER: Symbol.for('UserService'),

  /* Screens */
  SPLASH_SCREEN: Symbol.for('SplashScreen'),
  LOCATION_PERMISSION: Symbol.for('LocationPermissionScreen'),
  MAP_SCREEN: Symbol.for('MapScreen'),
};
