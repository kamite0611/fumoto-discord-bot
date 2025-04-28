import { JWT } from "google-auth-library";
import { google } from "googleapis";
import { GOOGLE_PRIVATE_KEY, GOOGLE_SERVICE_ACCOUNT_EMAIL } from "./settings";

// Google Sheets APIの設定
const SPREADSHEET_ID = "1EgCnN36YyzSGZn9EFX_fIbnbk2c4Uc2BHWC0EmXOaZQ";

const auth = new JWT({
  email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

// スプレッドシートからデータを取得
export async function getSpreadsheetData(range = "ユーザー一覧") {
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
}

// スプレッドシートにデータを書き込み
export async function writeSpreadsheetData(range: string, values: any[][]) {
  try {
    const response = await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: range,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: values,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error writing spreadsheet data:", error);
    throw error;
  }
}

// スプレッドシートにデータを追加
export async function appendSpreadsheetData(range: string, values: any[][]) {
  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: range,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: values,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error appending spreadsheet data:", error);
    throw error;
  }
}
