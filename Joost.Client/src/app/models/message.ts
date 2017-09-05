export class Message {
  Id: number;
  SenderId: number;
  ReceiverId: number;
  Title: string;
  Text: string;
  CreatedAt: Date;
  EditedAt: Date;
  AttachedFile: string;
  IsGroup: boolean;
}
