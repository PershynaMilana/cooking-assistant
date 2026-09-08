// container liveness only - the one route handler in the app, deliberately outside the
// "all HTTP goes through the api layer" rule, which is about the product's own API
export const dynamic = "force-dynamic";

// answering from the route cache would prove the file exists, not that the runtime still renders
export const GET = (): Response => new Response("ok");
