import mongoose from 'mongoose';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    throw new Error('Defina a variável DATABASE_URL no arquivo .env.local');
}

const connectMongo = async () => {
    try {
        await mongoose.connect(DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Conectado ao MongoDB');
    } catch (error) {
        console.error('Erro ao conectar ao MongoDB', error);
    }
};

export default connectMongo;
