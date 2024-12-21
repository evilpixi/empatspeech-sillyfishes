import IComponent from "./IComponent";
import Component from "./ComponentConsts";

export default class ClickableComponent implements IComponent
{
  public readonly name = Component.CLICKABLE;
  public onClick: () => void;

  constructor(onClick: () => void)
  {
    this.onClick = onClick;
  }
  idleAnimation: any;
}