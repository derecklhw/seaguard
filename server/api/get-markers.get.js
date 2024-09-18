import { getDB } from "../db/index";
import sql from "mssql";

export default defineEventHandler(async (event) => {
  const db = await getDB();

  const query = getQuery(event);
  const { startTime, endTime, userEmail } = query;

  try {
    const result = await db
      .request()
      .input("startTime", sql.VarChar, startTime)
      .input("endTime", sql.VarChar, endTime)
      .input("userEmail", sql.VarChar, userEmail).query(`
    SELECT Latitude, Longitude, MarkerId, startTime, endTime
    FROM BoatTracker BT
    WHERE 
        -- Check if any part of the existing booking overlaps with the new start and end times
        (
            -- Existing booking starts before the new end time
            -- and ends after the new start time
            LEFT(CAST(BT.startTime AS VARCHAR(MAX)), 10) <= LEFT(CAST(@endTime AS VARCHAR(MAX)), 10)
            AND LEFT(CAST(BT.endTime AS VARCHAR(MAX)), 10) >= LEFT(CAST(@startTime AS VARCHAR(MAX)), 10)
            
            AND
            (
                -- Check time overlap if dates are the same
                 (
                    SUBSTRING(CAST(BT.startTime AS VARCHAR(MAX)), 12, 8) <= SUBSTRING(CAST(@endTime AS VARCHAR(MAX)), 12, 8)
                    AND
                    SUBSTRING(CAST(BT.endTime AS VARCHAR(MAX)), 12, 8) >= SUBSTRING(CAST(@startTime AS VARCHAR(MAX)), 12, 8)
                    AND 
                    BT.userEmail != @userEmail
                )
                
                OR 

                (
                    SUBSTRING(CAST(BT.startTime AS VARCHAR(MAX)), 12, 8) = SUBSTRING(CAST(@startTime AS VARCHAR(MAX)), 12, 8)
                    AND
                    BT.userEmail != @userEmail
                )

                OR 

                (
                    SUBSTRING(CAST(BT.endTime AS VARCHAR(MAX)), 12, 8) = SUBSTRING(CAST(@endTime AS VARCHAR(MAX)), 12, 8)
                    AND 
                    BT.userEmail != @userEmail
                )
            )
        )
    `);
    
    return result.recordset;
  } catch (error) {
    console.error("Error fetching markers:", error);
    return { error: "Error fetching markers" };
  }
});
