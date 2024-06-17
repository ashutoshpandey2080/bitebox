import express from "express";
import { applyCouponController } from "../controllers/couponController.js";
import{ createCouponController,
    updateCouponController,
    deleteCouponController,
    getAllCouponsController
 } from "../controllers/couponController.js";
 import { isAdmin, requireSIgnIn } from "../middlewares/authMIddleware.js";
const router = express.Router();

// Apply coupon
router.post("/apply-coupon",  requireSIgnIn,applyCouponController);

// Create a coupon
router.post("/create-coupon", requireSIgnIn, isAdmin, createCouponController);

// Update a coupon
router.put("/update/:couponId", requireSIgnIn, isAdmin, updateCouponController);

// Delete a coupon
router.delete("/delete/:couponId", requireSIgnIn, isAdmin, deleteCouponController);

// Get all coupons
router.get("/all-coupons", requireSIgnIn, isAdmin, getAllCouponsController);

export default router;