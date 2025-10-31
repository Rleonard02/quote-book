import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

async function listPodPackages() {
  const token = await getLuluAccessToken();

  const response = await fetch("https://api.lulu.com/v1/pod-packages", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  console.log("Available POD packages:", data);
}

async function getLuluAccessToken(): Promise<string> {
  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("client_id", process.env.LULU_CLIENT_ID!);
  params.append("client_secret", process.env.LULU_CLIENT_SECRET!);

  const response = await fetch(process.env.LULU_AUTH_URL!, {
    method: "POST",
    body: params,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
  });

  const data = await response.json() as { access_token?: string };
  if (!data.access_token) throw new Error("No access token returned");

  return data.access_token;
}

listPodPackages();
