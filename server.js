import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import crypto from "crypto";
import bcrypt from "bcrypt";

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/final-project";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. 
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

//Defining routes here
app.get("/", (req, res) => {
  res.send({
    message: "Welcome to the Adventure Game API made by Leo Thunell and Joanna Philips",
    routes:[{
      "/Login": "handles login function for a user/account",
      "/register": "handles registration of a new user/account",
      "/thoughts": "handles data that require authentication to access"
    }]
  });
});

// const { Schema } = mongoose;

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  accessToken: {
    type: String,
    default: () => crypto.randomBytes(128).toString("hex")
  },
  userCoins: {
    type: Number,
    default: 100
  },
  userWeapons:{
    type: Array,
  },
  userAccessories:{
    type: Array
  }
});

const User = mongoose.model("User", UserSchema);

/// Registration
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const usernameRegex = /^[a-zA-Z0-9.\-_]+$/;
  
  if (!usernameRegex.test(username)) {
    res.status(401).json({
      success: false,
      response: "Username cannot contain special characters or spaces"
    });
    return;
  }
  
try {
    const salt = bcrypt.genSaltSync();
    const newUser = await new User({
      username: username,
      password: bcrypt.hashSync(password, salt)
    }).save();
    res.status(201).json({
      success: true,
      response: {
        username: newUser.username,
        id: newUser._id,
        accessToken: newUser.accessToken
      }
    })
  }
 
 catch (e) {
    res.status(400).json({
      success: false,
      response: "Username taken, try another one"
    })
  }
})

// Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

    // Handle regular user login
    try {
      const user = await User.findOne({ username: username });
      if (user && bcrypt.compareSync(password, user.password)) {
        res.status(200).json({
          success: true,
          response: {
            username: user.username,
            id: user._id,
            accessToken: user.accessToken,
          },
        });
      } else {
        res.status(400).json({
          success: false,
          response: "Credentials do not match",
        });
      }
    } catch (e) {
      res.status(500).json({
        success: false,
        response: e,
      });
    }
  }
);

// guest login
app.post("/login/guest", async (req, res) => {
  const guestUser = await User.findOne({ username: "guest" });
  if (guestUser) {
    res.status(200).json({
      success: true,
      response: {
        username: guestUser.username,
        id: guestUser._id,
        accessToken: guestUser.accessToken,
      },
    });
  } else {
    res.status(400).json({
      success: false,
      response: "Guest login failed",
    });
  }
});

//// Equipment
const EquipmentSchema = new mongoose.Schema({
  id: {
    type: Number
  },
  name: {
    type: String
  },
  category: {
    type: String
  },
  img_src: {
    type: String
  },
  damage: {
    type: Number
  },
  cost: {
    type: Number
  },
  sell: {
    type: Number
  },
  description: {
    type: String
  }
});

const Equipment = mongoose.model("Equipment", EquipmentSchema);

// Authenticate the user
const authenticateUser = async (req, res, next) => {
  const accessToken = req.header("Authorization");
  try {
    const user = await User.findOne({accessToken: accessToken});
    if (user) {
      next();
    } else {
      res.status(401).json({
        success: false,
        response: "Please log in"
      })
    }
  } catch (e) {
    res.status(500).json({
      success: false,
      response: e
    });
  }
}

app.get("/equipments",authenticateUser);
app.get("/equipments", async (req, res) => {
  const accessToken = req.header("Authorization");
  const user = await User.findOne({accessToken: accessToken});
  const equipments = await Equipment.find({user: user._id})
  res.status(200).json({success: true, response: equipments})
});

app.post("/equipments",authenticateUser);
app.post("/equipments", async (req, res) => {
  const { newEquipment } = req.body;
  const accessToken = req.header("Authorization");
  const user = await User.findOne({accessToken: accessToken});
  const createdEquipment = await new Equipment({newEquipment: newEquipment}).save();
  res.status(200).json({success: true, response: createdEquipment})
});

//// Adventure
const AdventureSchema = new mongoose.Schema({
  id: {
    type: Number
  },
  description: {
    type: String
  },
  difficulty: {
    type: Number
  },
  img_src: {
    type: String
  }
});

const Adventure = mongoose.model("Adventure", AdventureSchema);

app.get("/adventures",authenticateUser);
app.get("/adventures", async (req, res) => {
  const accessToken = req.header("Authorization");
  const user = await User.findOne({accessToken: accessToken});
  const adventures = await Adventure.find({user: user._id})
  res.status(200).json({success: true, response: adventures})
});

app.post("/adventures",authenticateUser);
app.post("/adventures", async (req, res) => {
  const { newAdventure } = req.body;
  const accessToken = req.header("Authorization");
  const user = await User.findOne({accessToken: accessToken});
  const createdAdventure = await new Adventure({ newAdventure: newAdventure }).save();
  res.status(200).json({success: true, response: createdAdventure})
});
// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
