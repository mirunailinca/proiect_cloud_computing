import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
    const { id } = await params;
    try {
        const records = await getCollection('records');
        const plant = await records.findOne({ _id: new ObjectId(id) });
        if (!plant) {
            return NextResponse.json({ error: 'Plant not found' }, { status: 404 });
        }
        return NextResponse.json(plant);
    } catch (e) {
        return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }
}

export async function DELETE(request, { params }) {
    const { id } = await params;
    try {
        const records = await getCollection('records');
        await records.deleteOne({ _id: new ObjectId(id) });
        return NextResponse.json({ message: 'Deleted successfully' });
    } catch (e) {
        return NextResponse.json({ error: 'Error deleting' }, { status: 500 });
    }
}
