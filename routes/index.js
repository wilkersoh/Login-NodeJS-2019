const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

router.get('/', (req, res) => {
    res.render('welcome')
})
// Dashboard - ensureAuth to protected if someone inside without login
router.get('/dashboard', ensureAuthenticated, (req, res) => res.render('dashboard',{
    name: req.user.name
}))

module.exports = router;