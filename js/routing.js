import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Circle as CircleStyle, Fill, Icon, Stroke, Style } from 'ol/style';
import Polyline from 'ol/format/Polyline';
import { transform } from 'ol/proj';
import { format } from 'ol/coordinate';
import Layer from 'ol/layer/Layer';

var api_key = '5b3ce3597851110001cf6248440bdd39e48e44d2b604b63027873835';

var waypoints = document.getElementById("waypoints");
var waypoint_add = document.getElementById("waypoint-add");
var waypoint_remove = document.getElementById("waypoint-remove");
var waypoint_up = document.getElementById("waypoint-up");
var waypoint_down = document.getElementById("waypoint-down");
var route_get = document.getElementById("route-get");
var route_zoom = document.getElementById("route-zoom");
var route_remove = document.getElementById("route-remove");
var route_info = document.getElementById("route-info");
var distance = document.getElementById("distance");
var time = document.getElementById("time");
var mouseLon = document.getElementById("mouseLon");
var mouseLat = document.getElementById("mouseLat");


// Hilfsfunktionen
function listboxMove(listbox, direction) {
    var selIndex = listbox.selectedIndex;
    if (-1 == selIndex) {
        alert("Please select an option to move.");
        return;
    }
    var increment = -1;
    if (direction == 'up')
        increment = -1;
    else
        increment = 1;
    if ((selIndex + increment) < 0 ||
        (selIndex + increment) > (listbox.options.length - 1)) {
        return;
    }
    var selValue = listbox.options[selIndex].value;
    var selText = listbox.options[selIndex].text;
    listbox.options[selIndex].value = listbox.options[selIndex + increment].value
    listbox.options[selIndex].text = listbox.options[selIndex + increment].text
    listbox.options[selIndex + increment].value = selValue;
    listbox.options[selIndex + increment].text = selText;
    listbox.selectedIndex = selIndex + increment;
}

function removeOptions(selectElement) {
    while (selectElement.options.length) {
        selectElement.remove(0);
    }
}

let routeLayer;

function routing_click(event) {
    let coord3857 = event.coordinate;
    let coord4326 = transform(coord3857, 'EPSG:3857', 'EPSG:4326');
    mouseLon.innerText = format(coord4326, "{x}", 6);
    mouseLat.innerText = format(coord4326, "{y}", 6);
}

waypoint_add.addEventListener('click', () => {
    let lat = mouseLat.textContent;
    let lon = mouseLon.textContent;
    let pos = lon + ',' + lat;
    let option = document.createElement("option");
    option.text = pos;
    option.value = pos;
    waypoints.appendChild(option);
})

waypoint_remove.addEventListener('click', () => {
    waypoints.remove(waypoints.selectedIndex);
})

waypoints.addEventListener('dblclick', () => {
    waypoints.remove(waypoints.selectedIndex);
})

route_get.addEventListener('click', () => {
    window.map.removeLayer(routeLayer);
    let w = Array();
    for (let i = 0; i < waypoints.options.length; i++) {
        w.push("[" + waypoints.options[i].value + ']')
    }
    
    let wps = '{"coordinates":[' + w.join(",") + ']}';

    fetch('https://api.openrouteservice.org/v2/directions/driving-car', {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain; charset=utf-8',
            'Content-Type': 'application/json',
            'Authorization': api_key,
        },
        body: wps
    }).then(response => response.json())
        .then(data => {
            console.log(data)
            let polyline = data.routes[0].geometry;
            let route = new Polyline({
                factor: 1e5
            }).readGeometry(polyline, {
                featureProjection: 'EPSG:3857',
                dataProjection: 'EPSG:4326'
            });
            console.log(route)

            let routeCoords = route.getCoordinates();
            let routeLength = routeCoords.length;
            let routeFeature = new Feature({
                type: 'route',
                geometry: route
            });
            let startIcon = new Feature({
                type: 'start',
                geometry: new Point(routeCoords[0])
            });
            let endIcon = new Feature({
                type: 'finish',
                geometry: new Point(routeCoords[1])
            })
            let styles = {
                'route': new Style({
                    stroke: new Stroke({
                        width: 6,
                        color: [0, 0, 0, 0.8]
                    })
                }),
                'start': new Style({
                    image: new Icon({
                        anchor: [0, 1],
                        scale: 0.2,
                        src: '../images/flag_green.svg'
                    })
                }),
                'finish': new Style({
                    image: new Icon({
                        anchor: [0, 1],
                        scale: 0.2,
                        src: '../images/flag_red.svg'
                    })
                })
            }
            routeLayer = new Layer({
                visible: true,
                source: new VectorSource({
                    features: [routeFeature, endIcon, startIcon]
                }),
                styles: (feature) => {
                    return styles[feature.get('type')];
                }
            })
            window.map.addLayer(routeLayer);
        }).catch(error => {
            route_info.textContent = error;
        })
})

export { routing_click };