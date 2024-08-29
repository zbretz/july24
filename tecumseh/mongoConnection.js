const dotenv = require('dotenv')
dotenv.config()
const { MongoClient } = require("mongodb");

let user = process.env.MONGO_USER
let pass = process.env.MONGO_PASS

const uri = `mongodb+srv://${user}:${pass}@rideshare.uulxsfp.mongodb.net/`; // "mongodb+srv://zach:zach@rideshare.uulxsfp.mongodb.net/?retryWrites=true&w=majority";

// const client = new MongoClient(uri);
const client9100 = new MongoClient(uri);

// testing
const db_test = client9100.db('RideshareRefactoredTesting');

// prod
const db_prod = client9100.db('v6');

// locals testing
const db_locals = client9100.db('PartnersTesting');


module.exports = {
    db__: db_test,//db_prod,//
    db_locals: db_locals,
}
