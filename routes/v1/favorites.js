const express = require('express');
const dropbox = require('dropbox');

const auth = require('../../middleware/auth');
const models = require('../../models');

const Favorite = models.Favorite;

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const { token, userId } = req;
    const favorites = await Favorite.findAll({ where: { userId } });
    const dbx = new dropbox.Dropbox({ accessToken: token });

    const metadataResults = await Promise.all(
      favorites.map(({ path }) => dbx.filesGetMetadata({ path, include_deleted: true }))
    );
    const brokenLinks = metadataResults
      .filter(({ result }) => result['.tag'] === 'deleted')
      .reduce((acc, { result }) => {
        return {
          [result['path_lower']]: true,
          ...acc
        };
      }, {});

    const favoritesPayload = favorites.map(
      favorite => ({
        name: favorite.name,
        path: favorite.path,
        favoriteId: favorite.id,
        isFavorite: true,
        isBroken: !!brokenLinks[favorite.path],
      })
    );

    res.json(favoritesPayload);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { userId, body } = req;
    const { name, path } = body;
    const newFavorite = await Favorite.create({ userId, name, path });

    res.json({
      favoriteId: newFavorite.id,
      isFavorite: true,
      name: newFavorite.name,
      path: newFavorite.path,
    });
  } catch (error) {
    res.status(400).json(error);
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const { userId, params } = req;
    const { id } = params;

    await Favorite.destroy({
      where: { id, userId }
    });

    res.status(200).json('ok');
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = router;