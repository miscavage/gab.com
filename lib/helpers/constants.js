/**
 * @description The base url for the Gab.com API
 * @kind constant
 */
const BASE = 'https://api.gab.com/';

/**
 * @description The host of the Gab.com API
 * @kind constant
 */
const HOST = 'api.gab.com';

/**
 * @description The current version of the GabAPIClient for the Gab.com API
 * @kind constant
 */
const VERSION = '1.0';

/**
 * @description The Gab.com URI according to base and current version
 * @kind constant
 */
const URI = `${BASE}v${VERSION}`;

/**
 * @description The maximum number of requests per minute for the Gab.com API
 * @kind constant
 */
const REQUESTS_PER_MINUTE = 60;

/**
 * @description The available scopes for the Gab.com API. Scopes are used to specify what your app wants to do on behalf of a user.
 * @kind constant
 */
const SCOPES = {
    /** @description Read access to your profile and feeds */
    READ: 'read',
    /** @description Follow or mute users */
    ENGAGE_USER: 'engage-user',
    /** @description Vote, repost, quote or report posts */
    ENGAGE: 'engage-post',
    /** @description Send new posts */
    WRITE_POST: 'write-post',
    /** @description Access notifications */
    NOTIFICATIONS: 'notifications',
};

/**
 * @description The current accepted methods for Gab.com API calls
 * @kind constant
 */
const ACCEPTED_METHODS = [
    'GET',
    'POST',
    'DELETE',
];

//

module.exports = {
    SCOPES,
    ACCEPTED_METHODS,
    BASE,
    HOST,
    VERSION,
    URI,
    REQUESTS_PER_MINUTE,
};