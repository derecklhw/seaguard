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

const getDB = () => {
  if (!db) {
    throw new Error("Database not connected");
  }
  return db;
};

export { connectDB, getDB };
