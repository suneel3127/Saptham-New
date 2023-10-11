const functions = require("firebase-functions");
var express = require("express");
var cors = require("cors");
var request = require("request");
const crypto = require("crypto");
const key = "rzp_test_LvDhgEzFCyXLjW";
const key_secret = "0ivJxt9qHelN5nRvef4tkRa1";

var app = express();

app.use(cors({ origin: true }));

app.post("/", (req, res) => {
  const amount = req.body.amount;

  //Allow Api Calls from local server
  const allowedOrigins = [
    "https://exp.host/@suneel3127/Saptham",
    // "http://127.0.0.1:8080",
    // "http://localhost:8080",
    // "https://-------YourFirebaseApp-----.firebaseapp.com/"
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.indexOf(origin) > -1) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  var options = {
    method: "POST",
    url: "https://api.razorpay.com/v1/orders",
    headers: {
      Authorization: `Basic ${Buffer.from(`${key}:${key_secret}`).toString("base64")}`,
    },
    form: {
      amount: amount,
      currency: "INR",
    }
  };

  request(options, function (error, response, body) {
    if (error) {
      console.error("Error creating Razorpay order:", error);
      res.status(500).send("Error creating Razorpay order");
    } else {
      console.log(response)
      console.log(body)
      res.send(body);
    }
  });
});

app.post("/confirmPayment", (req, res) => {
  const order = req.body;
  const text = order.razorpay_order_id + "|" + order.razorpay_payment_id;
  var signature = crypto
    .createHmac("sha256", key_secret)
    .update(text)
    .digest("hex");

  if (signature === order.razorpay_signature) {
    console.log("PAYMENT SUCCESSFULL");

    res.send("PAYMENT SUCCESSFULL");
  } else {
    res.send("something went wrong!");
    res.end();
  }
});

exports.paymentApi = functions.https.onRequest(app);