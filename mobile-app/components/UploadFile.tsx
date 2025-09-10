import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import tw from "twrnc";
import { MaterialIcons } from "@expo/vector-icons";

interface UploadDocumentInputProps {
  label?: string;
  document: DocumentPicker.DocumentPickerResult | null;
  setDocument: (document: DocumentPicker.DocumentPickerResult | null) => void;
}

const UploadDocumentInput: React.FC<UploadDocumentInputProps> = ({ 
  label = 'Upload Valid Licence', 
  document, 
  setDocument 
}) => {
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;
      setDocument(result);
    } catch (error) {
      console.error("Error picking document:", error);
    }
  };

  const truncateFileName = (fileName: string, maxLength: number = 25) => {
    if (fileName.length <= maxLength) return fileName;
    
    const extension = fileName.split('.').pop();
    const nameWithoutExtension = fileName.substring(0, fileName.lastIndexOf('.'));
    const truncatedName = nameWithoutExtension.substring(0, maxLength - extension!.length - 4);
    
    return `${truncatedName}...${extension}`;
  };

  const getDocumentName = () => {
    if (!document || document.canceled) return null;
    return document.assets?.[0]?.name || 'Unknown file';
  };

  const documentName = getDocumentName();

  return (
    <>
      {label && (
        <Text style={tw`text-[#100F0D] text-[16px] font-medium mb-2`}>
          {label}
        </Text>
      )}
      <View style={tw`mb-5`}>
        <View style={tw`px-3 py-4 bg-white rounded-lg border ${document ? 'border-green-200' : 'border-gray-200'}`}>
          <TouchableOpacity
            onPress={pickDocument}
            style={tw`flex-row items-center justify-between`}
          >
            <View style={tw`flex-row items-center flex-1`}>
              <MaterialIcons 
                name={document ? "description" : "cloud-upload"} 
                size={24} 
                color={document ? "#10B981" : "#6B7280"} 
                style={tw`mr-3`}
              />
              <Text style={tw`text-[#100F0D] text-[17px] flex-1`}>
                {document ? "Replace Document" : "Click here to upload Document"}
              </Text>
            </View>
            {document && (
              <MaterialIcons name="check-circle" size={20} color="#10B981" />
            )}
          </TouchableOpacity>
        </View>
        
        {documentName && (
          <View style={tw`mt-2 px-3 py-2 bg-green-50 rounded-lg flex-row items-center`}>
            <MaterialIcons name="attach-file" size={16} color="#059669" style={tw`mr-2`} />
            <Text style={tw`text-green-700 text-sm font-medium flex-1`}>
              {truncateFileName(documentName)}
            </Text>
            <TouchableOpacity 
              onPress={() => setDocument(null)}
              style={tw`ml-2 p-1`}
            >
              <MaterialIcons name="close" size={16} color="#DC2626" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </>
  );
};

export default UploadDocumentInput;