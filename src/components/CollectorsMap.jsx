import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Mail, Clock, User } from 'lucide-react';

const CollectorsMap = () => {
  const { t } = useTranslation();
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [collectors, setCollectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initializationAttempted, setInitializationAttempted] = useState(false);
  const [initializationTimeout, setInitializationTimeout] = useState(null);

  // Datos de cobradores con ubicaciones reales en Guatemala
  const mockCollectors = [
    {
      id: 1,
      name: "Carlos Mendoza",
      status: "activo",
      phone: "+502 1234-5678",
      email: "carlos.mendoza@empresa.com",
      location: { lat: 14.6349, lng: -90.5069 }, // Ciudad de Guatemala
      portfolio: 125000,
      clients: 45,
      lastActivity: "2024-01-15T10:30:00Z",
      address: "Zona 1, Ciudad de Guatemala"
    },
    {
      id: 2,
      name: "Ana García",
      status: "activo",
      phone: "+502 2345-6789",
      email: "ana.garcia@empresa.com",
      location: { lat: 14.6449, lng: -90.5169 }, // Zona 10, Ciudad de Guatemala
      portfolio: 98000,
      clients: 32,
      lastActivity: "2024-01-15T09:15:00Z",
      address: "Zona 10, Ciudad de Guatemala"
    },
    {
      id: 3,
      name: "Luis Rodríguez",
      status: "inactivo",
      phone: "+502 3456-7890",
      email: "luis.rodriguez@empresa.com",
      location: { lat: 14.6249, lng: -90.4969 }, // Zona 4, Ciudad de Guatemala
      portfolio: 0,
      clients: 0,
      lastActivity: "2024-01-10T16:45:00Z",
      address: "Zona 4, Ciudad de Guatemala"
    },
    {
      id: 4,
      name: "María López",
      status: "activo",
      phone: "+502 4567-8901",
      email: "maria.lopez@empresa.com",
      location: { lat: 14.6549, lng: -90.5269 }, // Zona 15, Ciudad de Guatemala
      portfolio: 156000,
      clients: 58,
      lastActivity: "2024-01-15T11:20:00Z",
      address: "Zona 15, Ciudad de Guatemala"
    },
    {
      id: 5,
      name: "Roberto Morales",
      status: "activo",
      phone: "+502 5678-9012",
      email: "roberto.morales@empresa.com",
      location: { lat: 14.5849, lng: -90.5369 }, // Mixco, Guatemala
      portfolio: 89000,
      clients: 28,
      lastActivity: "2024-01-15T08:45:00Z",
      address: "Mixco, Guatemala"
    },
    {
      id: 6,
      name: "Carmen Vásquez",
      status: "activo",
      phone: "+502 6789-0123",
      email: "carmen.vasquez@empresa.com",
      location: { lat: 14.6049, lng: -90.4569 }, // Villa Nueva, Guatemala
      portfolio: 112000,
      clients: 41,
      lastActivity: "2024-01-15T12:30:00Z",
      address: "Villa Nueva, Guatemala"
    },
    {
      id: 7,
      name: "Diego Herrera",
      status: "inactivo",
      phone: "+502 7890-1234",
      email: "diego.herrera@empresa.com",
      location: { lat: 14.5649, lng: -90.4769 }, // San Miguel Petapa
      portfolio: 0,
      clients: 0,
      lastActivity: "2024-01-12T14:20:00Z",
      address: "San Miguel Petapa, Guatemala"
    },
    {
      id: 8,
      name: "Patricia Jiménez",
      status: "activo",
      phone: "+502 8901-2345",
      email: "patricia.jimenez@empresa.com",
      location: { lat: 14.6749, lng: -90.4869 }, // Zona 13, Ciudad de Guatemala
      portfolio: 134000,
      clients: 52,
      lastActivity: "2024-01-15T13:15:00Z",
      address: "Zona 13, Ciudad de Guatemala"
    }
  ];


  useEffect(() => {
    let callbackName = null;
    let script = null;

     const loadMap = async () => {
       try {
         setLoading(true);
         
         // Simular carga de datos
         await new Promise(resolve => setTimeout(resolve, 500)); // Reducido de 1000ms a 500ms
         setCollectors(mockCollectors);


        // Verificar si Google Maps ya está cargado completamente
        if (window.google && window.google.maps && window.google.maps.Map) {
          console.log('Google Maps ya está cargado');
          return;
        }

        // Verificar si el script ya existe
        const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
        if (existingScript) {
          // Si el script existe, esperar a que se cargue completamente
           const checkGoogleMaps = () => {
             if (window.google && window.google.maps && window.google.maps.Map) {
               console.log('Google Maps API completamente cargada');
               initializeMap();
             } else {
               console.log('Esperando Google Maps API...');
               setTimeout(checkGoogleMaps, 200);
             }
           };
          checkGoogleMaps();
          return;
        }

        // Crear función global de callback única
        callbackName = `initGoogleMap_${Date.now()}`;
        window[callbackName] = () => {
          console.log('Google Maps cargado correctamente');
          delete window[callbackName];
        };
        
        // Crear y cargar el script con loading=async
        script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDn_kNYykM52C9PI_cLHoWq1fJX8fHx7P8&libraries=places&callback=${callbackName}&loading=async`;
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
          console.log('Script de Google Maps cargado exitosamente');
        };
        
        script.onerror = (error) => {
          console.error('Error cargando Google Maps API:', error);
          setLoading(false);
          delete window[callbackName];
        };
        
        document.head.appendChild(script);
      } catch (error) {
        console.error('Error loading map:', error);
        setLoading(false);
      }
    };

    loadMap();

    // Cleanup function
    return () => {
      if (callbackName && window[callbackName]) {
        delete window[callbackName];
      }
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  // Inicializar el mapa cuando todo esté listo - solo una vez
  useEffect(() => {
    if (map || initializationAttempted) return; // Si ya hay un mapa o ya se intentó, no hacer nada
    
    let attempts = 0;
    const maxAttempts = 10; // Reducido de 20 a 10 intentos
    
    const initializeWhenReady = () => {
      attempts++;
      
      if (mapRef.current && window.google && window.google.maps && window.google.maps.Map && collectors.length > 0) {
        console.log('Inicializando mapa - todas las condiciones cumplidas');
        setInitializationAttempted(true);
        initializeMap();
      } else if (attempts >= maxAttempts) {
        console.error('Timeout: No se pudo inicializar el mapa después de', maxAttempts, 'intentos');
        setInitializationAttempted(true);
        setLoading(false);
      } else {
        console.log(`Esperando condiciones (intento ${attempts}/${maxAttempts}):`, {
          mapRef: !!mapRef.current,
          google: !!window.google,
          maps: !!(window.google && window.google.maps),
          mapConstructor: !!(window.google && window.google.maps && window.google.maps.Map),
          collectors: collectors.length
        });
        setTimeout(initializeWhenReady, 300); // Reducido de 500ms a 300ms
      }
    };
    
    initializeWhenReady();
    
    // Cleanup function
    return () => {
      if (initializationTimeout) {
        clearTimeout(initializationTimeout);
      }
    };
  }, [collectors.length, map, initializationAttempted]);

  const initializeMap = () => {
    // Verificar que tenemos todos los requisitos
    if (!mapRef.current) {
      console.error('mapRef no disponible - no se puede inicializar el mapa');
      setLoading(false);
      return;
    }

    if (!window.google || !window.google.maps || !window.google.maps.Map) {
      console.error('Google Maps no está completamente cargado');
      setLoading(false);
      return;
    }

    if (collectors.length === 0) {
      console.log('Esperando datos de cobradores...');
      return;
    }

    try {
      // Centrar el mapa en Guatemala
      const center = { lat: 14.6349, lng: -90.5069 };
      
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        zoom: 13,
        center: center,
        mapTypeId: 'roadmap',
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });

      setMap(mapInstance);

      // Agregar marcadores para cada cobrador
      console.log('Agregando marcadores para', collectors.length, 'cobradores');
      collectors.forEach((collector, index) => {
        console.log(`Agregando marcador ${index + 1}:`, collector.name, 'en', collector.location);
        const marker = new window.google.maps.Marker({
          position: collector.location,
          map: mapInstance,
          title: collector.name,
          icon: {
            url: collector.status === 'activo' 
              ? 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="18" cy="18" r="14" fill="#10B981" stroke="#ffffff" stroke-width="3"/>
                    <path d="M14 18l3 3 6-6" stroke="#ffffff" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                `)
              : 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="18" cy="18" r="14" fill="#EF4444" stroke="#ffffff" stroke-width="3"/>
                    <path d="M14 14l8 8M22 14l-8 8" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                `),
            scaledSize: new window.google.maps.Size(36, 36)
          }
        });

        // Info window para cada cobrador
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div class="p-4">
              <h3 class="font-semibold text-gray-900 mb-2">${collector.name}</h3>
              <div class="space-y-1 text-sm text-gray-600">
                <div class="flex items-center">
                  <span class="w-2 h-2 rounded-full ${collector.status === 'activo' ? 'bg-green-500' : 'bg-red-500'} mr-2"></span>
                  ${collector.status === 'activo' ? 'Activo' : 'Inactivo'}
                </div>
                <div class="flex items-center">
                  <span class="mr-2">📞</span>
                  ${collector.phone}
                </div>
                <div class="flex items-center">
                  <span class="mr-2">✉️</span>
                  ${collector.email}
                </div>
                <div class="flex items-center">
                  <span class="mr-2">💰</span>
                  Q${collector.portfolio.toLocaleString()}
                </div>
                <div class="flex items-center">
                  <span class="mr-2">👥</span>
                  ${collector.clients} clientes
                </div>
                <div class="flex items-center">
                  <span class="mr-2">📍</span>
                  ${collector.address}
                </div>
                <div class="text-xs text-gray-500 mt-2">
                  Coordenadas: ${collector.location.lat.toFixed(6)}, ${collector.location.lng.toFixed(6)}
                </div>
              </div>
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(mapInstance, marker);
        });
      });

      console.log('Mapa inicializado correctamente con', collectors.length, 'marcadores');
      setLoading(false);
    } catch (error) {
      console.error('Error inicializando el mapa:', error);
      setLoading(false);
    }
  };

  const activeCollectors = collectors.filter(c => c.status === 'activo');
  const inactiveCollectors = collectors.filter(c => c.status === 'inactivo');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">
          Mapa de Cobradores
        </h3>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              if (map && collectors.length > 0) {
                const bounds = new window.google.maps.LatLngBounds();
                collectors.forEach(collector => {
                  bounds.extend(new window.google.maps.LatLng(collector.location.lat, collector.location.lng));
                });
                map.fitBounds(bounds);
              }
            }}
            className="btn-primary flex items-center space-x-2"
            disabled={!map || collectors.length === 0}
          >
            <MapPin className="w-4 h-4" />
            <span>Ver Todos los Cobradores</span>
          </button>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span>Activos ({activeCollectors.length})</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span>Inactivos ({inactiveCollectors.length})</span>
            </div>
          </div>
        </div>
      </div>




      <div className="h-96 rounded-lg overflow-hidden border border-gray-200">
        <div ref={mapRef} className="w-full h-full"></div>
      </div>

    </div>
  );
};

export default CollectorsMap;