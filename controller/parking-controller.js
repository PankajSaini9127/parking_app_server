const db = require("../connection/conn");


async function getState(req,res){
    try {
        let {name} = req.query;
       const response = await db('states').select("*").whereILike("name", `%${name}%`)
       .limit(10);

       if(response){
        return res.send({message:"state fetched",data:response,status:200})
       }

    } catch (error) {
        console.log(error);
        return res.status(500).send({message:"Something Went Wrong !"});
      
    }
};

async function getDistrict(req,res){
    try {
        let {id} = req.query;
       const response = await db('cities').select("*").where("state_id", id);
       if(response){
        return res.send({message:"state fetched",data:response,status:200})
       }

    } catch (error) {
        console.log(error);
        return res.status(500).send({message:"Something Went Wrong !"});
      
    }
};


async function addParking(req,res){
    try {
        req.body.location = JSON.stringify(req.body.location)
        req.body.user_id = req.user.jwtPayload.id;
         const response = await db('parking').insert(req.body);
         if(response){
            return res.send({message:"Parking Added",data:response,status:200})
           }

    } catch (error) {
        console.log(error);
        return res.status(500).send({status:500,message:"Something Went Wrong !"});
    }
};

async function updateParking(req,res){
    try {
         const response = await db('parking').update(req.body).where('id',"=",req.query.id);
         if(response){
            return res.send({message:"Parking Updeted SuccessFully",data:response,status:200})
        }else{
            return res.status(203).send({message:"Something Went Wrong.",status:203})
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send({message:"Something Went Wrong !"});
    }
};

async function getuserParking(req,res){
    try {
        const response = await db('parking').select("parking.*",'us.name')
        .where('user_id','=',req.user.jwtPayload.id)
        .leftJoin('users AS us', 'us.id', 'parking.user_id');


        if(response){
            return res.send({status:200,message:"All Parking Get Sucess",data:response})
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({message:"Something Went Wrong !"});
    }
};

async function getAllParking(req,res){
    try {
        
        const response = await db('parking').select("parking.*",'us.name')
        .leftJoin('users AS us', 'us.id', 'parking.user_id');

        if(response){
            return res.send({status:200,message:"All Parking Get Sucess",data:response})
        }else{
            return res.status(404).send({status:404,message:"Something Went Wrong"})
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({status:500,message:"Something Went Wrong !"});
    }
};

async function getParking(req,res){
    try {
        const response = await db('parking').select("*")
        .where('id','=',req.query.id)


        if(response){
            return res.send({status:200,message:"Parking Get Sucessfully",data:response})
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({message:"Something Went Wrong !"});
    }
};

async function SearchParking(req,res){
    try {
        const response = await db('parking').select("parking.*",'us.name')
        .where((cb) => {
            cb.whereILike("state", `%${req.query.searchVal}%`);
            cb.orWhereILike("city", `%${req.query.searchVal}%`);
            cb.orWhereILike("address", `%${req.query.searchVal}%`);
          })
        .leftJoin('users AS us', 'us.id', 'parking.user_id')
        ;

        console.log(response)

        if(response){
            return res.send({status:200,message:"All Parking Get Sucess",data:response})
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({message:"Something Went Wrong !"});
    }
};

async function deleteParking(req,res){
    try {
        
  const response = await db('parking').where('id','=',req.query.id).del();
        if(response){
            return res.send({status:200,message:"Parking Delete Sucessfully"})
        }else{
            return res.send({status:403,message:"Something Went Wrong!"});
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({message:"Something Went Wrong !"});
    }
};


//add parking route
async function addParkingRequest(req,res){
    try {
        req.body.location = JSON.stringify(req.body.location)
        req.body.user_id = req.user.jwtPayload.id;
         const response = await db('parking_request').insert(req.body);
         if(response){
            return res.send({message:"Parking Request Sent",status:200})
           }else{
            return res.send({message:"Something Went Wrong",status:203})
           }

    } catch (error) {
        console.log(error);
        return res.status(500).send({message:"Something Went Wrong !"});
    };
}


async function getuserParkingRequest(req,res){
    try {
        let user_id =  req.user.jwtPayload.id;
        const response = await db('parking_request').select("*")
        .where('user_id','=',user_id);


        if(response){
            return res.send({status:200,message:"All Parking Request Get Sucess",data:response})
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({message:"Something Went Wrong !"});
    }
};


module.exports = {getuserParkingRequest,getState,getDistrict,addParking,getAllParking,updateParking,SearchParking,deleteParking,getParking,getuserParking,addParkingRequest}