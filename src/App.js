import { DataQuery, Provider } from '@dhis2/app-runtime'
import React from 'react';
import i18n from '@dhis2/d2-i18n'
import classes from './App.module.css'
import 'maplibre-gl/dist/maplibre-gl.css';
import { MapApp } from './Map';


const appConfig = {
    baseUrl: 'https://debug.dhis2.org/2.40',
    apiVersion: 33,
}

const query = {
    geojson: {
        resource: "organisationUnits.geojson",
        params: {
            level: 2,
        },
    },
    values: {
        resource: "analytics",
        params: {
            dimension: ["dx:nkjlWUMIdHh", "ou:LEVEL-2"],
            filter: "pe:LAST_12_MONTHS",
        },
    }
};


const App = () => {
    return (
        <>
            <div className={classes.container}>
                <Provider config={appConfig}>
                    <DataQuery query={query}>
                        {({ error, loading, data }) => <>
                            <MapApp
                                error={error}
                                loading={loading}
                                data={data}
                            />
                        </>}
                    </DataQuery>
                </Provider>
            </div>
        </>
    )
}

export default App
