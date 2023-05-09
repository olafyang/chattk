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
      admin: {
        "1": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/9ef7e029-4cdf-4d4d-a0d5-e2b3fb2583fe/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/9ef7e029-4cdf-4d4d-a0d5-e2b3fb2583fe/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/9ef7e029-4cdf-4d4d-a0d5-e2b3fb2583fe/3",
        },
      },
      bits: {
        "1": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/73b5c3fb-24f9-4a82-a852-2f475b59411c/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/73b5c3fb-24f9-4a82-a852-2f475b59411c/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/73b5c3fb-24f9-4a82-a852-2f475b59411c/3",
        },
        "100": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/09d93036-e7ce-431c-9a9e-7044297133f2/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/09d93036-e7ce-431c-9a9e-7044297133f2/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/09d93036-e7ce-431c-9a9e-7044297133f2/3",
        },
        "1000": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/0d85a29e-79ad-4c63-a285-3acd2c66f2ba/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/0d85a29e-79ad-4c63-a285-3acd2c66f2ba/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/0d85a29e-79ad-4c63-a285-3acd2c66f2ba/3",
        },
        "5000": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/57cd97fc-3e9e-4c6d-9d41-60147137234e/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/57cd97fc-3e9e-4c6d-9d41-60147137234e/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/57cd97fc-3e9e-4c6d-9d41-60147137234e/3",
        },
        "10000": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/68af213b-a771-4124-b6e3-9bb6d98aa732/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/68af213b-a771-4124-b6e3-9bb6d98aa732/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/68af213b-a771-4124-b6e3-9bb6d98aa732/3",
        },
        "25000": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/64ca5920-c663-4bd8-bfb1-751b4caea2dd/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/64ca5920-c663-4bd8-bfb1-751b4caea2dd/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/64ca5920-c663-4bd8-bfb1-751b4caea2dd/3",
        },
        "50000": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/62310ba7-9916-4235-9eba-40110d67f85d/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/62310ba7-9916-4235-9eba-40110d67f85d/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/62310ba7-9916-4235-9eba-40110d67f85d/3",
        },
        "75000": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/ce491fa4-b24f-4f3b-b6ff-44b080202792/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/ce491fa4-b24f-4f3b-b6ff-44b080202792/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/ce491fa4-b24f-4f3b-b6ff-44b080202792/3",
        },
        "100000": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/96f0540f-aa63-49e1-a8b3-259ece3bd098/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/96f0540f-aa63-49e1-a8b3-259ece3bd098/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/96f0540f-aa63-49e1-a8b3-259ece3bd098/3",
        },
        "200000": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/4a0b90c4-e4ef-407f-84fe-36b14aebdbb6/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/4a0b90c4-e4ef-407f-84fe-36b14aebdbb6/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/4a0b90c4-e4ef-407f-84fe-36b14aebdbb6/3",
        },
        "300000": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/ac13372d-2e94-41d1-ae11-ecd677f69bb6/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/ac13372d-2e94-41d1-ae11-ecd677f69bb6/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/ac13372d-2e94-41d1-ae11-ecd677f69bb6/3",
        },
        "400000": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/a8f393af-76e6-4aa2-9dd0-7dcc1c34f036/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/a8f393af-76e6-4aa2-9dd0-7dcc1c34f036/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/a8f393af-76e6-4aa2-9dd0-7dcc1c34f036/3",
        },
        "500000": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/f6932b57-6a6e-4062-a770-dfbd9f4302e5/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/f6932b57-6a6e-4062-a770-dfbd9f4302e5/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/f6932b57-6a6e-4062-a770-dfbd9f4302e5/3",
        },
        "600000": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/4d908059-f91c-4aef-9acb-634434f4c32e/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/4d908059-f91c-4aef-9acb-634434f4c32e/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/4d908059-f91c-4aef-9acb-634434f4c32e/3",
        },
        "700000": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/a1d2a824-f216-4b9f-9642-3de8ed370957/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/a1d2a824-f216-4b9f-9642-3de8ed370957/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/a1d2a824-f216-4b9f-9642-3de8ed370957/3",
        },
        "800000": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/5ec2ee3e-5633-4c2a-8e77-77473fe409e6/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/5ec2ee3e-5633-4c2a-8e77-77473fe409e6/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/5ec2ee3e-5633-4c2a-8e77-77473fe409e6/3",
        },
        "900000": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/088c58c6-7c38-45ba-8f73-63ef24189b84/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/088c58c6-7c38-45ba-8f73-63ef24189b84/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/088c58c6-7c38-45ba-8f73-63ef24189b84/3",
        },
        "1000000": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/494d1c8e-c3b2-4d88-8528-baff57c9bd3f/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/494d1c8e-c3b2-4d88-8528-baff57c9bd3f/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/494d1c8e-c3b2-4d88-8528-baff57c9bd3f/3",
        },
        "1250000": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/ce217209-4615-4bf8-81e3-57d06b8b9dc7/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/ce217209-4615-4bf8-81e3-57d06b8b9dc7/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/ce217209-4615-4bf8-81e3-57d06b8b9dc7/3",
        },
        "1500000": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/c4eba5b4-17a7-40a1-a668-bc1972c1e24d/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/c4eba5b4-17a7-40a1-a668-bc1972c1e24d/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/c4eba5b4-17a7-40a1-a668-bc1972c1e24d/3",
        },
        "1750000": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/183f1fd8-aaf4-450c-a413-e53f839f0f82/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/183f1fd8-aaf4-450c-a413-e53f839f0f82/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/183f1fd8-aaf4-450c-a413-e53f839f0f82/3",
        },
        "2000000": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/7ea89c53-1a3b-45f9-9223-d97ae19089f2/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/7ea89c53-1a3b-45f9-9223-d97ae19089f2/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/7ea89c53-1a3b-45f9-9223-d97ae19089f2/3",
        },
        "2500000": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/cf061daf-d571-4811-bcc2-c55c8792bc8f/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/cf061daf-d571-4811-bcc2-c55c8792bc8f/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/cf061daf-d571-4811-bcc2-c55c8792bc8f/3",
        },
        "3000000": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/5671797f-5e9f-478c-a2b5-eb086c8928cf/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/5671797f-5e9f-478c-a2b5-eb086c8928cf/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/5671797f-5e9f-478c-a2b5-eb086c8928cf/3",
        },
        "3500000": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/c3d218f5-1e45-419d-9c11-033a1ae54d3a/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/c3d218f5-1e45-419d-9c11-033a1ae54d3a/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/c3d218f5-1e45-419d-9c11-033a1ae54d3a/3",
        },
        "4000000": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/79fe642a-87f3-40b1-892e-a341747b6e08/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/79fe642a-87f3-40b1-892e-a341747b6e08/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/79fe642a-87f3-40b1-892e-a341747b6e08/3",
        },
        "4500000": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/736d4156-ac67-4256-a224-3e6e915436db/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/736d4156-ac67-4256-a224-3e6e915436db/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/736d4156-ac67-4256-a224-3e6e915436db/3",
        },
        "5000000": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/3f085f85-8d15-4a03-a829-17fca7bf1bc2/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/3f085f85-8d15-4a03-a829-17fca7bf1bc2/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/3f085f85-8d15-4a03-a829-17fca7bf1bc2/3",
        },
      },
      "bits-leader": {
        "1": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/8bedf8c3-7a6d-4df2-b62f-791b96a5dd31/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/8bedf8c3-7a6d-4df2-b62f-791b96a5dd31/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/8bedf8c3-7a6d-4df2-b62f-791b96a5dd31/3",
        },
        "2": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/f04baac7-9141-4456-a0e7-6301bcc34138/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/f04baac7-9141-4456-a0e7-6301bcc34138/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/f04baac7-9141-4456-a0e7-6301bcc34138/3",
        },
        "3": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/f1d2aab6-b647-47af-965b-84909cf303aa/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/f1d2aab6-b647-47af-965b-84909cf303aa/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/f1d2aab6-b647-47af-965b-84909cf303aa/3",
        },
      },
      broadcaster: {
        "1": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/3",
        },
      },
      founder: {
        "0": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/511b78a9-ab37-472f-9569-457753bbe7d3/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/511b78a9-ab37-472f-9569-457753bbe7d3/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/511b78a9-ab37-472f-9569-457753bbe7d3/3",
        },
      },
      moderator: {
        "1": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/3",
        },
      },
      no_audio: {
        "1": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/aef2cd08-f29b-45a1-8c12-d44d7fd5e6f0/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/aef2cd08-f29b-45a1-8c12-d44d7fd5e6f0/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/aef2cd08-f29b-45a1-8c12-d44d7fd5e6f0/3",
        },
      },
      no_video: {
        "1": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/199a0dba-58f3-494e-a7fc-1fa0a1001fb8/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/199a0dba-58f3-494e-a7fc-1fa0a1001fb8/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/199a0dba-58f3-494e-a7fc-1fa0a1001fb8/3",
        },
      },
      predictions: {
        "blue-1": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/e33d8b46-f63b-4e67-996d-4a7dcec0ad33/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/e33d8b46-f63b-4e67-996d-4a7dcec0ad33/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/e33d8b46-f63b-4e67-996d-4a7dcec0ad33/3",
        },
        "blue-10": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/072ae906-ecf7-44f1-ac69-a5b2261d8892/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/072ae906-ecf7-44f1-ac69-a5b2261d8892/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/072ae906-ecf7-44f1-ac69-a5b2261d8892/3",
        },
        "blue-2": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/ffdda3fe-8012-4db3-981e-7a131402b057/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/ffdda3fe-8012-4db3-981e-7a131402b057/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/ffdda3fe-8012-4db3-981e-7a131402b057/3",
        },
        "blue-3": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/f2ab9a19-8ef7-4f9f-bd5d-9cf4e603f845/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/f2ab9a19-8ef7-4f9f-bd5d-9cf4e603f845/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/f2ab9a19-8ef7-4f9f-bd5d-9cf4e603f845/3",
        },
        "blue-4": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/df95317d-9568-46de-a421-a8520edb9349/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/df95317d-9568-46de-a421-a8520edb9349/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/df95317d-9568-46de-a421-a8520edb9349/3",
        },
        "blue-5": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/88758be8-de09-479b-9383-e3bb6d9e6f06/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/88758be8-de09-479b-9383-e3bb6d9e6f06/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/88758be8-de09-479b-9383-e3bb6d9e6f06/3",
        },
        "blue-6": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/46b1537e-d8b0-4c0d-8fba-a652e57b9df0/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/46b1537e-d8b0-4c0d-8fba-a652e57b9df0/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/46b1537e-d8b0-4c0d-8fba-a652e57b9df0/3",
        },
        "blue-7": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/07cd34b2-c6a1-45f5-8d8a-131e3c8b2279/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/07cd34b2-c6a1-45f5-8d8a-131e3c8b2279/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/07cd34b2-c6a1-45f5-8d8a-131e3c8b2279/3",
        },
        "blue-8": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/4416dfd7-db97-44a0-98e7-40b4e250615e/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/4416dfd7-db97-44a0-98e7-40b4e250615e/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/4416dfd7-db97-44a0-98e7-40b4e250615e/3",
        },
        "blue-9": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/fc74bd90-2b74-4f56-8e42-04d405e10fae/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/fc74bd90-2b74-4f56-8e42-04d405e10fae/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/fc74bd90-2b74-4f56-8e42-04d405e10fae/3",
        },
        "gray-1": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/144f77a2-e324-4a6b-9c17-9304fa193a27/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/144f77a2-e324-4a6b-9c17-9304fa193a27/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/144f77a2-e324-4a6b-9c17-9304fa193a27/3",
        },
        "gray-2": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/097a4b14-b458-47eb-91b6-fe74d3dbb3f5/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/097a4b14-b458-47eb-91b6-fe74d3dbb3f5/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/097a4b14-b458-47eb-91b6-fe74d3dbb3f5/3",
        },
        "pink-1": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/75e27613-caf7-4585-98f1-cb7363a69a4a/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/75e27613-caf7-4585-98f1-cb7363a69a4a/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/75e27613-caf7-4585-98f1-cb7363a69a4a/3",
        },
        "pink-2": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/4b76d5f2-91cc-4400-adf2-908a1e6cfd1e/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/4b76d5f2-91cc-4400-adf2-908a1e6cfd1e/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/4b76d5f2-91cc-4400-adf2-908a1e6cfd1e/3",
        },
      },
      premium: {
        "1": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/bbbe0db0-a598-423e-86d0-f9fb98ca1933/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/bbbe0db0-a598-423e-86d0-f9fb98ca1933/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/bbbe0db0-a598-423e-86d0-f9fb98ca1933/3",
        },
      },
      staff: {
        "1": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/d97c37bd-a6f5-4c38-8f57-4e4bef88af34/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/d97c37bd-a6f5-4c38-8f57-4e4bef88af34/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/d97c37bd-a6f5-4c38-8f57-4e4bef88af34/3",
        },
      },
      "sub-gift-leader": {
        "1": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/21656088-7da2-4467-acd2-55220e1f45ad/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/21656088-7da2-4467-acd2-55220e1f45ad/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/21656088-7da2-4467-acd2-55220e1f45ad/3",
        },
        "2": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/0d9fe96b-97b7-4215-b5f3-5328ebad271c/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/0d9fe96b-97b7-4215-b5f3-5328ebad271c/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/0d9fe96b-97b7-4215-b5f3-5328ebad271c/3",
        },
        "3": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/4c6e4497-eed9-4dd3-ac64-e0599d0a63e5/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/4c6e4497-eed9-4dd3-ac64-e0599d0a63e5/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/4c6e4497-eed9-4dd3-ac64-e0599d0a63e5/3",
        },
      },
      "sub-gifter": {
        "1": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/a5ef6c17-2e5b-4d8f-9b80-2779fd722414/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/a5ef6c17-2e5b-4d8f-9b80-2779fd722414/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/a5ef6c17-2e5b-4d8f-9b80-2779fd722414/3",
        },
        "5": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/ee113e59-c839-4472-969a-1e16d20f3962/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/ee113e59-c839-4472-969a-1e16d20f3962/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/ee113e59-c839-4472-969a-1e16d20f3962/3",
        },
        "10": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/d333288c-65d7-4c7b-b691-cdd7b3484bf8/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/d333288c-65d7-4c7b-b691-cdd7b3484bf8/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/d333288c-65d7-4c7b-b691-cdd7b3484bf8/3",
        },
        "25": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/052a5d41-f1cc-455c-bc7b-fe841ffaf17f/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/052a5d41-f1cc-455c-bc7b-fe841ffaf17f/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/052a5d41-f1cc-455c-bc7b-fe841ffaf17f/3",
        },
        "50": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/c4a29737-e8a5-4420-917a-314a447f083e/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/c4a29737-e8a5-4420-917a-314a447f083e/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/c4a29737-e8a5-4420-917a-314a447f083e/3",
        },
        "100": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/8343ada7-3451-434e-91c4-e82bdcf54460/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/8343ada7-3451-434e-91c4-e82bdcf54460/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/8343ada7-3451-434e-91c4-e82bdcf54460/3",
        },
        "150": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/514845ba-0fc3-4771-bce1-14d57e91e621/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/514845ba-0fc3-4771-bce1-14d57e91e621/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/514845ba-0fc3-4771-bce1-14d57e91e621/3",
        },
        "200": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/c6b1893e-8059-4024-b93c-39c84b601732/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/c6b1893e-8059-4024-b93c-39c84b601732/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/c6b1893e-8059-4024-b93c-39c84b601732/3",
        },
        "250": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/cd479dc0-4a15-407d-891f-9fd2740bddda/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/cd479dc0-4a15-407d-891f-9fd2740bddda/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/cd479dc0-4a15-407d-891f-9fd2740bddda/3",
        },
        "300": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/9e1bb24f-d238-4078-871a-ac401b76ecf2/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/9e1bb24f-d238-4078-871a-ac401b76ecf2/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/9e1bb24f-d238-4078-871a-ac401b76ecf2/3",
        },
        "350": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/6c4783cd-0aba-4e75-a7a4-f48a70b665b0/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/6c4783cd-0aba-4e75-a7a4-f48a70b665b0/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/6c4783cd-0aba-4e75-a7a4-f48a70b665b0/3",
        },
        "400": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/6f4cab6b-def9-4d99-ad06-90b0013b28c8/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/6f4cab6b-def9-4d99-ad06-90b0013b28c8/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/6f4cab6b-def9-4d99-ad06-90b0013b28c8/3",
        },
        "450": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/b593d68a-f8fb-4516-a09a-18cce955402c/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/b593d68a-f8fb-4516-a09a-18cce955402c/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/b593d68a-f8fb-4516-a09a-18cce955402c/3",
        },
        "500": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/60e9504c-8c3d-489f-8a74-314fb195ad8d/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/60e9504c-8c3d-489f-8a74-314fb195ad8d/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/60e9504c-8c3d-489f-8a74-314fb195ad8d/3",
        },
        "550": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/024d2563-1794-43ed-b8dc-33df3efae900/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/024d2563-1794-43ed-b8dc-33df3efae900/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/024d2563-1794-43ed-b8dc-33df3efae900/3",
        },
        "600": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/3ecc3aab-09bf-4823-905e-3a4647171fc1/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/3ecc3aab-09bf-4823-905e-3a4647171fc1/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/3ecc3aab-09bf-4823-905e-3a4647171fc1/3",
        },
        "650": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/eeabf43c-8e4c-448d-9790-4c2172c57944/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/eeabf43c-8e4c-448d-9790-4c2172c57944/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/eeabf43c-8e4c-448d-9790-4c2172c57944/3",
        },
        "700": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/4a9acdc7-30be-4dd1-9898-fc9e42b3d304/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/4a9acdc7-30be-4dd1-9898-fc9e42b3d304/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/4a9acdc7-30be-4dd1-9898-fc9e42b3d304/3",
        },
        "750": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/ca17277c-53e5-422b-8bb4-7c5dcdb0ac67/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/ca17277c-53e5-422b-8bb4-7c5dcdb0ac67/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/ca17277c-53e5-422b-8bb4-7c5dcdb0ac67/3",
        },
        "800": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/9c1fb96d-0579-43d7-ba94-94672eaef63a/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/9c1fb96d-0579-43d7-ba94-94672eaef63a/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/9c1fb96d-0579-43d7-ba94-94672eaef63a/3",
        },
        "850": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/cc924aaf-dfd4-4f3f-822a-f5a87eb24069/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/cc924aaf-dfd4-4f3f-822a-f5a87eb24069/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/cc924aaf-dfd4-4f3f-822a-f5a87eb24069/3",
        },
        "900": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/193d86f6-83e1-428c-9638-d6ca9e408166/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/193d86f6-83e1-428c-9638-d6ca9e408166/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/193d86f6-83e1-428c-9638-d6ca9e408166/3",
        },
        "950": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/7ce130bd-6f55-40cc-9231-e2a4cb712962/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/7ce130bd-6f55-40cc-9231-e2a4cb712962/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/7ce130bd-6f55-40cc-9231-e2a4cb712962/3",
        },
        "1000": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/bfb7399a-c632-42f7-8d5f-154610dede81/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/bfb7399a-c632-42f7-8d5f-154610dede81/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/bfb7399a-c632-42f7-8d5f-154610dede81/3",
        },
        "2000": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/4e8b3a32-1513-44ad-8a12-6c90232c77f9/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/4e8b3a32-1513-44ad-8a12-6c90232c77f9/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/4e8b3a32-1513-44ad-8a12-6c90232c77f9/3",
        },
        "3000": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/b18852ba-65d2-4b84-97d2-aeb6c44a0956/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/b18852ba-65d2-4b84-97d2-aeb6c44a0956/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/b18852ba-65d2-4b84-97d2-aeb6c44a0956/3",
        },
        "4000": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/efbf3c93-ecfa-4b67-8d0a-1f732fb07397/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/efbf3c93-ecfa-4b67-8d0a-1f732fb07397/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/efbf3c93-ecfa-4b67-8d0a-1f732fb07397/3",
        },
        "5000": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/d775275d-fd19-4914-b63a-7928a22135c3/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/d775275d-fd19-4914-b63a-7928a22135c3/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/d775275d-fd19-4914-b63a-7928a22135c3/3",
        },
      },
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
      twitchbot: {
        "1": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/df9095f6-a8a0-4cc2-bb33-d908c0adffb8/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/df9095f6-a8a0-4cc2-bb33-d908c0adffb8/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/df9095f6-a8a0-4cc2-bb33-d908c0adffb8/3",
        },
      },
      vip: {
        "1": {
          "1x": "https://static-cdn.jtvnw.net/badges/v1/b817aba4-fad8-49e2-b88a-7cc744dfa6ec/1",
          "2x": "https://static-cdn.jtvnw.net/badges/v1/b817aba4-fad8-49e2-b88a-7cc744dfa6ec/2",
          "4x": "https://static-cdn.jtvnw.net/badges/v1/b817aba4-fad8-49e2-b88a-7cc744dfa6ec/3",
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
