function GeolocationManager(_baseMap) {
    this.baseMap = _baseMap;

    this.pastTrack = [];
    this.currentPosition = null;


    this.start = function () {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(this.updatePosition);
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    }

    this.updatePosition = function (position) {
        this.currentPosition = position;
        // this.pastTrack.push(position);

        console.log("GeolocationManager got position:", position);

        console.log(this.baseMap);
        this.baseMap.setUserLocation(this.currentPosition);
        // this.baseMap.setUserTrack(this.pastTrack);
    } 
}