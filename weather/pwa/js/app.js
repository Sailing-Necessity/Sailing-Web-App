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














let map;


function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: {
            lat: 43.40034,
            lng: -84.58715
        },
        zoom: 8,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: true,
        fullscreenControl: true
    });
};

function loadGoogleMaps() {
    var script = document.createElement('script');
    script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDhntRQW_8oX8Xc4eKihfU-Fv6dfdPbFE0&callback=initMap";
    script.async = true;
    document.head.appendChild(script);
};

function setUserLocation(position) {
    // console.log("setUserLocation got position:", position);
    // console.log(map);

    // var marker = new google.maps.Marker({
    //     position: {
    //         lat: position.coords.latitude,
    //         lng: position.coords.longitude
    //     },
    //     map: map,
    //     title: "User Location"
    // });

    // map.setCenter(marker.position);

    // console.log(marker);
}


let pastGPSTrack = [];
let currentGPSPosition;
let userLocationTracker;

function startGPSTracking() {
    if (navigator.geolocation) {
        userLocationTracker = new UserLocationTracker();
        navigator.geolocation.watchPosition(updateGPSPosition);
    } else {
        console.error("Geolocation is not supported by this browser.");
    }
}

function updateGPSPosition(position) {
    currentGPSPosition = position;
    pastGPSTrack.push(position);

    console.log("updateGPSPosition got position:", position);

    userLocationTracker.update(position);
    setUserLocation(currentGPSPosition);
    // this.baseMap.setUserTrack(pastGPSTrack);
}


//////////////////////////////////////////////////////

loadGoogleMaps();
startGPSTracking();