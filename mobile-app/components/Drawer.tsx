import React, { ReactNode, useEffect } from 'react';
import { View, TouchableOpacity, Animated, Dimensions, StyleSheet } from 'react-native';
import tw from 'twrnc';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function Drawer({ isOpen, onClose, children }: DrawerProps) {
  const translateX = new Animated.Value(isOpen ? 0 : -SCREEN_WIDTH);

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: isOpen ? 0 : -SCREEN_WIDTH,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <TouchableOpacity
          style={StyleSheet.absoluteFillObject}
          onPress={onClose}
        >
          <View style={tw`absolute inset-0 bg-black opacity-40`} />
        </TouchableOpacity>
      )}
      <Animated.View
        style={[
          tw`absolute top-0 bottom-0 left-0 bg-white w-64 shadow-lg z-50`,
          { transform: [{ translateX }] },
        ]}
      >
        {children}
      </Animated.View>
    </>
  );
}




// drawer component usage
// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity } from 'react-native';
// import tw from 'twrnc';
// import Drawer from '~/components/Drawer';

// export default function ExampleScreen() {
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);

//   return (
//     <View style={tw`flex-1`}>
//       <TouchableOpacity
//         onPress={() => setIsDrawerOpen(true)}
//         style={tw`p-4 bg-blue-500`}
//       >
//         <Text style={tw`text-white font-bold`}>Open Drawer</Text>
//       </TouchableOpacity>

//       <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
//         <View style={tw`p-4`}>
//           <Text style={tw`text-lg font-bold mb-4`}>Drawer Menu</Text>
//           <TouchableOpacity onPress={() => setIsDrawerOpen(false)}>
//             <Text style={tw`text-orange-500`}>Close Drawer</Text>
//           </TouchableOpacity>
//         </View>
//       </Drawer>
//     </View>
//   );
// }