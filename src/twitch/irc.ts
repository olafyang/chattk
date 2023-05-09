import { HelixClient, Badge, Badges } from "./helix";

export interface Emote {
  id: string;
  usage: Array<{
    startPos: number;
    length: number;
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

type TwitchTagType = {
  ClearChat: {
    banDuration?: number;
    roomId: string;
    targetUserId?: string;
    tmiSentTs: Date;
  };
  ClearMessage: {
    login: string;
    roomId?: string;
    targetMsgId: string;
    tmiSentTs: Date;
  };
  GlobalUserState: {
    badgeInfo: BadgeInfo;
    badges: Badges;
    color: string;
    displayName: string;
    emoteSets: string;
    turbo: boolean;
    userId: string;
    userType: USERTYPE;
  };
  Notice: {
    msgId: string;
    targetUserId?: string;
  };
  PrivMsg: {
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
  RoomState: {
    emoteOnly: boolean;
    followersonly: number;
    r9k: boolean;
    roomId: string;
    slow: boolean;
    subsOnly: boolean;
  };
  UserNoticeBase: {
    badgeInfo: BadgeInfo;
    badges: Badges;
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
  UserNoticeSub: {
    msgParamCumulativeMonths: number;
    msgParamShouldShareStreak: boolean;
    msgParamStreakMonths: number;
    msgParamSubPlan: SUBPLAN;
    msgParamSubPlanName: string;
  } & TwitchTagType["UserNoticeBase"];
  UserNoticeReSub: TwitchTagType["UserNoticeSub"];
  UserNoticeSubGift: {
    msgParamMonths: number;
    msgParamRecipientDisplayName: string;
    msgParamRecipientId: string;
    msgParamRecipientUserName: string;
    msgParamSubPlan: SUBPLAN;
    msgParamSubPlanName: string;
    msgParamGiftMonths: number;
  } & TwitchTagType["UserNoticeBase"];
  UserNoticeGiftPaidUpgrade: {
    msgParamPromoGiftTotal: number;
    msgParamPromoName: string;
    msgParamSenderLogin: string;
    msgParamSenderName: string;
  } & TwitchTagType["UserNoticeBase"];
  UserNoticeAnonGiftPaidUpgrade: {
    msgParamPromoGiftTotal: number;
    msgParamPromoName: string;
  } & TwitchTagType["UserNoticeBase"];
  UserNoticeRaid: {
    msgParamDisplayName: string;
    msgParamLogin: string;
    msgParamViewerCount: number;
  } & TwitchTagType["UserNoticeBase"];
  UserNoticeRitual: {
    msgParamRitualName: string;
  } & TwitchTagType["UserNoticeBase"];
  UserNoticeBitsBadgeTier: {
    msgParamThreshold: number;
  } & TwitchTagType["UserNoticeBase"];
  UserState: {
    badgeInfo: BadgeInfo;
    badges: Badges;
    color: string;
    displayName: string;
    emoteSets: string;
    id: string;
    mod: boolean;
    subscriber: boolean;
    turbo: boolean;
    userType: USERTYPE;
  };
  Whisper: {
    badges: Badges;
    color: string;
    displayName: string;
    emotes: Array<Emote>;
    messageId: string;
    threadId: string;
    turbo: boolean;
    userId: string;
    userType: USERTYPE;
  };
};

export interface ClearChat {
  command: "CLEARCHAT";
  source: MessageSource;
  tags: TwitchTagType["ClearChat"];
  channel: string;
  user?: string;
}

export interface ClearMessage {
  command: "CLEARMSG";
  source: MessageSource;
  tags: TwitchTagType["ClearMessage"];
  channel: string;
  params: string;
}

export interface GlobalUserState {
  command: "GLOBALUSERSTATE";
  source: MessageSource;
  tags: TwitchTagType["GlobalUserState"];
}

export interface Notice {
  command: "NOTICE";
  source: MessageSource;
  tags: TwitchTagType["Notice"];
  channel: string;
  params: string;
}

export interface PrivMsg {
  command: "PRIVMSG";
  source: MessageSource;
  tags: TwitchTagType["PrivMsg"];
  channel: string;
  params: string;
}

export interface RoomState {
  command: "ROOMSTATE";
  source: MessageSource;
  tags: TwitchTagType["RoomState"];
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
  tags: TwitchTagType["UserNoticeSub"];
}

export interface UserNoticeReSub extends UserNoticeBase {
  id: "resub";
  tags: TwitchTagType["UserNoticeSub"];
}

export interface UserNoticeSubGift extends UserNoticeBase {
  id: "subgift";
  tags: TwitchTagType["UserNoticeSubGift"];
}

export interface UserNoticeGiftPaidUpgrade extends UserNoticeBase {
  id: "giftpaidupgrade";
  tags: TwitchTagType["UserNoticeGiftPaidUpgrade"];
}

export interface UserNoticeAnonGiftPaidUpgrade extends UserNoticeBase {
  id: "anongiftpaidupgrade";
  tags: TwitchTagType["UserNoticeAnonGiftPaidUpgrade"];
}

export interface UserNoticeRaid extends UserNoticeBase {
  id: "raid";
  tags: TwitchTagType["UserNoticeRaid"];
}

export interface UserNoticeRitual extends UserNoticeBase {
  id: "ritual";
  tags: TwitchTagType["UserNoticeRitual"];
}

export interface UserNoticeBitsBadgeTier extends UserNoticeBase {
  id: "bitsbadgetier";
  tags: TwitchTagType["UserNoticeBitsBadgeTier"];
}

export interface UserState {
  command: "USERSTATE";
  source: MessageSource;
  tags: TwitchTagType["UserState"];
  channel: string;
}

export interface Whisper {
  command: "WHISPER";
  source: MessageSource;
  tags: TwitchTagType["Whisper"];
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

export type CommandType =
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
  | Ping
  | UnknownCommand;

export class ChatClient {
  ws!: WebSocket;
  clientNick!: string;
  clientPass!: string;
  helixClientId!: string;
  helixToken!: string;
  connected: boolean = false;
  richMsgConfig!: {
    enable: boolean;
    helixClient?: HelixClient;
    globalBadges?: Badges;
    channelBadges?: { [channelLogin: string]: Badges };
  };

  constructor() {}

  public async connect(
    nick?: string,
    pass?: string,
    richMsgConfig?: typeof this.richMsgConfig
  ) {
    this.clientNick = nick ?? `justinfan${Math.floor(Math.random() * 1e4)}`;
    this.clientPass = pass ?? "SCHMOOPIIE";

    const clientId = "16w0yt7y78o8ojz6sdt120uz97uvse";
    const token = "biqgjw11d6s4293mfabctugqq1q1ig";

    this.helixClientId = clientId;
    this.helixToken = token;

    this.ws = new WebSocket("wss://irc-ws.chat.twitch.tv:443");
    this.ws.send(`PASS ${this.clientPass}`);
    this.ws.send(`NICK ${this.clientNick}`);

    if (richMsgConfig && richMsgConfig.enable) {
      this.richMsgConfig = richMsgConfig;
      this.ws.send("CAP REQ :twitch.tv/commands twitch.tv/tags");
      this.richMsgConfig.globalBadges =
        await this.richMsgConfig.helixClient!.getBadges();
    } else {
      this.richMsgConfig = {
        enable: false,
      };
    }
    this.connected = true;
  }

  public async join(channelLogin: string) {
    if (this.richMsgConfig.enable) {
      const channelId = await this.richMsgConfig.helixClient!.getUserId(
        channelLogin
      );

      this.richMsgConfig.channelBadges![channelLogin] =
        await this.richMsgConfig.helixClient!.getBadges(channelId);
    }
  }

  public listen(command: string) {
    if (!this.connected) {
      throw "Connect to IRC by calling connect() first!!";
    }
  }

  parseTwitchMessages(message: string): CommandType | Array<CommandType> {
    message = message.trim();
    let toParse = message.split("\r\n");
    let messages: any[] = [];

    toParse.forEach((message) => {
      message = message.trim();
      const command = ChatClient.parseMessage(message, {
        globalBadges: this.richMsgConfig.enable
          ? this.richMsgConfig.globalBadges!
          : {},
        channelBadges: this.richMsgConfig.enable
          ? this.richMsgConfig.channelBadges!
          : {},
      });
    });

    return messages;
  }

  static parseMessage(
    message: string,
    meta: {
      globalBadges: Badges;
      channelBadges: { [channelLogin: string]: Badges };
    }
  ): CommandType {
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

                let isChannelBadge = true;
                let channelBadgesLocalScope = meta.channelBadges;
                for (const scope of [rawChannel!, badgeName, badgeId]) {
                  if (isChannelBadge) {
                    isChannelBadge =
                      isChannelBadge &&
                      Object.hasOwn(channelBadgesLocalScope, scope);
                    // @ts-expect-error
                    channelBadgesLocalScope = channelBadgesLocalScope[scope];
                  }
                }

                const badge = {
                  name: badgeName,
                  id: badgeId,
                  images: isChannelBadge
                    ? meta.channelBadges[rawChannel!][badgeName][badgeId]
                    : meta.globalBadges[badgeName][badgeId],
                };
                badges.push(badge);
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
                  length: number;
                }> = [];

                const [emoteId, rawUsage] = rawEmote.split(":");
                rawUsage.split(",").forEach((use) => {
                  const startPos = Number(use.split("-")[0]);
                  const endPos = Number(use.split("-")[1]) + 1;
                  const length = endPos - startPos;
                  usage.push({ startPos: startPos, length: length });
                });

                emotes.push({
                  id: emoteId,
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

    let command: CommandType;
    switch (rawCommand) {
      case "CLEARCHAT":
        command = {
          command: "CLEARCHAT",
          source: source,
          tags: tags as TwitchTagType["ClearChat"],
          channel: rawChannel,
          user: rawParam,
        } as ClearChat;
        break;
      case "CLEARMSG":
        command = {
          command: "CLEARMSG",
          source: source!,
          tags: tags as TwitchTagType["ClearMessage"],
          channel: rawChannel!,
          params: rawParam,
        } as ClearMessage;
        break;
      case "GLOBALUSERSTATE":
        command = {
          command: "GLOBALUSERSTATE",
          source: source,
          tags: tags as TwitchTagType["GlobalUserState"],
        } as GlobalUserState;
        break;
      case "PRIVMSG":
        command = {
          command: "PRIVMSG",
          source: source,
          tags: tags as TwitchTagType["PrivMsg"],
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
          tags: tags as TwitchTagType["Notice"],
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
          tags: tags as TwitchTagType["RoomState"],
          channel: rawChannel,
        } as RoomState;
        break;
      case "USERNOTICE":
        const userNoticeTags = tags as TwitchTagType["UserNoticeBase"];
        let userNoticeCommand: CommandType;
        switch (userNoticeTags["msgId"]) {
          case "sub":
            userNoticeCommand = {
              command: "USERNOTICE",
              id: "sub",
              source: source,
              tags: tags as TwitchTagType["UserNoticeSub"],
              channel: rawChannel,
              params: rawParam,
            } as UserNoticeSub;
            break;
          case "resub":
            userNoticeCommand = {
              command: "USERNOTICE",
              id: "resub",
              source: source,
              tags: tags as TwitchTagType["UserNoticeReSub"],
              channel: rawChannel,
              params: rawParam,
            } as UserNoticeReSub;
            break;
          case "subgift":
            userNoticeCommand = {
              command: "USERNOTICE",
              id: "subgift",
              source: source,
              tags: tags as TwitchTagType["UserNoticeSubGift"],
              channel: rawChannel,
              params: rawParam,
            } as UserNoticeSubGift;
            break;
          case "giftpaidupgrade":
            userNoticeCommand = {
              command: "USERNOTICE",
              id: "giftpaidupgrade",
              source: source,
              tags: tags as TwitchTagType["UserNoticeGiftPaidUpgrade"],
              channel: rawChannel,
              params: rawParam,
            } as UserNoticeGiftPaidUpgrade;
            break;
          case "anongiftpaidupgrade":
            userNoticeCommand = {
              command: "USERNOTICE",
              id: "anongiftpaidupgrade",
              source: source,
              tags: tags as TwitchTagType["UserNoticeAnonGiftPaidUpgrade"],
              channel: rawChannel,
              params: rawParam,
            } as UserNoticeAnonGiftPaidUpgrade;
            break;
          case "raid":
            userNoticeCommand = {
              command: "USERNOTICE",
              id: "raid",
              source: source,
              tags: tags as TwitchTagType["UserNoticeRaid"],
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
              tags: tags as TwitchTagType["UserNoticeRitual"],
              channel: rawChannel,
              params: rawParam,
            } as UserNoticeRitual;
            break;
          case "bitsbadgetier":
            userNoticeCommand = {
              command: "USERNOTICE",
              id: "bitsbadgetier",
              source: source,
              tags: tags as TwitchTagType["UserNoticeBitsBadgeTier"],
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
          tags: tags as TwitchTagType["UserState"],
          channel: rawChannel,
        } as UserState;
        break;
      case "WHISPER":
        const [fromUser, message] = rawParam!.split(" ");
        command = {
          command: "WHISPER",
          source: source,
          tags: tags as TwitchTagType["Whisper"],
          fromUser: fromUser,
          message: message.slice(1),
        } as Whisper;
        break;
      default:
        command = { command: "UNKNOWN" } as UnknownCommand;
    }
    return command;
  }
}
