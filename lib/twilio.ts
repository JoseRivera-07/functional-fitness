// lib/twilio.ts
import { Twilio } from 'twilio';

let twilioClient: Twilio | null = null;

export function getTwilioClient(): Twilio {
  if (!twilioClient) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    if (!accountSid || !authToken) {
      throw new Error('Credenciales de Twilio no configuradas');
    }

    twilioClient = new Twilio(accountSid, authToken);
  }

  return twilioClient;
}

export async function sendWhatsAppMessage(
  toPhone: string,
  message: string
): Promise<string> {
  const twilio = getTwilioClient();

  const sentMessage = await twilio.messages.create({
    from: process.env.TWILIO_WHATSAPP_FROM!,
    to: `whatsapp:${toPhone}`,
    body: message
  });

  return sentMessage.sid;
}