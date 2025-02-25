import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request, { params }) {
    try {
        // Wait for params to be available and destructure them
        const { university, department } = await params;
        
        // Decode the URL-encoded names after awaiting params
        const decodedUniversity = decodeURIComponent(university);
        const decodedDepartment = decodeURIComponent(department);
        
        // Build path to the specific department folder
        const professorPath = path.join(process.cwd(), '..', 'data', decodedUniversity, decodedDepartment);
        
        // Get all items in the department directory
        const items = await fs.readdir(professorPath, { withFileTypes: true });
        
        // Filter to only include directories (professor folders)
        const professors = items
            .filter(item => item.isDirectory())
            .map(dir => dir.name);
            
        return Response.json(professors);
    } catch (error) {
        console.error('Error fetching professors:', error);
        return Response.json({ 
            error: `Failed to fetch professors: ${error.message}` 
        }, { status: 500 });
    }
} 