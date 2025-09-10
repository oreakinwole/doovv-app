import { View, Text, Animated, Easing } from 'react-native';
import React, { useState, useEffect } from 'react';
import tw from 'twrnc';
import { Link, router } from 'expo-router';
import { SelectionCard } from './SelectionCard';
import { BuildingImg, PackageImg, VehicleImg } from '~/assets/svgs/image';
import { UserRole } from '../types';
import CustomButton from './Button';
import { GoogleLogo } from '~/assets/svgs';
import { UserAuthentication } from '~/utils/authentication.flow';

interface RoleSelectionProps {
  setRole: (role: UserRole) => void;
  setToast?: (message: string, type: 'success' | 'error') => void;
}

export const RoleSelection: React.FC<RoleSelectionProps> = ({
  setRole,
  setToast = (message: string, type: 'success' | 'error') => { }
}) => {
  const [headerOpacity] = useState(new Animated.Value(0));
  const [headerTranslate] = useState(new Animated.Value(-20));
  const [slideAnims] = useState([
    new Animated.Value(60),
    new Animated.Value(60),
    new Animated.Value(60)
  ]);
  const [fadeAnims] = useState([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0)
  ]);
  const [scaleAnims] = useState([
    new Animated.Value(0.9),
    new Animated.Value(0.9),
    new Animated.Value(0.9)
  ]);
  const [footerOpacity] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(headerTranslate, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      })
    ]).start();

    const cardAnimations = slideAnims.map((slideAnim, index) => {
      return Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          delay: 300 + (index * 150),
          easing: Easing.out(Easing.back(1.1)),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnims[index], {
          toValue: 1,
          duration: 700,
          delay: 300 + (index * 150),
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnims[index], {
          toValue: 1,
          duration: 800,
          delay: 300 + (index * 150),
          easing: Easing.out(Easing.back(1.05)),
          useNativeDriver: true,
        })
      ]);
    });

    Animated.timing(footerOpacity, {
      toValue: 1,
      duration: 500,
      delay: 1000,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();

    Animated.stagger(150, cardAnimations).start();
  }, []);

  const handleCardPress = (role: UserRole, index: number) => {
    Animated.sequence([
      Animated.timing(scaleAnims[index], {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnims[index], {
        toValue: 1.02,
        duration: 150,
        easing: Easing.out(Easing.back(2)),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnims[index], {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      })
    ]).start(() => {
      setRole(role);
    });
  };

  const cards = [
    {
      description: 'Send packages to any destination.',
      icon: <PackageImg />,
      handleClick: () => handleCardPress("sender", 0),
      title: 'Sender'
    },
    {
      description: 'Earn by delivering packages along your route.',
      icon: <VehicleImg />,
      handleClick: () => handleCardPress("individualCourier", 1),
      title: 'Individual Courier'
    },
    {
      description: 'Manage a fleet and handle bulk deliveries.',
      icon: <BuildingImg />,
      handleClick: () => handleCardPress("businessCourier", 2),
      title: 'Business Courier'
    }
  ];

  return (
    <View style={tw`flex-1 justify-center px-4`}>
      <Animated.View
        style={{
          opacity: headerOpacity,
          transform: [{ translateY: headerTranslate }]
        }}
      >
        <Text style={tw`text-xl font-bold mb-2 `}>Choose Your Role</Text>
        <Text style={tw`text-gray-500 mb-8 `}>You can switch later if needed.</Text>
      </Animated.View>

      {cards.map((card, index) => (
        <Animated.View
          key={card.title}
          style={{
            opacity: fadeAnims[index],
            transform: [
              { translateY: slideAnims[index] },
              { scale: scaleAnims[index] }
            ]
          }}
        >
          <SelectionCard
            description={card.description}
            icon={card.icon}
            handleClick={card.handleClick}
            title={card.title}
          />
        </Animated.View>
      ))}

      <Animated.View 
        style={[
          tw`flex-row justify-center mt-4`,
          { opacity: footerOpacity }
        ]}
      >
        <Text style={tw`text-[#100F0D]`}>Already have an account?</Text>
        <Link href="/authentication/login" style={tw`text-[#FF6400] ml-1`}>
          Sign in
        </Link>
      </Animated.View>
    </View>
  );
};