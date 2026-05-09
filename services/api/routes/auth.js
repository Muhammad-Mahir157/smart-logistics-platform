const router = require("express").Router();
// const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');

//REGISTER

const bcrypt = require("bcrypt");
const Admin = require("../models/AdminUser");
const Shipper = require("../models/ShipperUser");
const Driver = require("../models/DriverUser");

const ShipmentNormal = require('../models/ShipmentNormal');
const ShipmentShared = require('../models/ShipmentShared');
const CompletedNormal = require('../models/CompletedNormal');
const CompletedShared = require('../models/CompletedShared');

router.post("/shipper/register", async (req, res) => {
  try {
    const { fullName, emailAddress, password, role } = req.body;

    // console.log(req.body);

    // Check if email already exists
    let user;
    if (role === "admin") {
      user = await Admin.findOne({ emailAddress });
    } else if (role === "shipper") {
      user = await Shipper.findOne({ emailAddress });
    } else if (role === "driver") {
      user = await Driver.findOne({ emailAddress });
    }

    if (user) {
      return res
        .status(400)
        .json({ message: "Email address is already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user based on role
    let newUser;
    if (role === "admin") {
      newUser = new Admin({
        fullName,
        emailAddress,
        password: hashedPassword,
      });
    } else if (role === "shipper") {
      newUser = new Shipper({
        fullName,
        emailAddress,
        password: hashedPassword,
      });
    } else if (role === "driver") {
      const { vehicle, vehicleCC, vehicleRegistration } = req.body;
      newUser = new Driver({
        fullName,
        emailAddress,
        password: hashedPassword,
        vehicle,
        vehicleCC,
        vehicleRegistration,
      });
    }

    // Save the new user to the database
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/driver/register", async (req, res) => {
  try {
    const { fullName, emailAddress, password, vehicle, vehicleCC, vehicleRegistration } = req.body;

    // console.log(req.body);

    // Check if email already exists
    let user;
    
    user = await Driver.findOne({ emailAddress });
    
    if (user) {
      return res
        .status(400)
        .json({ message: "Email address is already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    newUser = new Driver({
      fullName,
      emailAddress,
      password: hashedPassword,
      vehicle,
      vehicleCC,
      vehicleRegistration,
    });

    // Save the new user to the database
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// old sign up

// router.post("/signup", async (req, res) => {
//   try {
//     const { fullName, emailAddress, password, role } = req.body;

//     // console.log(req.body);

//     // Check if email already exists
//     let user;
//     if (role === "admin") {
//       user = await Admin.findOne({ emailAddress });
//     } else if (role === "shipper") {
//       user = await Shipper.findOne({ emailAddress });
//     } else if (role === "driver") {
//       user = await Driver.findOne({ emailAddress });
//     }

//     if (user) {
//       return res
//         .status(400)
//         .json({ message: "Email address is already registered" });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create user based on role
//     let newUser;
//     if (role === "admin") {
//       newUser = new Admin({
//         fullName,
//         emailAddress,
//         password: hashedPassword,
//       });
//     } else if (role === "shipper") {
//       newUser = new Shipper({
//         fullName,
//         emailAddress,
//         password: hashedPassword,
//       });
//     } else if (role === "driver") {
//       const { vehicle, vehicleCC, vehicleRegistration } = req.body;
//       newUser = new Driver({
//         fullName,
//         emailAddress,
//         password: hashedPassword,
//         vehicle,
//         vehicleCC,
//         vehicleRegistration,
//       });
//     }

//     // Save the new user to the database
//     await newUser.save();

//     res.status(201).json({ message: "User created successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

/*
//REGISTER
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with that email or username already exists." });
    }

    const newUser = new User({
      username,
      email,
      password: CryptoJS.AES.encrypt(password, process.env.PASS_SEC).toString(),
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});
*/

// login

router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    console.log(req.body);
    let user;
    switch (role) {
      case "shipper":
        user = await Shipper.findOne({ emailAddress: email });
        break;
      case "driver":
        user = await Driver.findOne({ emailAddress: email });
        break;
      case "admin":
        user = await Admin.findOne({ emailAddress: email });
        break;
      default:
        return res.status(400).json({ message: "Invalid role provided" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SEC, {
      expiresIn: "1h",
    });

    console.log("auth -> Token", token);
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});


router.post("/driver/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(req.body);
    let user = await Driver.findOne({ emailAddress: email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, role: "driver" }, process.env.JWT_SEC, {
      expiresIn: "1h",
    });

    console.log("auth -> Token", token);
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

//LOGIN
/*
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.body.username,
    });

    if (!user) {
      return res.status(401).json("Wrong User Name");
    }

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );

    const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    const inputPassword = req.body.password;

    if (originalPassword !== inputPassword) {
      return res.status(401).json("Wrong Password");
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: "3d" }
    );

    const { password, ...others } = user._doc;
    res.status(200).json({ ...others, accessToken });
  } catch (err) {
    res.status(500).json(err);
  }
});
*/

router.get("/getUser", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  console.log(token);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Here, you can use your preferred way to verify the token and get the user information
  // For example, using a JWT library like jsonwebtoken
  try {
    const decoded = jwt.verify(token, process.env.JWT_SEC);
    let user;

    console.log(decoded.role);
    console.log(decoded.id);

    if (decoded.role === "admin") {
      user = await Admin.findById(decoded.id).lean(); // fetch admin data from database
    } else if (decoded.role === "shipper") {
      user = await Shipper.findById(decoded.id).lean(); // fetch shipper data from database
    } else if (decoded.role === "driver") {
      user = await Driver.findById(decoded.id).lean(); // fetch driver data from database
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Unauthorized" });
  }
});


router.get('/driverStats', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SEC);
    const driverId = decoded.id;

    const sharedActiveCount = await ShipmentShared.countDocuments({ driver_id: driverId, status: 'Active' });
    const sharedInProgressCount = await ShipmentShared.countDocuments({ driver_id: driverId, status: 'In Progress' });
    const sharedPendingPaymentCount = await ShipmentShared.countDocuments({ driver_id: driverId, status: 'Payment Pending' });
    const sharedCompletedCount = await CompletedShared.countDocuments({ driver_id: driverId, status: 'Completed' });
    const normalActiveCount = await ShipmentNormal.countDocuments({ driver_id: driverId, status: 'Active' });
    const normalInProgressCount = await ShipmentNormal.countDocuments({ driver_id: driverId, status: 'In Progress' });
    const normalPendingPaymentCount = await ShipmentNormal.countDocuments({ driver_id: driverId, status: 'Payment Pending' });
    const normalCompletedCount = await CompletedNormal.countDocuments({ driver_id: driverId, status: 'Completed' });
    const shipmentCompletedCount = sharedCompletedCount + normalCompletedCount;
    // Calculate total earning based on the completed shipments
    const totalEarningNormal = await CompletedNormal.aggregate([
      {
        $match: { driver_id: new mongoose.Types.ObjectId(driverId) }
      },
      {
        $group: {
          _id: null,
          totalEarning: { $sum: '$price' }
        }
      }
    ]);

    const totalEarningShared = await CompletedShared.aggregate([
      {
        $match: { driver_id: new mongoose.Types.ObjectId(driverId) }
      },
      {
        $group: {
          _id: null,
          totalEarning: { $sum: '$price' }
        }
      }
    ]);

    console.log(totalEarningNormal[0]);

    const totalEarning = (totalEarningNormal[0]?.totalEarning || 0) + (totalEarningShared[0]?.totalEarning || 0);

    const countData = {
      shipmentCompleted: shipmentCompletedCount,
      sharedActive: sharedActiveCount,
      sharedInProgress: sharedInProgressCount,
      sharedPendingPayment: sharedPendingPaymentCount,
      sharedCompleted: sharedCompletedCount,
      normalActive: normalActiveCount,
      normalInProgress: normalInProgressCount,
      normalPendingPayment: normalPendingPaymentCount,
      normalCompleted: normalCompletedCount,
      totalEarning: totalEarning
    };

    res.status(200).json(countData);
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Unauthorized' });
  }
});


module.exports = router;
