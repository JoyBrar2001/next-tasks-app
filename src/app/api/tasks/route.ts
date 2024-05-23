import dbConnect from '@/lib/dbConnect';
import Task from '@/models/Task';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
    await dbConnect();

    try {
        const tasks = await Task.find({});
        return NextResponse.json(tasks);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    await dbConnect();

    try {
        const body = await req.json();
        const task = new Task(body);
        await task.save();
        return NextResponse.json(task);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
