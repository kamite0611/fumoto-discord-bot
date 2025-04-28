import { JWT } from "google-auth-library";
import { google } from "googleapis";

// サービスアカウントの認証
const auth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

const sheets = google.sheets({ version: "v4", auth });

export const getSpreadsheetData = async () => {
  console.log("sheets", sheets);
};
