import express from "express";
import { 
   registerController, 
   loginController, 
   testController, 
   forgotPasswordController, 
   updateProfileController, 
   getAllOrdersController, 
   orderStatusController, 
   getOrdersController, 
   getAllUsersController ,
   deleteUserController,
   deleteOrderController
} from "../controllers/authController.js";
import { isAdmin, requireSIgnIn } from "../middlewares/authMIddleware.js";

// Router object
const router = express.Router();

// Routing
router.post("/register", registerController);

// Login
router.post("/login", loginController);

// Test routes
router.get('/test', requireSIgnIn, isAdmin, testController);

// Forgot password || post
router.post('/forgot-password', forgotPasswordController);

// Protected route
router.get('/user-auth', requireSIgnIn, (req, res) => {
   res.status(200).send({ ok: true });
});

// Protected route for admin
router.get('/admin-auth', requireSIgnIn, isAdmin, (req, res) => {
   res.status(200).send({ ok: true });
});

// Update profile
router.put('/profile', requireSIgnIn, updateProfileController);

// Orders
router.get("/orders", requireSIgnIn, getOrdersController);

// All orders
router.get('/all-orders', requireSIgnIn, isAdmin, getAllOrdersController);

// Order status update
router.put("/order-status/:orderId", requireSIgnIn, isAdmin, orderStatusController);

// Get all users
router.get('/all-users', requireSIgnIn, isAdmin, getAllUsersController);
//delete a user
router.delete('/delete-user/:userId', requireSIgnIn, isAdmin, deleteUserController);
//delete an order
router.delete('/delete-order/:orderId', requireSIgnIn, isAdmin, deleteOrderController);  // New delete order route


export default router;