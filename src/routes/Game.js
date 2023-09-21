const express = require('express')
const router = new express.Router()
const Game = require('../models/Game')
const userAuth = require('../auth/UserAuth')
const calculateGameResult = require('../controllers/GameController')


// to create a game
router.post('/games', userAuth, async (req, res) => {
  const game = new Game({ ...req.body, played_by: req.user._id })
  try {
    await game.save()
    res.status(201).json({
      data: game,
      message: 'Game has been created successfully.'
    })
  } catch (error) {
    throw new Error(error)
  }
})


// to get all games
// GET /games?sortBy=createdAt:desc
// GET /games?status= available  (to filter games by status)
// GET /games?played_by= userId  (to filter games by User)
router.get('/games', userAuth, async (req, res) => {
  const sort = {}
  const match = {}

  if (req.query.status) {
    match.status = req.query.status
  } else if (req.query.played_by) {
    match.played_by = req.query.played_by
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(':')
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
  }

  try {
    const jobs = await Game.find(match)
      .sort(sort)
      .populate({
        path: 'played_by',
        select: '_id, name',
      })
    res.status(200).json({
      data: jobs,
      message: 'Game has been retrived successfully.'
    })
  } catch (error) {
    throw new Error(error)
  }
})

// to get game by id
router.get('/games/:id', userAuth, async (req, res, next) => {
  try {
    const game = await Game.findById(req.params.id)
      .populate({
        path: 'played_by',
        select: '_id, name',
      })

    if (!game) {
      let error = new Error('Game not found!')
      error.status = 404
      return next(error)
    }
    res.status(200).json({
      data: game,
      message: 'Game has been retrived successfully.'
    })
  } catch (error) {
    throw new Error(error)
  }
})


// update game by id.
router.put('/games/:id', userAuth, async (req, res) => {
  const gameId = req.params.id;
  const { moves } = req.body;
  const { row, col, player } = moves;

  try {
    const game = await Game.findById(gameId);

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    // Add the new move to the game
    game.moves.push({ row, col, player });

    // Check game result and update game status
    const gameResult = calculateGameResult(game);
    game.result = gameResult;

    if (gameResult !== 'In Progress') {
      game.status = 'COMPLETED'
    }

    // Save the updated game
    await game.save();

    res.status(201).json({ data: game, message: 'Game has been updated successfully.' });

  } catch (error) {
    throw new Error(error)
  }
});

// update game by id to reset game.
router.put('/games/reset/:id', userAuth, async (req, res) => {
  const gameId = req.params.id;

  try {
    const game = await Game.findById(gameId);

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    // Add the new move to the game
    game.moves = [];

    // Save the updated game
    await game.save();

    res.status(201).json({ data: game, message: 'Game has been updated successfully.' });

  } catch (error) {
    throw new Error(error)
  }
});




module.exports = router