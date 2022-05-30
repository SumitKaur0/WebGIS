import { transform } from "ol/proj";
import { format } from "ol/coordinate";

function coords_pointermove(event) {
    let coord3857 = event.coordinate;
    let coord4326 = transform(coord3857, 'EPSG:3857', 'EPSG:4326');

    document.getElementById('mouseCoord4326').innerHTML = format(coord4326, '{x}, {y}', 8);
    document.getElementById('mouseCoord3857').innerHTML = format(coord3857, '{x}, {y}', 2);
}


function coords_click(event) {
    let coord3857 = event.coordinate;
    let coord4326 = transform(coord3857, 'EPSG:3857', 'EPSG:4326');
    let lat = format(coord4326, "{x}", 8);
    let lon = format(coord4326, "{y}", 8);

    document.getElementById('mouseCoord4326ClickedAt').value = lat + ', ' + lon;
    document.getElementById('mouseCoord3857ClickedAt').value = format(coord3857, '{x}, {y}', 2);
}

function copy2clipboard(element_id) {
    const coords = document.getElementById(element_id);
    coords.select();
    navigator.clipboard.writeText(coords.value);

}

window.copy2clipboard = copy2clipboard;

export { coords_pointermove, coords_click };