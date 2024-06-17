    import couponModel from "../models/couponModel.js";
    

    // Create Coupon
    export const createCouponController = async (req, res) => {
    try {
        const { code, discount,valid } = req.body;

        // Validations
        if (!code || !discount) {
        return res.status(400).send({
            success: false,
            message: "All fields are required",
        });
        }

        // Check if coupon already exists
        const existingCoupon = await couponModel.findOne({ code });
        if (existingCoupon) {
        return res.status(400).send({
            success: false,
            message: "Coupon code already exists",
        });
        }

        // Create and save coupon
        const coupon = new couponModel({
        code,
        discount,
        valid,
        
        });
        await coupon.save();

        res.status(201).send({
        success: true,
        message: "Coupon created successfully",
        coupon,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
        success: false,
        message: "Error creating coupon",
        error,
        });
    }
    };

    // Update Coupon
    export const updateCouponController = async (req, res) => {
    try {
        const { couponId } = req.params;
        const { code, discount, expirationDate, valid } = req.body;

        // Find and update coupon
        const coupon = await couponModel.findByIdAndUpdate(
        couponId,
        { code, discount, expirationDate, valid },
        { new: true }
        );

        if (!coupon) {
        return res.status(404).send({
            success: false,
            message: "Coupon not found",
        });
        }

        res.status(200).send({
        success: true,
        message: "Coupon updated successfully",
        coupon,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
        success: false,
        message: "Error updating coupon",
        error,
        });
    }
    };

    // Delete Coupon
    export const deleteCouponController = async (req, res) => {
    try {
        const { couponId } = req.params;

        // Find and delete coupon
        const coupon = await couponModel.findByIdAndDelete(couponId);

        if (!coupon) {
        return res.status(404).send({
            success: false,
            message: "Coupon not found",
        });
        }

        res.status(200).send({
        success: true,
        message: "Coupon deleted successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
        success: false,
        message: "Error deleting coupon",
        error,
        });
    }
    };

    // Get All Coupons
    export const getAllCouponsController = async (req, res) => {
    try {
        const coupons = await couponModel.find({});
        res.status(200).send({
        success: true,
        coupons,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
        success: false,
        message: "Error fetching coupons",
        error,
        });
    }
    };
    export const applyCouponController = async (req, res) => {
        const { code, total } = req.body;
    
        try {
        const coupon = await couponModel.findOne({ code });
    
        if (!coupon || !coupon.valid  ) {
            return res.status(400).send({
            success: false,
            message: "Invalid or expired coupon",
            });
        }
    
        const discountAmount = (total * coupon.discount) / 100;
        const discountedTotal = total - discountAmount;
    
        res.status(200).send({
            success: true,
            discountAmount,
            discountedTotal,
        });
        } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error applying coupon",
            error,
        });
        }
    };