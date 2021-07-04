const db = require('../database/db');

class ProtectedController{
static dashboard(req,res){
    try {
        const {userid} = req.params;
        if(userid == null || userid == undefined){
            return res.status(500).json({message :'User id not found'})
        }
        db.oneOrNone(`SELECT user_name , user_email FROM "users" WHERE user_id = '${userid}'`).then((data)=>{
            if(data.user_name !== undefined && data.user_email !== undefined){
                res.status(200).json({data : data, message:'success', status :'true'});
            }
           else{
            res.status(400).json({message:'data not found', status :'false'});
           }
        }).catch(e =>{
            res.status(500).json({message:e.message, status :'false'});
        })
    } catch (error) {
        res.status(500).send(error.message ? error.message : 'Unexpected Error')
    }
    finally{
        db.end
    }
}
}

module.exports = ProtectedController;