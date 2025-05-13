const mongoose = require("mongoose")

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://NamsteNode:Ymz9HzBBSKZitfuY@namastenode.wxze5pg.mongodb.net/devTinder")
}

module.exports = {connectDB}



