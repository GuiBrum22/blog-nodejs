import mongoose from 'mongoose';

const connectMongo = async () => {
    if (mongoose.connection.readyState >= 1) return;
    mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
};

export default connectMongo;
