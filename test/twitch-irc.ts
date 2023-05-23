import assert from "node:assert/strict";
import { describe, test } from "node:test";

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
} from "../src/twitch/irc.js";

describe("Testing Message Parser", () => {
  const meta = {
    globalBadges: {
      subscriber: {
        "0": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/5d9f2208-5dd8-11e7-8513-2ff4adfae661/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/5d9f2208-5dd8-11e7-8513-2ff4adfae661/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/5d9f2208-5dd8-11e7-8513-2ff4adfae661/3",
        },
        "1": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/5d9f2208-5dd8-11e7-8513-2ff4adfae661/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/5d9f2208-5dd8-11e7-8513-2ff4adfae661/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/5d9f2208-5dd8-11e7-8513-2ff4adfae661/3",
        },
        "2": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/25a03e36-2bb2-4625-bd37-d6d9d406238d/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/25a03e36-2bb2-4625-bd37-d6d9d406238d/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/25a03e36-2bb2-4625-bd37-d6d9d406238d/3",
        },
        "3": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/e8984705-d091-4e54-8241-e53b30a84b0e/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/e8984705-d091-4e54-8241-e53b30a84b0e/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/e8984705-d091-4e54-8241-e53b30a84b0e/3",
        },
        "4": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/2d2485f6-d19b-4daa-8393-9493b019156b/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/2d2485f6-d19b-4daa-8393-9493b019156b/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/2d2485f6-d19b-4daa-8393-9493b019156b/3",
        },
        "5": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/b4e6b13a-a76f-4c56-87e1-9375a7aaa610/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/b4e6b13a-a76f-4c56-87e1-9375a7aaa610/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/b4e6b13a-a76f-4c56-87e1-9375a7aaa610/3",
        },
        "6": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/ed51a614-2c44-4a60-80b6-62908436b43a/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/ed51a614-2c44-4a60-80b6-62908436b43a/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/ed51a614-2c44-4a60-80b6-62908436b43a/3",
        },
      },
      turbo: {
        "1": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/bd444ec6-8f34-4bf9-91f4-af1e3428d80f/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/bd444ec6-8f34-4bf9-91f4-af1e3428d80f/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/bd444ec6-8f34-4bf9-91f4-af1e3428d80f/3",
        },
      },
    },
    channelBadges: {},
  };

  test("CLEARCHAT", () => {
    const msg = ChatClient.parseMessage(
      "@room-id=12345678;target-user-id=87654321;tmi-sent-ts=1642715756806 :tmi.twitch.tv CLEARCHAT #dallas :ronni",
      //@ts-expect-error
      meta
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
      "@login=foo;room-id=;target-msg-id=94e6c7ff-bf98-4faa-af5d-7ad633a158a9;tmi-sent-ts=1642720582342 :tmi.twitch.tv CLEARMSG #bar :what a great day",
      //@ts-expect-error
      meta
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
      "@badge-info=subscriber/8;badges=subscriber/6;color=#0D4200;display-name=dallas;emote-sets=0,33,50,237,793,2126,3517,4578,5569,9400,10337,12239;turbo=0;user-id=12345678;user-type=admin :tmi.twitch.tv GLOBALUSERSTATE",
      //@ts-expect-error
      meta
    ) as GlobalUserState;

    assert.equal(msg.command, "GLOBALUSERSTATE");
    assert.deepEqual(msg.tags.badgeInfo, { subLength: 8 });
    assert.deepEqual(msg.tags.badges, [
      { id: "6", images: meta.globalBadges.subscriber[6], name: "subscriber" },
    ]);
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
      "@msg-id=whisper_restricted;target-user-id=12345678 :tmi.twitch.tv NOTICE #bar :Your settings prevent you from sending this whisper.",
      //@ts-expect-error
      meta
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
      "@reply-parent-msg-id=b34ccfc7-4977-403a-8a94-33c6bac34fb8;badge-info=;badges=turbo/1;color=#0D4200;display-name=ronni;emotes=25:0-4,12-16/1902:6-10;first-msg=0;id=b34ccfc7-4977-403a-8a94-33c6bac34fb8;mod=0;room-id=1337;subscriber=0;tmi-sent-ts=1507246572675;turbo=1;user-id=1337;user-type=global_mod :ronni!ronni@ronni.tmi.twitch.tv PRIVMSG #ronni :Kappa Keepo Kappa",
      //@ts-expect-error
      meta
    ) as PrivMsg;

    assert.equal(msg.command, "PRIVMSG");
    assert.equal(msg.tags.badgeInfo, undefined);
    assert.deepEqual(msg.tags.badges, [
      { id: "1", images: meta.globalBadges.turbo[1], name: "turbo" },
    ]);
    assert.equal(msg.tags.bits, undefined);
    assert.equal(msg.tags.color, "#0D4200");
    assert.equal(msg.tags.displayName, "ronni");
    assert.deepEqual(msg.tags.emotes, [
      {
        id: "25",
        usage: [
          { startPos: 0, length: 5 },
          { startPos: 12, length: 5 },
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
        usage: [{ startPos: 6, length: 5 }],
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
      "@emote-only=0;followers-only=0;r9k=0;slow=0;subs-only=0 :tmi.twitch.tv ROOMSTATE #dallas",
      //@ts-expect-error
      meta
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
      "@badge-info=;badges=turbo/1;color=#9ACD32;display-name=TestChannel;emotes=;id=3d830f12-795c-447d-af3c-ea05e40fbddb;login=testchannel;mod=0;msg-id=raid;msg-param-displayName=TestChannel;msg-param-login=testchannel;msg-param-viewerCount=15;room-id=33332222;subscriber=0;system-msg=15sraiderssfromsTestChannelshavesjoined\n!;tmi-sent-ts=1507246572675;turbo=1;user-id=123456;user-type= :tmi.twitch.tv USERNOTICE #othertestchannel",
      //@ts-expect-error
      meta
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
      "@badge-info=;badges=staff/1;color=#0D4200;display-name=ronni;emote-sets=0,33,50,237,793,2126,3517,4578,5569,9400,10337,12239;mod=1;subscriber=1;turbo=1;user-type=staff :tmi.twitch.tv USERSTATE #dallas",
      //@ts-expect-error
      meta
    ) as UserState;

    assert.equal(msg.command, "USERSTATE");
  });

  test("WHISPER", () => {
    const msg = ChatClient.parseMessage(
      "@badges=staff/1;color=#8A2BE2;display-name=PetsgomOO;emotes=;message-id=306;thread-id=12345678_87654321;turbo=0;user-id=87654321;user-type=staff :petsgomoo!petsgomoo@petsgomoo.tmi.twitch.tv WHISPER foo :hello",
      //@ts-expect-error
      meta
    ) as Whisper;

    assert.equal(msg.command, "WHISPER");
    assert.equal(msg.tags.messageId, "306");
    assert.equal(msg.tags.threadId, "12345678_87654321");
    assert.equal(msg.tags.threadId, "12345678_87654321");
    assert.equal(msg.fromUser, "foo");
    assert.equal(msg.source.userName, "petsgomoo");
    assert.equal(msg.message, "hello");
  });
});
