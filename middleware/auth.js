const dropbox = require('dropbox');
const models = require('../models');

const User = models.User;

const auth = async (req, res, next) => {
  try {
    const bearerHeader = req.header('authorization');

    if (!bearerHeader) {
      throw "No Authorization header in request";
    }

    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    const dbx = new dropbox.Dropbox({ accessToken: bearerToken });
    const { result } = await dbx.usersGetCurrentAccount();
    const { account_id, email } = result;

    if (!account_id || !email) {
      throw "No user found";
    }

    const { id: userId } = await User.findOne({ where: { email } });

    req.account_id = account_id;
    req.email = email;
    req.userId = userId;
    req.token = bearerToken;

    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};

module.exports = auth;