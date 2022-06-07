
function loadScript(url, async = true) {

    var script = document.createElement('script');
    script.src = url;
    script.async = async;

    document.head.appendChild(script);
}

var scriptUrls = [
    // [scriptURL, asyncLoading]
    ["./scripts/BaseMap.js", false],
    ["./scripts/GeolocationManager.js", false],

    ["./scripts/app.js", false],
    ["https://maps.googleapis.com/maps/api/js?key=AIzaSyDhntRQW_8oX8Xc4eKihfU-Fv6dfdPbFE0&libraries=visualization&callback=initMap", true],
];

scriptUrls.forEach(x => loadScript(...x));