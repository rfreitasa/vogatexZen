export default function agrupaObjetos(objects, field) {
    return objects.reduce((groups, obj) => {
        const value = obj[field];
        if (!groups[value]) {
          groups[value] = [];
        }
        groups[value].push(obj);
        return groups;
      }, {});
  }
  