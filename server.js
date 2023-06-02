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
    default: 0
  },
  userWeapons:{
    type: Array,
    default: async function () {
      const Weapon = mongoose.model("Equipment", EquipmentSchema);
      const firstWeapon = await Weapon.findOne().lean(); // Retrieve the first weapon object

      if (firstWeapon) {
        return [firstWeapon]; // Return the first weapon as an array
      } else {
        return []; // Return an empty array if no weapon objects are found
      }
    },
  },
  userAvatar:{
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
/*             userCoins: user.userCoins,
            userWeapons: user.userWeapons,
            userAvatar: user.userAvatar */
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

// Authenticate the user
const authenticateUser = async (req, res, next) => {
  const accessToken = req.header("Authorization");
  try {
    const user = await User.findOne({ accessToken: accessToken });
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(401).json({
        success: false,
        response: "Please log in",
      });
    }
  } catch (e) {
    res.status(500).json({
      success: false,
      response: e,
    });
  }
};

// get user profile
app.get("/user", authenticateUser);
app.get("/user", async (req, res) => {
  const accessToken = req.header("Authorization");
  try {
    const user = await User.findOne({ accessToken: accessToken });
    if (!user) {
      return res.status(404).json({ success: false, message: "User profile not found" });
    }
    res.status(200).json({ success: true, response: {
      userCoins: user.userCoins,
      userWeapons: user.userWeapons,
      userAvatar: user.userAvatar 
    }, });
  } catch (error) {
    res.status(500).json({ success: false, error: error});
  }
});

//// Equipment
const EquipmentSchema = new mongoose.Schema({
  name: {
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

app.get("/equipments", authenticateUser);
app.get("/equipments", async (req, res) => {
  try {
    const equipments = await Equipment.find();

    if (!equipments.length > 0) {
      return res.status(404).json({ success: false, message: "Equipments not found" });
    }
    
    res.status(200).json({ success: true, response: equipments });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server Error" });
  }
});

/* to post to the server user following layout:
    {
  "newEquipment": {
    "name": "Stale baguette",
    "img_src": "../assets/img/Rock.jpg",
    "damage": 1,
    "cost": 2,
    "sell": 0,
    "description": "An extremely dry baguette"
  }
}
 */

app.post("/equipments", authenticateUser);
app.post("/equipments", async (req, res) => {
 
  try {
    const { newEquipment } = req.body;
    const createdEquipment = await new Equipment(newEquipment).save();
    if (!createdEquipment) {
      return res.status(404).json({ success: false, message: "Could not create equipment" });
    }

    res.status(200).json({ success: true, response: createdEquipment });
  } catch (error) {
    console.error(error); // Log the error to the console for debugging purposes
    res.status(500).json({ success: false, error: "Server Error" });
  }
});


app.delete("/equipments/:id", authenticateUser);
app.delete("/equipments/:id", async (req, res) => {
  try {
    const equipmentId = req.params.id;
    const deletedEquipment = await Equipment.findOneAndDelete({_id: equipmentId});

    if (!deletedEquipment) {
      return res.status(404).json({ success: false, message: "Could not delete equipment" });
    }

    res.status(200).json({ success: true, response: deletedEquipment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

//// Adventure
const AdventureSchema = new mongoose.Schema({
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
  try {
    const adventures = await Adventure.find();

    if (!adventures.length > 0) {
      return res.status(404).json({ success: false, message: "Adventures not found" });
    }

    res.status(200).json({success: true, response: adventures});
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server Error" });
  }
});

app.post("/adventures",authenticateUser);
app.post("/adventures", async (req, res) => {
  try {
    const { newAdventure } = req.body;
    const createdAdventure = await new Adventure({ newAdventure: newAdventure }).save();

    if (!createdAdventure) {
      return res.status(404).json({ success: false, message: "Could not create adventure" });
    }

    res.status(200).json({success: true, response: createdAdventure});
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server Error" });
  }
});

app.delete("/adventures/:id", authenticateUser);
app.delete("/adventures/:id", async (req, res) => {
  try {
    const adventureId = req.params.id;
    const deletedAdventure = await Adventure.findOneAndDelete({_id: adventureId});

    if (!deletedAdventure) {
      return res.status(404).json({ success: false, message: "Could not delete adventure" });
    }

    res.status(200).json({ success: true, response: deletedAdventure });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
