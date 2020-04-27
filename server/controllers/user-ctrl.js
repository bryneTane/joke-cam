const fs = require('fs');
const jo = require('jpeg-autorotate');
const options = { quality: 85 };

const User = require('../models/user-model');

createUser = (req, res) => {

    User.findOne({ id: req.body.id }, (err, user) => {
        if (!user) {
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
        } else {
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
        console.log('nobody')
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        });
    }

    User.findOne({ id: req.params.id }, (err, user) => {
        if (err) {
            console.log('notfound')
            return res.status(404).json({
                err,
                message: 'User not found!',
            });
        }
        user.pp = (body.pp === "none") ? "" : body.pp;
        user.name = body.name;
        if (user.pp) {
            if (user.pp !== "none") {
                var imageBuffer = decodeBase64Image(body.pp);
                // console.log(process.env.PUBLIC_URL)
                fs.writeFile(`../public/img/${req.params.id}-${body.timestamp}.jpg`, imageBuffer.data, function (err) {
                    // console.log(err);
                    if (!err) {
                        user.pp = req.params.id + '-' + body.timestamp + '.jpg';
                        jo.rotate(`./img/${req.params.id}-${body.timestamp}.jpg`, options)
                            .then(({ buffer, orientation, dimensions, quality }) => {
                                console.log(`Orientation was ${orientation}`)
                                console.log(`Dimensions after rotation: ${dimensions.width}x${dimensions.height}`)
                                console.log(`Quality: ${quality}`)
                                fs.writeFile(`../public/img/${req.params.id}-${body.timestamp}.jpg`, buffer, function (err) {
                                    if (err) console.log('failed to save the rotated image');
                                    else {
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
                                    };
                                });
                            })
                            .catch((error) => {
                                if (error.code === jo.errors.correct_orientation || error.code === jo.errors.no_orientation) {
                                    console.log('The orientation of this image is already correct!');
                                } else {
                                    console.log('An error occured while rotating image');
                                }
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
                            })
                    } else {
                        return res.status(400).json({
                            success: false,
                            message: 'The file was not saved!',
                        });
                    }
                });
            }
        } else {
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
        }
    });
}

likeOrDislikePost = (req, res) => {
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
                message: 'Quote not found!',
            });
        }
        user.liked = body.liked;
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
    likeOrDislikePost,
}