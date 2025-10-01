/**
 * Google Apps Script for tracking Knowledge Graph search queries
 * 
 * Instructions:
 * 1. Go to https://script.google.com/
 * 2. Create a new project
 * 3. Replace the default code with this script
 * 4. Deploy as a web app with "Execute as: Me" and "Who has access: Anyone"
 * 5. Copy the web app URL and use it in your website
 */

function doPost(e) {
  try {
    // Handle CORS preflight request
    if (e.parameter && e.parameter.method === 'OPTIONS') {
      return ContentService
        .createTextOutput('')
        .setMimeType(ContentService.MimeType.TEXT)
        .setHeaders({
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        });
    }
    
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Get the active spreadsheet
    const spreadsheetId = '1JY01Ka3QJMw2HDmo6UFSxsbq1f-02amr48NlJDIFdF4';
    const sheet = SpreadsheetApp.openById(spreadsheetId).getActiveSheet();
    
    // Get IP address from the request
    const ipAddress = e.parameter.ip || e.parameter.remote_addr || 
                     e.parameter['X-Forwarded-For'] || 
                     e.parameter['X-Real-IP'] || 
                     data.ipAddress || '';
    
    // Get location data from IP
    const locationData = getLocationFromIP(ipAddress);
    
    // Prepare the data to log
    const timestamp = new Date();
    const searchQuery = data.query || '';
    const userAgent = data.userAgent || '';
    const referrer = data.referrer || '';
    const resultsCount = data.resultsCount || 0;
    const topResultName = data.topResultName || '';
    const topResultScore = data.topResultScore || 0;
    const sessionId = data.sessionId || '';
    const searchDuration = data.searchDuration || 0; // Time taken for search in ms
    const hasResults = resultsCount > 0;
    const isMobile = /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const browser = getBrowserFromUserAgent(userAgent);
    const os = getOSFromUserAgent(userAgent);
    
    // Add headers if this is the first row
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, 20).setValues([[
        'Timestamp',
        'Search Query',
        'IP Address',
        'Country',
        'Region/State',
        'City',
        'Timezone',
        'User Agent',
        'Browser',
        'Operating System',
        'Is Mobile',
        'Referrer',
        'Results Count',
        'Has Results',
        'Top Result Name',
        'Top Result Score',
        'Search Duration (ms)',
        'Session ID',
        'Language',
        'Screen Resolution'
      ]]);
    }
    
    // Add the search data
    sheet.appendRow([
      timestamp,
      searchQuery,
      ipAddress,
      locationData.country || '',
      locationData.region || '',
      locationData.city || '',
      locationData.timezone || '',
      userAgent,
      browser,
      os,
      isMobile,
      referrer,
      resultsCount,
      hasResults,
      topResultName,
      topResultScore,
      searchDuration,
      sessionId,
      data.language || '',
      data.screenResolution || ''
    ]);
    
    // Return success response with CORS headers
    return ContentService
      .createTextOutput(JSON.stringify({success: true, message: 'Data logged successfully'}))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
      
  } catch (error) {
    // Return error response with CORS headers
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
  }
}

function doGet(e) {
  try {
    // Handle tracking requests from website
    if (e.parameter.query) {
      var data = {
        query: e.parameter.query || '',
        userAgent: e.parameter.userAgent || '',
        ipAddress: e.parameter.ipAddress || '',
        referrer: e.parameter.referrer || '',
        resultsCount: parseInt(e.parameter.resultsCount) || 0,
        topResultName: e.parameter.topResultName || '',
        topResultScore: parseFloat(e.parameter.topResultScore) || 0,
        sessionId: e.parameter.sessionId || '',
        timestamp: e.parameter.timestamp || new Date().toISOString(),
        language: e.parameter.language || '',
        screenResolution: e.parameter.screenResolution || '',
        searchDuration: parseFloat(e.parameter.searchDuration) || 0
      };
      
      // Log to spreadsheet
      logToSpreadsheet(data);
      
      // Return a simple 1x1 pixel image
      return ContentService
        .createTextOutput('')
        .setMimeType(ContentService.MimeType.TEXT);
    }
    
    // Handle regular GET requests (for testing)
    return ContentService
      .createTextOutput(JSON.stringify({message: 'Knowledge Graph Search Tracker is running'}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    // Return empty response on error
    return ContentService
      .createTextOutput('')
      .setMimeType(ContentService.MimeType.TEXT);
  }
}

// Helper function to log data to spreadsheet
function logToSpreadsheet(data) {
  try {
    // Get the active spreadsheet
    const spreadsheetId = '1JY01Ka3QJMw2HDmo6UFSxsbq1f-02amr48NlJDIFdF4';
    const sheet = SpreadsheetApp.openById(spreadsheetId).getActiveSheet();
    
    // Get location data from IP
    const locationData = getLocationFromIP(data.ipAddress || '');
    
    // Prepare the data to log
    const timestamp = new Date();
    const searchQuery = data.query || '';
    const userAgent = data.userAgent || '';
    const referrer = data.referrer || '';
    const resultsCount = data.resultsCount || 0;
    const topResultName = data.topResultName || '';
    const topResultScore = data.topResultScore || 0;
    const sessionId = data.sessionId || '';
    const searchDuration = data.searchDuration || 0;
    const hasResults = resultsCount > 0;
    const isMobile = /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const browser = getBrowserFromUserAgent(userAgent);
    const os = getOSFromUserAgent(userAgent);
    
    // Add headers if this is the first row
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, 20).setValues([[
        'Timestamp',
        'Search Query',
        'IP Address',
        'Country',
        'Region/State',
        'City',
        'Timezone',
        'User Agent',
        'Browser',
        'Operating System',
        'Is Mobile',
        'Referrer',
        'Results Count',
        'Has Results',
        'Top Result Name',
        'Top Result Score',
        'Search Duration (ms)',
        'Session ID',
        'Language',
        'Screen Resolution'
      ]]);
    }
    
    // Add the search data
    sheet.appendRow([
      timestamp,
      searchQuery,
      data.ipAddress || '',
      locationData.country || '',
      locationData.region || '',
      locationData.city || '',
      locationData.timezone || '',
      userAgent,
      browser,
      os,
      isMobile,
      referrer,
      resultsCount,
      hasResults,
      topResultName,
      topResultScore,
      searchDuration,
      sessionId,
      data.language || '',
      data.screenResolution || ''
    ]);
  } catch (error) {
    console.log('Error logging to spreadsheet:', error);
  }
}

// Get location data from IP address using ipapi.co (free service)
function getLocationFromIP(ipAddress) {
  if (!ipAddress || ipAddress === '127.0.0.1' || ipAddress === 'localhost') {
    return {
      country: 'Unknown',
      region: 'Unknown',
      city: 'Unknown',
      timezone: 'Unknown'
    };
  }
  
  try {
    const response = UrlFetchApp.fetch('http://ipapi.co/' + ipAddress + '/json/', {
      'muteHttpExceptions': true
    });
    
    if (response.getResponseCode() === 200) {
      const data = JSON.parse(response.getContentText());
      return {
        country: data.country_name || 'Unknown',
        region: data.region || 'Unknown',
        city: data.city || 'Unknown',
        timezone: data.timezone || 'Unknown'
      };
    }
  } catch (error) {
    console.log('Error fetching location data:', error);
  }
  
  return {
    country: 'Unknown',
    region: 'Unknown',
    city: 'Unknown',
    timezone: 'Unknown'
  };
}

// Parse browser from user agent
function getBrowserFromUserAgent(userAgent) {
  if (!userAgent) return 'Unknown';
  
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  if (userAgent.includes('Opera')) return 'Opera';
  if (userAgent.includes('Internet Explorer')) return 'Internet Explorer';
  
  return 'Other';
}

// Parse operating system from user agent
function getOSFromUserAgent(userAgent) {
  if (!userAgent) return 'Unknown';
  
  if (userAgent.includes('Windows NT 10.0')) return 'Windows 10';
  if (userAgent.includes('Windows NT 6.3')) return 'Windows 8.1';
  if (userAgent.includes('Windows NT 6.1')) return 'Windows 7';
  if (userAgent.includes('Windows NT 6.0')) return 'Windows Vista';
  if (userAgent.includes('Windows NT 5.1')) return 'Windows XP';
  if (userAgent.includes('Windows')) return 'Windows';
  
  if (userAgent.includes('Mac OS X')) return 'macOS';
  if (userAgent.includes('Macintosh')) return 'Mac';
  
  if (userAgent.includes('Android')) return 'Android';
  if (userAgent.includes('iPhone')) return 'iOS';
  if (userAgent.includes('iPad')) return 'iOS';
  
  if (userAgent.includes('Linux')) return 'Linux';
  
  return 'Other';
}
