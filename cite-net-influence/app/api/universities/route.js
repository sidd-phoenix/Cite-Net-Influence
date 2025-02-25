import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
    try {
        const dataDirectory = path.join(process.cwd(), '..', 'data');
        
        // Get all items in the directory
        const items = await fs.readdir(dataDirectory, { withFileTypes: true });
        
        // Filter to only include directories
        const universities = items
            .filter(item => item.isDirectory())
            .map(dir => dir.name);
            
        return Response.json(universities);
    } catch (error) {
        console.error('Error fetching universities:', error);
        return Response.json({ error: 'Failed to fetch universities' }, { status: 500 });
    }
}