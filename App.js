import React, { useState, useMemo } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";

import { products } from "./data/products";
import ProductCard from "./components/ProductCard";

const formatIDR = (price) => {
  return "Rp " + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

// ✨ KOMPONEN EMPTY STATE
const EmptyState = ({ searchText, selectedCategory }) => {
  const isSearching = searchText.length > 0;
  const isFiltering = selectedCategory !== "Semua";

  let message = "";
  let subMessage = "";

  if (isSearching && isFiltering) {
    message = `😔 Tidak ada produk`;
    subMessage = `dengan nama "${searchText}" di kategori ${selectedCategory}`;
  } else if (isSearching) {
    message = `🔍 "${searchText}" tidak ditemukan`;
    subMessage = `Coba gunakan kata kunci lain`;
  } else if (isFiltering) {
    message = `📂 Belum ada produk`;
    subMessage = `di kategori ${selectedCategory}`;
  } else {
    message = `🍽️ Belum ada menu`;
    subMessage = `Silakan tambahkan produk terlebih dahulu`;
  }

  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>🍔</Text>
      <Text style={styles.emptyTitle}>{message}</Text>
      <Text style={styles.emptySubtitle}>{subMessage}</Text>
    </View>
  );
};

export default function App() {
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [sortType, setSortType] = useState("Default");
  const [isGridView, setIsGridView] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const screenWidth = Dimensions.get("window").width;

  const getItemWidth = () => {
    if (isGridView) {
      return (screenWidth - 30) / 2;
    } else {
      return screenWidth - 20;
    }
  };

  const categories = ["Semua", ...new Set(products.map((p) => p.category))];

  const filteredData = useMemo(() => {
    let result = products.filter((item) => {
      const matchSearch = item.name
        .toLowerCase()
        .includes(searchText.toLowerCase());
      const matchCategory =
        selectedCategory === "Semua" || item.category === selectedCategory;
      return matchSearch && matchCategory;
    });

    if (sortType === "Harga Terendah") result.sort((a, b) => a.price - b.price);
    if (sortType === "Harga Tertinggi")
      result.sort((a, b) => b.price - a.price);
    if (sortType === "Rating") result.sort((a, b) => b.rating - a.rating);

    return result;
  }, [searchText, selectedCategory, sortType]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  if (selectedProduct) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.detailContainer}>
          <TouchableOpacity
            onPress={() => setSelectedProduct(null)}
            style={styles.backButton}
          >
            <Text style={styles.backText}>← Kembali</Text>
          </TouchableOpacity>

          <Image source={selectedProduct.image} style={styles.detailImage} />

          <View style={styles.detailInfo}>
            <Text style={styles.detailCategory}>
              {selectedProduct.category}
            </Text>
            <Text style={styles.detailName}>{selectedProduct.name}</Text>
            <Text style={styles.detailPrice}>
              {formatIDR(selectedProduct.price)}
            </Text>
            <Text>⭐ {selectedProduct.rating}</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.headerArea}>
        <Text style={styles.title}>🍔 Foodie App</Text>

        <View style={styles.searchRow}>
          <TextInput
            placeholder="Cari makanan enak..."
            value={searchText}
            onChangeText={setSearchText}
            style={styles.input}
          />

          <TouchableOpacity
            onPress={() => setIsGridView(!isGridView)}
            style={styles.toggle}
          >
            <Text style={styles.toggleText}>
              {isGridView ? "☰ LIST" : "▦ GRID"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* CATEGORY */}
      <View style={styles.categoryWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScrollContent}
        >
          {categories.map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => setSelectedCategory(item)}
              style={styles.chipTouch}
            >
              <Text
                style={[
                  styles.chip,
                  selectedCategory === item && styles.activeChip,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* SORT BAR */}
      <View style={styles.sortBar}>
        <Text style={styles.totalCount}>{filteredData.length} Menu</Text>

        <View style={styles.sortButtons}>
          {["Harga Terendah", "Harga Tertinggi", "Rating"].map((type) => (
            <TouchableOpacity key={type} onPress={() => setSortType(type)}>
              <Text
                style={[
                  styles.sortText,
                  sortType === type && styles.activeSort,
                ]}
              >
                {type === "Harga Terendah"
                  ? "💰 Murah"
                  : type === "Harga Tertinggi"
                  ? "💎 Mahal"
                  : "⭐ Rating"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* PRODUCT LIST - DENGAN EMPTY STATE */}
      <FlatList
        key={isGridView ? "grid" : "list"}
        data={filteredData}
        numColumns={isGridView ? 2 : 1}
        keyExtractor={(item) => item.id.toString()}
        columnWrapperStyle={
          isGridView ? { justifyContent: "space-between" } : null
        }
        contentContainerStyle={[
          styles.listContent,
          filteredData.length === 0 && styles.emptyListContent,
        ]}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={
          <EmptyState
            searchText={searchText}
            selectedCategory={selectedCategory}
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ width: getItemWidth(), padding: 5 }}
            onPress={() => setSelectedProduct(item)}
          >
            <ProductCard item={item} onPress={() => setSelectedProduct(item)} />
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fffaf0",
  },

  headerArea: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: "#ffedd5",
  },

  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#ea580c",
  },

  searchRow: {
    flexDirection: "row",
    marginTop: 12,
    alignItems: "center",
    gap: 10,
  },

  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
  },

  toggle: {
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 25,
  },

  toggleText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#ea580c",
  },

  categoryWrapper: {
    backgroundColor: "#fffaf0",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0e0c0",
  },

  categoryScrollContent: {
    paddingHorizontal: 12,
    gap: 8,
  },

  chipTouch: {
    marginRight: 8,
  },

  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 30,
    fontSize: 13,
    fontWeight: "500",
    color: "#333",
    overflow: "hidden",
  },

  activeChip: {
    backgroundColor: "#f97316",
    color: "#fff",
  },

  sortBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  totalCount: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },

  sortButtons: {
    flexDirection: "row",
    gap: 12,
  },

  sortText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#f97316",
    paddingHorizontal: 6,
  },

  activeSort: {
    textDecorationLine: "underline",
    fontWeight: "bold",
    color: "#ea580c",
  },

  listContent: {
    paddingHorizontal: 8,
    paddingTop: 12,
    paddingBottom: 100,
  },

  emptyListContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 80,
  },

  // ✨ EMPTY STATE STYLES
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 40,
  },

  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
    opacity: 0.7,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#444",
    marginBottom: 8,
    textAlign: "center",
  },

  emptySubtitle: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },

  // DETAIL SCREEN
  detailContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },

  backButton: {
    padding: 16,
    backgroundColor: "#fff",
  },

  backText: {
    color: "#f97316",
    fontWeight: "bold",
    fontSize: 16,
  },

  detailImage: {
    width: "100%",
    height: 280,
    resizeMode: "cover",
  },

  detailInfo: {
    padding: 20,
  },

  detailCategory: {
    color: "#f97316",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },

  detailName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },

  detailPrice: {
    color: "#16a34a",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
});