import React from "react";
import { Tabs, usePathname, router } from "expo-router";

import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

interface Link {
  path: string;
  label: string;
  icon: JSX.Element;
  activeIcon: JSX.Element;
}

const LINKS: Link[] = [
  {
    path: "/i-courier/tabs/Home",
    label: "Home",
    icon: <Ionicons name="home-outline" size={22} color="#9CA3AF" />,
    activeIcon: <Ionicons name="home" size={22} color="#D97706" />,
  },
  {
    path: "/i-courier/tabs/Pickups",
    label: "Pickups",
    icon: <MaterialIcons name="local-shipping" size={22} color="#9CA3AF" />,
    activeIcon: <MaterialIcons name="local-shipping" size={22} color="#D97706" />,
  },
  {
    path: "/i-courier/tabs/Deliveries",
    label: "Deliveries",
    icon: <AntDesign name="clockcircle" size={22} color="#9CA3AF" />,
    activeIcon: <AntDesign name="clockcircle" size={22} color="#D97706" />,
  },
  {
    path: "/i-courier/tabs/Wallet",
    label: "Wallet",
    icon: <Ionicons name="wallet-outline" size={22} color="#9CA3AF" />,
    activeIcon: <Ionicons name="wallet" size={22} color="#D97706" />,
  },
  {
    path: "/i-courier/tabs/Account",
    label: "Account",
    icon: <Ionicons name="person-outline" size={22} color="#9CA3AF" />,
    activeIcon: <Ionicons name="person" size={22} color="#D97706" />,
  },
];

const Layout = () => {
  const pathname = usePathname();

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: "none" },
        }}
      >
        {LINKS.map((link) => (
          <Tabs.Screen key={link.path} name={link.label} />
        ))}
      </Tabs>

      <View
        style={{
          backgroundColor: "white",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          height: 80,
          borderTopColor: "#E5E7EB",
          borderTopWidth: 1,
          paddingBottom: 20,
          paddingTop: 12,
        }}
      >
        {LINKS.map((link, index) => {
          const isActive = pathname === link.path;

          return (
            <TouchableOpacity
              key={index}
              style={{ alignItems: "center", flex: 1 }}
              onPress={() => router.push(link.path as any)}

            >
              {isActive ? link.activeIcon : link.icon}
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: isActive ? "600" : "400",
                  color: isActive ? "#D97706" : "#6B7280",
                  marginTop: 4,
                }}
              >
                {link.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </>
  );
};

export default Layout;