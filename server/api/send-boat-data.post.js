import { getDB } from "../db/index";
import sql from "mssql";

export default defineEventHandler(async (event) => {
  const db = await getDB();

  const body = await readBody(event);
  const { markerId, latitude, longitude, startTime, endTime, userEmail } = body;

  try {
    console.log(
      markerId,
      latitude,
      longitude,
      startTime,
      endTime,
      userEmail
    );

    // Check for overlapping bookings using start and end times with userEmail
    const checkStartResult = await db
      .request()
      .input("userEmail", sql.VarChar, userEmail)
      .input("startTime", sql.Text, startTime)
      .query(
        "SELECT COUNT(*) as count FROM BoatTracker BT WHERE BT.userEmail = @userEmail AND BT.startTime like @startTime"
      );

    const checkEndResult = await db
      .request()
      .input("userEmail", sql.VarChar, userEmail)
      .input("endTime", sql.Text, endTime)
      .query(
        "SELECT COUNT(*) as count FROM BoatTracker BT WHERE BT.userEmail = @userEmail AND BT.endTime like @endTime"
      );

    const checkEndTimeOverlap = await db
      .request()
      .input("userEmail", sql.VarChar, userEmail)
      .input("endTime", sql.Text, endTime).query(`
            SELECT COUNT(*) as count 
            FROM BoatTracker BT 
            WHERE BT.userEmail = @userEmail 
            AND (
                LEFT(CAST(@endTime AS VARCHAR(MAX)), 10) = LEFT(CAST(BT.startTime AS VARCHAR(MAX)), 10) -- Compare dates (YYYY-MM-DD)
                AND SUBSTRING(CAST(@endTime AS VARCHAR(MAX)), 12, 8) BETWEEN SUBSTRING(CAST(BT.startTime AS VARCHAR(MAX)), 12, 8) AND SUBSTRING(CAST(BT.endTime AS VARCHAR(MAX)), 12, 8) -- Compare times (HH:MM:SS)
            )
        `);

    const checkStartTimeOverlap = await db
      .request()
      .input("userEmail", sql.VarChar, userEmail)
      .input("startTime", sql.Text, startTime).query(`
            SELECT COUNT(*) as count 
            FROM BoatTracker BT 
            WHERE BT.userEmail = @userEmail 
            AND (
                LEFT(CAST(@startTime AS VARCHAR(MAX)), 10) = LEFT(CAST(BT.startTime AS VARCHAR(MAX)), 10) -- Compare dates (YYYY-MM-DD)
                AND SUBSTRING(CAST(@startTime AS VARCHAR(MAX)), 12, 8) BETWEEN SUBSTRING(CAST(BT.startTime AS VARCHAR(MAX)), 12, 8) AND SUBSTRING(CAST(BT.endTime AS VARCHAR(MAX)), 12, 8) -- Compare times (HH:MM:SS)
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
      .input("startTime", sql.Text, startTime)
      .input("endTime", sql.Text, endTime)
      .input("userEmail", sql.VarChar, userEmail)
      .query(
        "INSERT INTO BoatTracker (MarkerId, Latitude, Longitude, startTime, endTime, userEmail) OUTPUT Inserted.Id VALUES (@markerId, @latitude, @longitude, @startTime, @endTime, @userEmail)"
      );

    const newBookingId = insertResult.recordset[0].Id;

    return { message: "Booking successful.", bookingId: newBookingId };
  } catch (error) {
    console.error("Error processing booking:", error);
    return { error: "An error occurred while processing the booking." };
  }
});
