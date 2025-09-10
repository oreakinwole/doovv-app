import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import tw from 'twrnc';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import LayoutPage from '~/layout/PageLayout';
import { MapSim } from '~/components/MapSim';
import Map from '~/components/Map';

const BottomCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <View style={tw`absolute bottom-0 w-full bg-white rounded-t-3xl px-5 pt-5 pb-8 shadow-lg`}>
      {children}
    </View>
  );
};

const LocationCardContent = () => {
  return (
    <>
      <View style={tw`flex-row items-center justify-between mb-4`}>
        <View style={tw`flex-row items-center`}>
          <MaterialIcons name="location-on" size={20} color="#F97316" />
          <Text style={tw`text-base font-semibold text-gray-800 ml-1`}>Obafemi Awolowo way</Text>
        </View>
        <TouchableOpacity style={tw`flex-row items-center bg-gray-100 px-3 py-1 rounded-full`}>
          <Feather name="edit-2" size={14} color="black" />
          <Text style={tw`ml-1 text-xs font-medium`}>Edit</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={tw`bg-gray-100 flex-row items-center rounded-xl px-4 py-3 mb-5`}>
        <Feather name="search" size={18} color="gray" />
        <Text style={tw`ml-3 text-base text-gray-500`}>To Where</Text>
      </TouchableOpacity>

      <ScrollView style={tw`max-h-40 mb-4`} showsVerticalScrollIndicator={false}>
        {[
          {
            title: 'Admiralty Way',
            subtitle: 'Lekki Lagos',
          },
          {
            title: '37A Opebi Road',
            subtitle: 'Ikeja Lagos',
          },
        ].map((loc, i) => (
          <TouchableOpacity key={i} style={tw`flex-row items-center mb-4`}>
            <View style={tw`h-8 w-8 rounded-full bg-gray-200 items-center justify-center`}>
              <Ionicons name="time-outline" size={18} color="#666" />
            </View>
            <View style={tw`ml-3`}>
              <Text style={tw`text-base font-medium text-gray-800`}>{loc.title}</Text>
              <Text style={tw`text-sm text-gray-500`}>{loc.subtitle}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity style={tw`bg-orange-500 py-4 rounded-xl items-center justify-center`}>
        <Text style={tw`text-white text-lg font-semibold`}>Set Route</Text>
      </TouchableOpacity>
    </>
  );
};



const Home = () => {
  return (
    <LayoutPage noscroll={true}>

      <Map />
      {/* Bottom Card */}
      <BottomCard>
        <LocationCardContent />
      </BottomCard>
    </LayoutPage>
  );
};

export default Home;