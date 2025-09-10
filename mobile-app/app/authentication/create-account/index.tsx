// CreateAccount.tsx
import React, { useState } from 'react';
import { router } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import Toast from 'react-native-toast-message';
import LayoutPage from '~/layout/PageLayout';
import { requests } from '~/api/requests';
import { passRoute, UserAuthentication } from '~/utils/authentication.flow';

import { UserRole, RegisterCourierPayload } from '~/types';
import { RoleSelection } from '~/components/RoleSelection';
import { SenderForm } from '~/components/forms/SenderForm';
import { IndividualCourierForm } from '~/components/forms/IndividualCourierForm';
import { BusinessCourierForm } from '~/components/forms/BusinessCourierForm';

export default function CreateAccount(): JSX.Element {
  const [role, setRole] = useState<UserRole>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [document, setDocument] = useState<DocumentPicker.DocumentPickerResult | null>(null);
  const [utilityBillDocument, setUtilityBillDocument] = useState<DocumentPicker.DocumentPickerResult | null>(null);
  const [cacDocument, setCacDocument] = useState<DocumentPicker.DocumentPickerResult | null>(null);

  const initialRegistrationData: RegisterCourierPayload = {
    name: '',
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    phone: '',
    confirmPassword: '',
    meansOfTravel: null,
    nin: '',
    bvn: '',
    dob: '',
  }

  const [registrationData, setRegistrationData] = useState<RegisterCourierPayload>(initialRegistrationData);

  const updateRegistrationData = (field: keyof RegisterCourierPayload, value: any): void => {
    setRegistrationData(prev => ({ ...prev, [field]: value }));
  };

  const handleSenderCreateAccount = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await requests.registerCustomer(
        registrationData.name,
        registrationData.email,
        registrationData.password,
        registrationData.phone
      );

      Toast.show({
        type: 'success',
        text1: response.data.message,
        position: 'top'
      });

      UserAuthentication.email = registrationData.email;
      passRoute.url = '/sender/tabs/Home';

      setTimeout(() => router.push('/authentication/verification'), 2000);

    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: error.response?.data?.message || "An error occurred",
        position: 'top'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleIndividualCourierSignUp = async (): Promise<void> => {
    setLoading(true);
    
    try {
      // Validate document uploads
      if (!document || document.canceled || !document.assets || document.assets.length === 0) {
        Toast.show({
          type: 'error',
          text1: "Please select your valid license document",
          position: 'top'
        });
        setLoading(false);
        return;
      }

      if (!utilityBillDocument || utilityBillDocument.canceled || !utilityBillDocument.assets || utilityBillDocument.assets.length === 0) {
        Toast.show({
          type: 'error',
          text1: "Please select your utility bill",
          position: 'top'
        });
        setLoading(false);
        return;
      }

      // Get upload session and token
      const sessionResponse = await requests.getSignupSession();
      const { upload_token } = sessionResponse.data;
      
      // Upload ID document
      const idFileUri = document.assets[0].uri;
      const idFileType = document.assets[0].mimeType;
      const idFileName = document.assets[0].name;
      
      const idFormData = new FormData();
      idFormData.append('document', {
        uri: idFileUri,
        type: idFileType,
        name: idFileName,
      } as any);
      
      const idUploadResponse = await requests.uploadDocument(idFormData, upload_token);
      const uploadedIdUrl = idUploadResponse.data.url;
      
      // Upload utility bill document
      const utilityFileUri = utilityBillDocument.assets[0].uri;
      const utilityFileType = utilityBillDocument.assets[0].mimeType;
      const utilityFileName = utilityBillDocument.assets[0].name;
      
      const utilityFormData = new FormData();
      utilityFormData.append('document', {
        uri: utilityFileUri,
        type: utilityFileType,
        name: utilityFileName,
      } as any);
      
      const utilityUploadResponse = await requests.uploadDocument(utilityFormData, upload_token);
      const utilityBillUrl = utilityUploadResponse.data.url;
      
      // Prepare registration data with uploaded document URLs
      const userData = {
        email: registrationData.email,
        password: registrationData.password,
        firstname: registrationData.firstname,
        lastname: registrationData.lastname,
        phone: registrationData.phone,
        ...(registrationData.nin && { nin: registrationData.nin }),
        ...(registrationData.bvn && { bvn: registrationData.bvn }),
        meansOfTravel: registrationData.meansOfTravel,
        dob: registrationData.dob || '',
        uploadedIdUrl,
        utilityBillUrl,
      }

      const response = await requests.registerCourier(userData);
      Toast.show({
        type: 'success',
        text1: response.data.message,
        position: 'top'
      });

      UserAuthentication.email = registrationData.email;
      passRoute.url = '/i-courier/tabs/Home';

      setTimeout(() => router.push('/authentication/verification'), 2000);

    } catch (error: any) {
      console.error('Registration Error:', error);
      let errorMessage = error.response?.data?.message || "An error occurred during registration";

      if (error.response?.data?.data && typeof error.response.data.data === 'object') {
        const validationErrors = Object.values(error.response.data.data).join('. ');
        errorMessage += `. ${validationErrors}`;
      }

      Toast.show({
        type: 'error',
        text1: errorMessage,
        position: 'top'
      });

    } finally {
      setLoading(false);
    }
  };

  const handleBusinessCourierProceed = async (): Promise<void> => {
    setLoading(true);

    try {
      // Validate document uploads
      if (!cacDocument || cacDocument.canceled || !cacDocument.assets || cacDocument.assets.length === 0) {
        Toast.show({
          type: 'error',
          text1: "Please upload your CAC document",
          position: 'top'
        });
        setLoading(false);
        return;
      }

      if (!utilityBillDocument || utilityBillDocument.canceled || !utilityBillDocument.assets || utilityBillDocument.assets.length === 0) {
        Toast.show({
          type: 'error',
          text1: "Please upload your utility bill",
          position: 'top'
        });
        setLoading(false);
        return;
      }

      // Get upload session and token
      const sessionResponse = await requests.getSignupSession();
      const { upload_token } = sessionResponse.data;
      
      // Upload CAC document
      const cacFileUri = cacDocument.assets[0].uri;
      const cacFileType = cacDocument.assets[0].mimeType;
      const cacFileName = cacDocument.assets[0].name;
      
      const cacFormData = new FormData();
      cacFormData.append('file', {
        uri: cacFileUri,
        type: cacFileType,
        name: cacFileName,
      } as any);
      
      const cacUploadResponse = await requests.uploadDocument(cacFormData, upload_token);
      const uploadedCac = cacUploadResponse.data.url;
      
      // Upload utility bill document
      const utilityFileUri = utilityBillDocument.assets[0].uri;
      const utilityFileType = utilityBillDocument.assets[0].mimeType;
      const utilityFileName = utilityBillDocument.assets[0].name;
      
      const utilityFormData = new FormData();
      utilityFormData.append('file', {
        uri: utilityFileUri,
        type: utilityFileType,
        name: utilityFileName,
      } as any);
      
      const utilityUploadResponse = await requests.uploadDocument(utilityFormData, upload_token);
      const utilityBillUrl = utilityUploadResponse.data.url;

      const businessData = {
        email: registrationData.email,
        password: registrationData.password,
        firstname: registrationData.firstname,
        lastname: registrationData.lastname,
        businessName: registrationData.name,
        phone: registrationData.phone,
        ...(registrationData.nin && { nin: registrationData.nin }),
        ...(registrationData.bvn && { bvn: registrationData.bvn }),
        uploadedCac,
        utilityBillUrl,
      }

      const response = await requests.registerBusiness(businessData);

      Toast.show({
        type: 'success',
        text1: response.data.message,
        position: 'top'
      });

      setRegistrationData(initialRegistrationData);

      UserAuthentication.email = registrationData.email;
      passRoute.url = '/b-courier/tabs/Home';

      setTimeout(() => {
        setLoading(false);
        router.push('/authentication/verification');
      }, 2000);

    } catch (error: any) {
      console.error('Business Registration Error:', error);
      let errorMessage = error.response?.data?.message || "An error occurred during registration";

      if (error.response?.data?.data && typeof error.response.data.data === 'object') {
        const validationErrors = Object.values(error.response.data.data).join('. ');
        errorMessage += `. ${validationErrors}`;
      }

      Toast.show({
        type: 'error',
        text1: errorMessage,
        position: 'top'
      });

    } finally {
      setLoading(false);
    }
  }

  const renderCurrentForm = (): JSX.Element => {
    switch (role) {
      case 'sender':
        return (
          <SenderForm
            onSubmit={handleSenderCreateAccount}
            loading={loading}
            registrationData={registrationData}
            updateRegistrationData={updateRegistrationData}
            setRole={setRole}
          />
        );
      case 'individualCourier':
        return (
          <IndividualCourierForm
            onSubmit={handleIndividualCourierSignUp}
            loading={loading}
            document={document}
            setDocument={setDocument}
            utilityBillDocument={utilityBillDocument}
            setUtilityBillDocument={setUtilityBillDocument}
            setRole={setRole}
            registrationData={registrationData}
            updateRegistrationData={updateRegistrationData}
          />
        );
      case 'businessCourier':
        return (
          <BusinessCourierForm
            registrationData={registrationData}
            updateRegistrationData={updateRegistrationData}
            onSubmit={handleBusinessCourierProceed}
            loading={loading}
            cacDocument={cacDocument}
            setCacDocument={setCacDocument}
            utilityBillDocument={utilityBillDocument}
            setUtilityBillDocument={setUtilityBillDocument}
            setRole={setRole}
          />
        );
      default:
        return <RoleSelection setRole={setRole} />;
    }
  };

  return (
    <LayoutPage noscroll={role === ''}>
      {renderCurrentForm()}
    </LayoutPage>
  );
}