// components/SwitchRoleModal.jsx
import React from 'react';
import { View, Text } from 'react-native';
import tw from 'twrnc';
import FullPageModalLayout from '~/layout/FullPageModalLayout';
import { SelectionCard } from '~/components/SelectionCard';
import { BuildingImg, VehicleImg } from '~/assets/svgs/image';

interface SwitchRoleModalProps {
    visible: boolean;
    onClose: () => void;
}

const SwitchRoleModal: React.FC<SwitchRoleModalProps> = ({ visible, onClose }) => {
    const handleRoleSelection = (roleType: 'individual' | 'business') => {
        console.log(`Selected role: ${roleType}`);
        // Add role switching logic here
        onClose();
    };

    return (
        <FullPageModalLayout 
            modalVisible={visible} 
            setModalVisible={onClose} 
            button={onClose}
        >
            <View style={tw`p-4`}>
                <Text style={tw`text-xl font-bold mb-2`}>Switch Your Role</Text>
                <Text style={tw`text-gray-500 mb-5`}>You can switch later if needed.</Text>
                
                <SelectionCard
                    description='Earn by delivering packages along your route.'
                    icon={<VehicleImg />}
                    handleClick={() => handleRoleSelection('individual')}
                    title='Individual Courier'
                />
                
                <SelectionCard
                    description='Manage a fleet and handle bulk deliveries.'
                    icon={<BuildingImg />}
                    handleClick={() => handleRoleSelection('business')}
                    title='Business Courier'
                />
            </View>
        </FullPageModalLayout>
    );
};

export default SwitchRoleModal;