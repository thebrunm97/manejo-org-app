import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Popup, FeatureGroup, useMap } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import L from 'leaflet';

// Component to handle auto-zoom based on focusTarget or initial bounds
const MapController = ({ talhoes, focusTarget }) => {
    const map = useMap();

    useEffect(() => {
        if (focusTarget && focusTarget.geometry) {
            try {
                const geo = typeof focusTarget.geometry === 'string' ? JSON.parse(focusTarget.geometry) : focusTarget.geometry;
                if (geo.coordinates && geo.coordinates[0]) {
                    const coords = geo.coordinates[0].map(c => [c[1], c[0]]);
                    const bounds = L.latLngBounds(coords);
                    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 18, animate: true, duration: 1.5 });
                }
            } catch (e) {
                console.error("Invalid geometry for focus:", e);
            }
        } else if (talhoes.length > 0 && !focusTarget) {
            const bounds = L.latLngBounds([]);
            let hasValidBounds = false;
            talhoes.forEach(t => {
                if (t.geometry) {
                    try {
                        const geo = typeof t.geometry === 'string' ? JSON.parse(t.geometry) : t.geometry;
                        if (geo.coordinates && geo.coordinates[0]) {
                            const coords = geo.coordinates[0].map(c => [c[1], c[0]]);
                            bounds.extend(coords);
                            hasValidBounds = true;
                        }
                    } catch (e) { }
                }
            });
            if (hasValidBounds && bounds.isValid()) map.fitBounds(bounds);
        }
    }, [talhoes, focusTarget, map]);

    return null;
};

export default function FarmMap({ talhoes, focusTarget, onCreated, onEdited, onDeleted, onMapCreated, onSaveTalhao, onTalhaoClick }) {

    const handleCreated = async (e) => {
        const layer = e.layer;

        // Calculate area immediately to pass to parent
        const geoJSON = layer.toGeoJSON();
        const areaM2 = L.GeometryUtil?.geodesicArea(layer.getLatLngs()[0]) || 0;

        if (onMapCreated) {
            onMapCreated({
                layer,
                geometry: JSON.stringify(geoJSON.geometry),
                areaM2: areaM2
            });
        }
    };

    return (
        <MapContainer center={[-18.9186, -48.2772]} zoom={15} style={{ height: '100%', width: '100%', minHeight: '500px' }}>
            <TileLayer url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}" subdomains={['mt0', 'mt1', 'mt2', 'mt3']} attribution="Google Satélite" />

            <FeatureGroup>
                <EditControl
                    position="topright"
                    onCreated={handleCreated}
                    onEdited={onEdited}
                    onDeleted={onDeleted}
                    draw={{
                        rectangle: false,
                        circle: false,
                        circlemarker: false,
                        marker: false,
                        polyline: false,
                        polygon: { allowIntersection: true, showArea: true, shapeOptions: { color: '#97009c' } }
                    }}
                />

                {talhoes.map(t => {
                    if (!t.geometry) return null;
                    const geo = typeof t.geometry === 'string' ? JSON.parse(t.geometry) : t.geometry;

                    if (!geo.coordinates || !geo.coordinates[0]) return null;
                    const positions = geo.coordinates[0].map(c => [c[1], c[0]]);

                    return (
                        <Polygon
                            key={t.id}
                            positions={positions}
                            pathOptions={{ color: t.cor || '#FFF', fillColor: t.cor, fillOpacity: 0.5 }}
                            eventHandlers={{
                                click: (e) => {
                                    L.DomEvent.stopPropagation(e);
                                    if (onTalhaoClick) onTalhaoClick(t);
                                }
                            }}
                        >
                            <Popup>
                                <strong>{t.nome}</strong><br />
                                <small style={{ color: '#666' }}>{t.tipo ? t.tipo.toUpperCase() : 'TALHÃO'}</small><br />
                                Área: {t.area_total_m2 || t.area_m2} m²<br />
                                {t.cultura && <span>🌱: {t.cultura}<br /></span>}
                                <hr style={{ margin: '4px 0' }} />
                                🧪 pH: {t.ph_solo || '-'}<br />
                                ⚡ V%: {t.v_percent || '-'}%<br />
                                🧱 Argila: {t.teor_argila || '-'}%
                                {onTalhaoClick && (
                                    <div style={{ marginTop: '8px', textAlign: 'center' }}>
                                        <button
                                            style={{ cursor: 'pointer', padding: '4px 8px', background: '#4caf50', color: 'white', border: 'none', borderRadius: '4px' }}
                                            onClick={(e) => {
                                                e.stopPropagation(); // prevent map click
                                                onTalhaoClick(t);
                                            }}
                                        >
                                            Gerenciar
                                        </button>
                                    </div>
                                )}
                            </Popup>
                        </Polygon>
                    )
                })}
            </FeatureGroup>
            <MapController talhoes={talhoes} focusTarget={focusTarget} />
        </MapContainer>
    );
}
