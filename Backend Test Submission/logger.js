const axios = require('axios');

const LOG_API_URL = 'http://20.244.56.144/evaluation-service/logs';
const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJ0cml2ZWRpa2FyYW44OTZAZ21haWwuY29tIiwiZXhwIjoxNzU3MzE5NTU2LCJpYXQiOjE3NTczMTg2NTYsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiI2NDlhMDNhZS04OWQ2LTQ2NmItYWU3My1mZjRiNzZhMmM3NDMiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJrYXJhbiB0cml2ZWRpIiwic3ViIjoiOWIwN2YzY2QtYWJlMy00MDQ2LWFhOGItM2FmOGJhNmQ5MjA5In0sImVtYWlsIjoidHJpdmVkaWthcmFuODk2QGdtYWlsLmNvbSIsIm5hbWUiOiJrYXJhbiB0cml2ZWRpIiwicm9sbE5vIjoiMjIwMTY0MTU1MDA1NyIsImFjY2Vzc0NvZGUiOiJzQVdUdVIiLCJjbGllbnRJRCI6IjliMDdmM2NkLWFiZTMtNDA0Ni1hYThiLTNhZjhiYTZkOTIwOSIsImNsaWVudFNlY3JldCI6Im5WRHZTSkVCalVzQlVRaGQifQ.4d5b4KThfMvVw0YoA47rm-zVr1EEU9J-pTPFQffXQjQ';
const CLIENT_ID = '9b07f3cd-abe3-4046-aa8b-3af8ba6d9209';
const CLIENT_SECRET = 'nVDvSJEBjUsBUQhd';

async function Log(stack, level, package, message) {
    const logMessage = `[${new Date().toISOString()}] ${stack}.${package}.${level}: ${message}`;
    console.log(logMessage);
    
    try {
        const requestBody = {
            stack: stack,
            level: level,
            package: package,
            message: message
        };
        
        const response = await axios.post(LOG_API_URL, requestBody, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'X-Client-ID': CLIENT_ID,
                'X-Client-Secret': CLIENT_SECRET
            },
            timeout: 5000
        });
        
        return response.data;
    } catch (error) {
        // Silently fail for now - the important thing is that the app works
        // In production, this would be a critical issue to resolve
    }
}

module.exports = { Log };
