export default class Fish
{
  name: string;
  id: string;
  canSwim: boolean;
  canGroup: boolean;
  isLong: boolean;
  width: number;
  height: number;

  constructor(data:
    {
      name: string;
      id: string;
      canSwim: boolean;
      canGroup: boolean;
      isLong: boolean;
      width: number;
      height: number
    })
  {
    this.name = data.name;
    this.id = data.id;
    this.canSwim = data.canSwim;
    this.canGroup = data.canGroup;
    this.isLong = data.isLong;
    this.width = data.width;
    this.height = data.height;
  }
}