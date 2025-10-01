# Knowledge Graph Search Analytics Dashboard

## 📊 **Enhanced Data Collection Fields**

Your Google Spreadsheet will now automatically collect these 20 data points:

### **Basic Information**
1. **Timestamp** - When the search occurred
2. **Search Query** - What the user searched for
3. **IP Address** - User's IP address
4. **Session ID** - Unique session identifier

### **Location Data** 🌍
5. **Country** - User's country (e.g., "United States", "Canada", "United Kingdom")
6. **Region/State** - State or province (e.g., "California", "Ontario", "England")
7. **City** - User's city (e.g., "Los Angeles", "Toronto", "London")
8. **Timezone** - User's timezone (e.g., "America/Los_Angeles", "Europe/London")

### **Device & Browser Information** 💻
9. **User Agent** - Full browser string
10. **Browser** - Detected browser (Chrome, Firefox, Safari, Edge, etc.)
11. **Operating System** - OS (Windows 10, macOS, Android, iOS, etc.)
12. **Is Mobile** - Boolean (true/false)
13. **Screen Resolution** - Display size (e.g., "1920x1080", "375x667")

### **Search Performance** 🔍
14. **Results Count** - Number of Knowledge Graph results returned
15. **Has Results** - Boolean (true/false)
16. **Top Result Name** - Name of the highest-scoring result
17. **Top Result Score** - Google's confidence score
18. **Search Duration (ms)** - Time taken for search

### **User Context** 👤
19. **Language** - User's browser language (e.g., "en-US", "es-ES")
20. **Referrer** - Where the user came from

## 📈 **Analytics Insights You Can Track**

### **Geographic Analysis**
- Which countries search most frequently?
- Regional search patterns and trends
- Time zone-based usage patterns
- City-level search distribution

### **Search Behavior**
- Most popular search terms
- Search success rates by location
- Average search duration
- Mobile vs desktop usage patterns

### **Technical Analytics**
- Browser and OS distribution
- Screen resolution trends
- Language preferences
- Referrer sources

### **Performance Metrics**
- Search result quality scores
- Geographic variations in search success
- Device-specific search patterns
- Session-based user journeys

## 🎯 **Sample Analytics Queries**

### **Most Popular Searches by Country**
```sql
SELECT Country, Search Query, COUNT(*) as Search_Count
FROM [Your Sheet]
GROUP BY Country, Search Query
ORDER BY Search_Count DESC
```

### **Mobile vs Desktop Usage**
```sql
SELECT Is Mobile, COUNT(*) as Usage_Count
FROM [Your Sheet]
GROUP BY Is Mobile
```

### **Search Success Rate by Location**
```sql
SELECT Country, 
       COUNT(*) as Total_Searches,
       SUM(Has Results) as Successful_Searches,
       (SUM(Has Results) / COUNT(*)) * 100 as Success_Rate
FROM [Your Sheet]
GROUP BY Country
ORDER BY Success_Rate DESC
```

## 📊 **Recommended Google Sheets Formulas**

### **1. Search Success Rate**
```
=COUNTIF(H:H,TRUE)/COUNTA(A:A)
```

### **2. Most Popular Search Terms**
```
=QUERY(A:B,"SELECT B, COUNT(B) GROUP BY B ORDER BY COUNT(B) DESC LIMIT 10")
```

### **3. Geographic Distribution**
```
=QUERY(A:D,"SELECT D, COUNT(D) GROUP BY D ORDER BY COUNT(D) DESC")
```

### **4. Mobile vs Desktop Split**
```
=QUERY(A:K,"SELECT K, COUNT(K) GROUP BY K")
```

### **5. Average Search Score by Country**
```
=QUERY(A:P,"SELECT D, AVG(P) GROUP BY D ORDER BY AVG(P) DESC")
```

## 🔧 **Advanced Analytics Setup**

### **Create Pivot Tables for:**
- Search terms by country
- Success rates by device type
- Peak search times by timezone
- Browser distribution by region

### **Set Up Charts for:**
- Geographic search heat map
- Search volume over time
- Success rate trends
- Device usage patterns

### **Automated Reports:**
- Daily search summaries
- Weekly geographic reports
- Monthly trend analysis
- Quarterly performance reviews

## 🚀 **Business Intelligence Applications**

### **Market Research**
- Identify popular search terms in different regions
- Understand cultural search patterns
- Track emerging search trends

### **SEO Optimization**
- Optimize for high-performing search terms
- Target specific geographic markets
- Improve mobile search experience

### **User Experience**
- Identify search pain points
- Optimize for popular devices/browsers
- Improve search result relevance

### **Content Strategy**
- Create content for popular search terms
- Localize content for different regions
- Optimize for mobile users

## 📱 **Mobile-Specific Analytics**

Track mobile search patterns:
- iOS vs Android usage
- Mobile search success rates
- Screen size optimization
- Touch-friendly search behavior

## 🌍 **International Expansion**

Use location data to:
- Identify new market opportunities
- Understand regional search preferences
- Plan localized content strategies
- Track international user engagement

This enhanced tracking system gives you comprehensive insights into how users interact with your Knowledge Graph search, enabling data-driven decisions for optimization and growth!
