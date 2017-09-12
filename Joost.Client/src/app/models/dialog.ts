import {UserState} from "./user-detail";
export class Dialog {
  public Id: number;
  public Name: string;
  public LastMessage: string;
  public DateLastMessage: Date;
  public Avatar: string;
  public IsGroup: boolean;
  public UserState: UserState;
}
