const express = require('express');
const app = express();
const helmet = require('helmet');
const dotenv = require('dotenv');
const bodyparser = require('body-parser');
const mongoose  = require('mongoose');

//Import Routes
const authRoute = require('./routes/auth');
const drugRoute = require('./routes/drugs')


dotenv.config();



//Conect to DB
mongoose.Promise  = global.Promise
mongoose.connect(process.env.DB_CONNECT ,{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>{
    console.log("CONNECTION TO DATABASE SUCCESFULLY");  
})
.catch((err)=>console.log("Cant coneect to"+err)
)

//Middlewares
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());
app.use(helmet());

//CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY,autorization, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});



//Route Defines
app.use('/API/user/',authRoute);
app.use('/API/drug/',drugRoute);

app.listen(3000,()=>console.log("Server up and running"));
