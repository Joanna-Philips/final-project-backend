import mongooseConnection from "../../database/mongoose";
import crypto from "crypto";

const UserSchema = new mongooseConnection.Schema({
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
      type: Array
    },
    equippedWeapon:{
      type: String
    },
    userAvatar:{
      type: String
    },
    userAccessories:{
      type: Array
    }
  });
  
  const User = mongooseConnection.model("User", UserSchema);
  
  export default User;