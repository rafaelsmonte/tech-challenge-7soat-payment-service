import { MessageSender } from 'src/enum/message-sender.enum';
import { MessageTarget } from 'src/enum/message-target.enum';
import { MessageType } from 'src/enum/message-type.enum';

export type PaymentMessage = {
  type: MessageType;
  sender: MessageSender;
  target: MessageTarget;
  payload: object;
};
