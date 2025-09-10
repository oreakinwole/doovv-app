import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import tw from 'twrnc';

export const MapSim = () => {
  return (
    <>
      {/* Map Background Placeholder */}
      <View style={tw`flex-1 bg-gray-200`}>
        {/* Menu Button */}
        <TouchableOpacity style={tw`absolute top-14 left-5 bg-white p-3 rounded-full shadow-lg z-10`}>
          <Feather name="menu" size={20} color="#F97316" />
        </TouchableOpacity>

        {/* Navigation Arrow Button */}
        <TouchableOpacity style={tw`absolute bottom-40 right-5 bg-white p-3 rounded-full shadow-lg z-10`}>
          <MaterialIcons name="navigation" size={24} color="#F97316" />
        </TouchableOpacity>

        {/* Map Markers Simulation */}
        <View style={tw`absolute top-32 left-20 h-8 w-8 bg-orange-500 rounded-full items-center justify-center`}>
          <View style={tw`h-4 w-4 bg-white rounded-full`} />
        </View>

        <View style={tw`absolute top-60 right-16 h-8 w-8 bg-orange-500 rounded-full items-center justify-center`}>
          <View style={tw`h-4 w-4 bg-white rounded-full`} />
        </View>

        <View style={tw`absolute bottom-72 left-12 h-8 w-8 bg-orange-500 rounded-full items-center justify-center`}>
          <View style={tw`h-4 w-4 bg-white rounded-full`} />
        </View>

        <View style={tw`absolute bottom-60 right-20 h-8 w-8 bg-orange-500 rounded-full items-center justify-center`}>
          <View style={tw`h-4 w-4 bg-white rounded-full`} />
        </View>

        {/* Grid Lines to Simulate Map */}
        <View style={tw`absolute inset-0`}>
          {Array.from({ length: 15 }).map((_, i) => (
            <View
              key={`h-${i}`}
              // style={tw`absolute w-full h-px bg-gray-300 opacity-30`}
              style={[tw`absolute w-full h-px bg-gray-300 opacity-30`, { top: i * 50 }]}
            />
          ))}
          {Array.from({ length: 10 }).map((_, i) => (
            <View
              key={`v-${i}`}
              // style={tw`absolute h-full w-px bg-gray-300 opacity-30`}
              style={[tw`absolute h-full w-px bg-gray-300 opacity-30`, { left: i * 40 }]}
            />
          ))}
        </View>

        {/* Street Names Overlay */}
        <Text style={tw`absolute top-24 left-8 text-sm font-medium text-gray-600 bg-white px-2 py-1 rounded`}>
          2nd Avenue
        </Text>
        <Text style={tw`absolute top-48 right-8 text-sm font-medium text-gray-600 bg-white px-2 py-1 rounded`}>
          13th St
        </Text>
        <Text style={tw`absolute bottom-96 left-6 text-sm font-medium text-gray-600 bg-white px-2 py-1 rounded`}>
          3rd Ave
        </Text>
        <Text style={tw`absolute bottom-80 right-12 text-sm font-medium text-gray-600 bg-white px-2 py-1 rounded`}>
          20th St
        </Text>

        {/* Location Label */}
        <View style={tw`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-3 py-2 rounded-lg shadow-md`}>
          <Text style={tw`text-base font-semibold text-gray-800`}>ASHOK NAGAR</Text>
          <Text style={tw`text-sm text-gray-600`}>SDAT Cricket Ground</Text>
        </View>
      </View>
    </>

  )

}