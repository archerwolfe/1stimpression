# Knowledge Graph Search Tracking Setup Guide

This guide will help you set up automatic tracking of all user search queries in a Google Spreadsheet.

## Step 1: Create Google Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Knowledge Graph Search Analytics" (or any name you prefer)
4. Copy the Spreadsheet ID from the URL (the long string between `/d/` and `/edit`)
5. Save this ID - you'll need it for the Google Apps Script

## Step 2: Set Up Google Apps Script

1. Go to [Google Apps Script](https://script.google.com)
2. Click "New Project"
3. Replace the default code with the content from `google-apps-script.js`
4. Replace `YOUR_SPREADSHEET_ID_HERE` with your actual spreadsheet ID from Step 1
5. Save the project (Ctrl+S or Cmd+S)
6. Give it a name like "Knowledge Graph Tracker"

## Step 3: Deploy Google Apps Script

1. In your Google Apps Script project, click "Deploy" → "New deployment"
2. Click the gear icon and select "Web app"
3. Set the following:
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
4. Click "Deploy"
5. Copy the Web App URL that appears
6. Click "Done"

## Step 4: Update Your Website Configuration

1. Open `js/config.js` in your website
2. Replace `YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE` with the Web App URL from Step 3
3. Save the file

## Step 5: Test the System

1. Open your website's Knowledge Graph search page
2. Perform a test search
3. Check your Google Spreadsheet - you should see a new row with the search data
4. Check the browser console (F12) for any error messages

## Data Collected

The system will automatically track:

- **Timestamp**: When the search was performed
- **Search Query**: What the user searched for
- **User Agent**: Browser and device information
- **IP Address**: User's IP address (detected by server)
- **Referrer**: Which page the user came from
- **Results Count**: How many Knowledge Graph results were returned
- **Top Result Name**: Name of the highest-scoring result
- **Top Result Score**: Google's confidence score for the top result
- **Session ID**: Unique identifier for the user's session

## Troubleshooting

### No data appearing in spreadsheet:
- Check that the Web App URL is correct in `js/config.js`
- Verify the spreadsheet ID is correct in the Google Apps Script
- Check browser console for error messages
- Ensure the Google Apps Script is deployed as a web app with "Anyone" access

### Permission errors:
- Make sure the Google Apps Script is set to "Execute as: Me"
- Ensure you have edit access to the spreadsheet
- Try redeploying the web app

### CORS errors:
- This is normal for local testing
- The system will work fine when deployed to a web server

## Analytics and Insights

Once you have data, you can analyze:

- Most popular search terms
- Search success rates (results count > 0)
- User behavior patterns
- Peak search times
- Geographic distribution (if you add IP geolocation)

## Security Notes

- The Google Apps Script URL is public but only accepts POST requests with specific data structure
- User IP addresses are logged for analytics but can be removed if privacy is a concern
- Consider adding rate limiting if you expect high traffic

## Optional Enhancements

You can extend this system by:

1. **Adding IP geolocation** to track user locations
2. **Creating automated reports** with Google Apps Script
3. **Setting up email alerts** for unusual search patterns
4. **Adding user demographics** if you have that data
5. **Creating data visualizations** with Google Sheets charts

## Support

If you encounter issues:

1. Check the browser console for JavaScript errors
2. Verify all URLs and IDs are correct
3. Test the Google Apps Script directly using the "Test" button
4. Ensure your website is served over HTTPS (required for some features)
