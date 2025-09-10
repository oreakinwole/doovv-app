// components/AccountMenuItems.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import tw from 'twrnc';

interface MenuItemProps {
    icon: React.ReactNode;
    title: string;
    onPress: () => void;
}

interface AccountMenuItemsProps {
    onCompanyInfoPress: () => void;
    onLogoutPress: () => void;
    setIsShowVehicleModal: (show: boolean) => void
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, title, onPress }) => (
    <>
        <TouchableOpacity
            style={tw`flex-row items-center justify-between py-4`}
            onPress={onPress}
        >
            <View style={tw`flex-row items-center`}>
                {icon}
                <Text style={tw`text-lg`}>{title}</Text>
            </View>
            <Feather name="chevron-right" size={24} color="black" />
        </TouchableOpacity>
        <View style={tw`h-px bg-gray-200 my-2`}></View>
    </>
);

const AccountMenuItems: React.FC<AccountMenuItemsProps> = ({ onCompanyInfoPress,setIsShowVehicleModal, onLogoutPress }) => {
    const menuItems = [
        {
            id: 'company',
            icon: <MaterialIcons name="business" size={24} color="black" style={tw`mr-4`} />,
            title: 'Company Info',
            onPress: onCompanyInfoPress
        },
        {
            id: 'fleet',
            icon: <MaterialIcons name="local-shipping" size={24} color="black" style={tw`mr-4`} />,
            title: 'Fleet Info',
            onPress: () => {setIsShowVehicleModal(true)}
        },
        {
            id: 'driver',
            icon: <MaterialIcons name="person" size={24} color="black" style={tw`mr-4`} />,
            title: 'Driver Info',
            onPress: () => {}
        },
        {
            id: 'logout',
            icon: <MaterialIcons name="logout" size={24} color="black" style={tw`mr-4`} />,
            title: 'Logout',
            onPress: onLogoutPress
        }
    ];

    return (
        <View style={tw`mt-5`}>
            {menuItems.map(item => (
                <MenuItem 
                    key={item.id}
                    icon={item.icon}
                    title={item.title}
                    onPress={item.onPress}
                />
            ))}
        </View>
    );
};

export default AccountMenuItems;