import React, { useState, useRef } from 'react';
import { TouchableOpacity, TouchableOpacityProps, Animated, StyleProp, ViewStyle } from 'react-native';

interface FocusableTouchableOpacityProps extends TouchableOpacityProps {
  children: React.ReactNode;
}

const FocusableTouchableOpacity: React.FC<FocusableTouchableOpacityProps> = ({ children, style, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleFocus = (e: any) => {
    setIsFocused(true);
    Animated.spring(scaleAnim, {
      toValue: 1.1,
      useNativeDriver: true,
    }).start();
    props.onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
    props.onBlur?.(e);
  };

  const dynamicStyles: StyleProp<ViewStyle> = {
    borderColor: isFocused ? '#FFFFFF' : 'transparent',
    transform: [{ scale: scaleAnim }],
    borderWidth: 2,
  };

  return (
    <Animated.View style={[style, dynamicStyles]}>
      <TouchableOpacity
        {...props}
        onFocus={handleFocus}
        onBlur={handleBlur}
        activeOpacity={0.8}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default FocusableTouchableOpacity;
