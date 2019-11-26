export var cordova = {};

export const App = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    onDeviceReady: function () {
        // window.StatusBar.backgroundColorByHexString("#28b280");
        // window.navigator.splashscreen.hide();
        cordova = window.cordova;
        // cordova.requestFileSystem = window.requestFileSystem;
        // cordova.VideoPlayer = window.VideoPlayer;
        // cordova.geolocation = window.navigator.geolocation;
        // cordova.screen = window.screen;
        // cordova.AndroidFullScreen = window.AndroidFullScreen;
        // cordova.connection = window.navigator.connection.type;
        // cordova.camera = window.navigator.camera;
    }
}
