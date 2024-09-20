import { getDB } from "../db/index";
import sql from "mssql";

export default defineEventHandler(async (event) => {
  try {
    const db = await getDB();

    const body = await readBody(event);
    const { givenName, id, mail, surname, userPrincipalName } = body;

    const checkUserExists =
      await db.query`SELECT * FROM users where userPrincipalName = ${userPrincipalName}`;

    if (checkUserExists.recordset.length > 0) {
      return {
        success: true,
        message: checkUserExists.recordset[0],
      };
    }

    const response = await db
      .request()
      .input("Email", sql.NVarChar, mail)
      .input("UserPrincipalName", sql.NVarChar, userPrincipalName)
      .input("Surname", sql.NVarChar, surname)
      .input("Id", sql.NVarChar, id)
      .input("GivenName", sql.NVarChar, givenName)
      .input("Role", sql.NVarChar, "User")
      .query(
        "INSERT INTO users (Email, UserPrincipalName, Surname, Id, GivenName, Role) OUTPUT INSERTED.Id VALUES (@Email, @UserPrincipalName, @Surname, @Id, @GivenName, @Role)"
      );

    return { success: true, message: response.recordset[0] };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: "Error inserting user",
    };
  }
});
