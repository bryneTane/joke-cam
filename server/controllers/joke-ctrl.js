const fs = require('fs');

const Joke = require('../models/joke-model');

directoryName = (typeExt) => {
    let type = typeExt.split('/')[0];
    if(type==='image') return 'img';
    if(type==="audio") return 'audios';
    if(type==="video") return 'videos';
}

createJoke = (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a joke',
        })
    }
    body.id = Date.now();
    const filename = `${body.id}.${body.type.split('/')[1]}`;

    var imageBuffer = decodeBase64Image(body.file);
    // console.log(process.env.PUBLIC_URL)
    fs.writeFile(`./${directoryName(body.type)}/${filename}`, imageBuffer.data, function(err) { 
        // console.log(err);
        if(!err){
            body.filename = filename;
            const joke = new Joke(body)

            if (!joke) {
                return res.status(400).json({ success: false, error: err })
            }

            joke
                .save()
                .then(() => {
                    return res.status(201).json({
                        success: true,
                        id: joke.id,
                        message: 'Joke created!',
                    });
                })
                .catch(error => {
                    return res.status(400).json({
                        error,
                        message: 'Joke not created!',
                    });
                });
        }else{
            return res.status(400).json({
                err,
                message: 'Joke not created because the file could not be saved !',
            });
        }
    });
}

function decodeBase64Image(dataString) {
    console.log(dataString.slice(0, 40));
    var matches = dataString.match(/^data:([A-Za-z0-9-+\/]+);base64,(.+)$/),
      response = {};
  
    if (matches.length !== 3) {
      return new Error('Invalid input string');
    }
  
    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');
  
    return response;
  }

// updateJoke = async (req, res) => {
//     const body = req.body;

//     if (!body) {
//         return res.status(400).json({
//             success: false,
//             error: 'You must provide a body to update',
//         });
//     }

//     Joke.findOne({ id: req.params.id }, (err, joke) => {
//         if (err) {
//             return res.status(404).json({
//                 err,
//                 message: 'Joke not found!',
//             });
//         }
//         joke.name = body.name;
//         if(body.pp){
//             var imageBuffer = decodeBase64Image(body.pp);
//             // console.log(process.env.PUBLIC_URL)
//             fs.writeFile(`../public/img/${req.params.id}.jpg`, imageBuffer.data, function(err) { 
//                 // console.log(err);
//                 if(!err) joke.pp = req.params.id + '.jpg';
//                 joke
//                     .save()
//                     .then(() => {
//                         return res.status(200).json({
//                             success: true,
//                             id: joke.id,
//                             message: 'Joke updated!',
//                         });
//                     })
//                     .catch(error => {
//                         return res.status(404).json({
//                             error,
//                             message: 'Joke not updated!',
//                         });
//                     });
//             });
//         }
//         else joke
//                 .save()
//                 .then(() => {
//                     return res.status(200).json({
//                         success: true,
//                         id: joke.id,
//                         message: 'Joke updated!',
//                     });
//                 })
//                 .catch(error => {
//                     return res.status(404).json({
//                         error,
//                         message: 'Joke not updated!',
//                     });
//                 });
//     });
// }

deleteJoke = async (req, res) => {
    await Joke.findOneAndDelete({ id: req.params.id }, (err, joke) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }

        if (!joke) {
            return res
                .status(404)
                .json({ success: false, error: `Joke not found` });
        }

        return res.status(200).json({ success: true, data: joke });
    }).catch(err => console.log(err));
}

getJokeById = async (req, res) => {
    await Joke.findOne({ id: req.params.id }, (err, joke) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }

        if (!joke) {
            return res
                .status(404)
                .json({ success: false, error: `Joke not found` });
        }
        return res.status(200).json({ success: true, data: joke });
    }).catch(err => console.log(err));
}

getJokes = async (req, res) => {
    await Joke.find({}, (err, jokes) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        if (!jokes.length) {
            return res
                .status(404)
                .json({ success: false, error: `Joke not found` });
        }
        return res.status(200).json({ success: true, data: jokes });
    }).catch(err => console.log(err));
}

module.exports = {
    createJoke,
    // updateJoke,
    deleteJoke,
    getJokes,
    getJokeById,
}