module.exports = {
  PORT: process.env.PORT || 4000,
  
  // Since we are running on fixed data only once, 
  // we can use this as a delay before the first sync if needed.
  SIMULATOR_INTERVAL_MS: 5000, 

  // The ACO algorithm can use this to decide which bins to include
  FILL_THRESHOLD: 80,

  // Add your MongoDB URI here to keep server.js clean
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://mohdazamansari52_db_user:5w0c6vK2EIEJpXrs@cluster0.cjahvvr.mongodb.net/?appName=cluster0'
};