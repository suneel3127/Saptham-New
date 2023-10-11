import React, { useLayoutEffect, useState, useEffect } from "react";
import { FlatList, Text, View, TouchableHighlight, Image, ActivityIndicator } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import styles from "./styles";
import CartButton from "../../components/CartButton/CartButton";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setProducts } from "../../redux/slice";
import { onAuthStateChanged } from "firebase/auth";
import { auth, database } from "../../firebase/config";
import { getDatabase, ref, get } from "firebase/database";
import AccountButton from "../../components/AccountButton/AccountButton";

export default function HomeScreen(props) {
  const { navigation } = props;
  const dispatch = useDispatch();
  const [value, setValue] = useState("");
  const [originalData, setOriginalData] = useState([]);
  const [data, setData] = useState([]);
  const db = database;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetchUserData();
    getProductsSnap();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableHighlight>
         <View style={styles.logoContainer}>
          <Image style={styles.logo} source={require("../../../assets/images/Saptham-Logo.png")} />
          </View>
        </TouchableHighlight>
      ),
      headerRight: () => (
        <View style={styles.iconContainer}>
          <CartButton
            onPress={() => {
              navigation.navigate("Cart");
            }}
          />

          <AccountButton
            onPress={() => {
              navigation.navigate("Account");
            }}
          />
        </View>
      ),
    });
  }, []);

  const handleSearch = (text) => {
    setValue(text);
    const filteredData = [];
    if (text !== "") {
      data.map((data) => {
        if (data.name.toUpperCase().includes(text.toUpperCase())) {
          filteredData.push(data);
        }
      });
      setData(filteredData);
    } else {
      setData(originalData);
    }
  };

  const fetchUserData = async () => {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userId = firebaseUser.uid;
        const userRef = ref(db, "users/" + userId);

        try {
          let snapshot = await get(userRef);
          if (snapshot.exists()) {
            const userData = snapshot.val();
            const user = userData;
            dispatch(setUser(userData));
            setIsLoading(false);
          }
        } catch (error) {
          console.error("Error fetching user data", error);
          setIsLoading(false);
        }
      } else {
        dispatch(setUser(null));
        setIsLoading(false);
      }
    });
  };

  const getProductsSnap = async () => {
    let productsRef = ref(db, "Products");
    try {
      let snapshot = await get(productsRef);
      if (snapshot.exists()) {
        let productData = snapshot.val();
        dispatch(setProducts(productData));
        setOriginalData(productData);
        setData(productData);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching Products data", error);
      setIsLoading(false);
    }
  };

  const onPressProduct = (item) => {
    navigation.navigate("Product", { item });
  };

  const renderProducts = ({ item }) => (
    <TouchableHighlight underlayColor="rgba(73,182,77,0.9)" onPress={() => onPressProduct(item)}>
      <View style={styles.productcontainer}>
        <Image style={styles.photo} source={{ uri: item.images[0].src }} />
        <Text style={styles.title}>{item.name}</Text>
      </View>
    </TouchableHighlight>
  );

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loaderContainer}>
        <ActivityIndicator />
        </View>
      ) : (
        <View>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              onChangeText={handleSearch}
              value={value}
            />
            <Image style={styles.searchIcon} source={require("../../../assets/icons/search.png")} />
          </View>
          {data.length === 0 ? (
            <View style={styles.noProductsMessageContainer}>
              <Text style={styles.noProductsMessage}>No Products to Display</Text>
            </View>
          ) : (
            <FlatList
              vertical
              showsVerticalScrollIndicator={false}
              numColumns={2}
              data={data}
              renderItem={renderProducts}
              keyExtractor={(item) => `${item.id}`}
            />
          )}
        </View>
      )}
    </View>
  );
}
