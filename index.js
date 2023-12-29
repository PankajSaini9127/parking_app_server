
const cors = require("cors");
const express = require("express")
const app = express();

const PORT = process.env.PORT || 8080;
 
app.use(cors());

app.use(express.json());

app.get('/',(req,res)=>{

    res.send("Parking Management App Server is Runing");
    res.end();
});

app.use('/auth',require('./routes/auth-route.js'));


app.use('/parking',require('./routes/parking-route.js'))

app.use('/vehicle',require('./routes/vehicle-route.js'));


app.listen(PORT,()=>{
    console.log(`Server in listen on Port No: ${PORT}`)
})