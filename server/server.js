var express = require('express')
var bodyParser = require('body-parser')

var { mongoose } = require('./DB/mongoose');
var { creation } = require('./models/zone');

var app = express();

app.use(bodyParser.json());

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

app.get('/fetch',(req,res)=>{
creation.find().then((zones)=>{
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

app.listen(3000, () => {
    console.log("startes on port 3000")
});