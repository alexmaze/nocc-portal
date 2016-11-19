export function commonStatusFilter() {
  return function (value: any) {
    let arr = [];
    if (value) {
      for (let key in value) {
        if (value.hasOwnProperty(key)) {
          if (value[key] > 0) {
            let ckey = _.capitalize(key);
            arr.push(ckey + ' ' + value[key]);
          }
        }
      }
    }
    return arr.join(', ');
  };
}
