# AI Assistant Frontend

## URLs and APIs used

This frontend currently uses the following URL and API configuration:

- Frontend development URL: http://localhost:5173
  - This is the default Vite local development URL.

- Backend base URL:
  - Set through the environment variable VITE_API_BASE_URL.
  - The value is read from [src/services/api.ts](src/services/api.ts).

- Main API endpoint used:
  - POST ${VITE_API_BASE_URL}/indexer-proxy
  - This request is made from [src/pages/Playground/PlaygroundPage.tsx](src/pages/Playground/PlaygroundPage.tsx).
  - It sends a JSON query body to the backend proxy for execution.

## Environment setup

Create a .env file in the project root with:

```env
VITE_API_BASE_URL=http://your-backend-url
```

If VITE_API_BASE_URL is not set, the app falls back to an empty base URL and uses a relative path.

## Notes

- The current frontend does not hardcode any production URL.
- The only API endpoint used in this frontend so far is /indexer-proxy.
