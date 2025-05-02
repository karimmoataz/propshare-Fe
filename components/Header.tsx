import { useState, useRef } from 'react';
import { View, Image, TouchableOpacity, Animated, Dimensions, Text, ViewStyle } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";

const { width } = Dimensions.get('window');
const MENU_WIDTH = width * 0.7;

interface MenuItem {
  name: string;
  icon: string;
  path: string;
}

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const slideAnim = useRef<Animated.Value>(new Animated.Value(-MENU_WIDTH)).current;
  const router = useRouter();

  const toggleMenu = (): void => {
    const toValue = menuOpen ? -MENU_WIDTH : 0;
    
    Animated.timing(slideAnim, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
    
    setMenuOpen(!menuOpen);
  };

  const navigateTo = (path: string): void => {
    toggleMenu();
    router.push(path as any);
  };

  const menuItems: MenuItem[] = [
    { name: 'Home', icon: 'home', path: '/' },
    { name: 'Settings', icon: 'settings', path: '/settings' },
    { name: 'Contact', icon: 'mail', path: '/help-center' },
  ];

  const overlayStyle: ViewStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 10,
  };

  const sideMenuStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: MENU_WIDTH,
    zIndex: 20,
    transform: [{ translateX: slideAnim }],
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  };

  return (
    <>
      {/* Overlay when menu is open */}
      {menuOpen && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={toggleMenu}
          style={overlayStyle}
        />
      )}
      
      {/* Side Menu */}
      <Animated.View
        style={sideMenuStyle as Animated.WithAnimatedObject<ViewStyle>}
        className="bg-white pt-12 px-4"
      >
        <View className="items-center mb-8">
          <Image
            source={require("../assets/images/logo.png")}
            className="w-40 h-12"
          />
        </View>
        
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            className="flex-row items-center py-4 border-b border-gray-200"
            onPress={() => navigateTo(item.path)}
          >
            <Feather name={item.icon as any} size={20} color="black" />
            <Text className="ml-4 text-lg font-medium">{item.name}</Text>
          </TouchableOpacity>
        ))}
      </Animated.View>
      
      {/* Header */}
      <View className="flex-row justify-between items-center px-4 py-5">
        <TouchableOpacity onPress={toggleMenu}>
          <Feather name="menu" size={24} color="black" />
        </TouchableOpacity>
        <Image
          source={require("../assets/images/logo.png")}
          className="w-60 h-16 mx-auto"
        />
        <TouchableOpacity>
          <Link href={"/notification"}>
            <Feather name="bell" size={24} color="black" />
          </Link>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default Header;