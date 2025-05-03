export const validateDate = (date: string) => {
  const dateRegex = /^\d{2}-\d{2}$/;
  return dateRegex.test(date);
};

export const getTargetDate = (date: string) => {
  const [month, day] = date.split("-");

  const targetDate = new Date(
    new Date().getFullYear(),
    parseInt(month) - 1,
    parseInt(day)
  );

  if (targetDate < new Date())
    targetDate.setFullYear(targetDate.getFullYear() + 1);

  return targetDate;
};

export const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};
