const mongoose=require('mongoose');
const { Schema } = mongoose;

//we are declaring here that user is an objectId of another 
//mongoose schema model (concept is like foreign key in sql).Here user is a field which stores user Id of User schema. 
const noteSchema = new Schema({
    user:{type:mongoose.Schema.Types.ObjectId, ref:"user"},
    title: { type:String , required:true },
    description: { type:String , required:true },
    tag: { type:String, default: "General"},
    date:{type:Date, default: Date.now}
});

module.exports=mongoose.model('note',noteSchema);