const express = require('express');
const dropbox = require('dropbox');

const auth = require('../../middleware/auth');

const router = express.Router();

router.get('/:path*?', auth, async (req, res) => {
  try {
    const { token, path } = req;
    const dbx = new dropbox.Dropbox({ accessToken: token });
    const { result } = await dbx.filesGetTemporaryLink({ path: decodeURI(path) });
    const { name, path_lower: pathLower } = result.metadata;

    res.json({
      name,
      path: pathLower,
      src: result.link,
      parentPath: pathLower.replace(`/${ name.toLowerCase() }`, '')
    });
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = router;