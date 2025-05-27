import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/db";
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, mobileNumber, visitorLogId } = body;

    if (!name || !mobileNumber) {
      return NextResponse.json({ error: 'Name and mobileNumber are required' }, { status: 400 });
    }

    if (
      typeof name !== 'string' ||
      typeof mobileNumber !== 'string'
    ) {
      return NextResponse.json({ error: 'Invalid type for name or mobileNumber' }, { status: 400 });
    }

    if (visitorLogId !== undefined) {
      if (typeof visitorLogId !== 'number') {
        return NextResponse.json({ error: 'Invalid type for visitorLogId, must be a number' }, { status: 400 });
      }
      const visitorLogExists = await prisma.waitlistVisitorLocationLog.findUnique({
        where: { id: visitorLogId },
      });
      if (!visitorLogExists) {
        return NextResponse.json({ error: 'Invalid visitorLogId, no such visitor log exists' }, { status: 400 });
      }
    }


    const existing = await prisma.waitlistEntry.findUnique({
      where: { mobileNumber },
    });

    if (existing) {
      const token = jwt.sign(
        { name: existing.name, mobileNumber: existing.mobileNumber, waitlistId: existing.id },
        process.env.JWT_SECRET || 'default-secret', 
        { expiresIn: '90d' } 
      );
      return NextResponse.json({ message: 'Already on waitlist', token }, { status: 200 });
    }

    const entry = await prisma.waitlistEntry.create({
      data: {
        name,
        mobileNumber,
        status: "pending",
        visitorLogId: visitorLogId || null,
      },
    });

    const token = jwt.sign(
      { name, mobileNumber, waitlistId: entry.id },
      process.env.JWT_SECRET || 'default-secret', 
      { expiresIn: '90d' } 
    );

    return NextResponse.json(
      {
        message: 'Added to waitlist',
        entry,
        token, 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}