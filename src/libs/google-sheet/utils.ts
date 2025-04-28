import { JWT } from "google-auth-library";
import { google } from "googleapis";
import {
  GOOGLE_PRIVATE_KEY,
  GOOGLE_SERVICE_ACCOUNT_EMAIL,
} from "../../settings";

// Google Sheets APIの設定
const SPREADSHEET_ID = "1EgCnN36YyzSGZn9EFX_fIbnbk2c4Uc2BHWC0EmXOaZQ";

const auth = new JWT({
  email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

export const appendSpreadsheetData = async (range: string, values: any[][]) => {
  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: range,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: values,
      },
    });
  } catch (error) {
    console.error("Error appending user data:", error);
    throw error;
  }
};

export const updateSpreadsheetData = async (range: string, values: any[][]) => {
  try {
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: range,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: values,
      },
    });
  } catch (error) {
    console.error("Error updating user data:", error);
    throw error;
  }
};

export const getSpreadsheetData = async (range: string) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: range,
    });
    return response.data.values;
  } catch (error) {
    console.error("Error fetching spreadsheet data:", error);
    throw error;
  }
};
