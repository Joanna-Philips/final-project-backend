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

  module.exports = Adventure;