export const formatSalary = (min, max) => {
  const hasMin = min !== null && min !== undefined && min !== "";
  const hasMax = max !== null && max !== undefined && max !== "";

  if (!hasMin && !hasMax) {
    return "Thỏa thuận";
  }

  const formatMoney = (value) => {
    const numberValue = Number(value);

    if (Number.isNaN(numberValue)) return "";

    const million = numberValue / 1000000;

    return million % 1 === 0 ? million.toFixed(0) : million.toFixed(1);
  };

  const minSalary = hasMin ? formatMoney(min) : "";
  const maxSalary = hasMax ? formatMoney(max) : "";

  if (minSalary && maxSalary) {
    return `${minSalary}-${maxSalary} triệu VND`;
  }

  if (minSalary) {
    return `Từ ${minSalary} triệu VND`;
  }

  if (maxSalary) {
    return `Đến ${maxSalary} triệu VND`;
  }

  return "Thỏa thuận";
};
