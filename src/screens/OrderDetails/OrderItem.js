import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import styles from "./styles";

const OrderItem = ({item,navigateToReview,navigationPage}) => {

  return (
    <View style={styles.container}>
      <Image source={{ uri: item.item_images[0].src  }} style={styles.image} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.item_name}</Text>
        <Text style={styles.itemPrice}>Price: {(item.quantity*item.unit_price).toFixed(2)}</Text>
        <Text style={styles.itemQuantity}>{item.variant_name}: {item.variant_quantity} * {item.quantity}</Text>
      </View>
      {navigationPage!=="checkout"&&<TouchableOpacity
        style={styles.reviewButton}
        onPress={() => {
          navigateToReview(item);
        }}
      >
        <Text style={styles.reviewButtonText}>Write a Review</Text>
      </TouchableOpacity>}
    </View>
  );
};

export default OrderItem