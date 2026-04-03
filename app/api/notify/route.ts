// app/api/notify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getTwilioClient } from '@/lib/twilio';

export async function POST(request: NextRequest) {
  try {
    const { user_id, test_phone } = await request.json();

    // Para testing sin número real, usar test_phone
    const phoneToUse = test_phone || '+573001111111';

    const twilio = getTwilioClient();
    const message = await twilio.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM!,
      to: `whatsapp:${phoneToUse}`,
      body: `Hola, mensaje de prueba desde Functional Fitness`
    });

    return NextResponse.json({
      success: true,
      message_id: message.sid,
      status: message.status
    });

  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error en /api/notify:', errorMsg);
    
    return NextResponse.json(
      { error: errorMsg },
      { status: 500 }
    );
  }
}