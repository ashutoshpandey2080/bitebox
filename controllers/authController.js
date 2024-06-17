import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "./../helpers/authHelper.js";
import JWT from "jsonwebtoken";
import orderModel from "../models/orderModel.js";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;
    // Validations
    if (!name) {
      return res.send({ Message: "Name is Required" });
    }
    if (!email) {
      return res.send({ Message: "Email is Required" });
    }
    if (!password) {
      return res.send({ Message: "Password is Required" });
    }
    if (!phone) {
      return res.send({ Message: "Phone no is Required" });
    }
    if (!address) {
      return res.send({ Message: "Table is Required" });
    }
    if (!answer) {
      return res.send({ Message: "Answer is Required" });
    }
    // Check user
    const exisitingUser = await userModel.findOne({ email });
    // Existing user
    if (exisitingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Register please login",
      });
    }
    // Register user
    const hashedPassword = await hashPassword(password);
    // Save
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      answer,
      password: hashedPassword,
    }).save();

    res.status(201).send({
      success: true,
      message: "User Register Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Registration",
      error,
    });
  }
};

// POST LOGIN
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    // Check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }
    // Token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

// Forgot password
export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      return res.status(404).send({
        success: false,
        message: "Email is required",
      });
    }

    if (!answer) {
      return res.status(404).send({
        success: false,
        message: "Answer is required",
      });
    }

    if (!newPassword) {
      return res.status(404).send({
        success: false,
        message: "New password is required",
      });
    }
    // Check
    const user = await userModel.findOne({ email, answer });
    // Validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or answer",
      });
    }

    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in forgot password",
      error,
    });
  }
};

// Test controller
export const testController = (req, res) => {
  try {
    res.send("Protected Routes");
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};

export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await userModel.findById(req.user._id);
    // Password
    if (password && password.length < 6) {
      return res.json({ error: "Password is required or the length of password should be at least six characters" });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated Successfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error While Updating profile",
      error,
    });
  }
};

export const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name address phone");
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Getting Orders",
      error,
    });
  }
};

// Get all orders
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name address phone");
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Getting Orders",
      error,
    });
  }
};

// Order status
export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Updating Order",
      error,
    });
  }
};

// Get all users
export const getAllUsersController = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.status(200).send({
      success: true,
      users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Getting Users",
      error,
    });
  }
};
//delete a user
export const deleteUserController = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if the user exists
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    
    await userModel.findByIdAndDelete(userId);

    res.status(200).send({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting user",
      error,
    });
  }
};

// Delete order
export const deleteOrderController = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Check if the order exists
    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).send({
        success: false,
        message: "Order not found",
      });
    }

    // Delete the order
    await orderModel.findByIdAndDelete(orderId);

    res.status(200).send({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting order",
      error,
    });
  }
};
