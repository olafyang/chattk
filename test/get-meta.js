import { writeFile } from "node:fs";
import { ChatClient } from "../dist/twitch/irc.js";

ChatClient.getBadges(
  "16w0yt7y78o8ojz6sdt120uz97uvse",
  "biqgjw11d6s4293mfabctugqq1q1ig"
).then((gl) => {
  console.log(JSON.stringify(gl));
  writeFile("globalBadges.json", JSON.stringify(gl), (err) => {
    console.log(err);
  });
});
