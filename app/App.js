import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Keyboard
} from 'react-native';
import {
  Input,
  Stack,
  Center,
  Heading,
  useColorModeValue,
  NativeBaseProvider,
} from "native-base"

import axios from 'axios';
import RazorpayCheckout from 'react-native-razorpay';
import { RazorpayApiKey } from './config';

export default function App() {
  const [amount ,setAmount] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  // const onComponentMount = async () => {
  //   const { data } = await axios.get(
  //     `https://fakestoreapi.com/products/${Math.floor(Math.random() * 20)}`,
  //   );
  //   data.price = Math.ceil(data.price) * 100;
  //   setProduct(data);
  // };

  // useEffect(() => {
  //   onComponentMount();
  // }, []);

  const createOrder = async () => {
    const { data } = await axios.post(
      'https://razorpay-project.herokuapp.com/createOrder',
      {
        amount: parseInt(amount) * 100,
        currency: 'INR',
      },
    );
    return data;
  };

  const verifyPayment = async (orderID, transaction) => {
    const { data } = await axios.post(
      'https://razorpay-project.herokuapp.com/verifySignature',
      {
        orderID: orderID,
        transaction: transaction,
      },
    );
    return data.validSignature;
  };

  const onPay = async () => {
    console.log('OnPay');
    setPaymentProcessing(true);
    const order = await createOrder();
    var options = {
      name: "Donation",
      // image: product.image,
      description: "Thank You For Donating!",
      order_id: order.id,
      key: RazorpayApiKey,
      prefill: {
        email: 'useremail@example.com',
        contact: '9191919191',
        name: 'Pratik Jain',
      },
      theme: { color: '#a29bfe' },
    };
    RazorpayCheckout.open(options)
      .then(async (transaction) => {
        const validSignature = await verifyPayment(order.id, transaction);
        alert('Is Valid Payment: ' + validSignature);
      })
      .catch(console.log);
    setPaymentProcessing(false);
  };


  return (
    <NativeBaseProvider>
      <View style={styles.screen}>
        <Text style={styles.heading}>Enter Donation Amount in Rs</Text>
        <Input

            variant="rounded"
            placeholder="Enter Amount"
            placeholderTextColor={useColorModeValue("blueGray.400", "gray.50")}
            value={amount}
            onChangeText={val => setAmount(val)}
            type ="number"
            keyboardType='numeric'
            />
        <TouchableOpacity style={styles.button} onPress={onPay}>
          {paymentProcessing ? (
            <ActivityIndicator color="white" size={30} />
            ) : (
              <Text style={styles.buttonText}>Donate ₹{amount}</Text>
              )}
        </TouchableOpacity>
      </View>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    marginTop: 300,
    fontSize: 28,
    color: '#a29bfe',
    marginBottom : 20,
  },
  title: {
    marginTop: 30,
    fontSize: 22,
    textAlign: 'center',
    width: '80%',
    color: '#a29bfe',
  },
  button: {
    width: '80%',
    backgroundColor: '#a29bfe',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 50,
    // position: 'relive',
    // bottom: 220,
    marginBottom: 50,
    marginTop : 30
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
  },
});
