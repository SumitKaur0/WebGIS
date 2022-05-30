import { coords_click, coords_pointermove } from "./coordinates";
import { routing_click } from "./routing";

export function map_events(map) {
    map.on('pointermove', coords_pointermove);
    map.on('click', coords_click);
    map.on('click', routing_click);
}