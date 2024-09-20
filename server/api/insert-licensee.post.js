import { getDB } from "../db/index";
import sql from "mssql";

export default defineEventHandler(async (event) => {
  try {
    const db = await getDB();

    const body = await readBody(event);
    const {
      licensee,
      address,
      registration_no,
      mooring_place,
      receipt_no,
      date_issued,
      email,
      userPrincipalName,
    } = body;

    const response = await db
      .request()
      .input("Licensee", sql.NVarChar, licensee)
      .input("Address", sql.NVarChar, address)
      .input("RegistrationNo", sql.NVarChar, registration_no)
      .input("MooringPlace", sql.NVarChar, mooring_place)
      .input("ReceiptNo", sql.NVarChar, receipt_no)
      .input("DateIssued", sql.DateTime, date_issued)
      .input("UserEmail", sql.NVarChar, email)
      .query(
        "INSERT INTO Licensee (Licensee, Address, RegistrationNo, MooringPlace, ReceiptNo, DateIssued, UserEmail) VALUES (@Licensee, @Address, @RegistrationNo, @MooringPlace, @ReceiptNo, @DateIssued, @UserEmail)"
      );

    if (response.rowsAffected[0] === 1) {
      const updateRole = await db
        .request()
        .input("UserPrincipalName", sql.NVarChar, userPrincipalName)
        .input("Role", sql.NVarChar, "Skipper")
        .query(
          "UPDATE users SET Role = @Role WHERE UserPrincipalName = @UserPrincipalName"
        );
      if (updateRole.rowsAffected[0] === 1) {
        return {
          success: true,
          message: "Licensee inserted successfully",
        };
      } else {
        throw Error("Failed to update role");
      }
    } else {
      throw Error("Failed to insert licensee");
    }
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: "Error inserting user",
    };
  }
});
