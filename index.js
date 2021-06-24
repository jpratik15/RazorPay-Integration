const express = require("express");
const crypto = require("crypto");
const Razorpay = require("razorpay");

const app = express();
app.use(express.json());

const razorpay = new Razorpay({
  key_id: "rzp_test_Rug4ohoVw64p97",
  key_secret: "IfGMUF41sM3xGjIZpPIY5z8t",
});

app.get("/", (req, res) => res.send("Razorpay Server"));

app.post("/createOrder", async (req, res) => {
  console.log(req.body);
  try {
    const order = await razorpay.orders.create({
      amount: req.body.amount,
      currency: "INR",
    });
    res.send(order);
  } catch (error) {
    res.send(error);
  }
});

app.post("/verifySignature", (req, res) => {
  const { orderID, transaction } = req.body;

  const generatedSignature = crypto
    .createHmac("sha256", "IfGMUF41sM3xGjIZpPIY5z8t")
    .update(`${orderID}|${transaction.razorpay_payment_id}`)
    .digest("hex");

  res.send({ validSignature: generatedSignature === transaction.razorpay_signature });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Razorpay Server listening at Port ${port}`));
