import sql from "mssql";

let db;

const connectDB = async () => {
  if (db) return db;

  const config = useRuntimeConfig();

  try {
    console.log("Database Connecting");
    db = await sql.connect(config.azureMSSQLConfig);
    console.log("Database Connected");
    return db;
  } catch (error) {
    console.log(error);
  }
};

const getDB = async () => {
  if (!db) {
    console.log("Database not connected, retrying to connect");
    await connectDB();
    getDB();
  }
  return db;
};

export { connectDB, getDB };
