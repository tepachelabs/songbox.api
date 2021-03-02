const express = require('express');
const dropbox = require('dropbox');

const auth = require('../../middleware/auth');
const models = require('../../models');

const Favorite = models.Favorite;

const router = express.Router();

router.get('/:path*?', auth, async (req, res) => {
  try {
    const { token, path, userId } = req;
    const dbx = new dropbox.Dropbox({ accessToken: token });
    const cleanedPath = path === '/' ? '' : decodeURI(path);
    const { result } = await dbx.filesListFolder({ path: cleanedPath });
    const favorites = await Favorite.findAll({ where: { userId } });

    const pathsList = result.entries.reduce((collection, current) => {
      const newPath = {
        name: current['name'],
        path: current['path_lower'],
      };

      if (current['.tag'] === 'file') {
        if (/\.?(mp3|ogg|wav)/.test(newPath.name)) {
          const favoriteRecord = favorites.find(element => element.name === newPath.name);
          newPath.isFavorite = !!favoriteRecord;
          newPath.favoriteId = favoriteRecord?.id || null;
          collection.files.push(newPath);
        }
      } else {
        collection.folders.push(newPath);
      }

      return collection;
    }, {
      files: [],
      folders: [],
    });

    res.json(pathsList);
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = router;