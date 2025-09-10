import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';

interface MapProps {
  isActive?: boolean;
  fromLocation?: any;
  toLocation?: any;
  markers?: any[];
  onCurrentLocationFound?: (location: { latitude: number; longitude: number; address: string }) => void;
}

const Map: React.FC<MapProps> = ({ 
  isActive = true, 
  fromLocation, 
  toLocation, 
  markers,
  onCurrentLocationFound
}) => {
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [mapRegion, setMapRegion] = useState({
    latitude: 6.5244,
    longitude: 3.3792,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (fromLocation && toLocation) {
      const minLat = Math.min(fromLocation.latitude, toLocation.latitude);
      const maxLat = Math.max(fromLocation.latitude, toLocation.latitude);
      const minLng = Math.min(fromLocation.longitude, toLocation.longitude);
      const maxLng = Math.max(fromLocation.longitude, toLocation.longitude);

      const latDelta = (maxLat - minLat) * 1.3;
      const lngDelta = (maxLng - minLng) * 1.3;

      setMapRegion({
        latitude: (minLat + maxLat) / 2,
        longitude: (minLng + maxLng) / 2,
        latitudeDelta: Math.max(latDelta, 0.01),
        longitudeDelta: Math.max(lngDelta, 0.01),
      });
    }
  }, [fromLocation, toLocation]);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location permission is needed to show your current location on the map.',
          [{ text: 'OK' }]
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = location.coords;
      
      setCurrentLocation({ latitude, longitude });
      
      setMapRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      try {
        const addresses = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        if (addresses.length > 0) {
          const address = addresses[0];
          const fullAddress = `${address.name || ''} ${address.street || ''}, ${address.city || ''}, ${address.region || ''}`.trim();
          
          onCurrentLocationFound?.({
            latitude,
            longitude,
            address: fullAddress,
          });
        }
      } catch (geocodeError) {
        console.warn('Reverse geocoding failed:', geocodeError);
      }

    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert(
        'Location Error',
        'Unable to get your current location. Please check your location settings.',
        [{ text: 'OK' }]
      );
    }
  };

  const routeCoordinates = React.useMemo(() => {
    if (fromLocation && toLocation) {
      return [
        {
          latitude: fromLocation.latitude,
          longitude: fromLocation.longitude,
        },
        {
          latitude: toLocation.latitude,
          longitude: toLocation.longitude,
        }
      ];
    }
    return [];
  }, [fromLocation, toLocation]);

  const PickupMarker = () => (
    <View style={styles.customMarkerContainer}>
      <View style={styles.pickupMarker}>
        <Ionicons name="location" size={24} color="#fff" />
      </View>
    </View>
  );

  const DestinationMarker = () => (
    <View style={styles.customMarkerContainer}>
      <View style={styles.destinationMarker}>
        <Svg width="32" height="32" viewBox="0 0 32 32">
          <Circle opacity="0.2" cx="16" cy="16" r="16" fill="#FF6400"/>
          <Circle cx="16.5" cy="15.5" r="7.5" fill="#FF6400"/>
        </Svg>
      </View>
    </View>
  );

  const CurrentLocationMarker = () => (
    <View style={styles.currentLocationContainer}>
      <View style={styles.currentLocationMarker}>
        <View style={styles.currentLocationInner} />
      </View>
    </View>
  );

  const CourierMarker = () => (
    <View style={styles.customMarkerContainer}>
      <View style={styles.courierMarker}>
        <Ionicons name="bicycle" size={20} color="#fff" />
      </View>
    </View>
  );

  if (!isActive) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={mapRegion}
        onRegionChangeComplete={setMapRegion}
        scrollEnabled={isActive}
        zoomEnabled={isActive}
        rotateEnabled={isActive}
        pitchEnabled={isActive}
        onMapReady={() => {
          console.log('Map is ready');
        }}
        onError={(error) => {
          console.warn('Map error:', error);
        }}
        mapType="standard"
        showsUserLocation={false}
        showsMyLocationButton={true}
        showsCompass={false}
        showsScale={false}
        showsBuildings={false}
        showsTraffic={false}
        showsIndoors={false}
      >
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#FF6B37"
            strokeWidth={3}
            lineDashPattern={[5, 5]}
          />
        )}

        {currentLocation && (
          <Marker
            coordinate={currentLocation}
            title="Your Location"
            description="You are here"
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <CurrentLocationMarker />
          </Marker>
        )}

        {fromLocation && (
          <Marker
            coordinate={{
              latitude: fromLocation.latitude,
              longitude: fromLocation.longitude,
            }}
            title="Pickup Location"
            description={fromLocation.address}
            anchor={{ x: 0.5, y: 1 }}
          >
            <PickupMarker />
          </Marker>
        )}

        {toLocation && (
          <Marker
            coordinate={{
              latitude: toLocation.latitude,
              longitude: toLocation.longitude,
            }}
            title="Destination"
            description={toLocation.address}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <DestinationMarker />
          </Marker>
        )}

        {markers?.map((marker, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title={marker.title}
            description={marker.description}
            anchor={{ x: 0.5, y: 1 }}
          >
            <CourierMarker />
          </Marker>
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  customMarkerContainer: {
    alignItems: 'center',
  },
  pickupMarker: {
    backgroundColor: '#FF6B37',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  destinationMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  courierMarker: {
    backgroundColor: '#3B82F6',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  currentLocationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentLocationMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#3B82F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  currentLocationInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
  },
});

export default Map;