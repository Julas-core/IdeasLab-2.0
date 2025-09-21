
import React, { useMemo } from 'react';
import type { Problem } from '../types';
import { MapIcon } from './icons/AllIcons';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix for default Leaflet icon path issues with bundlers/modules
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});


interface HeatmapProps {
    selectedCategory: string;
    problems: Problem[];
    onProblemSelect: (problem: Problem) => void;
}

const Heatmap: React.FC<HeatmapProps> = ({ selectedCategory, problems, onProblemSelect }) => {
    
    const filteredProblems = useMemo(() => {
        const withLocation = problems.filter(p => p.latitude != null && p.longitude != null);
        if (selectedCategory === 'All Categories') {
            return withLocation;
        }
        return withLocation.filter(p => p.category === selectedCategory);
    }, [problems, selectedCategory]);

    const renderMap = () => {
        if (filteredProblems.length === 0) {
            return (
                <div className="h-full flex items-center justify-center">
                    <p className="text-gray-500 text-center">
                        No problems with location data found for "{selectedCategory}".<br/>
                        Try a different category or a global location search.
                    </p>
                </div>
            );
        }
        return (
            <div className="flex-grow bg-gray-900/50 rounded-lg border border-gray-700/50 relative overflow-hidden">
                 <MapContainer 
                    center={[20, 0]} 
                    zoom={2} 
                    style={{ height: '100%', width: '100%', backgroundColor: '#1f2937' }}
                    className="map-container"
                    scrollWheelZoom={true}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    />
                    {filteredProblems.map(problem => (
                        <Marker 
                            key={problem.id} 
                            position={[problem.latitude!, problem.longitude!]}
                        >
                            <Popup>
                               <div style={{ color: '#333', maxWidth: '200px' }}>
                                    <p style={{ fontWeight: 'bold', margin: '0 0 4px 0' }}>{problem.title}</p>
                                    <p style={{ fontSize: '0.8rem', color: '#666', margin: '0' }}>{problem.locationName}</p>
                                    <button 
                                        onClick={() => onProblemSelect(problem)}
                                        style={{
                                            marginTop: '8px',
                                            padding: '4px 8px',
                                            backgroundColor: '#0891b2',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontSize: '0.75rem',
                                        }}
                                    >
                                        View Details
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        )
    }

    return (
        <div className="bg-gray-800/50 rounded-xl p-6 md:p-8 border border-gray-700/50 h-full flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-white flex items-center">
                <MapIcon className="w-8 h-8 mr-3 text-cyan-300" />
                Problem Heatmap
            </h1>
            <p className="text-gray-400 mb-6">Visualizing the global distribution of identified problems. Showing {filteredProblems.length} problems for <span className="font-semibold text-gray-300">'{selectedCategory}'</span>.</p>
            {renderMap()}
        </div>
    );
};

export default Heatmap;
