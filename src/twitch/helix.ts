export interface Badges {
  [name: string]: {
    [versionId: string]: {
      "1x": URL;
      "2x": URL;
      "4x": URL;
    };
  };
}

export interface Badge {
  name: string;
  id: string;
  images: {
    "1x": URL;
    "2x": URL;
    "4x": URL;
  };
}

export class HelixClient {
  clientId: string;
  token: string;

  constructor(clientId: string, token: string) {
    this.clientId = clientId;
    this.token = token;
  }

  /**
   * Gets twitch global or channel badges
   *
   * @private
   * @static
   * @param {string} clientId Client ID of registered twitch application
   * @param {string} token Twitch API token
   * @param {string} [twitchId] Twitch channel **ID**, returns global badges if not given, else returns channel badges
   * @return {*}  {Promise<Badges>}
   * @memberof ChatClient
   */
  async getBadges(twitchId?: string): Promise<Badges> {
    const auth = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Client-Id": this.clientId,
      },
    };

    return new Promise(async (resolve, reject) => {
      let badges: Badges = {};
      type BadgeType = {
        set_id: string;
        versions: Array<{
          id: string;
          image_url_1x: string;
          image_url_2x: string;
          image_url_4x: string;
        }>;
      };

      let url = twitchId
        ? `https://api.twitch.tv/helix/chat/badges?broadcaster_id=${twitchId}`
        : "https://api.twitch.tv/helix/chat/badges/global";

      fetch(url, auth).then(async (res) => {
        if (res.status === 401) {
          reject("Authorization Error!");
          return;
        }
        if (res.status === 500) {
          reject("Channel not found! Only accepts user id!");
          return;
        }

        let badgesRaw = (await res.json()).data;
        badgesRaw.forEach((badge: BadgeType) => {
          const badgeName = badge["set_id"];
          badges[badgeName] = {};

          badge.versions.forEach((version) => {
            const versionId = version.id;
            badges[badgeName][versionId] = {
              "1x": new URL(version["image_url_1x"]),
              "2x": new URL(version["image_url_2x"]),
              "4x": new URL(version["image_url_4x"]),
            };
          });
        });
        resolve(badges);
      });
    });
  }

  /**
   * Gets the id of a twitch user from their login name
   *
   * @private
   * @static
   * @param {string} clientId Client ID of registered twitch application
   * @param {string} token Twitch API token
   * @param {string} login Twitch user's login name
   * @return {*}  {Promise<string>} Resolves to the id of given twitch user
   * @memberof ChatClient
   */
  async getUserId(login: string): Promise<string> {
    const auth = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Client-Id": this.clientId,
      },
    };

    return new Promise(async (resolve, reject) => {
      fetch(`https://api.twitch.tv/helix/users?login=${login}`, auth).then(
        (res) => {
          if (res.status === 401) {
            reject("Authorization Error!");
            return;
          }

          res.json().then(
            (json: {
              data: Array<{
                id: string;
                login: string;
                display_name: string;
                type: string;
                broadcaster_type: string;
                description: string;
                profile_image_url: string;
                offline_image_url: string;
                view_count: number;
                created_at: string;
              }>;
            }) => {
              if (json.data.length === 0) {
                reject(`User '${login} not found!'`);
                return;
              }
              resolve(json.data[0].id);
            }
          );
        }
      );
    });
  }
}
