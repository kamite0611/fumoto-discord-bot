import { Message } from "discord.js";
import { getUserId, getUserName } from "../discord";
import {
  appendSpreadsheetData,
  deleteRow,
  getSpreadsheetData,
  updateSpreadsheetData,
} from "./utils";

type UserRow = {
  userId: string;
  userName: string;
  date: string;
};

const SHEET_NAME = "ユーザー一覧";

export const getUserRow = async (
  message: Message
): Promise<{ rowIndex: number; userRow: UserRow } | null> => {
  const userId = getUserId(message);

  try {
    const values = await getSpreadsheetData(`${SHEET_NAME}!A:C`);
    if (!values) return null;

    // ユーザーIDが一致する行を検索
    const rowIndex = values.findIndex((row) => row[0] === userId);
    if (rowIndex === -1) return null;

    const userRow = values[rowIndex];
    if (!userRow) return null;

    return {
      rowIndex: rowIndex + 1,
      userRow: {
        userId: userRow[0],
        userName: userRow[1],
        date: userRow[2],
      },
    };
  } catch (error) {
    console.error("Error fetching user row:", error);
    throw error;
  }
};

export const createUserRow = async (
  message: Message,
  newDate: string
): Promise<UserRow> => {
  const userId = getUserId(message);
  const userName = getUserName(message);
  const values = [[userId, userName, newDate]];

  try {
    // A:C列の最後の空いている行にデータを追加
    await appendSpreadsheetData(`${SHEET_NAME}!A:C`, values);

    return {
      userId: userId,
      userName: userName,
      date: newDate,
    };
  } catch (error) {
    console.error("Error creating user row:", error);
    throw error;
  }
};

export const updateUserRow = async (
  rowIndex: number,
  message: Message,
  newDate: string
): Promise<UserRow> => {
  const userId = getUserId(message);
  const userName = getUserName(message);
  const values = [[userId, userName, newDate]];

  try {
    // 既存の行を更新
    await updateSpreadsheetData(
      `${SHEET_NAME}!A${rowIndex}:C${rowIndex}`,
      values
    );

    return {
      userId: userId,
      userName: userName,
      date: newDate,
    };
  } catch (error) {
    console.error("Error updating user row:", error);
    throw error;
  }
};

export const deleteUserRow = async (rowIndex: number, message: Message) => {
  try {
    // 行を削除
    await deleteRow(rowIndex);
    return true;
  } catch (error) {
    console.error("Error deleting user row:", error);
    throw error;
  }
};
