import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import { useCreateBooking } from '~/hooks/useBookings';
import { CreateBookingDto } from '~/types';

const validationSchema = Yup.object().shape({
    serviceType: Yup.string().required('Service type is required'),
    vehicleInfo: Yup.string().required('Vehicle information is required'),
    address: Yup.string().when('serviceType', {
        is: (val: string) => val === 'MOBILE' || val === 'PICKUP_RETURN',
        then: (schema) => schema.required('Address is required for this service type'),
        otherwise: (schema) => schema,
    }),
    scheduledAt: Yup.date().required('Scheduled date is required').min(new Date(), 'Date must be in the future'),
});

const serviceTypes = [
    { value: 'DROP_OFF', label: 'Drop Off', price: 25, description: 'Bring your car to us' },
    { value: 'MOBILE', label: 'Mobile Wash', price: 35, description: 'We come to you' },
    { value: 'PICKUP_RETURN', label: 'Pickup & Return', price: 45, description: 'Full service with pickup' },
];

export default function CreateBookingScreen() {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const createBooking = useCreateBooking();

    const handleSubmit = async (values: any) => {
        const bookingData: CreateBookingDto = {
            serviceType: values.serviceType,
            vehicleInfo: values.vehicleInfo,
            address: values.address || undefined,
            scheduledAt: values.scheduledAt.toISOString(),
        };

        try {
            await createBooking.mutateAsync(bookingData);
            Alert.alert(
                'Success',
                'Your booking has been created successfully!',
                [{ text: 'OK' }]
            );
        } catch (error) {
            console.error('Booking creation error:', error);
        }
    };

    return (
        <ScrollView style={tw`flex-1 bg-gray-50`}>
            <View style={tw`p-6`}>
                <Text style={tw`text-2xl font-bold text-gray-800 mb-6`}>Book a Wash</Text>

                <Formik
                    initialValues={{
                        serviceType: '',
                        vehicleInfo: '',
                        address: '',
                        scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                        <View style={tw`space-y-6`}>
                            {/* Service Type Selection */}
                            <View>
                                <Text style={tw`text-lg font-semibold text-gray-800 mb-3`}>Service Type</Text>
                                {serviceTypes.map((service) => (
                                    <TouchableOpacity
                                        key={service.value}
                                        style={tw`border-2 rounded-lg p-4 mb-3 ${values.serviceType === service.value
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 bg-white'
                                            }`}
                                        onPress={() => setFieldValue('serviceType', service.value)}
                                    >
                                        <View style={tw`flex-row justify-between items-center`}>
                                            <View style={tw`flex-1`}>
                                                <Text style={tw`font-semibold text-gray-800 text-base`}>
                                                    {service.label}
                                                </Text>
                                                <Text style={tw`text-gray-600 text-sm mt-1`}>
                                                    {service.description}
                                                </Text>
                                            </View>
                                            <Text style={tw`text-lg font-bold text-blue-600`}>
                                                ${service.price}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                                {touched.serviceType && errors.serviceType && (
                                    <Text style={tw`text-red-500 text-sm`}>{errors.serviceType}</Text>
                                )}
                            </View>

                            {/* Vehicle Info */}
                            <View>
                                <Text style={tw`text-lg font-semibold text-gray-800 mb-2`}>Vehicle Information</Text>
                                <TextInput
                                    style={tw`border border-gray-300 rounded-lg px-4 py-3 bg-white text-base ${touched.vehicleInfo && errors.vehicleInfo ? 'border-red-500' : ''
                                        }`}
                                    placeholder="e.g., 2020 Honda Civic, Blue"
                                    value={values.vehicleInfo}
                                    onChangeText={handleChange('vehicleInfo')}
                                    onBlur={handleBlur('vehicleInfo')}
                                    multiline
                                />
                                {touched.vehicleInfo && errors.vehicleInfo && (
                                    <Text style={tw`text-red-500 text-sm mt-1`}>{errors.vehicleInfo}</Text>
                                )}
                            </View>

                            {/* Address (conditional) */}
                            {(values.serviceType === 'MOBILE' || values.serviceType === 'PICKUP_RETURN') && (
                                <View>
                                    <Text style={tw`text-lg font-semibold text-gray-800 mb-2`}>Address</Text>
                                    <TextInput
                                        style={tw`border border-gray-300 rounded-lg px-4 py-3 bg-white text-base ${touched.address && errors.address ? 'border-red-500' : ''
                                            }`}
                                        placeholder="Enter your address"
                                        value={values.address}
                                        onChangeText={handleChange('address')}
                                        onBlur={handleBlur('address')}
                                        multiline
                                    />
                                    {touched.address && errors.address && (
                                        <Text style={tw`text-red-500 text-sm mt-1`}>{errors.address}</Text>
                                    )}
                                </View>
                            )}

                            {/* Date Picker */}
                            <View>
                                <Text style={tw`text-lg font-semibold text-gray-800 mb-2`}>Scheduled Date</Text>
                                <TouchableOpacity
                                    style={tw`border border-gray-300 rounded-lg px-4 py-3 bg-white flex-row items-center justify-between`}
                                    onPress={() => setShowDatePicker(true)}
                                >
                                    <Text style={tw`text-base text-gray-800`}>
                                        {values.scheduledAt.toLocaleDateString()} at {values.scheduledAt.toLocaleTimeString()}
                                    </Text>
                                    <Ionicons name="calendar-outline" size={20} color="#6B7280" />
                                </TouchableOpacity>
                                {touched.scheduledAt && errors.scheduledAt && (
                                    <Text style={tw`text-red-500 text-sm mt-1`}>{errors.scheduledAt}</Text>
                                )}
                            </View>

                            {showDatePicker && (
                                <DateTimePicker
                                    value={values.scheduledAt}
                                    mode="datetime"
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        setShowDatePicker(false);
                                        if (selectedDate) {
                                            setFieldValue('scheduledAt', selectedDate);
                                        }
                                    }}
                                    minimumDate={new Date()}
                                />
                            )}

                            {/* Submit Button */}
                            <TouchableOpacity
                                style={tw`bg-blue-600 rounded-lg py-4 mt-8 ${createBooking.isPending ? 'opacity-50' : ''
                                    }`}
                                onPress={handleSubmit}
                                disabled={createBooking.isPending}
                            >
                                <Text style={tw`text-white text-center text-lg font-semibold`}>
                                    {createBooking.isPending ? 'Creating Booking...' : 'Book Now'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </Formik>
            </View>
        </ScrollView>
    );
}