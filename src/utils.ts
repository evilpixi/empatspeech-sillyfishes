export default class Utils
{
  static getRandomFromArray<T>(array: T[]): T
  {
    return array[Math.floor(Math.random() * array.length)];
  }

  static getFromLocalStorage(key: string, defaultValue: string = ""): string
  {
    let item = localStorage.getItem(key);
    if (item === null)
    {
      localStorage.setItem(key, defaultValue);
      item = defaultValue;
    }
    return item;
  }

  static setToLocalStorage(key: string, value: any): void
  {
    localStorage.setItem(key, value);
  }
}