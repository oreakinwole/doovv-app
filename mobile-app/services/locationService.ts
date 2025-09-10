import Constants from 'expo-constants';

export interface PlaceSuggestion {
  place_id: string;
  description: string;
  main_text: string;
  secondary_text: string;
  types: string[];
}

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  address: string;
  place_id: string;
}

export class LocationService {
  private static baseUrl = 'https://maps.googleapis.com/maps/api/place';
  // private static apiKey = Constants.expoConfig?.extra?.googleMapsApiKey || 
  //                         Constants.expoConfig?.extra?.googlePlacesApiKey;

    private static apiKey = 'AIzaSyDsEqI39bCnntwJ1IsJaiNXMdhVLpOTKgc';
  
  static async getPlaceSuggestions(
    input: string, 
    sessionToken?: string,
    countryCode: string = 'NG'
  ): Promise<PlaceSuggestion[]> {
    if (!input || input.length < 2) return [];
    
    if (!this.apiKey) {
      console.error('Google Maps API key not found in environment variables');
      return [];
    }
    
    try {
      const url = `${this.baseUrl}/autocomplete/json`;
      const params = new URLSearchParams({
        input,
        key: this.apiKey,
        components: `country:${countryCode}`,
        types: 'establishment|geocode',
        sessiontoken: sessionToken || '',
      });

      const response = await fetch(`${url}?${params}`);
      const data = await response.json();

      if (data.status === 'OK') {
        return data.predictions.map((prediction: any) => ({
          place_id: prediction.place_id,
          description: prediction.description,
          main_text: prediction.structured_formatting?.main_text || '',
          secondary_text: prediction.structured_formatting?.secondary_text || '',
          types: prediction.types || [],
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching place suggestions:', error);
      return [];
    }
  }

  static async getPlaceDetails(placeId: string): Promise<LocationCoordinates | null> {
    if (!this.apiKey) {
      console.error('Google Maps API key not found in environment variables');
      return null;
    }

    try {
      const url = `${this.baseUrl}/details/json`;
      const params = new URLSearchParams({
        place_id: placeId,
        key: this.apiKey,
        fields: 'geometry,formatted_address,name',
      });

      const response = await fetch(`${url}?${params}`);
      const data = await response.json();

      if (data.status === 'OK' && data.result) {
        const { geometry, formatted_address } = data.result;
        
        return {
          latitude: geometry.location.lat,
          longitude: geometry.location.lng,
          address: formatted_address,
          place_id: placeId,
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching place details:', error);
      return null;
    }
  }

  static generateSessionToken(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  static async reverseGeocode(latitude: number, longitude: number): Promise<string | null> {
    if (!this.apiKey) {
      console.error('Google Maps API key not found in environment variables');
      return null;
    }

    try {
      const url = 'https://maps.googleapis.com/maps/api/geocode/json';
      const params = new URLSearchParams({
        latlng: `${latitude},${longitude}`,
        key: this.apiKey,
      });

      const response = await fetch(`${url}?${params}`);
      const data = await response.json();

      if (data.status === 'OK' && data.results.length > 0) {
        return data.results[0].formatted_address;
      }
      
      return null;
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return null;
    }
  }

  // New method to get current location as LocationCoordinates
  static async getCurrentLocationCoordinates(latitude: number, longitude: number): Promise<LocationCoordinates | null> {
    try {
      const address = await this.reverseGeocode(latitude, longitude);
      
      if (address) {
        return {
          latitude,
          longitude,
          address,
          place_id: `current_location_${latitude}_${longitude}_${Date.now()}`,
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error getting current location coordinates:', error);
      return null;
    }
  }

  // Helper method to create a LocationCoordinates object from basic location data
  static createLocationCoordinates(
    latitude: number, 
    longitude: number, 
    address: string, 
    place_id?: string
  ): LocationCoordinates {
    return {
      latitude,
      longitude,
      address,
      place_id: place_id || `manual_location_${latitude}_${longitude}_${Date.now()}`,
    };
  }
}