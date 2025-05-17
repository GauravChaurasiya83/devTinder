const mongoose = require("mongoose")

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://NamsteNode:AkUdFOetg83i8PIW@namastenode.wxze5pg.mongodb.net/devTinder")
}

module.exports = {connectDB}



