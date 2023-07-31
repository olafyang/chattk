import assert from "node:assert/strict";
import { describe, test, beforeEach, afterEach, before, after } from "mocha";
import { WebSocketServer, WebSocket } from "ws";

import {
  ClearChat,
  ClearMessage,
  GlobalUserState,
  Notice,
  PrivMsg,
  RoomState,
  UserNoticeRaid,
  UserState,
  Whisper,
  ChatClient,
  Join,
} from "../src/twitch/irc.js";

describe("Testing Message Parser", () => {
  test("CLEARCHAT", () => {
    const msg = ChatClient.parseMessage(
      "@room-id=12345678;target-user-id=87654321;tmi-sent-ts=1642715756806 :tmi.twitch.tv CLEARCHAT #dallas :ronni"
    ) as ClearChat;

    assert.equal(msg.command, "CLEARCHAT");
    assert.equal(msg.tags.roomId, "12345678");
    assert.equal(msg.tags.targetUserId, "87654321");
    assert.deepEqual(msg.tags.tmiSentTs, new Date(1642715756806));
    assert.equal(msg.source.source, "tmi.twitch.tv");
    assert.equal(msg.channel, "dallas");
    assert.equal(msg.user, "ronni");
  });

  test("CLEARMSG", () => {
    const msg: ClearMessage = ChatClient.parseMessage(
      "@login=foo;room-id=;target-msg-id=94e6c7ff-bf98-4faa-af5d-7ad633a158a9;tmi-sent-ts=1642720582342 :tmi.twitch.tv CLEARMSG #bar :what a great day"
    ) as ClearMessage;

    assert.equal(msg.command, "CLEARMSG");
    assert.equal(msg.tags.login, "foo");
    assert.equal(msg.tags.roomId, undefined);
    assert.equal(msg.tags.targetMsgId, "94e6c7ff-bf98-4faa-af5d-7ad633a158a9");
    assert.deepEqual(msg.tags.tmiSentTs, new Date(1642720582342));
    assert.equal(msg.source.source, "tmi.twitch.tv");
    assert.equal(msg.channel, "bar");
    assert.equal(msg.params, "what a great day");
  });

  test("GLOBALUSERSTATE", () => {
    const msg = ChatClient.parseMessage(
      "@badge-info=subscriber/8;badges=subscriber/6;color=#0D4200;display-name=dallas;emote-sets=0,33,50,237,793,2126,3517,4578,5569,9400,10337,12239;turbo=0;user-id=12345678;user-type=admin :tmi.twitch.tv GLOBALUSERSTATE"
    ) as GlobalUserState;

    assert.equal(msg.command, "GLOBALUSERSTATE");
    assert.deepEqual(msg.tags.badgeInfo, { subLength: 8 });
    assert.deepEqual(msg.tags.badges, [{ id: "6", name: "subscriber" }]);
    assert.equal(msg.tags.color, "#0D4200");
    assert.equal(msg.tags.displayName, "dallas");
    assert.equal(
      msg.tags.emoteSets,
      "0,33,50,237,793,2126,3517,4578,5569,9400,10337,12239"
    );
    assert.equal(msg.tags.turbo, false);
    assert.equal(msg.tags.userId, "12345678");
    assert.equal(msg.tags.userType, "admin");
    assert.equal(msg.source.source, "tmi.twitch.tv");
  });

  test("NOTICE", () => {
    const msg = ChatClient.parseMessage(
      "@msg-id=whisper_restricted;target-user-id=12345678 :tmi.twitch.tv NOTICE #bar :Your settings prevent you from sending this whisper."
    ) as Notice;

    assert.equal(msg.command, "NOTICE");
    assert.equal(msg.tags.msgId, "whisper_restricted");
    assert.equal(msg.tags.targetUserId, "12345678");
    assert.equal(msg.source.source, "tmi.twitch.tv");
    assert.equal(msg.channel, "bar");
    assert.equal(
      msg.params,
      "Your settings prevent you from sending this whisper."
    );
  });

  test("PRIVMSG Emotes", () => {
    const msg = ChatClient.parseMessage(
      "@reply-parent-msg-id=b34ccfc7-4977-403a-8a94-33c6bac34fb8;badge-info=;badges=turbo/1;color=#0D4200;display-name=ronni;emotes=25:0-4,12-16/1902:6-10;first-msg=0;id=b34ccfc7-4977-403a-8a94-33c6bac34fb8;mod=0;room-id=1337;subscriber=0;tmi-sent-ts=1507246572675;turbo=1;user-id=1337;user-type=global_mod :ronni!ronni@ronni.tmi.twitch.tv PRIVMSG #ronni :Kappa Keepo Kappa"
    ) as PrivMsg;

    assert.equal(msg.command, "PRIVMSG");
    assert.equal(msg.tags.badgeInfo, undefined);
    assert.deepEqual(msg.tags.badges, [{ id: "1", name: "turbo" }]);
    assert.equal(msg.tags.bits, undefined);
    assert.equal(msg.tags.color, "#0D4200");
    assert.equal(msg.tags.displayName, "ronni");
    assert.deepEqual(msg.tags.emotes, [
      {
        id: "25",
        name: "Kappa",
        usage: [
          { startPos: 0, endPos: 5 },
          { startPos: 12, endPos: 17 },
        ],
        images: {
          "1x": new URL(
            "https://static-cdn.jtvnw.net/emoticons/v2/25/default/dark/1.0"
          ),
          "2x": new URL(
            "https://static-cdn.jtvnw.net/emoticons/v2/25/default/dark/2.0"
          ),
          "3x": new URL(
            "https://static-cdn.jtvnw.net/emoticons/v2/25/default/dark/3.0"
          ),
        },
      },
      {
        id: "1902",
        name: "Keepo",
        usage: [{ startPos: 6, endPos: 11 }],
        images: {
          "1x": new URL(
            "https://static-cdn.jtvnw.net/emoticons/v2/1902/default/dark/1.0"
          ),
          "2x": new URL(
            "https://static-cdn.jtvnw.net/emoticons/v2/1902/default/dark/2.0"
          ),
          "3x": new URL(
            "https://static-cdn.jtvnw.net/emoticons/v2/1902/default/dark/3.0"
          ),
        },
      },
    ]);
    assert.equal(msg.tags.firstMsg, false);
    assert.equal(
      msg.tags.replyParentMsgId,
      "b34ccfc7-4977-403a-8a94-33c6bac34fb8"
    );
    assert.equal(msg.tags.id, "b34ccfc7-4977-403a-8a94-33c6bac34fb8");
    assert.equal(msg.tags.mod, false);
    assert.equal(msg.tags.roomId, "1337");
    assert.equal(msg.tags.subscriber, false);
    assert.deepEqual(msg.tags.tmiSentTs, new Date(1507246572675));
    assert.equal(msg.tags.turbo, true);
    assert.equal(msg.tags.userId, "1337");
    assert.equal(msg.tags.userType, "global_mod");
    assert.equal(msg.tags.vip, undefined);
    assert.equal(msg.source.userName, "ronni");
    assert.equal(msg.source.source, "ronni.tmi.twitch.tv");
    assert.equal(msg.channel, "ronni");
    assert.equal(msg.params, "Kappa Keepo Kappa");
  });

  test("ROOMSTATE", () => {
    const msg = ChatClient.parseMessage(
      "@emote-only=0;followers-only=0;r9k=0;slow=0;subs-only=0 :tmi.twitch.tv ROOMSTATE #dallas"
    ) as RoomState;

    assert.equal(msg.command, "ROOMSTATE");
    assert.equal(msg.tags.emoteOnly, false);
    assert.equal(msg.tags.r9k, false);
    assert.equal(msg.tags.slow, false);
    assert.equal(msg.tags.subsOnly, false);
    assert.equal(msg.source.source, "tmi.twitch.tv");
    assert.equal(msg.channel, "dallas");
  });

  test("USERNOTICE", () => {
    const msg = ChatClient.parseMessage(
      "@badge-info=;badges=turbo/1;color=#9ACD32;display-name=TestChannel;emotes=;id=3d830f12-795c-447d-af3c-ea05e40fbddb;login=testchannel;mod=0;msg-id=raid;msg-param-displayName=TestChannel;msg-param-login=testchannel;msg-param-viewerCount=15;room-id=33332222;subscriber=0;system-msg=15sraiderssfromsTestChannelshavesjoined\n!;tmi-sent-ts=1507246572675;turbo=1;user-id=123456;user-type= :tmi.twitch.tv USERNOTICE #othertestchannel"
    ) as UserNoticeRaid;

    assert.equal(msg.command, "USERNOTICE");
    assert.equal(msg.id, "raid");
    assert.equal(msg.tags.msgParamDisplayName, "TestChannel");
    assert.equal(msg.tags.msgParamLogin, "testchannel");
    assert.equal(msg.tags.msgParamViewerCount, 15);
    assert.equal(
      msg.tags.systemMsg,
      "15sraiderssfromsTestChannelshavesjoined\n!"
    );
  });

  test("USERSTATE", () => {
    const msg = ChatClient.parseMessage(
      "@badge-info=;badges=turbo/1;color=#0D4200;display-name=ronni;emote-sets=0,33,50,237,793,2126,3517,4578,5569,9400,10337,12239;mod=1;subscriber=1;turbo=1;user-type=staff :tmi.twitch.tv USERSTATE #dallas"
    ) as UserState;

    assert.equal(msg.command, "USERSTATE");
  });

  test("WHISPER", () => {
    const msg = ChatClient.parseMessage(
      "@badges=turbo/1;color=#8A2BE2;display-name=PetsgomOO;emotes=;message-id=306;thread-id=12345678_87654321;turbo=0;user-id=87654321;user-type=staff :petsgomoo!petsgomoo@petsgomoo.tmi.twitch.tv WHISPER foo :hello"
    ) as Whisper;

    assert.equal(msg.command, "WHISPER");
    assert.equal(msg.tags.messageId, "306");
    assert.equal(msg.tags.threadId, "12345678_87654321");
    assert.equal(msg.tags.threadId, "12345678_87654321");
    assert.equal(msg.fromUser, "foo");
    assert.equal(msg.source.userName, "petsgomoo");
    assert.equal(msg.message, "hello");
  });

  test("JOIN", () => {
    const msg = ChatClient.parseMessage(
      ":justinfan12345!justinfan12345@justinfan12345.tmi.twitch.tv JOIN #baguettech"
    ) as Join;
    assert.equal(msg.command, "JOIN");
    assert.equal(msg.channel, "baguettech");
  });
});

describe("Testing IRC Interface", () => {
  let authMsgs = [
    ["PASS SCHMOOPIIE", ""],
    [
      "NICK justinfan12345",
      `:tmi.twitch.tv 001 justinfan12345 :Welcome, GLHF!
      :tmi.twitch.tv 002 justinfan12345 :Your host is tmi.twitch.tv
      :tmi.twitch.tv 003 justinfan12345 :This server is rather new
      :tmi.twitch.tv 004 justinfan12345 :-
      :tmi.twitch.tv 375 justinfan12345 :-
      :tmi.twitch.tv 372 justinfan12345 :You are in a maze of twisty passages, all alike.
      :tmi.twitch.tv 376 justinfan12345 :>`,
    ],
    ["CAP REQ :twitch.tv/tags", ":tmi.twitch.tv CAP * ACK :twitch.tv/tags"],
  ];

  let cases = [
    {
      command: "PRIVMSG",
      serverMessage:
        "@reply-parent-msg-id=b34ccfc7-4977-403a-8a94-33c6bac34fb8;badge-info=;badges=turbo/1;color=#0D4200;display-name=ronni;emotes=25:0-4,12-16/1902:6-10;first-msg=0;id=b34ccfc7-4977-403a-8a94-33c6bac34fb8;mod=0;room-id=1337;subscriber=0;tmi-sent-ts=1507246572675;turbo=1;user-id=1337;user-type=global_mod :ronni!ronni@ronni.tmi.twitch.tv PRIVMSG #ronni :Kappa Keepo Kappa",
      clientMessage: ":ronni!ronni@ronni.tmi.twitch.tv PRIVMSG #ronni :reply",
    },
    // TODO  userNotices
  ];
  cases = cases.reverse();
  let ws: WebSocketServer;
  let chatClient: ChatClient;

  beforeEach(function () {
    ws = new WebSocketServer({ port: 1450 });
    ws.on("connection", (socket) => {
      socket = socket;
    });
    chatClient = new ChatClient(
      "justinfan12345",
      "SCHMOOPIIE",
      true,
      "ws://localhost:1450"
    );
  });

  test("Authentication", function (done) {
    const expectedMsgs = [...authMsgs];

    chatClient.connect();

    ws.on("connection", (socket, req) => {
      socket.onmessage = (event) => {
        event;
      };

      socket.on("message", (data, isBin) => {
        const test = expectedMsgs.splice(0, 1)[0];
        const expected = test[0];
        const res = test[1];
        const message = data.toString("utf-8");

        assert(!isBin);
        assert.equal(message, expected);

        if (res !== "") {
          socket.send(res);
        }

        if (expectedMsgs.length === 0) {
          chatClient.close();
          socket.close();
          done();
        }
      });
    });
  });

  const getAuthHandler = () => {
    let callCount = 0;
    return (msg: string, socket: WebSocket) => {
      if (callCount >= authMsgs.length - 1) return true;

      const out = authMsgs[callCount][1];
      if (out !== "") {
        socket.send(out);
      }

      callCount++;
    };
  };

  test("Joining / Leaving Channel", function (done) {
    const handleAuth = getAuthHandler();

    chatClient.connect();

    ws.on("connection", (socket, req) => {
      socket.onmessage = (event) => {
        event;
      };

      let join = true;
      let part = true;

      socket.on("message", (data, isBin) => {
        const message = data.toString("utf-8");
        const authCompleted = handleAuth(message, socket);

        if (!authCompleted) return;

        if (join) {
          setTimeout(() => {
            chatClient.join("twitch");
            join = false;
          }, 0);
          return;
        }
        if (!join && part) {
          assert.equal(message, "JOIN #twitch");
          socket.send(":bar!bar@bar.tmi.twitch.tv JOIN #twitch");
          setTimeout(() => {
            chatClient.part("twitch");
            join = false;
          }, 0);
          part = false;
          return;
        }
        assert.equal(message, "PART #twitch");
        chatClient.close();
        socket.close();
        done();
      });
    });
  });
  afterEach(function () {
    ws.close();
  });
});
