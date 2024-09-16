import { getDB } from "../db/index";
import sql from "mssql";

export default defineEventHandler(async (event) => {
  const db = await getDB();

  const body = await readBody(event);
  const { markerId, latitude, longitude, startTime, endTime, userEmail } = body;

  try {
    // Parse startTime and endTime to Date objects
    let startDate = new Date(startTime);
    let endDate = new Date(endTime);

    // Add 4 hours to both startTime and endTime
    startDate.setHours(startDate.getHours() + 4);
    endDate.setHours(endDate.getHours() + 4);

    // Convert back to the desired format for SQL query
    var newStartTime = startDate.toISOString();
    var newEndTime = endDate.toISOString();

    console.log(
      markerId,
      latitude,
      longitude,
      newStartTime,
      newEndTime,
      userEmail
    );

    // Check for overlapping bookings using start and end times with userEmail
    const checkStartResult = await db
      .request()
      .input("userEmail", sql.VarChar, userEmail)
      .input("newStartTime", sql.Text, newStartTime)
      .query(
        "SELECT COUNT(*) as count FROM BoatTracker BT WHERE BT.userEmail = @userEmail AND BT.startTime like @newStartTime"
      );

    const checkEndResult = await db
      .request()
      .input("userEmail", sql.VarChar, userEmail)
      .input("newEndTime", sql.Text, newEndTime)
      .query(
        "SELECT COUNT(*) as count FROM BoatTracker BT WHERE BT.userEmail = @userEmail AND BT.endTime like @newEndTime"
      );

    const checkEndTimeOverlap = await db
      .request()
      .input("userEmail", sql.VarChar, userEmail)
      .input("newEndTime", sql.Text, newEndTime).query(`
            SELECT COUNT(*) as count 
            FROM BoatTracker BT 
            WHERE BT.userEmail = @userEmail 
            AND (
                LEFT(CAST(@newEndTime AS VARCHAR(MAX)), 10) = LEFT(CAST(BT.startTime AS VARCHAR(MAX)), 10) -- Compare dates (YYYY-MM-DD)
                AND SUBSTRING(CAST(@newEndTime AS VARCHAR(MAX)), 12, 8) BETWEEN SUBSTRING(CAST(BT.startTime AS VARCHAR(MAX)), 12, 8) AND SUBSTRING(CAST(BT.endTime AS VARCHAR(MAX)), 12, 8) -- Compare times (HH:MM:SS)
            )
        `);

    const checkStartTimeOverlap = await db
      .request()
      .input("userEmail", sql.VarChar, userEmail)
      .input("newStartTime", sql.Text, newStartTime).query(`
            SELECT COUNT(*) as count 
            FROM BoatTracker BT 
            WHERE BT.userEmail = @userEmail 
            AND (
                LEFT(CAST(@newStartTime AS VARCHAR(MAX)), 10) = LEFT(CAST(BT.startTime AS VARCHAR(MAX)), 10) -- Compare dates (YYYY-MM-DD)
                AND SUBSTRING(CAST(@newStartTime AS VARCHAR(MAX)), 12, 8) BETWEEN SUBSTRING(CAST(BT.startTime AS VARCHAR(MAX)), 12, 8) AND SUBSTRING(CAST(BT.endTime AS VARCHAR(MAX)), 12, 8) -- Compare times (HH:MM:SS)
            )
        `);

    if (checkStartResult.recordset[0].count > 0) {
      return {
        error: "A booking with the same start time already exists.",
      };
    }

    if (checkEndResult.recordset[0].count > 0) {
      return {
        error: "A booking with the same end time already exists.",
      };
    }

    if (checkEndTimeOverlap.recordset[0].count > 0) {
      return {
        error: "End time is overlapping with an existing booking.",
      };
    }

    if (checkStartTimeOverlap.recordset[0].count > 0) {
      return {
        error: "Start time is overlapping with an existing booking.",
      };
    }

    // Insert new record into BoatTracker table
    const insertResult = await db
      .request()
      .input("markerId", sql.Int, markerId)
      .input("latitude", sql.Float, latitude)
      .input("longitude", sql.Float, longitude)
      .input("newStartTime", sql.Text, newStartTime)
      .input("newEndTime", sql.Text, newEndTime)
      .input("userEmail", sql.VarChar, userEmail)
      .query(
        "INSERT INTO BoatTracker (MarkerId, Latitude, Longitude, startTime, endTime, userEmail) OUTPUT Inserted.Id VALUES (@markerId, @latitude, @longitude, @newStartTime, @newEndTime, @userEmail)"
      );

    const newBookingId = insertResult.recordset[0].Id;

    return { message: "Booking successful.", bookingId: newBookingId };
  } catch (error) {
    console.error("Error processing booking:", error);
    return { error: "An error occurred while processing the booking." };
  }
});
