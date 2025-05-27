import { NextResponse } from 'next/server';
import prisma from "@/db/index";
import { Decimal } from '@prisma/client/runtime/library';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  let body: {
    latitude: number;
    longitude: number;
    address?: string;
    ip?: string;
    userAgent?: string;
    platform?: string;
    language?: string;
    screenResolution?: string;
    deviceName?: string;
    model?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ status: "failure", data: { message: 'Invalid JSON' } }, { status: 400 });
  }

  const { latitude, longitude, address, ip, userAgent, platform, language, screenResolution, deviceName, model } = body;

  if (
    typeof latitude !== 'number' ||
    typeof longitude !== 'number'
  ) {
    return NextResponse.json({ status: "failure", data: { message: 'Latitude and longitude are required and must be numbers' } }, { status: 400 });
  }

  if (
    (address && typeof address !== 'string') ||
    (ip && typeof ip !== 'string') ||
    (userAgent && typeof userAgent !== 'string') ||
    (platform && typeof platform !== 'string') ||
    (language && typeof language !== 'string') ||
    (screenResolution && typeof screenResolution !== 'string') ||
    (deviceName && typeof deviceName !== 'string') ||
    (model && typeof model !== 'string')
  ) {
    return NextResponse.json({ status: "failure", data: { message: 'Invalid input data' } }, { status: 400 });
  }

  try {
    const newLog = await prisma.waitlistVisitorLocationLog.create({
      data: {
        address: address || null,
        latitude: new Decimal(latitude),
        longitude: new Decimal(longitude),
        ip: ip || null,
        userAgent: userAgent || null,
        platform: platform || null,
        language: language || null,
        screenResolution: screenResolution || null,
        deviceName: deviceName || null,
        model: model || null,
      },
    });

    const token = jwt.sign(
      { logId: newLog.id },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '24h' }
    );

    return NextResponse.json(
      {
        status: "success",
        data: {
          message: 'Location and device info logged',
          log: newLog,
          token, // Include JWT in response
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error logging location and device info:', error);
    return NextResponse.json({ status: "failure", data: { message: 'Internal server error' } }, { status: 500 });
  }
}