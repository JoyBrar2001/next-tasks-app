import dbConnect from '@/lib/dbConnect';
import Task from '@/models/Task';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { taskId: string } }) {
    await dbConnect();
    try {
        const { taskId } = params;
        const task = await Task.findById(taskId);
        return NextResponse.json(task);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: { taskId: string } }) {
    await dbConnect();

    try {
        const { taskId } = params;
        const { name, completed} = await req.json();
        
        if (!name && completed === undefined) {
            return NextResponse.json({ error: 'Provide either name or completed field to update' }, { status: 400 });
        }

        const updatedTask = await Task.findByIdAndUpdate(taskId, { name, completed }, { new: true });

        if (!updatedTask) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        return NextResponse.json(updatedTask);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { taskId: string } }) {
    await dbConnect();

    try {
        const { taskId } = params;
        const task = await Task.findByIdAndDelete(taskId);
        if (!task) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }
        return NextResponse.json({ message: `Task id:${taskId} has been deleted.` });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}