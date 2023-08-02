import { ChatClient as TwitchChatClient } from "./twitch/irc.js";

export class TwitchClient extends EventTarget {
  clientId: string;
  token: string;
  chatNickname: string;

  twitchChatClient?: TwitchChatClient;

  constructor(
    clientID: string,
    token: string,
    chatNickname: string,
    options = {
      chat: true,
      pubsub: true,
    }
  ) {
    super();
    this.clientId = clientID;
    this.token = token;
    this.chatNickname = chatNickname;
  }

  getChatClient(): TwitchChatClient {
    if (this.twitchChatClient) {
      return this.twitchChatClient;
    }
    this.twitchChatClient = new TwitchChatClient(
      this.chatNickname,
      `oauth:${this.token}`
    );
    return this.twitchChatClient;
  }
}
