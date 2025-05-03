const DISCORD_WEBHOOK_URL =
  "https://discord.com/api/webhooks/1368113684345262142/-sIzeD_nv3fse5x1Z7Q0INf3ew9-X0gLABFqoTBTQxKPKRY6EE10XRGgn-De_LvLMQsA";

function getFUMOTOData() {
  const res = UrlFetchApp.fetch(
    "https://reserve.fumotoppara.net/api/shared/reserve/calendars",
    {
      headers: { "X-Api-Key": "51ff85fe-ca21-4a42-f8cc-cf5f34b964e5" },
    }
  );
  const caledersData = JSON.parse(res.getContentText());
  const calendarsSiteDateList = caledersData.calendarsSiteDateList;
  const campStayDataList = calendarsSiteDateList.filter(
    (data) => data.siteGroupCd == "01" && data.stayDiv == "STAY"
  );
  return campStayDataList;
}

const cmpDate = (date1, date2) => {
  if (date1.getFullYear() !== date2.getFullYear()) return false;
  if (date1.getMonth() !== date2.getMonth()) return false;
  if (date1.getDate() !== date2.getDate()) return false;
  return true;
};

function findFUMOTODateByDate(date, FUMOTOData) {
  return FUMOTOData.find((data) => cmpDate(date, new Date(data.calDate)));
}

function sendMessageToDiscord(targetData, targetUser) {
  const message = {
    content: `<@${targetUser.userId}> **${targetData.calDate}の予約枠があります！**\n残り${targetData.remainCount}サイト\n\n予約サイト: https://reserve.fumotoppara.net/`,
    embeds: [
      {
        title: "FUMOTO空き情報",
        color: 5814783,
        fields: [
          {
            name: "日付",
            value: targetData.calDate,
            inline: true,
          },
          {
            name: "サイト残数",
            value: targetData.remainCount.toString(),
            inline: true,
          },
          {
            name: "予約数",
            value: targetData.reserveCount,
            inline: true,
          },
        ],
        footer: {
          text: "FUMOTO予約通知システム",
        },
        timestamp: new Date().toISOString(),
      },
    ],
  };

  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(message),
  };

  UrlFetchApp.fetch(DISCORD_WEBHOOK_URL, options);
}

function deleteInvalidDates(userData, sheet) {
  const today = new Date();

  // 過去の日付を持つ行をシートから削除
  const rowsToDelete = [];
  userData.forEach((user, index) => {
    const userDate = new Date(user.date);
    userDate.setHours(0, 0, 0, 0);
    if (userDate < today) {
      // シートの行番号は1始まり、ヘッダー行(1行目)と0始まりのインデックスを考慮して+2
      rowsToDelete.push(index + 2);
    }
  });

  // 削除すべき行がある場合、古い行から順に削除（降順でソートして削除）
  if (rowsToDelete.length > 0) {
    rowsToDelete.sort((a, b) => b - a); // 降順ソート
    rowsToDelete.forEach((rowIndex) => {
      sheet.deleteRow(rowIndex);
    });
  }
}

function myFunction() {
  const spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadSheet.getSheetByName("ユーザー一覧");
  if (!sheet) {
    return;
  }

  // シートからデータ範囲を取得
  const lastRow = sheet.getLastRow();
  const dataRange = sheet.getRange(2, 1, lastRow - 1, 3); // A〜C列を取得（2行目から開始）
  const values = dataRange.getValues();

  // 取得したデータを処理
  const userData = values.map((row) => {
    return {
      userId: row[0], // A列: userID
      name: row[1], // B列: 名前
      date: row[2], // C列: 日付(yyyy-mm-dd)
    };
  });
  if (userData.length == 0) return;

  // 現在の日付
  const today = new Date();
  today.setHours(0, 0, 0, 0); // 時間部分をリセット

  // 過去の日付を除外
  const validUserData = userData.filter((user) => {
    const userDate = new Date(user.date);
    userDate.setHours(0, 0, 0, 0); // 時間部分をリセット
    return userDate >= today;
  });

  deleteInvalidDates(userData, sheet);
  if (validUserData.length > 0) return;

  const FUMOTOData = getFUMOTOData();
  // 有効なデータだけを処理
  validUserData.forEach((user) => {
    const targetData = findFUMOTODateByDate(user.date, FUMOTOData);
    if (!targetData) return;
    if (targetData.remainCount < 1) return;
    sendMessageToDiscord(targetData, user);
  });
}
