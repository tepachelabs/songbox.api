const express = require('express');

const auth = require('../../middleware/auth');
const models = require('../../models');

const User = models.User;
const Favorite = models.Favorite;

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const { email } = req;
    const { id: userId } = await User.findOne({ where: { email } });
    const favorites = await Favorite.findAll({ where: { userId } });

    res.json(favorites);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { email, body } = req;
    const { name, path } = body;

    const { id: userId } = await User.findOne({ where: { email } });
    const newFavorite = await Favorite.create({ userId, name, path });

    res.json(newFavorite);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const { email, params } = req;
    const { id } = params;
    const { id: userId } = await User.findOne({ where: { email } });

    await Favorite.destroy({
      where: { id, userId }
    });

    res.status(200).json('ok');
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = router;