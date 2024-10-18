"use server";

import { currentUser } from "@clerk/nextjs/server";
import { StreamClient } from "@stream-io/node-sdk";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const apiSecret = process.env.STREAM_SECRET_KEY;

export const tokenProvider = async () => {
  const user = await currentUser();

  if (!user) throw new Error("User is not logged in");
  if (!apiKey) throw new Error("No Stream API Key provided");
  if (!apiSecret) throw new Error("No Stream API Secret Key provided");

  const client = new StreamClient(apiKey, apiSecret);

  const exp = Math.round(new Date().getTime() / 1000) + 60 * 60; 
  const issued = Math.floor(new Date().getTime() / 1000) - 60;

  const token = client.createToken(user.id, exp, issued);

  console.log("[action tokenProvider] token: ", typeof token);
  return token;
};
