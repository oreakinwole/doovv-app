import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import tw from 'twrnc';
import FullPageModalLayout from '~/layout/FullPageModalLayout';

interface ProfileEditModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (fullname: string) => void;
    initialFullname: string;
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ visible, onClose, onSave, initialFullname }) => {
    const [fullname, setFullname] = useState(initialFullname);

    const handleSave = () => {
        onSave(fullname);
        onClose();
    };

    return (
        <FullPageModalLayout 
            modalVisible={visible} 
            setModalVisible={onClose} 
            button={onClose}
        >
            <View style={tw`p-4`}>
                <Text style={tw`text-xl font-bold mb-2`}>Edit Profile</Text>
                <Text style={tw`text-gray-500 mb-5`}>Update your profile information below.</Text>
                
                <TextInput
                    style={tw`border border-gray-300 rounded p-2 mb-4`}
                    placeholder="Full Name"
                    value={fullname}
                    onChangeText={setFullname}
                />
                
                <Button title="Save" onPress={handleSave} />
            </View>
        </FullPageModalLayout>
    );
};

export default ProfileEditModal;
