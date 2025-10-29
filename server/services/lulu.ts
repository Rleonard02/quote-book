import fetch from "node-fetch";

let luluAccessToken: string | null = null;
let tokenExpiresAt = 0;

interface LuluTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export async function getLuluToken(): Promise<string> {
  const now = Date.now();

  if (luluAccessToken && now < tokenExpiresAt - 60000) {
    return luluAccessToken;
  }

  const response = await fetch(process.env.LULU_AUTH_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(
          `${process.env.LULU_CLIENT_ID}:${process.env.LULU_CLIENT_SECRET}`
        ).toString("base64"),
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
    }),
  });
  
  let data = await response.json() as LuluTokenResponse;
  console.log("New Lulu access token fetched");

  luluAccessToken = data.access_token;
  tokenExpiresAt = now + data.expires_in * 1000;

  return luluAccessToken!;
}
