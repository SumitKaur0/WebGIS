import './style.css';
import './css/fontawsome/css/all.css';
import './css/sidebar.css';
import './css/clipboard.css';
import './css/routing.css';
import './js/sidebar';

import { Map, View } from 'ol';
import { fromLonLat } from 'ol/proj';
import { createLayerPanel } from './js/layerpanel';
import { routing_click } from './js/routing';

import { BASELAYER } from './js/baselayer';
import { map_events } from './js/map_events';
import { TRANSPORT } from './js/transport';

const start_center = fromLonLat([9.97930374, 53.44904540]);
const start_zoom = 13;

export let map = new Map({
  target: 'map'
});

map.addLayer(BASELAYER);
map.addLayer(TRANSPORT);

let map_view = new View({
  center: start_center,
  zoom: start_zoom
});
map.setView(map_view);

createLayerPanel('baselayer', [BASELAYER, TRANSPORT]);

map_events(map);

window.map = map;