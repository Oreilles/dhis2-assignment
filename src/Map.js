import classes from './App.module.css'
import React, { useState, useEffect } from 'react';
import { Map, NavigationControl } from 'react-map-gl/maplibre';
import DeckGL, { GeoJsonLayer, WebMercatorViewport, FlyToInterpolator } from 'deck.gl';
import { CircularLoader } from '@dhis2/ui'
import { Legend, LEGEND_COLORS, LEGEND_ITEMS_COUNT } from './Legend';
import bbox from '@turf/bbox';

const MAP_STYLE = 'https://cdn.jsdelivr.net/gh/Oreilles/osm-esri-gl-style/styles/dark-gray.json';


function getValuesMinMax(values) {
    let min_value = +Infinity;
    let max_value = -Infinity;
    for (const row of values.rows) {
        const current_value = row[2];
        min_value = Math.min(min_value, current_value);
        max_value = Math.max(max_value, current_value);
    }
    return [Number(min_value), Number(max_value)];
}

function parseResponseData(data) {
    const { geojson, values } = data;
    const [min_value, max_value] = getValuesMinMax(values);
    const legend_step = (max_value - min_value) / LEGEND_ITEMS_COUNT;
    for (let i = 0; i < geojson.features.length; i++) {
        const feature = geojson.features[i];
        const value = Number(values.rows[i][2]);
        const legend_idx = Math.min(Math.floor((value - min_value) / legend_step), LEGEND_ITEMS_COUNT - 1);
        feature.properties.value = value;
        feature.properties.color = LEGEND_COLORS[legend_idx];
    }
    return {
        min_value,
        max_value,
        geojson,
        bounds: bbox(data.geojson),
    };
}

function getFeatureColor(feature) {
    return feature.properties.color;
}

export const MapApp = ({ error, loading, data }) => {
    const [viewState, setViewState] = useState({
        latitude: 0,
        longitude: 0,
        zoom: 3,
        bearing: 0,
        pitch: 0,
    });

    const [parsedData, setParsedData] = useState({
        geojson: undefined,
        bounds: undefined,
        min_value: undefined,
        max_value: undefined,
    })

    useEffect(() => {
        if (data) {
            const { geojson, bounds, min_value, max_value } = parseResponseData(data);
            setParsedData({ geojson, bounds, min_value, max_value });
            const viewport = new WebMercatorViewport(viewState);
            const { latitude, longitude } = viewport.fitBounds([
                [bounds[0], bounds[1]], [bounds[2], bounds[3]]
            ]);
            setViewState({
                latitude,
                longitude,
                zoom: 6,
                pitch: 0,
                bearing: 0,
                transitionDuration: 2000,
                transitionInterpolator: new FlyToInterpolator(),
            })
        }
    }, [data])

    if (error) { return <h1> ERROR </h1> }
    return (
        <>
            <div className={classes.mapContainer}>
                <DeckGL
                    initialViewState={viewState}
                    controller={true}
                    getTooltip={({ object }) => {
                        if (!object) return;
                        return `${object.properties.name} (value: ${object.properties.value})`
                    }}
                >
                    <Map mapStyle={MAP_STYLE}>
                        {/* <NavigationControl /> */}
                    </Map>
                    <GeoJsonLayer
                        data={parsedData.geojson}
                        getFillColor={getFeatureColor}
                        getLineWidth={1}
                        lineWidthUnits="pixels"
                        pickable={true}
                    />
                </DeckGL>
                <div className={classes.legend}>
                    {loading ? <CircularLoader /> : <Legend
                        min={parsedData.min_value}
                        max={parsedData.max_value}
                        loading={loading}
                    />}
                </div>
            </div>
        </>
    )
}