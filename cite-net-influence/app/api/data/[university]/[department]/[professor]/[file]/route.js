import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request, { params }) {
    try {
        const { university, department, professor, file } = await params;
        
        // Decode all URL components
        const decodedUniversity = decodeURIComponent(university);
        const decodedDepartment = decodeURIComponent(department);
        const decodedProfessor = decodeURIComponent(professor);
        const decodedFile = decodeURIComponent(file);
        
        // Build path to the CSV file
        const filePath = path.join(
            process.cwd(),
            '..',
            'data',
            decodedUniversity,
            decodedDepartment,
            decodedProfessor,
            decodedFile
        );
        
        // Read the CSV file
        const fileContent = await fs.readFile(filePath, 'utf-8');
        // console.log(fileContent);
        
        // Return the CSV content with appropriate headers
        return new Response(fileContent, {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="${decodedFile}"`,
            },
        });
    } catch (error) {
        console.error('Error reading CSV file:', error);
        return Response.json({ 
            error: `Failed to read file: ${error.message}` 
        }, { status: 500 });
    }
} 