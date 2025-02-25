import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request, { params }) {
    try {
        // Await and decode the URL-encoded university name
        const { university } = await params;
        const decodedUniversity = decodeURIComponent(university);
        
        const universityPath = path.join(process.cwd(), '..', 'data', decodedUniversity);
        
        // Get all items in the university directory
        const items = await fs.readdir(universityPath, { withFileTypes: true });
        
        // Filter to only include directories (departments)
        const departments = items
            .filter(item => item.isDirectory())
            .map(dir => dir.name);
            
        return Response.json(departments);
    } catch (error) {
        console.error('Error fetching departments:', error);
        return Response.json({ 
            error: `Failed to fetch departments: ${error.message}` 
        }, { status: 500 });
    }
} 