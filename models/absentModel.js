const mongoose =  require("mongoose");
const absentSchema = new mongoose.Schema({
    empno:{type:String, required:true},
    date:{
        type:String, 
        required:true,
        // validate:{
        //     validator:function(value){
        //         const date = new Date(value);
        //         const day = date.getDay();
        //         return day !== 0 &&  day !== 6;
        //     },
        //     message: "unable to insert saturday and sunday for absent"
        // }
    },
    campus: {type:String, required:true},
});
absentSchema.index({empno:1,date:1}, {unique:true});

module.exports = mongoose.model("absent", absentSchema);