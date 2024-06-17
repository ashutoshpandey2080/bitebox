    import mongoose from "mongoose";

    const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    discount: {
        type: Number,
        required: true,
    },
    valid: {
        type: Boolean,
        default: true,
    },
    
    });

    export default mongoose.model("Coupon", couponSchema);