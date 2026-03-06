const express = require('express');
const router = express.Router();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '0072013';

// Authentication Middleware Router
const requireAuth = (req, res, next) => {
    if (req.session && req.session.isAdmin) {
        return next();
    } else {
        return res.redirect('/login');
    }
};

// Secure Custom route to serve the admin dashboard
router.get('/chulda', requireAuth, (req, res) => {
    // If an IP is provided, serve the detailed tools dashboard for that specific IP
    if (req.query.ip) {
        return res.render('admin/ip_dashboard', { visitorIp: req.query.ip });
    }

    // Otherwise serve the main table overview
    res.render('admin/dashboard');
});

// Setup Login Routes
router.get('/login', (req, res) => {
    if (req.session.isAdmin) return res.redirect('/chulda');
    res.render('admin/login');
});

router.post('/login', (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
        req.session.isAdmin = true;
        res.status(200).json({ success: true });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

module.exports = router;
