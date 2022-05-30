import Group from 'ol/layer/Group';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import Style from 'ol/style/Style';
import { Icon, Fill, Stroke, Text } from 'ol/style';


function resolution2zoom(resolution) {
    const equator_length = 40075016.686;
    const tile_size = 256;
    return (Math.log2(equator_length / (tile_size * resolution)))
}

export const TRANSPORT = new Group({
    id: 'Transport',
    title: 'Verkehr',
    layers: [
        new TileLayer({
            id: 'opnv',
            title: 'ÖPNV',
            visible: false,
            source: new XYZ({
                url: 'https://tileserver.memomaps.de/tilegen/{z}/{x}/{y}.png'
            })
        }),
        new TileLayer({
            id: 'openseamap',
            title: 'OpenSeaMap',
            visible: false,
            source: new XYZ({
                url: 'https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png'
            })
        }),
        new VectorLayer({
            id: 'usar',
            title: 'USAR',
            visible: false,
            source: new VectorSource({
                url: '../data/hvvstationen.geojson',
                format: new GeoJSON()
            }),
            style: (feature, resolution) => {
                console.log(feature.get('ART'));
                let icon = "../images/" + feature.get('ART') + '.png';
                let txt = resolution < 10 ? feature.get("HALTESTELLE") : '';

                return new Style({
                    image: new Icon({
                        anchor: [0.5, 15],
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'pixels',
                        opacity: 0.8,
                        src: icon
                    }),
                    text: new Text({
                        font: '16px Calibre sans-serif',
                        fill: new Fill({ color: 'black' }),
                        stroke: new Stroke({
                            color: '#fff',
                            width: 3,
                            opacity: 0.7
                        }),
                        text: txt,
                        zIndex: 999
                    })
                })
            }
        }),
        new VectorLayer({
            id: 'usar_scaled',
            title: 'USAR (scaled icons)',
            visible: false,
            source: new VectorSource({
                url: '../data/hvvstationen.geojson',
                format: new GeoJSON()
            }),
            style: (feature, resolution) => {
                let icon = "../images/" + feature.get('ART') + '.svg';
                let zoom = resolution2zoom(resolution);
                let txt = zoom >= 15 ? feature.get("HALTESTELLE") : '';
                let scale = 0.004 * Math.pow(zoom, 1.5);
                scale = zoom >= 6 ? scale : 0;
                return new Style({
                    image: new Icon({
                        anchor: [0.5, 0.5],
                        opacity: 0.8,
                        scale: scale,
                        src: icon
                    }),
                    text: new Text({
                        font: '16px Calibre sans-serif',
                        fill: new Fill({ color: 'black' }),
                        stroke: new Stroke({
                            color: '#fff',
                            width: 3,
                            opacity: 0.7
                        }),
                        text: txt,
                        zIndex: 999
                    })
                })
            }
        })
    ]
})