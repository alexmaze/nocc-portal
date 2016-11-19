export enum KeyStatus {
  active = 0,
  inactive = 1
}

export function keyStatusFilter() {
  return function (value: KeyStatus) {
    switch (value) {
      case KeyStatus.active:
        return 'In Use';
      case KeyStatus.inactive:
        return 'Suspended';
      default:
        return 'Unknow';
    }
  };
}
