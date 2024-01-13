/**
 * An array of routes that accesible to the public
 * These routes does not require authentications
 * @type  {string[]}
 */

export const publicRoutes =[
    "/"
];


/**
 * An array of routes that are used for authentication
 * These routes will redirect loggen in users to /dashboard 
 * @type  {string[]}
 */
export const authRoutes =[
    "/login"
];

/**
 * The Prefix for API authentication routes
 * Routes that start ith this prefix are used for API
 * authentication purposes
 * @type  {string}
 */
//export const apiAuthPrefix = "api/auth";
export const apiAuthPrefix = "login";

/**
 * The default redirect path after logging in
 * @type  {string}
 */
//export const DEFAULT_LOGIN_REDIRECT = "/settings"
export const DEFAULT_LOGIN_REDIRECT = "/dashboard";


