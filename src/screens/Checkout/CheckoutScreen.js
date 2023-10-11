import React, { useState, useLayoutEffect, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import styles from './styles';
import { useDispatch,useSelector } from "react-redux";
import AddressForm from '../Address/AddressForm';
import {setUser, setStores} from "../../redux/slice";
import { getDatabase, ref, set, get, push, update } from "firebase/database";
import BackButton from "../../components/BackButton/BackButton";
import axios from 'axios';
import RazorpayCheckout from 'react-native-razorpay';
import Toast from '../../components/Toast/Toast';
import RadioGroup from 'react-native-radio-buttons-group';


const CheckoutScreen= (props) => {
    const { navigation } = props;
    const dispatch = useDispatch();
    const db = getDatabase();
    const [deliverToHome, setDeliverToHome] = useState(true);
    const [pickUpAtStore, setPickUpAtStore] = useState(false);
    const [showAddressSection, setShowAddressSection] = useState(true);
    const [showStoreSection, setShowStoreSection] = useState(false);
    const user = useSelector((app) => app.state.userDetails);
    const stores = useSelector((app) => app.state.stores);
    const totalAmount = useSelector((app) => app.state.totalAmount);
    const [isAddressModalVisible, setAddressModalVisible] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [selectedStore, setSelectedStore] = useState(null);
    const [selectedPaymentOption,setSelectedPaymentOption] = useState(false);
    const [toast, setToast] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    let userCartId = null;
    let userCartItems = [];

    useEffect(()=>{
      getStoresSnap();
    },[])

    useLayoutEffect(() => {
      navigation.setOptions({
        headerLeft: () => (
          <BackButton
            onPress={() => {
              navigation.navigate("Cart", { key: Math.random() }); 
            }}
          />
        ),
        headerRight: () => <View />,
      });
    }, []);

    const getStoresSnap = async () =>{
      let storesRef = ref(db, "Stores")
      try {
        let snapshot = await get(storesRef);  
        if (snapshot.exists()) {
          let storeData = snapshot.val();
          dispatch(setStores(storeData));
        }
      } catch (error) {
        console.error('Error fetching Store data:', error);
      }
    };
    const showToast = (message, type, duration) => {
      setToast({ message, type, duration });
      setTimeout(() => {
          setToast(null);
        }, 1500);
    };

    const handleAddNewAddress = () => {
      setAddressModalVisible(true);
    };

    const handleDeliverToHomePress = () => {
      setDeliverToHome(true);
      setPickUpAtStore(false);
      setShowAddressSection(true);
      setShowStoreSection(false);
    };

    const handlePickUpAtStorePress = () => {
      setDeliverToHome(false);
      setPickUpAtStore(true);
      setShowAddressSection(false);
      setShowStoreSection(true);
    };

    const handleAddressOptionSelect = (address) => {
      setSelectedAddress(address);
    };
  
    const handleStoreOptionSelect = (store) => {
      setSelectedStore(store);
    };

    
    
    const saveAddress = (address, addressObj) =>{
      const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 10000);
    const addressId=  `${timestamp}-${randomNum}`;
    const newAddress = {
      id: addressId,
      address: address,
      addressObj:addressObj
    };
    const updatedShippingAddress = user.shipping_address
      ? [...user.shipping_address, newAddress]
      : [newAddress];
    const updatedUser = { ...user, shipping_address: updatedShippingAddress };
    set(userRef, updatedUser)
      .then(() => {
        showToast('User details updated successfully!','success');
        setUser(updatedUser);
      })
      .catch((error) => {
        showToast('Error updating user details:', 'error');
      });
    }
    
  const selectPaymentOption = ()=>{
      setSelectedPaymentOption(!selectedPaymentOption);
  }
  const continueToPayment = async () => {

    if (deliverToHome  && selectedAddress!==null|| pickUpAtStore&&selectedStore!==null ) {
      setIsLoading(true);
      const cartsRef = ref(db, "ShoppingCarts"); 
      const cartItemsRef = ref(db, "ShoppingCartItems");
      const cartsSnapshot = await get(cartsRef);
      if (cartsSnapshot.exists()) {
        const allCarts = cartsSnapshot.val();
       
        for (const cartId in allCarts) {
          if (allCarts[cartId].user_id === user.id) {
            userCartId = cartId;
            break;
          }
        }
        if (userCartId) {
          const cartItemsSnapshot = await get(cartItemsRef);

          if (cartItemsSnapshot.exists()) {
            const allCartItems = cartItemsSnapshot.val();
             userCartItems = Object.values(allCartItems).filter(
              (item) => item.cart_id === userCartId
            );
            
          }
        }
      }
      const orderItems = userCartItems.map((cartItem) => {
        return {
          product_id :cartItem.parent_product_id,
          variant_id :cartItem.product_id,
          variant_quantity:cartItem.variant_quantity,
          variant_name:cartItem.variant_name,
          quantity:cartItem.quantity,
          unit_price :cartItem.price,
          subtotal: cartItem.quantity*cartItem.price,
          item_name:cartItem.name ,
          item_images:cartItem.images
        };
      });
      const timestamp = Date.now();

      const newTransaction = {
        user_id: user?.id,
        order_date: new Date(timestamp).toISOString(),
        order_name:orderItems.map((orderItem) => orderItem.item_name).join(', '),
        order_status: 'Payment Pending',
        total_amount: totalAmount*100,
        orderType:deliverToHome?"Deliver to Home" : "Pick Up at Store",
        shipping_address:deliverToHome?user.shipping_address[selectedAddress].address:null,
        pickUp_address:pickUpAtStore?stores[selectedStore].store_name : null,
        payment_method:'razorpay',
      };
      const orderResponse = await createRazorpayOrder(newTransaction);
      try {
          const order = await orderResponse;
          console.log("inside");
          newTransaction.razorpay_order_id = order.id;
          const ordersRef = ref(db, 'Orders');
          const newOrderRef = push(ordersRef);
          const newOrderKey = newOrderRef.key;
          newTransaction.id = newOrderKey;
          await set(newOrderRef, newTransaction);
          await createOrderItems(orderItems, newOrderKey);
          redirectToRazorPay(newTransaction);
        } catch (error) {
          setIsLoading(false)
          showToast("Payment Server is Down","error")
        }      
    } else {
      showToast("Please select an address to deliver or a store to pickup", 'error')
    }
  };

  const createOrderItems = async (orderItems, newOrderKey) => {
    const orderItemsRef = ref(db, 'OrderItems');
  
    for (const orderItem of orderItems) {
      const newOrderItemRef = push(orderItemsRef);
      const newOrderItemKey = newOrderItemRef.key;
      orderItem.order_id = newOrderKey;
      orderItem.id = newOrderItemKey;
  
      try {
        await set(newOrderItemRef, orderItem);
        console.log(`Order item created successfully: ${newOrderItemKey}`);
      } catch (error) {
        console.error('Error creating order item:', error);
      }
    }
  };

  const createRazorpayOrder = async (newTransaction) => {
    try {
      const response = await axios.post('https://us-central1-saptham-140ee.cloudfunctions.net/paymentApi/', {
        amount: newTransaction.total_amount,
      });
      return response.data;
    } catch (err) {
      setIsLoading(false)
      showToast("Payment Server is Down","error")
    }
  };

  const redirectToRazorPay = (order)=>{
    const options = {
      key: 'rzp_test_LvDhgEzFCyXLjW', 
      amount: order.total_amount, 
      currency: 'INR',
      name: 'Saptham',
      description: 'Payment for Order',
      order_id: order.razorpay_order_id, 
      prefill: {
        contact: user.phone_number,
        email: user.email, 
      },
      theme: { color: '#F37254' },
    };
    RazorpayCheckout.open(options)
      .then((data) => {
        handlePayment(data,order,"success")
        setIsLoading(true)
      }).then((status)=>{
        navigation.navigate("Order Details", { item:order,user,navigationPage:'checkout' }) 
      })
      .catch((error) => {
        handlePayment(null,order,"error")
        setIsLoading(false)
        showToast(error.description,"error")
      });
  }
  
  const handlePayment=async (data,order,status)=>{
    const paymentRef = ref(db, 'Payments');
    const orderRef = ref(db, 'Orders/' + order.id);
    
    const newPaymentRef = push(paymentRef);
    const newPaymentKey = newPaymentRef.key;
    
    const newPayment = {
      id: newPaymentKey,
      order_id: order.id,
      razorpay_order_id:data?data.razorpay_order_id:order.razorpay_order_id,
      razorpay_payment_id: data?data.razorpay_payment_id:null,
      payment_status: status,
      payment_date: Date.now(),
      payment_amount:order.total_amount,
      payment_token:data?data.razorpay_signature:null,
    };
    if(data){
    try {
      await set(newPaymentRef, newPayment);
      let order = await get(orderRef); 
      if (order.exists()) {
        await update(orderRef, { order_status: status=="success"?"Ordered":"Payment Failed" });
      }
      for (const userCartItem of userCartItems) {
        await set(ref(db, `ShoppingCartItems/${userCartItem.id}`), null);
      }
      await set(ref(db, `ShoppingCarts/${userCartId}`), null);
      return true;
      

    return true;
    } catch (error) {
      showToast('Error recording payment:',"error")
      return false
    }
    }
  }
  
  const navigateToLogin = () =>{
      navigation.navigate("Login"); 
    }
 if (user == null) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ marginBottom:20}}>Please login to checkout</Text>
          <TouchableOpacity  style={styles.loginButton}>
            <Text onPress={navigateToLogin} style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      );
    }

  
  
    return (
      <View style={styles.maincontainer}>
     {isLoading ? (
        <ActivityIndicator />
      ) : (
        <View style={styles.maincontainer}>
        {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              duration={toast.duration}
            />
          )}
            <View style={styles.container}>
                <TouchableOpacity
                onPress={handleDeliverToHomePress}
                style={[
                    styles.option,
                    deliverToHome && styles.selectedTab,
                ]}
                >
                <Text style={[styles.optionText, deliverToHome && styles.selectedOptionText]}>Deliver to Home</Text>
                </TouchableOpacity>
                <TouchableOpacity
                onPress={handlePickUpAtStorePress}
                style={[
                    styles.option,
                    pickUpAtStore && styles.selectedTab,
                ]}
                >
                <Text style={[styles.optionText, pickUpAtStore && styles.selectedOptionText]}>Pick Up at Store</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.container}>
                {showAddressSection && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Select Address</Text>
                        <RadioGroup
                          radioButtons={user?.shipping_address?.map((address, index) => ({
                            id: index,
                            label: address.address,
                            value: index,
                          }))}
                          onPress={(value) => {
                            handleAddressOptionSelect(value);
                          }}
                          selectedId={selectedAddress}
                        />
                        <TouchableOpacity
                        onPress={() => handleAddNewAddress()}
                        style={styles.addAddressButton}
                        >
                        <Text style={styles.addAddressButtonText} >Add New Address</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {showStoreSection && (
                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>Select Store</Text>
                      <RadioGroup
                            containerStyle={styles.storeOption}
                            radioButtons={stores.map((store, index) => ({
                              id: index,
                              label: store.store_name,
                              value: index,
                            }))}
                            onPress={(value) => {
                              handleStoreOptionSelect(value);
                            }}
                            selectedId={selectedStore}
                          />
                    </View>
                )}
            </View>
            <View style={styles.container}>
            
            </View>
            <View style={styles.container}>
            <TouchableOpacity
                        onPress={() => continueToPayment()}
                        style={styles.paymentButton}
                        >
                        <Text style={styles.paymentButtonText} >Continue To Payment</Text>
            </TouchableOpacity>
            </View>
            <AddressForm
                isVisible={isAddressModalVisible}
                onClose={() => setAddressModalVisible(false)}
                onSaveAddress={(newAddress,addressObj) => {
                    saveAddress(newAddress, addressObj);
                    setAddressModalVisible(false);          
                }}
            />                        
      </View>)}
    </View>
    );
};

export default CheckoutScreen;
