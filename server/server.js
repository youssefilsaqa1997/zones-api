var express = require('express')
var bodyParser = require('body-parser')
const hbs = require('hbs');
const cors = require('cors')
var { User } = require('./models/users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')

var { mongoose } = require('./DB/mongoose');
var { creation } = require('./models/zone');

const port = process.env.PORT || 3000;
var app = express();
hbs.registerPartials(__dirname + '/server/views');
app.set('view engine', 'hbs');

app.use(cors())
app.use(bodyParser.json());

function checkValid(req, res, next) {
    const _token = req.body['token'];
    console.log(_token);
    jwt.verify(_token, "ilsaqa", (err, verified) => {
        console.log(err, verified);
        next();
    })
}

async function findingUser(createdBy, zoneObject) {
    var data = {}
    await User.findById(createdBy, (err, user) => {
        data = {
            label: zoneObject.label,
            color: zoneObject.color,
            points: zoneObject.points,
            creationDate: zoneObject.creationDate,
            createdBy: {
                name: user.name,
                mobile: user.mobile,
                _id: user._id
            }
        }

    });
    return data;
}

app.get('/', (req, res) => {
    res.render('home.hbs');
})
app.post('/creation', (req, res) => {
    if (req.body.points.length >= 3) {
        var zoneCreation = new creation({
            label: req.body.label,
            color: req.body.color,
            points: req.body.points,
            createdBy: req.body.userID,
            creationDate: new Date()
        }

        );

        zoneCreation.save().then((doc) => {
            res.send(doc);
        }, (e) => {
            res.status(400).send(e);
        })
    } else {
        res.status(400).send({ message: "you need more 2 points" })
    }

});

app.post('/check', checkValid, (req, res) => {
    res.send({ message: "still working" })
})

app.post('/signUp', (req, res) => {
    if (req.body.mobile.length == 11) {

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(req.body.password, salt, (err, hash) => {
                var user = new User({
                    mobile: req.body.mobile,
                    password: hash,
                    name: req.body.name
                });

                user.save().then((doc) => {
                    res.send(doc);
                }, (e) => {
                    res.status(400).send(e);
                })
            })
        })


    } else {
        res.status(400).send({ massege: "mobile number less or more than 11 number" });
    }

});

app.post('/loginToken', (req, res) => {
    if (req.body.mobile.length == 11) {
        User.findOne({ mobile: req.body.mobile }).then((doc) => {
            bcrypt.compare(req.body.password, doc.password, (err, Res) => {
                if (Res == true) {
                    const token = doc.generateAuthToken();
                    res.send({
                        token,
                        user: {
                            mobile: doc.mobile,
                            name: doc.name,
                            id: doc._id
                        }
                    });

                } else {
                    res.status(400).send({ message: "password doesn't match" });
                }

            })

        }).catch((e) => {
            res.status(400).send({ message: "mobile number not found" });
        })
    }
    else {
        res.status(400).send({ message: "The number less than or more 11" })
    }
})

app.get('/fetch', (req, res) => {
    creation.find().then(async (zones) => {
        var fetchedData = [];
        for (i = 0; i < zones.length; i++) {                
            fetchedData.push(await findingUser(zones[i].createdBy, zones[i]));             
        };
        res.send({ fetchedData });

    }, (e) => {
        res.status(400).send(e);
    })
});


app.post('/update', (req, res) => {
    if (req.body.points.length >= 3) {

        creation.findOneAndUpdate({ _id: req.body._id }, {
            $set: {
                label: req.body.label,
                color: req.body.color,
                points: req.body.points
            }
        }).then((doc) => {
            res.send(doc);
        }, (e) => {
            res.status(400).send(e);
        })

    } else {
        res.status(400).send({ message: "you need more 2 points" })
    }


});

app.post('/delete', (req, res) => {
    creation.findOneAndRemove({ _id: req.body._id }).then(() => {
        res.send({ message: "Deleted" })
    }).catch((e) => {
        res.status(400).send({ message: "ID not found" });
    })
});
app.listen(port, () => {
    console.log(`startes on port ${port}`)
});