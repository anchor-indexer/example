function cache<T>(k: string, v?: T): T | null {
  k = `royalty-tools:${k}`;

  switch (arguments.length) {
    case 2:
      v === null
        ? window.localStorage.removeItem(k)
        : window.localStorage.setItem(k, JSON.stringify(v));
      return null;

    case 1:
      try {
        return JSON.parse(window.localStorage.getItem(k)!) as T;
      } catch (e) {
        return null;
      }

    default:
      return null;
  }
}

export default cache;
