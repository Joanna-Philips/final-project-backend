import mongooseConnection from "../../database/mongoose";

const EquipmentSchema = new mongooseConnection.Schema({
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
  
  const Equipment = mongooseConnection.model("Equipment", EquipmentSchema);

  export default Equipment;