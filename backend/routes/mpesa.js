// routes/mpesa_stk.js
// --------------------------------------
// 💰 M-Pesa STK Push Route (Daraja Sandbox)
// --------------------------------------

const express = require("express");
const axios = require("axios");
const router = express.Router();

// 🔑 Credentials (from Safaricom Developer Portal)
const consumerKey = "AY0lso7icTtw8p3b7BW1sBYw3Ky3BC1yCFdYsYMRDMOmnUuc";
const consumerSecret = "W34pFwqid0vwqHGL8RoyX3ZlGZvIAjcCySU8utmPMANcltdZw3beKuPl2xQz70gC";
const shortcode = "3560653"; // Lipa Na M-Pesa sandbox shortcode
const passkey = "e0dcd9d6a9dae8f52d1262008d1bfbaa65c945ac0dd3ed55fc92095a9c972881";

// 🟢 Step 1: Get Access Token
async function getAccessToken() {
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");
  const response = await axios.get(
    "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    { headers: { Authorization: `Basic ${auth}` } }
  );
  return response.data.access_token;
}

// 🟢 Step 2: Handle STK Push request
router.post("/stkpush", async (req, res) => {
  const { phone, amount } = req.body;

  try {
    const timestamp = new Date().toISOString().replace(/[-:T.]/g, "").slice(0, 14);
    const password = Buffer.from(
      shortcode + passkey + timestamp
    ).toString("base64");

    // Get token
    const token = await getAccessToken();

    // Prepare M-Pesa STK Push payload
    const payload = {
      BusinessShortCode: 3560653,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerBuyGoodsOnline",
      Amount: amount,
      PartyA: phone,
      PartyB: 6444134,
      PhoneNumber: phone,
      CallBackURL: "https://darajapayment.onrender.com/api/callback",
      AccountReference: "Innovex Shop",
      TransactionDesc: "E-commerce payment",
    };

    // Send request to M-Pesa API
    const response = await axios.post(
      "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("STK Push Error:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Failed to send STK Push" });
  }
});

module.exports = router;