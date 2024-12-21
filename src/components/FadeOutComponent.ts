import IComponent from "./IComponent";
import Component from "./ComponentConsts";

export default class FadeOutComponent implements IComponent
{
  public readonly name: string = Component.FADE_OUT;
  public duration: number;

  constructor(duration: number)
  {
    this.duration = duration;
  }
}