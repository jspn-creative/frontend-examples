import { json, error } from '@sveltejs/kit';
import { writeFile, access, mkdir } from 'fs/promises';
import { constants } from 'fs';
import { join, dirname } from 'path';

// Use import.meta.glob to discover all page files at build time
const pageModules = import.meta.glob('/src/routes/**/+page.svelte');

export async function GET({ url }) {
  // Get the route path from the query parameter
  const routePath = url.searchParams.get('routePath');
  
  if (!routePath) {
    throw error(400, 'Missing routePath parameter');
  }
  
  // Normalize the route path
  let normalizedPath = routePath;
  if (!normalizedPath.startsWith('/')) normalizedPath = `/${normalizedPath}`;
  if (normalizedPath.endsWith('/')) normalizedPath = normalizedPath.slice(0, -1);
  
  try {
    // For the file system, we need to determine the actual route path including (examples)
    // Map from the clean URL to the actual file system path
    
    // First, we'll find the matching module path for this route
    let actualRoutePath = normalizedPath;
    let foundMatchingPath = false;
    
    // Check all available modules to find the correct internal path
    for (const modulePath in pageModules) {
      // Clean the module path to match our URL format
      const cleanedModulePath = modulePath
        .replace('/src/routes', '')
        .replace('/+page.svelte', '')
        .replace(/\/\([^)]+\)/g, '');
      
      // If this cleaned path matches our requested path, use the original module path
      if (cleanedModulePath === normalizedPath) {
        actualRoutePath = modulePath
          .replace('/src/routes', '')
          .replace('/+page.svelte', '');
        foundMatchingPath = true;
        break;
      }
    }
    
    if (!foundMatchingPath) {
      // Fall back to using normalizedPath with the assumption it might be in (examples)
      // This helps with direct metadata generation for new routes
      if (normalizedPath.startsWith('/') && !normalizedPath.startsWith('/(examples)')) {
        actualRoutePath = `/(examples)${normalizedPath}`;
      }
    }
    
    // Convert path to a file system path using the actual route path
    const fullRoutePath = join(process.cwd(), 'src/routes', actualRoutePath);
    
    // Extract the route name - handling routes inside (examples) directory
    // Use the normalized path for naming since it doesn't have the (examples) prefix
    let segments = normalizedPath.split('/').filter(Boolean);
    
    const lastSegment = segments[segments.length - 1];
    const routeName = lastSegment.split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    // Check if the path exists
    try {
      await access(fullRoutePath, constants.F_OK);
    } catch (err) {
      throw error(404, `Route directory not found: ${normalizedPath} (tried ${fullRoutePath})`);
    }
    
    // Check if metadata file already exists
    const metadataPath = join(fullRoutePath, 'route-meta.ts');
    let fileExists = false;
    
    try {
      await access(metadataPath, constants.F_OK);
      fileExists = true;
    } catch (err) {
      // File doesn't exist, will create it
    }
    
    if (fileExists) {
      return json({ 
        success: false,
        message: `Metadata file already exists for route: ${normalizedPath}` 
      });
    }
    
    // Get the actual segments for determining import path depth
    // This matters for the relative import to work correctly
    const actualSegments = actualRoutePath.split('/').filter(Boolean);
    
    // Determine the correct relative path for the import
    // Count how many directories deep we are to add the right number of '../'
    const importPath = '../'.repeat(actualSegments.length) + 'api/routes/+server.ts';
    
    // Create the content for the new metadata file
    const metadataContent = `import type { RouteMeta } from '${importPath}';

export const meta: RouteMeta = {
  name: "${routeName}",
  status: "WIP",
  note: "",
  tags: [],
  featured: false
};`;
    
    // Ensure directory exists
    await mkdir(dirname(metadataPath), { recursive: true });
    
    // Write the file
    await writeFile(metadataPath, metadataContent);
    
    return json({ 
      success: true,
      message: `Created metadata file for route: ${normalizedPath}`,
      filePath: `src/routes${actualRoutePath}/route-meta.ts`,
      fullPath: metadataPath
    });
  } catch (err: unknown) {
    console.error('Error creating metadata file:', err);
    if (typeof err === 'object' && err !== null && 'status' in err && 'body' in err) {
      // Pass through SvelteKit errors
      throw err;
    } else {
      const message = err instanceof Error ? err.message : 'Failed to create metadata file';
      throw error(500, message);
    }
  }
} 