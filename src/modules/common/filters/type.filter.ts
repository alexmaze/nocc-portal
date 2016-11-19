/** @ngInject */
export function type(typeConstants: any) {

  function typeTransform(value: string, type: string) {
    return typeConstants[type] && typeConstants[type][value] ? typeConstants[type][value] : 'UNKNOW';
  }
  return typeTransform;

}
