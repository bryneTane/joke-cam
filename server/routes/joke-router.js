const express = require('express');

const JokeCtrl = require('../controllers/joke-ctrl');

const router = express.Router();

router.post('/joke', JokeCtrl.createJoke);
// router.put('/joke/:id', JokeCtrl.updateJoke);
router.delete('/joke/:id', JokeCtrl.deleteJoke);
router.get('/joke/:id', JokeCtrl.getJokeById);
router.get('/jokes', JokeCtrl.getJokes);

module.exports = router;