# URL Shortener Microservice - Campus Evaluation Project

**Student ID:** 2201641550057  
**Developer:** Karan Trivedi  
**Submission Date:** September 2025

## 🚀 Project Overview

This repository showcases a comprehensive URL shortening microservice built with Node.js and Express.js, featuring advanced logging capabilities and real-time analytics tracking. The project demonstrates modern backend development practices with clean architecture and robust error handling.

## 📁 Repository Structure

```
├── Backend Test Submission/     # Main URL shortener service
│   ├── server.js               # Express server configuration
│   ├── urlService.js           # Core business logic
│   ├── logger.js               # Logging utility
│   └── package.json            # Dependencies
└── Logging Middleware/         # Reusable logging package
    ├── logger.js               # Standalone logging module
    └── package.json            # Package configuration
```

## ⚡ Quick Start Guide

### Prerequisites

- Node.js (v14 or higher)
- npm package manager

### Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/Karantriv/2201641550057.git
   cd 2201641550057
   ```

2. **Install dependencies**

   ```bash
   cd "Backend Test Submission"
   npm install
   ```

3. **Start the server**

   ```bash
   npm start
   ```

4. **Verify installation**
   - Server will start on `http://localhost:3000`
   - Check console for startup confirmation

## 🎯 Core Features

### URL Management

- **Smart Shortening**: Automatic generation of unique 6-character codes
- **Custom Shortcodes**: Support for user-defined shortcodes (1-10 characters)
- **Expiration Control**: Configurable validity periods (default: 30 minutes)
- **Collision Prevention**: Automatic handling of duplicate shortcodes

### Analytics & Tracking

- **Click Monitoring**: Real-time tracking of URL access
- **Visitor Metadata**: Capture referrer and user-agent information
- **Statistical Reports**: Comprehensive analytics per shortened URL
- **Timestamp Logging**: Detailed access history with ISO timestamps

### System Architecture

- **Modular Design**: Clean separation between server, service, and logging layers
- **In-Memory Storage**: High-performance Map-based data storage
- **Comprehensive Logging**: Integration with external evaluation service
- **Error Resilience**: Robust error handling with appropriate HTTP status codes

## 🔧 Technical Implementation

### Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **HTTP Client**: Axios
- **Storage**: In-memory Maps
- **Logging**: Custom HTTP API integration

### API Endpoints

- `POST /shorturls` - Create new shortened URL
- `GET /shorturls/:shortcode` - Retrieve URL statistics
- `GET /:shortcode` - Redirect to original URL (with tracking)

### Security & Validation

- URL format validation using native URL constructor
- Shortcode pattern validation (alphanumeric only)
- Input sanitization and type checking
- Expiration-based access control

## 📊 Performance Characteristics

- **Response Time**: Sub-millisecond URL lookups via Map storage
- **Concurrency**: Handles multiple simultaneous requests efficiently
- **Memory Usage**: Optimized in-memory data structures
- **Scalability**: Stateless design enables horizontal scaling

## 🛠️ Development Notes

### Code Organization

The codebase follows a layered architecture pattern:

- **Presentation Layer**: Express route handlers
- **Business Logic**: URL service functions
- **Data Access**: In-memory storage operations
- **Cross-cutting**: Logging and error handling

### Error Handling Strategy

- Comprehensive input validation
- Graceful degradation for external service failures
- Detailed error logging for debugging
- User-friendly error messages

## 📈 Future Enhancements

- Database integration for persistent storage
- Rate limiting and abuse prevention
- Custom domain support
- Bulk URL processing capabilities
- Advanced analytics dashboard
