// an array of routes that are available to all users, these routes do not require authentication, @type {string[]}
export const publicRoutes = ["/"];

// an array of routes that are used for authentication, These routes will redirect logged in users to /settings, @type {string[]}
export const authRoutes = ["/auth/login", "/auth/register"];

// the prefix for API authentication routes, Routes that start with this prefix are used for api authentication purposes, @type {string}
export const apiAuthPrefix = "/api/auth";

// the default redirect path after logging in, @type {string}
export const DEFAULT_LOGIN_REDIRECT = "/settings";
