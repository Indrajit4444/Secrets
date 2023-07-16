const mongoose = require('mongoose');
const encrypt=  require('mongoose-encryption');
const itemSchema= new mongoose.Schema({
    email:{
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }});
itemSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

let Item=new mongoose.model('User',itemSchema);
exports.connect= async (url)=>{
   await mongoose.connect(url);
}
exports.insert= async (item, collectionName)=>{
   const newitem = new Item (item);
   await newitem.save();
}
exports.find= async (element)=>{
   let item;
   if (element===undefined)
      item=await Item.findOne();
   else item=await Item.find(element);
   // console.log(items);
   return item;
}