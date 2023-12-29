const { getState, getDistrict,addParking, getAllParking, SearchParking, deleteParking, getParking, getuserParking, updateParking, addParkingRequest, getuserParkingRequest } =  require("../controller/parking-controller.js");

const express = require("express");
const Auth = require("../middleware/auth.js");

const Router = express.Router();

Router.route('/state').post(getState);

Router.route('/district').post(getDistrict);

//secure route
//login required

Router.post('/add',Auth,addParking);

Router.put('/update',Auth,updateParking);

Router.get('/get-parking',Auth,getuserParking);

Router.get('/get-all-parking',Auth,getAllParking);

Router.get('/get-single-parking',Auth,getParking);

Router.delete('/delete',Auth,deleteParking);


//search aprking area
Router.get('/search',Auth,SearchParking);


//add parking request
Router.post('/add-parking-request',Auth,addParkingRequest);

//users parking
Router.get('/get-users-parking-req',Auth,getuserParkingRequest);


module.exports = Router;