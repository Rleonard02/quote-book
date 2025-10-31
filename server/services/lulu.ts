import fetch from "node-fetch";

let token: string | null = null;
let tokenExpiresAt = 0;

interface LuluTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export async function getLuluToken(): Promise<string> {
  const now = Date.now();

  if (token && now < tokenExpiresAt - 60000) {
    return token;
  }

  const response = await fetch(process.env.LULU_AUTH_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.LULU_CLIENT_ID!,
      client_secret: process.env.LULU_CLIENT_SECRET!,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("Failed to fetch  token:", response.status, text);
    throw new Error("Failed to fetch Lulu  token");
  }

  const data = (await response.json()) as LuluTokenResponse;
  console.log("New Lulu access token fetched");

  token = data.access_token;
  tokenExpiresAt = now + data.expires_in * 1000;

  return token!;
}
