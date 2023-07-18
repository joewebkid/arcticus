/**
  Проверяет, все ли элементы множества setA присутствуют в множестве setB.
  @param {Set<T>} this - Первое множество.
  @param {Set<T>} setB - Второе множество.
  @returns {boolean} - true, если все элементы множества setA присутствуют в множестве setB, и false в противном случае. 
*/
Set.prototype.hasAll = function(setB) {
  if(!setB) return false
  for (const element of setB) {
    if (!this.has(element)) {
      return false;
    }
  }

  return true;
};

Set.prototype.hasAny = function(setB) {
  for (const element of setB) {
    if (this.has(element)) {
      return true;
    }
  }

  return false;
};