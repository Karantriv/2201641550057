// Import logging utility for comprehensive service-level tracking
const { Log } = require('./logger');

// ========================================
// DATA STORAGE CONFIGURATION
// ========================================

// In-memory storage solutions for URL mappings and analytics data
const urlStore = new Map();
const clickStats = new Map();

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Ensure custom shortcodes meet our alphanumeric requirements and length constraints
function isValidShortcode(shortcode) {
    // Regex pattern: 1-10 characters, letters and numbers only
    const regex = /^[a-zA-Z0-9]{1,10}$/;
    return regex.test(shortcode);
}

// Validate URL format using native URL constructor for robust checking
function isValidUrl(url) {
    try {
        // Attempt to create URL object - throws if malformed
        new URL(url);
        return true;
    } catch (error) {
        // Invalid URL format detected
        return false;
    }
}

// Generate random alphanumeric shortcodes with configurable length
function generateShortcode(length = 6) {
    // Character set includes both cases and digits for maximum entropy
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    // Build shortcode character by character using random selection
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// ========================================
// MAIN SERVICE FUNCTIONS
// ========================================

// Core business logic for creating shortened URLs with validation and collision handling
function createShortUrl(originalUrl, validity = 30, customShortcode = null) {
    Log('backend', 'info', 'service', 'creating short url');
    
    // Verify the provided URL is properly formatted before processing
    if (!isValidUrl(originalUrl)) {
        Log('backend', 'error', 'service', 'invalid url provided');
        throw new Error('Invalid URL provided');
    }
    
    // Initialize shortcode variable for either custom or generated value
    let shortcode = customShortcode;
    
    // Handle custom shortcode validation and uniqueness checking
    if (customShortcode) {
        // Ensure custom shortcode meets our formatting requirements
        if (!isValidShortcode(customShortcode)) {
            Log('backend', 'error', 'service', 'invalid shortcode format');
            throw new Error('Invalid shortcode format');
        }
        
        // Prevent duplicate shortcodes in our system
        if (urlStore.has(customShortcode)) {
            Log('backend', 'error', 'service', 'shortcode already exists');
            throw new Error('Shortcode already exists');
        }
    } else {
        // Generate random shortcode until we find one that's not taken
        do {
            shortcode = generateShortcode();
        } while (urlStore.has(shortcode));
    }
    
    // Calculate timestamps for creation and expiration
    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() + validity * 60 * 1000);
    
    // Construct URL data object with all necessary metadata
    const urlData = {
        originalUrl: originalUrl,
        shortcode: shortcode,
        createdAt: createdAt.toISOString(),
        expiresAt: expiresAt.toISOString(),
        validity: validity
    };
    
    // Store URL data and initialize click tracking
    urlStore.set(shortcode, urlData);
    clickStats.set(shortcode, {
        clickCount: 0,
        clicks: []
    });
    
    Log('backend', 'info', 'service', 'short url created successfully');
    
    // Return response with shortened link and expiration info
    return {
        shortLink: `http://localhost:3000/${shortcode}`,
        expiry: expiresAt.toISOString()
    };
}

// Retrieve URL data by shortcode with expiration validation
function getUrlByShortcode(shortcode) {
    Log('backend', 'info', 'service', 'retrieving url by shortcode');
    
    // Attempt to find URL data in storage
    const urlData = urlStore.get(shortcode);
    if (!urlData) {
        Log('backend', 'warn', 'service', 'shortcode not found');
        return null;
    }
    
    // Check if URL has expired based on current timestamp
    const now = new Date();
    const expiresAt = new Date(urlData.expiresAt);
    
    if (now > expiresAt) {
        Log('backend', 'warn', 'service', 'shortcode has expired');
        return null;
    }
    
    return urlData;
}

// ========================================
// ANALYTICS FUNCTIONS
// ========================================

// Record click event with visitor metadata for analytics tracking
function recordClick(shortcode, referrer, userAgent) {
    Log('backend', 'info', 'service', 'recording click');
    
    // Retrieve existing click statistics for this shortcode
    const stats = clickStats.get(shortcode);
    if (stats) {
        // Increment click counter and add detailed click record
        stats.clickCount++;
        stats.clicks.push({
            timestamp: new Date().toISOString(),
            referrer: referrer || 'direct',
            location: 'unknown',
            userAgent: userAgent
        });
        // Update statistics in storage
        clickStats.set(shortcode, stats);
    }
}

// Compile comprehensive statistics for a given shortcode
function getUrlStats(shortcode) {
    Log('backend', 'info', 'service', 'retrieving url statistics');
    
    // Fetch URL metadata from primary storage
    const urlData = urlStore.get(shortcode);
    if (!urlData) {
        Log('backend', 'warn', 'service', 'shortcode not found for stats');
        return null;
    }
    
    // Retrieve click analytics or initialize empty stats
    const stats = clickStats.get(shortcode) || { clickCount: 0, clicks: [] };
    
    // Combine URL data with analytics for comprehensive response
    return {
        originalUrl: urlData.originalUrl,
        shortcode: shortcode,
        createdAt: urlData.createdAt,
        expiresAt: urlData.expiresAt,
        clickCount: stats.clickCount,
        clicks: stats.clicks
    };
}

module.exports = {
    createShortUrl,
    getUrlByShortcode,
    recordClick,
    getUrlStats
};
