import React, { useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";

export default function ProductCard({ item, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const pressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const formatPrice = (price) => {
    return "Rp " + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPressIn={pressIn}
      onPressOut={pressOut}
      onPress={() => onPress(item)}
      style={styles.touchable}
    >
      <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
        <Image source={item.image} style={styles.image} />
        <View style={styles.content}>
          <Text style={styles.category}>{item.category}</Text>
          <Text style={styles.name} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.price}>{formatPrice(item.price)}</Text>
          {item.rating && (
            <Text style={styles.rating}>⭐ {item.rating}</Text>
          )}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchable: {
    flex: 1,
    margin: 6,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  image: {
    width: "100%",
    height: 140,
    resizeMode: "cover",
  },

  content: {
    padding: 12,
  },

  category: {
    fontSize: 11,
    color: "#EA580C",
    fontWeight: "800",
    textTransform: "uppercase",
    marginBottom: 4,
  },

  name: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 6,
    color: "#333",
  },

  price: {
    color: "#16A34A",
    fontWeight: "bold",
    fontSize: 14,
  },

  rating: {
    fontSize: 11,
    color: "#f1c40f",
    marginTop: 4,
  },
});