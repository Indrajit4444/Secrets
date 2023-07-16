const mongoose = require('mongoose');
const itemSchema= new mongoose.Schema({email: String, password: String});
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
      item=await Item.find();
   else item=await Item.find(element);
   // console.log(items);
   return item;
}