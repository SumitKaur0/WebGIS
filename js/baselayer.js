import Group from 'ol/layer/Group';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';

const BASELAYER = new Group({
    'id': 'baselayer',
    'title': 'Basiskarten',
    'fold': 'open',
    layers: [
        new TileLayer({
            id: 'OSM',
            title: 'OpenStreetMap',
            type: 'base',
            visible: true,
            source: new OSM()
        }),
        new TileLayer({
            id: 'WikimediaMap',
            title: 'Wikipedia Map',
            type: 'base',
            visible: false,
            source: new XYZ({
                url: 'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png'
            })
        }),
        new TileLayer({
            id: 'WebatlasDE',
            title: "Webatlas DE",
            type: 'base',
            visible: false,
            source: new TileWMS({
                url: 'https://sg.geodatenzentrum.de/wms_webatlasde.light?',
                params: {
                    'LAYERS': 'webatlasde.light',
                    'FORMAT': 'image/png',
                    //'TRANSPARENT': 'true',
                },
                attributions: ['&copy GeoBasis-DE / <a href="http://www.bkg.bund.de/">BKG</a>']
            })
        })
    ]
});

export { BASELAYER };
