import mongoose from "mongoose";

const dataBase = async () => {
    await mongoose.connect(process.env.MONGODB_URL).then(() => {
        console.log("Data base is connected");
    })
}

export default dataBase