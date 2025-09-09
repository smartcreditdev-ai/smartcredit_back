import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const CollectorsMap = () => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [collectors, setCollectors] = useState([]);

  // Generar ubicaciones aleatorias en Guatemala
  const generateRandomGuatemalaLocations = (count) => {
    const locations = [];
    const guatemalaBounds = {
      north: 17.8,
      south: 13.7,
      east: -88.2,
      west: -92.2
    };

    for (let i = 0; i < count; i++) {
      const lat = guatemalaBounds.south + Math.random() * (guatemalaBounds.north - guatemalaBounds.south);
      const lng = guatemalaBounds.west + Math.random() * (guatemalaBounds.east - guatemalaBounds.west);
      
      locations.push({
        id: i + 1,
        name: `Cobrador ${i + 1}`,
        lat: lat,
        lng: lng,
        portfolio: Math.floor(Math.random() * 50000) + 10000, // $10,000 - $60,000
        clients: Math.floor(Math.random() * 50) + 10, // 10-60 clientes
        status: Math.random() > 0.3 ? 'activo' : 'inactivo'
      });
    }
    return locations;
  };

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: 'AIzaSyDn_kNYykM52C9PI_cLHoWq1fJX8fHx7P8',
        version: 'weekly',
        libraries: ['places']
      });

      try {
        const google = await loader.load();
        
        // Centro de Guatemala
        const guatemalaCenter = { lat: 15.7835, lng: -90.2308 };
        
        const mapInstance = new google.maps.Map(mapRef.current, {
          center: guatemalaCenter,
          zoom: 7,
          styles: [
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{ color: '#e9e9e9' }, { lightness: 17 }]
            },
            {
              featureType: 'landscape',
              elementType: 'geometry',
              stylers: [{ color: '#f5f5f5' }, { lightness: 20 }]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.fill',
              stylers: [{ color: '#ffffff' }, { lightness: 17 }]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{ color: '#ffffff' }, { lightness: 29 }, { weight: 0.2 }]
            }
          ]
        });

        setMap(mapInstance);

        // Generar cobradores aleatorios
        const collectorsData = generateRandomGuatemalaLocations(15);
        setCollectors(collectorsData);

        // Crear marcadores para cada cobrador
        collectorsData.forEach(collector => {
          const marker = new google.maps.Marker({
            position: { lat: collector.lat, lng: collector.lng },
            map: mapInstance,
            title: collector.name,
            icon: {
              url: collector.status === 'activo' 
                ? 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="16" cy="16" r="12" fill="#10B981" stroke="#ffffff" stroke-width="3"/>
                    <text x="16" y="20" text-anchor="middle" fill="white" font-size="12" font-weight="bold">${collector.id}</text>
                  </svg>
                `)
                : 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="16" cy="16" r="12" fill="#EF4444" stroke="#ffffff" stroke-width="3"/>
                    <text x="16" y="20" text-anchor="middle" fill="white" font-size="12" font-weight="bold">${collector.id}</text>
                  </svg>
                `),
              scaledSize: new google.maps.Size(32, 32)
            }
          });

          // Crear info window
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div class="p-3">
                <h3 class="font-semibold text-gray-900 mb-2">${collector.name}</h3>
                <div class="space-y-1 text-sm">
                  <div><span class="font-medium">Cartera:</span> $${collector.portfolio.toLocaleString()}</div>
                  <div><span class="font-medium">Clientes:</span> ${collector.clients}</div>
                  <div><span class="font-medium">Estado:</span> 
                    <span class="px-2 py-1 text-xs rounded-full ${collector.status === 'activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                      ${collector.status === 'activo' ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
              </div>
            `
          });

          marker.addListener('click', () => {
            infoWindow.open(mapInstance, marker);
          });
        });

      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    initMap();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Mapa de Cobradores con Cartera Asignada - Guatemala</h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span>Activos ({collectors.filter(c => c.status === 'activo').length})</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span>Inactivos ({collectors.filter(c => c.status === 'inactivo').length})</span>
          </div>
        </div>
      </div>
      
      <div className="h-96 rounded-lg overflow-hidden border border-gray-200">
        <div ref={mapRef} className="w-full h-full" />
      </div>

      {/* Resumen de cobradores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            ${collectors.reduce((sum, c) => sum + c.portfolio, 0).toLocaleString()}
          </div>
          <div className="text-sm text-green-800">Cartera Total Asignada</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {collectors.reduce((sum, c) => sum + c.clients, 0)}
          </div>
          <div className="text-sm text-blue-800">Total Clientes Asignados</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {collectors.length}
          </div>
          <div className="text-sm text-purple-800">Cobradores Activos</div>
        </div>
      </div>
    </div>
  );
};

export default CollectorsMap;
