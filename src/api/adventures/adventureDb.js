import mongooseConnection from "../../database/mongoose";

const AdventureSchema = new mongooseConnection.Schema({
    description: {
      type: String
    },
    difficulty: {
      type: Number
    },
    img_src: {
      type: String
    },
    rewardCoins: {
      type: Number
    },
    fail: {
      type: String
    }
  });
  
  const Adventure = mongooseConnection.model("Adventure", AdventureSchema);

  export default Adventure;