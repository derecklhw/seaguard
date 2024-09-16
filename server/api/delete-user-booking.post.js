import { getDB } from "../db/index";
import sql from "mssql";

export default defineEventHandler(async (event) => {
  const db = await getDB();

  const body = await readBody(event);
  const { bookingId, userEmail } = body;
  console.log(bookingId, userEmail);
  try {
    // Delete the booking based on the provided booking ID
    const result = await db
      .request()
      .input("bookingId", sql.Int, bookingId)
      .input("userEmail", sql.VarChar, userEmail).query(`
            DELETE FROM BoatTracker
            WHERE Id = @bookingId
            AND userEmail = @userEmail
        `);

    if (result.rowsAffected[0] > 0) {
      return {
        success: true,
        message: "Booking deleted successfully",
      };
    } else {
      return {
        success: true,
        message: "Booking not found or already deleted",
      };
    }
  } catch (err) {
    console.error("Error deleting booking:", err);
    return {
      success: false,
      message: "Error deleting booking",
    };
  }
});
