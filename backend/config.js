import dotenv from 'dotenv';

dotenv.config();

export const PORT = 5000;

// const mongo = mongodb+srv://rexexpert:<password>@cluster0.znaasyl.mongodb.net/?retryWrites=true&w=majority;

// const mongo1 = 'mongodb+srv://rexexpert:<password>@cluster0.znaasyl.mongodb.net/';

export const mongo_uri = process.env.mongo;

