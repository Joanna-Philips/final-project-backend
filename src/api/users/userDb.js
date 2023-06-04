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
      type: Array,
      default: async function () {
        const Weapon = mongooseConnection.model("Equipment", EquipmentSchema);
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
  
  const User = mongooseConnection.model("User", UserSchema);
  
  export default User;