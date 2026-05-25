const express = require("express");
const router = express.Router();
const {
  getPincodeDetails,
  getWeatherByPincode,
  getMarketPrices,
  getCompleteLocationInfo,
  getPincodeByCoordinates
} = require("../controllers/locationController");

router.get("/pincode/:pincode", getPincodeDetails);
router.get("/weather/:pincode", getWeatherByPincode);
router.get("/market/:pincode", getMarketPrices);
router.get("/complete/:pincode", getCompleteLocationInfo);
router.get("/reverse", getPincodeByCoordinates);

module.exports = router;