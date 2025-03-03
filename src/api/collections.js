const { connectToDatabase } = require('./mongodb');

module.exports = async (req, res) => {
  try {
    const { db } = await connectToDatabase(process.env.MONGODB_URI);
    const databaseName = req.query.db;
    if (!databaseName) {
      console.error("Database name is missing in the request");
      return res.status(400).json({ error: "Database name is required" });
    }
    console.log(`Fetching collections from database: ${databaseName}`);
    const collections = await db.db(databaseName).listCollections().toArray();
    console.log(`Fetched collections from database ${databaseName}:`, collections);
    res.status(200).json({ collections });
  } catch (error) {
    console.error("Error fetching collections:", error);
    res.status(500).json({ error: "Failed to fetch collections" });
  }
};
