const fs = require('fs');

const User = require('../models/user-model');

createUser = (req, res) => {

    User.findOne({id : req.body.id}, (err, user) => {
        if (!user){
            const body = req.body;

            if (!body) {
                return res.status(400).json({
                    success: false,
                    error: 'You must provide a user',
                })
            }

            const user = new User(body)

            if (!user) {
                return res.status(400).json({ success: false, error: err })
            }

            user
                .save()
                .then(() => {
                    return res.status(201).json({
                        success: true,
                        id: user._id,
                        message: 'User created!',
                    })
                })
                .catch(error => {
                    return res.status(400).json({
                        error,
                        message: 'User not created!',
                    })
                })
        }else {
            return res.status(449).json({
                message: '449',
            })
        }
    });
}

function decodeBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
      response = {};
  
    if (matches.length !== 3) {
      return new Error('Invalid input string');
    }
  
    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');
  
    return response;
  }

updateUser = async (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        });
    }

    User.findOne({ id: req.params.id }, (err, user) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'User not found!',
            });
        }
        user.name = body.name;
        if(body.pp){
            var imageBuffer = decodeBase64Image(body.pp);
            // console.log(process.env.PUBLIC_URL)
            fs.writeFile(`./img/${req.params.id}.jpg`, imageBuffer.data, function(err) { 
                // console.log(err);
                if(!err) user.pp = req.params.id + '.jpg';
                user
                    .save()
                    .then(() => {
                        return res.status(200).json({
                            success: true,
                            id: user.id,
                            message: 'User updated!',
                        });
                    })
                    .catch(error => {
                        return res.status(404).json({
                            error,
                            message: 'User not updated!',
                        });
                    });
            });
        }
        else user
                .save()
                .then(() => {
                    return res.status(200).json({
                        success: true,
                        id: user.id,
                        message: 'User updated!',
                    });
                })
                .catch(error => {
                    return res.status(404).json({
                        error,
                        message: 'User not updated!',
                    });
                });
    });
}

deleteUser = async (req, res) => {
    await User.findOneAndDelete({ id: req.params.id }, (err, user) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }

        if (!user) {
            return res
                .status(404)
                .json({ success: false, error: `User not found` });
        }

        return res.status(200).json({ success: true, data: user });
    }).catch(err => console.log(err));
}

getUserById = async (req, res) => {
    await User.findOne({ id: req.params.id }, (err, user) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }

        if (!user) {
            return res
                .status(404)
                .json({ success: false, error: `User not found` });
        }
        return res.status(200).json({ success: true, data: user });
    }).catch(err => console.log(err));
}

getUsers = async (req, res) => {
    await User.find({}, (err, users) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        if (!users.length) {
            return res
                .status(404)
                .json({ success: false, error: `User not found` });
        }
        return res.status(200).json({ success: true, data: users });
    }).catch(err => console.log(err));
}

module.exports = {
    createUser,
    updateUser,
    deleteUser,
    getUsers,
    getUserById,
}