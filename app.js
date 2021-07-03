const express = require('express');
const app = express();
const cors = require('cors');

//MiddleWare
app.use(express.json());
app.use(cors());

//Getting Routes
app.use('/api/1.0', require('./Routes/Routes'));


//Server
const port = 3000
app.listen(port , ()=>{
    console.log('App is running at port :', port);
})