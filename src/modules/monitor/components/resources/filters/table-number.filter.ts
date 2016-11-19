export function tableNumber() {
  return function (value: any, fix: number) {
    if (isNaN(value)) {
      return 'NaN';
    }
    if (value === undefined || value === null || value === '') {
      return '-';
    }
    return parseFloat(value).toFixed(fix);
  };
}
