
function UserLocationTracker() {
    this.marker;
    this.circle;
    this.heading;

    this.track;

    this.assets = {
        noHeadingMarkerIcon: {
            path: "M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8",
            fillColor: "#2962FF",
            fillOpacity: 1,
            strokeWeight: 3,
            strokeColor: "#FFF",
            rotation: 0,
            scale: 2,
            anchor: {
                x: 12,
                y: 12
            },
        },
        headingMarkerIcon: {
            path: "M12,2L4.5,20.29L5.21,21L12,18L18.79,21L19.5,20.29L12,2Z",
            fillColor: "#2962FF",
            fillOpacity: 1,
            strokeWeight: 3,
            strokeColor: "#FFF",
            rotation: 0,
            scale: 2,
            anchor: {
                x: 12,
                y: 12
            },
        }

    }

    this.update = function (position) {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        var acc = position.coords.accuracy;
        heading = position.coords.heading;

        var pos = new google.maps.LatLng(lat, lng);

        if (!this.marker) this.initializeMarker(pos);
        if (!this.circle) this.initializeCircle(acc);

        this.marker.setPosition(pos);

        this.circle.setCenter(pos);
        this.circle.setRadius(acc);

        this.marker.setIcon(
            this.hasHeading() ?
            this.assets.headingMarkerIcon :
            this.assets.noHeadingMarkerIcon
        );

        map.panTo(this.getPosition());

        this.updateTrack(pos);

        // store position locally
        storageManager.storeLastPosition(pos);
    }

    this.initializeMarker = function (pos) {
        this.marker = new google.maps.Marker({
            position: pos,
            map: map,
            title: "User Location"
        });
    }

    this.initializeCircle = function (radius) { // radius in meters
        this.circle = new google.maps.Circle({
            strokeColor: "#2962FF",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#82B1FF",
            fillOpacity: 0.35,
            map,
            center: this.marker.position,
            radius: radius,
        });
    }

    this.updateTrack = function (pos) {
        if (!this.track) {
            this.track = new google.maps.Polyline({
                strokeColor: "#000000",
                strokeOpacity: 1.0,
                strokeWeight: 3,
            });
            this.track.setMap(map);
        }
        this.track.getPath().push(pos);
    }

    this.getPosition = function () {
        return this.marker.position;
    }

    this.getHeading = function () {
        return this.heading;
    }

    this.hasHeading = function () {
        return this.heading != undefined;
    }
}

function StorageManager() {
    this.STORAGE_KEYS = {
        LAST_POSITION: "LAST_USER_POSITION",
    }

    this.storeLastPosition = function(gMapsLatLng) {
        localStorage.setItem(
            this.STORAGE_KEYS.LAST_POSITION,
            JSON.stringify(
                gMapsLatLng.toJSON()
            )
        );
    }

    this.getLastPosition = function(gMapsLatLng) {
        return JSON.parse(
            localStorage.getItem(
                this.STORAGE_KEYS.LAST_POSITION,
                { // default map position
                    lat: 43.40034,
                    lng: -84.58715
                }
            )
        );
    }
}

function WebSocketManager(url) {
    this.websocket = new WebSocket(url);

    this.websocket.onopen = function(event) {
        console.log("WebSocket opened", event);
    }

    this.websocket.onmessage = function(event) {
        var message = event.data;
        console.log(message);
    }

    this.sendRequest = function(requestData) {
        this.websocket.send(JSON.stringify(requestData));
    }
}










let map;


function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: storageManager.getLastPosition(),
        zoom: 8,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: true,
        fullscreenControl: true
    });

    
    startGPSTracking();
    startWebSocket();
};

function loadGoogleMaps() {
    var script = document.createElement('script');
    script.src = "https://maps.googleapis.com/maps/api/js?key=" + GOOGLE_MAPS_API_KEY + "&callback=initMap";
    script.async = true;
    document.head.appendChild(script);
};



function startGPSTracking() {
    if (navigator.geolocation) {
        userLocationTracker = new UserLocationTracker();
        navigator.geolocation.watchPosition(updateGPSPosition);
    } else {
        console.error("Geolocation is not supported by this browser.");
    }
}

function updateGPSPosition(position) {

    console.log("updateGPSPosition got position:", position);

    userLocationTracker.update(position);
}

function startWebSocket() {
    var webSocketURL = "";

    socketManager = new WebSocketManager(webSocketURL);
}


//////////////////////////////////////////////////////

let userLocationTracker;
let storageManager = new StorageManager();
let socketManager;

loadGoogleMaps();

if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
      navigator.serviceWorker
        .register("js/serviceWorker.js")
        .then(res => console.log("service worker registered"))
        .catch(err => console.log("service worker not registered", err))
    })
  }