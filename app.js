const express= require('express');
const bodyParser= require('body-parser');
const ejs=require('ejs');
const app=express();
const DB= require(__dirname+'/DB.js');
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');

DB.connect('mongodb://127.0.0.1:27017/userDB');

app.get('/',(req,res)=>{
    res.render("home");
});
app.get('/login',(req,res)=>{
    res.render("login");
});
app.post('/login',(req,res)=>{
    (async()=>{
        const user=await DB.find({email:req.body.username, password: req.body.password});
        // console.log(user);
        if (user.length) res.render('secrets');
    })();
});
app.get('/register',(req,res)=>{
    res.render("register");
});
app.post('/register',(req,res)=>{
    (async ()=>{
        await DB.insert({email:req.body.username, password: req.body.password});
        res.render('secrets');
    })();
});
app.listen(3000,()=>{
console.log('Server is Running on port 3000');
});