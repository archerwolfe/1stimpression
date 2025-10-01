# 🚀 Complete Deployment Steps for Your Knowledge Graph Tracker

## ✅ **Step 1: Set Up Google Apps Script**

1. **Go to [Google Apps Script](https://script.google.com)**
2. **Click "New Project"**
3. **Delete the default code** and paste the entire content from `google-apps-script.js`
4. **Save the project** (Ctrl+S or Cmd+S)
5. **Name it** "Knowledge Graph Search Tracker"

## ✅ **Step 2: Deploy as Web App**

1. **Click "Deploy" → "New deployment"**
2. **Click the gear icon** and select "Web app"
3. **Set these options:**
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
4. **Click "Deploy"**
5. **Copy the Web App URL** that appears (it will look like: `https://script.google.com/macros/s/ABC123.../exec`)
6. **Click "Done"**

## ✅ **Step 3: Update Your Website**

1. **Open `js/config.js`** in your website
2. **Replace this line:**
   ```javascript
   TRACKING_URL: "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE"
   ```
   **With your actual Web App URL:**
   ```javascript
   TRACKING_URL: "https://script.google.com/macros/s/YOUR_ACTUAL_URL_HERE/exec"
   ```

## ✅ **Step 4: Test the System**

1. **Open your website's Knowledge Graph search page**
2. **Perform a test search** (try searching for "Elon Musk" or any famous person)
3. **Check your Google Spreadsheet** - you should see a new row with data
4. **Check browser console** (F12) for any error messages

## 🔍 **What to Expect in Your Spreadsheet**

After a successful test search, you should see a row with data like:
- **Timestamp**: Current date/time
- **Search Query**: What you searched for
- **Country**: Your country (e.g., "United States")
- **Region/State**: Your state/province
- **City**: Your city
- **Browser**: Your browser (e.g., "Chrome")
- **Operating System**: Your OS (e.g., "Windows 10")
- **Is Mobile**: false (if on desktop)
- **Results Count**: Number of Knowledge Graph results
- **And 11 more data points...**

## 🛠️ **Troubleshooting**

### **No data appearing in spreadsheet:**
- ✅ Check that the Web App URL is correct in `js/config.js`
- ✅ Verify the Google Apps Script is deployed as "Anyone" access
- ✅ Check browser console (F12) for error messages
- ✅ Try redeploying the web app

### **Permission errors:**
- ✅ Make sure the Google Apps Script is set to "Execute as: Me"
- ✅ Ensure you have edit access to the spreadsheet
- ✅ Try redeploying the web app

### **CORS errors in console:**
- ✅ This is normal for local testing
- ✅ The system will work fine when deployed to a web server

## 📊 **Your Spreadsheet is Ready!**

Your spreadsheet with ID `1JY01Ka3QJMw2HDmo6UFSxsbq1f-02amr48NlJDIFdF4` is now configured to receive:
- **20 data columns** with comprehensive analytics
- **Automatic location detection** (country, city, timezone)
- **Device and browser information**
- **Search performance metrics**
- **User session tracking**

## 🎯 **Next Steps After Testing**

Once you confirm the system is working:

1. **Deploy your website** to your web server
2. **Monitor the spreadsheet** for incoming data
3. **Set up analytics dashboards** using the data
4. **Create automated reports** if desired

## 📈 **Analytics You Can Now Track**

- Most popular search terms by country
- Search success rates by device type
- Geographic distribution of users
- Peak search times by timezone
- Browser and OS usage patterns
- Mobile vs desktop search behavior

**Ready to test? Let me know if you need help with any of these steps!**
