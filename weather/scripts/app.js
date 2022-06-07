let map;

let app;

function initMap() {
    var stClareShores = new google.maps.LatLng(42.477344811444574, -82.69110269729487);

    map = new google.maps.Map(document.getElementById('map'), {
        center: stClareShores,
        zoom: 11,
    });

    app = new App();

}

window.initMap = initMap;

function App() {

    this.baseMap = new BaseMap();
    this.locationManager = new GeolocationManager(this.baseMap);

    this.locationManager.start();

}
