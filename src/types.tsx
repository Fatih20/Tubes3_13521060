export type ChatSession = {
  id: string;
  userId: string;
  title: string;
};

export type Chat = {
  fromUser: boolean;
  text: string;
  textLength: number;
  time: Date;
};
