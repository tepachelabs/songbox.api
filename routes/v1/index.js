const express = require('express');
const meRouter = require('./me');
const pathRouter = require('./path');
const streamLinkRouter = require('./stream-link');
const favoritesRouter = require('./favorites');

const router = express.Router();

router.use('/me', meRouter);
router.use('/path', pathRouter);
router.use('/stream_link', streamLinkRouter);
router.use('/favorites', favoritesRouter);

module.exports = router;
