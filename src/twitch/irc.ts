import NodeWS from "ws";

interface Badge {
  name: string;
  id: string;
}

export interface Emote {
  id: string;
  name: string;
  usage: Array<{
    startPos: number;
    endPos: number;
  }>;
  images: {
    "1x": URL;
    "2x": URL;
    "3x": URL;
  };
}

export enum USERTYPE {
  NORMAL = "normal",
  ADMIN = "admin",
  GLOBALMOD = "global_mod",
  STAFF = "staff",
}

export enum SUBPLAN {
  Prime = "Prime",
  Tier1 = "1000",
  Tier2 = "2000",
  Tier3 = "3000",
}

export enum USERNOTICETYPE {
  SUB = "sub",
  RESUB = "resub",
  SUBGIFT = "subgift",
  SUBMYSTERYGIFT = "submysterygift",
  GIFTPAIDUPGRADE = "giftpaidupgrade",
  REWARDGIFT = "rewardgift",
  ANONGIFTPAIDUPGRADE = "anongiftpaidupgrade",
  RAID = "raid",
  UNRAID = "unraid",
  RITUAL = "ritual",
  BITSBADGETIER = "bitsbadgetier",
}

type BadgeInfo = {
  subLength: number;
};

interface MessageSource {
  source: string;
  userName?: string;
}

interface Sendable {
  makeCommand(): string;
}

type UserNoticeBaseTags = {
  badgeInfo: BadgeInfo;
  badges: Badge[];
  color: string;
  displayName: string;
  emotes: Array<Emote>;
  id: string;
  login: string;
  mod: boolean;
  msgId: USERNOTICETYPE;
  roomId: string;
  subscriber: boolean;
  systemMsg: string;
  tmiSentTs: Date;
  turbo: boolean;
  userId: string;
  userType: USERTYPE;
};

export interface ClearChat {
  command: "CLEARCHAT";
  source: MessageSource;
  tags: {
    banDuration?: number;
    roomId: string;
    targetUserId?: string;
    tmiSentTs: Date;
  };
  channel: string;
  user?: string;
}

export interface ClearMessage {
  command: "CLEARMSG";
  source: MessageSource;
  tags: {
    login: string;
    roomId?: string;
    targetMsgId: string;
    tmiSentTs: Date;
  };
  channel: string;
  params: string;
}

export interface GlobalUserState {
  command: "GLOBALUSERSTATE";
  source: MessageSource;
  tags: {
    badgeInfo: BadgeInfo;
    badges: Badge[];
    color: string;
    displayName: string;
    emoteSets: string;
    turbo: boolean;
    userId: string;
    userType: USERTYPE;
  };
}

export interface Notice {
  command: "NOTICE";
  source: MessageSource;
  tags: {
    msgId: string;
    targetUserId?: string;
  };
  channel: string;
  params: string;
}

export interface PrivMsg {
  command: "PRIVMSG";
  source: MessageSource;
  tags: {
    badgeInfo: BadgeInfo;
    badges: Array<Badge>;
    bits?: number;
    color: string;
    displayName: string;
    emotes: Array<Emote>;
    firstMsg?: boolean;
    id: string;
    mod: boolean;
    replyParentMsgId?: string;
    replyParentUserId?: string;
    replyParentUserLogin?: string;
    replyParentDisplayName?: string;
    replyParentMsgBody?: String;
    roomId: string;
    subscriber: boolean;
    tmiSentTs: Date;
    turbo: boolean;
    userId: string;
    userType: USERTYPE;
    vip?: boolean;
  };
  channel: string;
  params: string;
}

export interface RoomState {
  command: "ROOMSTATE";
  source: MessageSource;
  tags: {
    emoteOnly: boolean;
    followersonly: number;
    r9k: boolean;
    roomId: string;
    slow: boolean;
    subsOnly: boolean;
  };
  channel: string;
}

interface UserNoticeBase {
  command: "USERNOTICE";
  source: MessageSource;
  channel: string;
  params?: string;
}

export interface UserNoticeSub extends UserNoticeBase {
  id: "sub";
  tags: {
    msgParamCumulativeMonths: number;
    msgParamShouldShareStreak: boolean;
    msgParamStreakMonths: number;
    msgParamSubPlan: SUBPLAN;
    msgParamSubPlanName: string;
  } & UserNoticeBaseTags;
}

export interface UserNoticeReSub extends UserNoticeBase {
  id: "resub";
  tags: UserNoticeSub["tags"];
}

export interface UserNoticeSubGift extends UserNoticeBase {
  id: "subgift";
  tags: {
    msgParamMonths: number;
    msgParamRecipientDisplayName: string;
    msgParamRecipientId: string;
    msgParamRecipientUserName: string;
    msgParamSubPlan: SUBPLAN;
    msgParamSubPlanName: string;
    msgParamGiftMonths: number;
  } & UserNoticeBaseTags;
}

export interface UserNoticeGiftPaidUpgrade extends UserNoticeBase {
  id: "giftpaidupgrade";
  tags: {
    msgParamPromoGiftTotal: number;
    msgParamPromoName: string;
    msgParamSenderLogin: string;
    msgParamSenderName: string;
  } & UserNoticeBaseTags;
}

export interface UserNoticeAnonGiftPaidUpgrade extends UserNoticeBase {
  id: "anongiftpaidupgrade";
  tags: {
    msgParamPromoGiftTotal: number;
    msgParamPromoName: string;
  } & UserNoticeBaseTags;
}

export interface UserNoticeRaid extends UserNoticeBase {
  id: "raid";
  tags: {
    msgParamDisplayName: string;
    msgParamLogin: string;
    msgParamViewerCount: number;
  } & UserNoticeBaseTags;
}

export interface UserNoticeRitual extends UserNoticeBase {
  id: "ritual";
  tags: {
    msgParamRitualName: string;
  } & UserNoticeBaseTags;
}

export interface UserNoticeBitsBadgeTier extends UserNoticeBase {
  id: "bitsbadgetier";
  tags: {
    msgParamThreshold: number;
  } & UserNoticeBaseTags;
}

export interface UserState {
  command: "USERSTATE";
  source: MessageSource;
  tags: {
    badgeInfo: BadgeInfo;
    badges: Badge[];
    color: string;
    displayName: string;
    emoteSets: string;
    id: string;
    mod: boolean;
    subscriber: boolean;
    turbo: boolean;
    userType: USERTYPE;
  };
  channel: string;
}

export interface Whisper {
  command: "WHISPER";
  source: MessageSource;
  tags: {
    badges: Badge[];
    color: string;
    displayName: string;
    emotes: Array<Emote>;
    messageId: string;
    threadId: string;
    turbo: boolean;
    userId: string;
    userType: USERTYPE;
  };
  fromUser: string;
  message: string;
}

export interface HostTarget {
  command: "HOSTTARGET";
  source: MessageSource;
  hostingChannel: string;
  hostedChannel: string | null;
  numberOfViewers: number;
}

export interface Reconnect {
  command: "RECONNECT";
  source: MessageSource;
}

type IRCINFO =
  | {
      command: "002" | "003" | "004" | "375" | "372";
      info: "info";
    }
  | {
      command: "001";
      info: "auth_success";
    }
  | {
      command: "376";
      info: "connected";
    };

export interface Join extends Sendable {
  channel: string | Array<string>;
}

export interface Part extends Sendable {
  channel: string | Array<string>;
}

export interface Nick extends Sendable {
  nickName: string;
}

export interface Pass extends Sendable {
  token: string;
}

export interface Ping {
  command: "PING";
  source: MessageSource;
}

export interface Pong extends Sendable {}

export interface UnknownCommand {
  command: "UNKNOWN";
}

type CommandUnion =
  | ClearChat
  | ClearMessage
  | Notice
  | GlobalUserState
  | PrivMsg
  | RoomState
  | UserNoticeSub
  | UserNoticeReSub
  | UserNoticeSubGift
  | UserNoticeBitsBadgeTier
  | UserNoticeGiftPaidUpgrade
  | UserNoticeAnonGiftPaidUpgrade
  | UserNoticeRaid
  | UserNoticeRitual
  | UserState
  | Whisper
  | HostTarget
  | Reconnect
  | IRCINFO
  | Ping
  | UnknownCommand;

export type ListenerOptions =
  | {
      [command in CommandUnion["command"]]?:
        | {
            // If selected command does not contain 'channel', 'channel?' is of type never
            // -> If contains channel, maps the source type to 'channel?'
            channel?: Extract<CommandUnion, { channel: any }> extends undefined
              ? never
              : string | Array<string> | "*";
          }
        | "*";
    }
  | "*";

class MessageEvent extends Event {
  command: CommandUnion;

  constructor(command: CommandUnion) {
    super("irc");
    this.command = command;
  }
}

export class ChatClient {
  ws!: WebSocket;
  clientNick!: string;
  clientPass!: string;
  connected: boolean = false;
  listeners: Map<(event: MessageEvent) => void, ListenerOptions> = new Map();
  enableRichMsg!: boolean;
  username?: string;

  constructor() {}

  public connect(
    nick?: string,
    pass?: string,
    enableRichMsg: boolean = true,
    server = "wss://irc-ws.chat.twitch.tv:443"
  ) {
    this.clientNick = nick ?? `justinfan${Math.floor(Math.random() * 1e4)}`;
    this.clientPass = pass ?? "SCHMOOPIIE";

    let _WebSocket: typeof WebSocket | typeof NodeWS;
    if (typeof window === "undefined") {
      _WebSocket = NodeWS;
    } else {
      _WebSocket = window.WebSocket;
    }
    this.ws = new _WebSocket(server) as WebSocket;

    this.ws.onopen = (event) => {
      this.ws.send(`PASS ${this.clientPass}`);
      this.ws.send(`NICK ${this.clientNick}`);

      if (enableRichMsg) {
        this.enableRichMsg = enableRichMsg;
        this.ws.send("CAP REQ :twitch.tv/commands twitch.tv/tags");
      }
    };
    this.ws.onmessage = (event) => {
      this.ircHandler(event.data);
    };
    this.connected = true;
  }

  public join(channelLogin: string) {
    // TODO join channel
  }

  public close() {
    if (this.connected) {
      this.ws.close();
    }
  }

  public addListener(
    handler: (event: MessageEvent) => void,
    options: ListenerOptions = { PRIVMSG: "*" }
  ): void {
    this.listeners.set(handler, options);
  }

  public removeListener(handler: (event: MessageEvent) => void): boolean {
    return this.listeners.delete(handler);
  }

  private ircHandler(message: string) {
    message = message.trim();
    let toParse = message.split("\r\n");

    toParse.forEach((message) => {
      message = message.trim();
      const command = ChatClient.parseMessage(message);

      this.dispatchEvent(command);
    });
  }

  dispatchEvent(command: CommandUnion) {
    for (const [listner, options] of this.listeners) {
      const messageEvent = new MessageEvent(command);

      if (options === "*") {
        listner(messageEvent);
        return;
      }

      if (!Object.hasOwn(options, command.command)) {
        return;
      }

      for (const opt of Object.keys(options)) {
        switch (opt) {
          case "channel":
            if (typeof opt === "string" && Object.hasOwn(command, "channel")) {
              console.log(123);
            }
            break;
        }
      }
    }
  }

  static parseMessage(message: string): CommandUnion {
    let rawTags: string | undefined;
    let rawSource: string | undefined;
    let rawCommand!: string;
    let rawChannel: string | undefined;
    let rawParam: string | undefined;

    let index = 0;
    // If includes tags
    if (message.charAt(index) === "@") {
      const partEnd = message.indexOf(" ");
      rawTags = message.slice(index + 1, partEnd);
      index = index + partEnd + 1;
    }
    // If includes source
    if (message.charAt(index) === ":" && !rawCommand) {
      const partEnd = message.indexOf(" ", index);
      rawSource = message.slice(index + 1, partEnd);
      index = partEnd + 1;
    }
    // Command
    {
      const partEnd = message.indexOf(" ", index);
      if (partEnd === -1) {
        rawCommand = message.slice(index);
      } else {
        rawCommand = message.slice(index, partEnd);
        index = partEnd;
      }
    }

    // If includes channel
    if (message.charAt(index + 1) === "#") {
      const partEnd = message.indexOf(" ", index + 1);
      if (partEnd !== -1) {
        rawChannel = message.slice(index + 2, partEnd);
      } else {
        rawChannel = message.slice(index + 2);
      }
      index = partEnd + 1;
    }
    // Params
    if (index !== 0) {
      rawParam = message.slice(index + 1);
    }

    let source: MessageSource | undefined;
    if (rawSource) {
      if (rawSource.includes("@")) {
        let user = rawSource.split("@")[0].split("!")[0];
        source = {
          source: rawSource.split("@")[1],
          userName: user,
        };
      } else {
        source = {
          source: rawSource,
        };
      }
    }

    let tags: any = {};
    if (rawTags) {
      rawTags.split(";").forEach(async (entry) => {
        let tag = entry.split("=")[0];
        const val = entry.split("=")[1];
        // Convert tag name to camel case
        if (tag.includes("-")) {
          const parts = tag.split("-");
          tag = "";
          for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            if (i === 0) {
              tag += part;
            } else {
              tag += part.charAt(0).toUpperCase() + part.slice(1);
            }
          }
        }

        tags[tag] = ((tag, val): any => {
          if (val === "") return undefined;
          switch (tag) {
            case "badges":
              let badges: Array<Badge> = [];
              val.split(",").forEach((badgeRaw) => {
                const badgeName = badgeRaw.split("/")[0];
                const badgeId = badgeRaw.split("/")[1];

                badges.push({
                  name: badgeName,
                  id: badgeId,
                });
              });
              return badges;
            case "emotes":
              let emotes: Array<Emote> = [];

              val.split("/").forEach((rawEmote) => {
                if (rawEmote === "") {
                  return;
                }

                let usage: Array<{
                  startPos: number;
                  endPos: number;
                }> = [];

                const [emoteId, rawUsage] = rawEmote.split(":");
                rawUsage.split(",").forEach((use) => {
                  const startPos = Number(use.split("-")[0]);
                  const endPos = Number(use.split("-")[1]) + 1;
                  usage.push({ startPos: startPos, endPos: endPos });
                });

                emotes.push({
                  id: emoteId,
                  name: rawParam!.slice(usage[0].startPos, usage[0].endPos),
                  usage: usage,
                  images: {
                    "1x": new URL(
                      `https://static-cdn.jtvnw.net/emoticons/v2/${emoteId}/default/dark/1.0`
                    ),
                    "2x": new URL(
                      `https://static-cdn.jtvnw.net/emoticons/v2/${emoteId}/default/dark/2.0`
                    ),
                    "3x": new URL(
                      `https://static-cdn.jtvnw.net/emoticons/v2/${emoteId}/default/dark/3.0`
                    ),
                  },
                });
              });
              return emotes;

            case "userType":
              return val as USERTYPE;
            case "tmiSentTs":
              return new Date(Number(val));
            case "banDuration":
              return Number(val);
            case "badgeInfo":
              return {
                subLength: Number(val.split("/")[1]),
              };
            case "firstMsg":
              return val === "1";
            case "turbo":
              return val === "1";
            case "bits":
              return Number(val);
            case "mod":
              return val === "1";
            case "subscriber":
              return val === "1";
            case "vip":
              return val === "1";
            case "emoteOnly":
              return val === "1";
            case "r9k":
              return val === "1";
            case "slow":
              return val === "1";
            case "subsOnly":
              return val === "1";
            case "followersOnly":
              return Number(val);
            case "msgParamCumulativeMonths":
              return Number(val);
            case "msgParamMonths":
              return Number(val);
            case "msgParamShouldShareStreak":
              return val === "1";
            case "msgParamStreakMonths":
              return val === "1";
            case "msgParamViewerCount":
              return Number(val);
            case "msgParamThreshold":
              return Number(val);
            case "msgParamGiftMonths":
              return Number(val);
            default:
              return val;
          }
        })(tag, val);
      });
    }

    let command: CommandUnion;
    switch (rawCommand) {
      case "CLEARCHAT":
        command = {
          command: "CLEARCHAT",
          source: source,
          tags: tags as ClearChat["tags"],
          channel: rawChannel,
          user: rawParam,
        } as ClearChat;
        break;
      case "CLEARMSG":
        command = {
          command: "CLEARMSG",
          source: source!,
          tags: tags as ClearMessage["tags"],
          channel: rawChannel!,
          params: rawParam,
        } as ClearMessage;
        break;
      case "GLOBALUSERSTATE":
        command = {
          command: "GLOBALUSERSTATE",
          source: source,
          tags: tags as GlobalUserState["tags"],
        } as GlobalUserState;
        break;
      case "PRIVMSG":
        command = {
          command: "PRIVMSG",
          source: source,
          tags: tags as PrivMsg["tags"],
          channel: rawChannel,
          params: rawParam,
        } as PrivMsg;
        break;
      case "HOSTTARGET":
        const [hostedChannel, numberOfViewers] = rawParam!.split(" ");
        // Ended hosting
        if (hostedChannel === "-") {
          command = {
            command: "HOSTTARGET",
            source: source,
            hostingChannel: rawChannel,
            hostedChannel: null,
            numberOfViewers: Number(numberOfViewers),
          } as HostTarget;
          break;
        } else {
          command = {
            command: "HOSTTARGET",
            source: source,
            hostingChannel: rawChannel,
            hostedChannel: rawChannel,
            numberOfViewers: Number(numberOfViewers),
          } as HostTarget;
          break;
        }
      case "NOTICE":
        command = {
          command: "NOTICE",
          source: source,
          tags: tags as Notice["tags"],
          channel: rawChannel,
          params: rawParam,
        } as Notice;
        break;
      case "RECONNECT":
        command = {
          command: "RECONNECT",
          source: source,
        } as Reconnect;
        break;
      case "ROOMSTATE":
        command = {
          command: "ROOMSTATE",
          source: source,
          tags: tags as RoomState["tags"],
          channel: rawChannel,
        } as RoomState;
        break;
      case "USERNOTICE":
        const userNoticeTags = tags as UserNoticeBaseTags;
        let userNoticeCommand: CommandUnion;
        switch (userNoticeTags["msgId"]) {
          case "sub":
            userNoticeCommand = {
              command: "USERNOTICE",
              id: "sub",
              source: source,
              tags: tags as UserNoticeSub["tags"],
              channel: rawChannel,
              params: rawParam,
            } as UserNoticeSub;
            break;
          case "resub":
            userNoticeCommand = {
              command: "USERNOTICE",
              id: "resub",
              source: source,
              tags: tags as UserNoticeReSub["tags"],
              channel: rawChannel,
              params: rawParam,
            } as UserNoticeReSub;
            break;
          case "subgift":
            userNoticeCommand = {
              command: "USERNOTICE",
              id: "subgift",
              source: source,
              tags: tags as UserNoticeSubGift["tags"],
              channel: rawChannel,
              params: rawParam,
            } as UserNoticeSubGift;
            break;
          case "giftpaidupgrade":
            userNoticeCommand = {
              command: "USERNOTICE",
              id: "giftpaidupgrade",
              source: source,
              tags: tags as UserNoticeGiftPaidUpgrade["tags"],
              channel: rawChannel,
              params: rawParam,
            } as UserNoticeGiftPaidUpgrade;
            break;
          case "anongiftpaidupgrade":
            userNoticeCommand = {
              command: "USERNOTICE",
              id: "anongiftpaidupgrade",
              source: source,
              tags: tags as UserNoticeAnonGiftPaidUpgrade["tags"],
              channel: rawChannel,
              params: rawParam,
            } as UserNoticeAnonGiftPaidUpgrade;
            break;
          case "raid":
            userNoticeCommand = {
              command: "USERNOTICE",
              id: "raid",
              source: source,
              tags: tags as UserNoticeRaid["tags"],
              channel: rawChannel,
              params: rawParam,
            } as UserNoticeRaid;
            break;
          // case 'unraid': // TODO Investigate unraid
          case "ritual":
            userNoticeCommand = {
              command: "USERNOTICE",
              id: "ritual",
              source: source,
              tags: tags as UserNoticeRitual["tags"],
              channel: rawChannel,
              params: rawParam,
            } as UserNoticeRitual;
            break;
          case "bitsbadgetier":
            userNoticeCommand = {
              command: "USERNOTICE",
              id: "bitsbadgetier",
              source: source,
              tags: tags as UserNoticeBitsBadgeTier["tags"],
              channel: rawChannel,
              params: rawParam,
            } as UserNoticeBitsBadgeTier;
            break;
        }
        command = userNoticeCommand!;
        break;
      case "USERSTATE":
        command = {
          command: "USERSTATE",
          source: source,
          tags: tags as UserState["tags"],
          channel: rawChannel,
        } as UserState;
        break;
      case "WHISPER":
        const [fromUser, message] = rawParam!.split(" ");
        command = {
          command: "WHISPER",
          source: source,
          tags: tags as Whisper["tags"],
          fromUser: fromUser,
          message: message.slice(1),
        } as Whisper;
        break;
      case "001" || "002" || "003" || "004" || "375" || "372" || "376":
        let info: IRCINFO["info"] = "info";
        if (rawCommand === "001") {
          info = "auth_success";
        } else if (rawCommand === "376") {
          info = "connected";
        }
        command = {
          command: rawCommand,
          info: info,
        } as IRCINFO;
        break;
      default:
        command = { command: "UNKNOWN" } as UnknownCommand;
        break;
    }
    return command;
  }
}
