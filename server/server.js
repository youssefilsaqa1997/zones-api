var express = require('express')
var bodyParser = require('body-parser')
const hbs = require('hbs');
const cors = require('cors')
var {User} = require('./models/users');
const jwt = require('jsonwebtoken');

var { mongoose } = require('./DB/mongoose');
var { creation } = require('./models/zone');

const port =process.env.PORT || 3000;
var app = express();
hbs.registerPartials(__dirname + '/server/views');
app.set('view engine', 'hbs');

app.use(cors())
app.use(bodyParser.json());

function checkValid(req, res, next){
    const _token = req.body['token'];
    console.log(_token);
    jwt.verify(_token, "ilsaqa", (err, verified)=>{
        console.log(err, verified);
        next();
    })
 }

app.get('/',(req, res) => {
    res.render('home.hbs');
})
app.post('/creation', (req, res) => {
    if(req.body.points.length>=3){
    var zoneCreation = new creation({
        label: req.body.label,
        color: req.body.color,
        points:req.body.points
    });
}else{
    var zoneCreation = new creation({
        label: req.body.label,
        color: req.body.color
    });
}
zoneCreation.save().then((doc) => {
    res.send(doc);
}, (e) => {
    res.status(400).send(e);
})
});

app.post('/check', checkValid, (req, res)=>{
    res.send({message: "still working"})
})

app.post('/loginToken',(req, res) => {
    if(req.body.mobile.length==11){
        User.findOne({mobile:req.body.mobile}).then((doc) => {
         if(doc.password==req.body.password){
            const token = doc.generateAuthToken();
            res.send({token});
                
         }else{
             res.status(400).send({message: "password doesn't match"});
         }
        },(e)=>{
            res.status(400).send({message:"mobile number not found"});
        })
}else {
    res.status(400).send({message:"The number less than 10"})
}
})

app.get('/fetch',(req,res)=>{
creation.find().then((zones)=>{
    console.log(zones); 
    res.send({zones});
},(e)=>{
    res.status(400).send(e);
})
});


app.post('/update', (req, res) => {
    if(req.body.points.length>=3){
    var zoneCreation = new creation({
        label: req.body.label,
        color: req.body.color,
        points:req.body.points
    });
}else{
    var zoneCreation = new creation({
        label: req.body.label,
        color: req.body.color
    });
}

creation.findOneAndUpdate({_id:req.body._id},{ $set: { 
    label: req.body.label,
    color: req.body.color,
    points:req.body.points}}).then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    })
});

app.listen(port, () => {
    console.log(`startes on port ${port}`)
});