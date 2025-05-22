const dotenv = require('dotenv')
dotenv.config()
const { MongoClient } = require("mongodb");

let user = process.env.MONGO_USER
let pass = process.env.MONGO_PASS

const uri = `mongodb+srv://${user}:${pass}@rideshare.uulxsfp.mongodb.net/`; // "mongodb+srv://zach:zach@rideshare.uulxsfp.mongodb.net/?retryWrites=true&w=majority";

// const client = new MongoClient(uri);
const client9100 = new MongoClient(uri);



// prod
const db_prod = client9100.db('v6');
// locals prod
const db_locals = client9100.db('Partners');
// childcare prod
const db_childcare = client9100.db('Childcare');

// testing
const db_test = client9100.db('v6Testing');
// locals testing
const db_locals_test = client9100.db('PartnersTesting');


module.exports = {
    db__: db_prod,//test,
    db_locals: db_locals,
    db_childcare: db_childcare,
    uri: uri
}
