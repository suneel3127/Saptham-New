import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import StarRating from 'react-native-star-rating-widget'
import styles from "./styles";
import { getDatabase, ref, push, set} from "firebase/database";
import Toast from '../../components/Toast/Toast';

const WriteReviewScreen = (props) => {
  const { navigation, route } = props;
  const item = route.params?.item;
  const user = route.params?.user;
  const db = getDatabase();
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type, duration) => {
    setToast({ message, type, duration });
    setTimeout(() => {
        setToast(null);
      }, 1000);
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleSaveReview = async () => {
    setIsLoading(true);
   
    const reviewsRef = ref(db, 'Reviews'); 
    const newReviewItemRef = push(reviewsRef); 
    const newReviewItemKey = newReviewItemRef.key;
    const reviewData = {
      id:newReviewItemKey,
      user_id: user.id, 
      user_name:user.first_name,
      product_id: item.product_id, 
      rating: rating,
      review_text: reviewText,
      review_date: new Date().toISOString(), 
    };
    try{
        await set(newReviewItemRef, reviewData);
        setIsLoading(false);
        showToast('Review saved successfully','success');
        navigation.navigate("Order Details");
    }
    catch(error){
        setIsLoading(false)
        showToast('Error saving review:', 'error');
    }
  };

  return (
    <View style={styles.reviewcontainer}>
      <Text style={styles.ratingLabel}>Rate this product:</Text>
      <StarRating
        maxStars={5}
        rating={rating}
        enableHalfStar={false}
        onChange={(newRating) => handleRatingChange(newRating)}
        size={100}
        activeColor="#FFD700"
      />
      <Text style={styles.reviewLabel}>Write a review:</Text>
      <TextInput
        style={styles.reviewInput}
        multiline
        numberOfLines={4}
        
        placeholder="Write your review here..."
        value={reviewText}
        onChangeText={(text) => setReviewText(text)}
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveReview}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
      {
        isLoading?
          <ActivityIndicator />:null 
        }
          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              duration={toast.duration}
            />
          )}
    </View>
  );
};



export default WriteReviewScreen;
