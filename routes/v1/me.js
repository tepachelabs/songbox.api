const express = require('express');
const dropbox = require('dropbox');

const auth = require('../../middleware/auth');
const models = require('../../models');

const router = express.Router();
const User = models.User;

router.get('/', auth, async (req, res) => {
  try {
    const token = req.token;
    const dbx = new dropbox.Dropbox({ accessToken: token });
    const { result } = await dbx.usersGetCurrentAccount();
    const [user] = await User.findOrCreate({
      where: {
        dropboxId: result['account_id'],
      },
      defaults: {
        email: result['email'],
        name: result['name']['display_name'],
        avatar: result['profile_photo_url'],
      }
    });

    res.json(user);
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = router;