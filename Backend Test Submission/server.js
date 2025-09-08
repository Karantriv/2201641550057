// ========================================
// DEPENDENCIES AND CONFIGURATION
// ========================================

// Core dependencies for building our URL shortening microservice
const express = require('express');
const cors = require('cors');
const { Log } = require('./logger');
const { createShortUrl, getUrlByShortcode, recordClick, getUrlStats } = require('./urlService');

// Application configuration constants
const PORT = 3000;
const app = express();

// ========================================
// MIDDLEWARE SETUP
// ========================================

// Enable cross-origin requests and JSON parsing for API endpoints
app.use(cors());
app.use(express.json());

// Custom middleware to track every incoming HTTP request for debugging purposes
app.use((req, res, next) => {
    Log('backend', 'info', 'middleware', `${req.method} ${req.path} - incoming request`);
    next();
});

// ========================================
// API ROUTE HANDLERS
// ========================================

// Primary endpoint for creating shortened URLs with optional custom parameters
app.post('/shorturls', async (req, res) => {
    try {
        Log('backend', 'info', 'handler', 'processing create short url request');
        
        // Extract user-provided parameters from request payload
        const { url, validity, shortcode } = req.body;
        
        // Validate that the essential URL parameter is present
        if (!url) {
            Log('backend', 'error', 'handler', 'url field is required');
            return res.status(400).json({
                error: 'URL is required'
            });
        }
        
        // Set default expiration time to 30 minutes if not specified by user
        const validityMinutes = validity || 30;
        
        // Ensure validity period is a positive number to prevent infinite or negative expiration
        if (typeof validityMinutes !== 'number' || validityMinutes <= 0) {
            Log('backend', 'error', 'handler', 'invalid validity value');
            return res.status(400).json({
                error: 'Validity must be a positive number'
            });
        }
        
        // Delegate URL creation logic to service layer for better separation of concerns
        const result = createShortUrl(url, validityMinutes, shortcode);
        
        Log('backend', 'info', 'handler', 'short url created successfully');
        res.status(201).json(result);
        
    } catch (error) {
        Log('backend', 'error', 'handler', `error creating short url: ${error.message}`);
        res.status(400).json({
            error: error.message
        });
    }
});

// Analytics endpoint to retrieve detailed statistics for any shortened URL
app.get('/shorturls/:shortcode', async (req, res) => {
    try {
        Log('backend', 'info', 'handler', 'processing get url stats request');
        
        // Extract shortcode identifier from URL path parameters
        const { shortcode } = req.params;
        
        // Fetch comprehensive analytics data from service layer
        const stats = getUrlStats(shortcode);
        
        // Handle case where shortcode doesn't exist in our system
        if (!stats) {
            Log('backend', 'warn', 'handler', 'shortcode not found for stats');
            return res.status(404).json({
                error: 'Short URL not found'
            });
        }
        
        Log('backend', 'info', 'handler', 'url stats retrieved successfully');
        res.json(stats);
        
    } catch (error) {
        Log('backend', 'error', 'handler', `error retrieving stats: ${error.message}`);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// Main redirection endpoint that handles shortened URL clicks and tracks analytics
app.get('/:shortcode', async (req, res) => {
    try {
        Log('backend', 'info', 'handler', 'processing redirect request');
        
        // Parse shortcode from the URL path for lookup
        const { shortcode } = req.params;
        
        // Attempt to retrieve URL data and check expiration status
        const urlData = getUrlByShortcode(shortcode);
        
        // Return 404 if shortcode is invalid or has expired
        if (!urlData) {
            Log('backend', 'warn', 'handler', 'shortcode not found or expired');
            return res.status(404).json({
                error: 'Short URL not found or expired'
            });
        }
        
        // Capture visitor metadata for analytics tracking purposes
        const referrer = req.get('Referer');
        const userAgent = req.get('User-Agent');
        
        // Log this click event with metadata before redirecting user
        recordClick(shortcode, referrer, userAgent);
        
        Log('backend', 'info', 'handler', 'redirecting to original url');
        res.redirect(urlData.originalUrl);
        
    } catch (error) {
        Log('backend', 'error', 'handler', `error processing redirect: ${error.message}`);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// ========================================
// ERROR HANDLING MIDDLEWARE
// ========================================

// Catch-all middleware for handling requests to undefined routes
app.use((req, res) => {
    Log('backend', 'warn', 'handler', `route not found: ${req.method} ${req.path}`);
    res.status(404).json({
        error: 'Route not found'
    });
});

// Global error handler to catch any unhandled exceptions in the application
app.use((error, req, res, next) => {
    Log('backend', 'fatal', 'handler', `unhandled error: ${error.message}`);
    res.status(500).json({
        error: 'Internal server error'
    });
});

// ========================================
// SERVER INITIALIZATION
// ========================================

// Start the HTTP server and begin listening for incoming connections
app.listen(PORT, () => {
    Log('backend', 'info', 'config', `server started on port ${PORT}`);
    console.log(`Server running on port ${PORT}`);
});
