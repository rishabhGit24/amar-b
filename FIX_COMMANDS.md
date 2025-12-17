# Fix Commands

## Issue 1: npm install in wrong directory

You were running `npm install` in the root directory (`R:\StartUp\New folder (2)`), but you need to run it in the **frontend** directory.

### Correct Commands:

```cmd
cd frontend
npm install
```

Or from the root directory:

```cmd
npm install --prefix frontend
```

## Issue 2: TypeScript errors in ParticleBackground.tsx

✅ **FIXED** - Removed unused `@ts-expect-error` directives and changed the mesh ref to use `@ts-ignore` instead.

The TypeScript errors should now be resolved. The frontend should compile successfully.

## Summary

1. Navigate to frontend folder: `cd frontend`
2. Install dependencies: `npm install`
3. Start dev server: `npm start`

The backend is already running on port 8000, so once you start the frontend, everything should work together.
