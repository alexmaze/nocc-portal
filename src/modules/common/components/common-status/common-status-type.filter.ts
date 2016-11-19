export function commonStatusTypeFilter() {
  return function (value: string) {
    let temp = value.toLowerCase();
    switch (temp) {
      case 'down':
      case 'bad':
      case 'stopped':
      case 'backoff':
      case 'stopping':
      case 'exited':
      case 'fatal':
      case 'readonly':
      case 'unavailable':
      case 'error':
        return 'error';
      case 'up':
      case 'good':
      case 'running':
      case 'rw':
      case 'active':
      case 'information':
      case 'info':
        return 'normal';
      case 'ro':
      case 'inactive':
      case 'warning':
      case 'warn':
        return 'warning';
      case 'critical':
        return 'critical';
    }
    return 'default';
  };
}

