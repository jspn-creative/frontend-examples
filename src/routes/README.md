# Route Metadata

This project includes a metadata system for routes that provides additional information about each route/component.

## How to Use

Each route directory can include a `route-meta.ts` file with the following structure:

```typescript
export const meta = {
  name: "Route Name",
  status: "Completed", // Status: "WIP" | "Completed" | "Inactive"
  note: "",
  tags: ["hero"],
  featured: false,
};
```

## Quick Creation

You can quickly generate a metadata file for any route by:

1. Browsing to the routes page (http://localhost:5173/)
2. Finding a route without metadata
3. Clicking the "Add Metadata" button in the card
4. Editing the generated file in your code editor

## API

If you want to generate metadata programmatically, use the API endpoint:

```
GET /api/generate-metadata?routePath=your-route-path
```
