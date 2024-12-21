import IComponent from "./IComponent";
import Component from "./ComponentConsts";

export default class FadeInComponent implements IComponent
{
  public readonly name = Component.FADE_IN;
  public readonly duration: number;
  private completed: boolean;

  constructor(duration: number)
  {
    this.duration = duration;
    this.completed = false;
  }

  complete()
  {
    this.completed = true;
  }

  isComplete()
  {
    return this.completed;
  }
}