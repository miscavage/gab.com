'use strict';

//Modules
const https = require('https');
const { URL, URLSearchParams } = require('url');

//Helpers
const Utils = require('./helpers/utilities');
const Constants = require('./helpers/constants');

/**
 * @class GabAPIClient
 * @author Mark Miscavage <markmiscavage@protonmail.com>
 * @description An simple node.js wrapper for the Gab.com API. For more information, visit: https://developers.gab.com
 * @example
 *     const GabAPIClient = require('gab.com');
 *     const Gab = new GabAPIClient(<GAB_API_CLIENT_ID>, <GAB_API_SECRET>);
 * @public
 * @version 0.0.3
 * @license MIT
 * @kind class
 */
class GabAPIClient {

    /**
     * @description GabAPIClient constructor. Sets up initial variables for the class.
     * @constructor
     * @param {string} clientId - Gab.com Client ID
     * @param {string} secret - Gab.com Secret
     * @returns GabAPIClient
     */
    constructor(clientId, secret) {
        //Check if parameters are valid
        if (!Utils.isString(clientId) || Utils.isStringEmpty(clientId)) Utils._WARN_('Invalid parameter', 'clientId must be of type: String and greater than 0 characters.');
        if (!Utils.isString(secret) || Utils.isStringEmpty(secret)) Utils._WARN_('Invalid parameter', 'secret must be of type: String and greater than 0 characters.');

        //Set incoming params
        this._clientId = clientId;
        this._secret = secret;

        //Set defaults
        this._scopes = undefined;
        this._redirectUri = undefined;

        //Return GabAPIClient
        return this;
    }

    /**
     * @description Set secret
     * @function setSecret
     * @param {string} secret - Gab.com Secret
     * @returns GabAPIClient
     */
    setSecret(secret) {
        //Check if parameters are valid
        if (!Utils.isString(secret) || Utils.isStringEmpty(secret)) Utils._WARN_('Invalid parameter', 'secret must be of type: String and greater than 0 characters.');

        //Set
        this._secret = secret;

        //Return GabAPIClient
        return this;
    }

    /**
     * @description Get secret
     * @returns {string} secret - Gab.com Secret
     */
    get secret() {
        return this._secret;
    }

    /**
     * @description Set secret
     * @param {string} secret - Gab.com Secret
     */
    set secret(secret) {
        //Check if parameters are valid
        if (!Utils.isString(secret) || Utils.isStringEmpty(secret)) Utils._WARN_('Invalid parameter', 'secret must be of type: String and greater than 0 characters.');

        //Set
        this._secret = secret;
    }

    /**
     * @description Set Client ID
     * @function setClientId
     * @param {string} clientId - Gab.com Client ID
     * @returns GabAPIClient
     */
    setClientId(clientId) {
        //Check if parameters are valid
        if (!Utils.isString(clientId) || Utils.isStringEmpty(clientId)) Utils._WARN_('Invalid parameter', 'clientId must be of type: String and greater than 0 characters.');

        //Set
        this._clientId = clientId;

        //Return GabAPIClient
        return this;
    }

    /**
     * @description Get Client ID
     * @returns {string} clientId - Gab.com Client ID
     */
    get clientId() {
        return this._clientId
    }

    /**
     * @description Set Client ID
     * @param {string} clientId - Gab.com Client ID
     */
    set clientId(clientId) {
        //Check if parameters are valid
        if (!Utils.isString(clientId) || Utils.isStringEmpty(clientId)) Utils._WARN_('Invalid parameter', 'clientId must be of type: String and greater than 0 characters.');

        //Set
        this._clientId = clientId;
    }

    /**
     * @description Set redirect URI. After the Gab.com user answers your access request, they will be redirected to the route specified.
     * @function setRedirectUri
     * @param {string} redirectUri - Route to be redirected to after a Gab.com access request is answered
     * @returns GabAPIClient
     */
    setRedirectUri(redirectUri) {
        //Set
        this._redirectUri = new URL(redirectUri).href;

        //Return GabAPIClient
        return this;
    }

    /**
     * @description Get redirect URI. After the Gab.com user answers your access request, they will be redirected to the route specified.
     * @returns {string} redirectUri - Route to be redirected to after a Gab.com access request is answered
     */
    get redirectUri() {
        return this._redirectUri;
    }

    /**
     * @description Set redirect URI. After the Gab.com user answers your access request, they will be redirected to the route specified.
     * @param {string} redirectUri - Route to be redirected to after a Gab.com access request is answered
     */
    set redirectUri(redirectUri) {
        //Set
        this._redirectUri = new URL(redirectUri).href;
    }

    /**
     * @description Set Gab.com access request scopes. Scopes are used to specify what your app wants to do on behalf of a user. Use the GabAPIClient.SCOPES enumeration to properly set scopes.
     * @function setScopes
     * @param {array} scopes - Array of GabAPIClient.SCOPES enumerations
     * @returns GabAPIClient
     */
    setScopes(scopes) {
        //Check if parameters are valid
        if (!Utils.isArray(scopes)) Utils._WARN_('Invalid parameter', 'scopes must be of type: Array');

        //Set
        this._scopes = scopes;

        //Return GabAPIClient
        return this;
    }

    /**
     * @description Get Gab.com access request scopes. Scopes are used to specify what your app wants to do on behalf of a user. Use the GabAPIClient.SCOPES enumeration to properly set scopes.
     * @returns {array} scopes - Array of GabAPIClient.SCOPES enumerations
     */
    get scopes() {
        return this._scopes;
    }

    /**
     * @description Set Gab.com access request scopes. Scopes are used to specify what your app wants to do on behalf of a user. Use the GabAPIClient.SCOPES enumeration to properly set scopes.
     * @param {array} scopes - Array of GabAPIClient.SCOPES enumerations
     */
    set scopes(scopes) {
        //Check if parameters are valid
        if (!Utils.isArray(scopes)) Utils._WARN_('Invalid parameter', 'scopes must be of type: Array');

        //Set
        this._scopes = scopes;
    }

    /**
     * @description Join the array of Gab.com scopes for use in the access request.
     * @function getScopesForRequest
     * @returns {string} scopes - Array of GabAPIClient.SCOPES enumerations separated by spaces
     */
    getScopesForRequest() {
        if (!Utils.isArray(this._scopes)) Utils._WARN_('Invalid parameter', 'scopes must be of type: Array');

        return this._scopes.join(' ');
    }

    /**
     * @description Helper to get the authorization url to redirect to for oauth access requests based on given Gab.com Client ID, Secret, redirectUri and scopes.
     * @returns {string} authorizationURL - Authorization url to redirect to for oauth access requests
     */
    get authorizationURL() {
        //Check if required variables are valid
        if (!Utils.isString(this._clientId) || Utils.isStringEmpty(this._clientId)) Utils._WARN_('Invalid parameter', 'You must set the clientId to a string in order to receive a valid authorizationURL.');
        if (!Utils.isString(this._redirectUri) || Utils.isStringEmpty(this._clientId)) Utils._WARN_('Invalid parameter', 'You must set the redirectUri to a string in order to receive a valid authorizationURL.');

        //Set scopes for request
        let scopes = this.getScopesForRequest();
        if (!Utils.isString(scopes) || Utils.isStringEmpty(scopes)) Utils._WARN_('Invalid parameter', 'You must set the scopes in order to receive a valid authorizationURL.');

        let path = '/oauth/authorize';

        let url = `${Constants.BASE}${path}?response_type=code&client_id=${this._clientId}&redirect_uri=${this._redirectUri}&scope=${scopes}`;
        url = encodeURI(url);

        //Return url
        return url;
    }

    /**
     * @description Helper to handle authorization redirect request
     * @async
     * @function handleAuthorizationRedirectRequest
     * @param {object} request
     * @returns {object} { expirationDate, expiresIn, accessToken, refreshToken }
     */
    async handleAuthorizationRedirectRequest(request) {
        //Check if parameters are valid
        if (!request) Utils._WARN_('Invalid parameter', 'Request is not valid.');

        //Get protocol
        let protocol = request.protocol || 'http';
        //Create url
        let url = new URL(`${protocol}://${request.headers.host}${request.url}`);
        //Get query param: code
        let code = url.searchParams.get('code');

        //Handle authorization callback request with retrieved code
        return this._handleAuthorizationCallbackRequest(code);
    }

    /**
     * @description Refreshing tokens - (When refreshing the token, you can only request identical or narrower scopes than the original access token.)
     * @async
     * @function refreshAccessToken
     * @param {string} refreshToken - You can use refresh tokens to create a new access token to avoid expiration.
     * @returns {object} { expirationDate, expiresIn, accessToken, refreshToken }
     */
    async refreshAccessToken(refreshToken) {
        //Check if parameters are valid
        if (!Utils.isString(refreshToken) || Utils.isStringEmpty(refreshToken)) Utils._WARN_('Invalid parameter', 'refreshToken must be of type: String and greater than 0 characters.');

        //Set scopes for request
        let scopes = this.getScopesForRequest();
        if (!Utils.isString(scopes) || Utils.isStringEmpty(scopes)) Utils._WARN_('Invalid parameter', 'You must set the scopes in order to receive a valid authorizationURL.');

        const method = 'POST';
        let path = `/oauth/token`;

        //Create required post data object
        let postData = JSON.stringify({
            refresh_token: refreshToken,
            grant_type: 'refresh_token',
            client_secret: this._secret,
            client_id: this._clientId,
            scope: scopes,
        });

        //Set headers
        let headers = {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData, 'utf8'),
        };

        //Set https.request options
        let options = {
            path,
            headers,
            method,
            host: Constants.HOST,
            port: 443,
        };

        //Make request now
        let results = undefined;
        try {
            results = await this._request(options, postData);
            results = results['data'] || undefined;
        }
        catch (error) {
            Utils._WARN_('Authorization Error', error);
        }

        //Return now
        return this._extractAccessTokenDataFromResults(results);
    }

    /**
     * @description Calls related to the currentUser
     */
    get currentUser() {
        return {
            /**
             * @description Returns the information about logged-in user. Requires read scope.
             * @function currentUser.fetch()
             * @async
             * @param {string} accessToken - User authorization access token
             * @returns {object} - {success, message, code, data}
             */
            fetch: async(accessToken) => {
                const method = 'GET';
                let path = '/me';

                //Build request options
                let options = this._buildRequestOptions(method, path, accessToken);

                //Return request
                return this._request(options);
            },

            /**
             * @description Returns latest notifications. Requires notifications scope.
             * @function currentUser.fetchNotifications()
             * @async
             * @param {string} accessToken - User authorization access token
             * @param {string|number} beforeNoficationId - The notification ID to load older ones
             * @returns {object} - {success, message, code, data}
             */
            fetchNotifications: async(accessToken, beforeNoficationId = '') => {
                const method = 'GET';
                let path = '/notifications';
                if (beforeNoficationId) {
                    path += `?before=${beforeNoficationId}`;
                }

                //Build request options
                let options = this._buildRequestOptions(method, path, accessToken);

                //Return request
                return this._request(options);
            },

            /**
             * @description Returns the main feed. Requires read scope.
             * @function currentUser.fetchFeed()
             * @async
             * @param {string} accessToken - User authorization access token
             * @param {string|date} beforeDate - ISO8601 datetime to load older posts
             * @returns {object} - {success, message, code, data}
             */
            fetchFeed: async(accessToken, beforeDate) => {
                const method = 'GET';
                let path = '/feed';
                if (beforeDate) {
                    path += `?before=${beforeDate}`;
                }

                //Build request options
                let options = this._buildRequestOptions(method, path, accessToken);

                //Return request
                return this._request(options);
            },

            /**
             * @description Creates a post. Requires write-post scope.
             * @function currentUser.createPost()
             * @async
             * @param {string} accessToken - User authorization access token
             * @param {object} postOptions - Post options, see: https://developers.gab.com/#949155f0-821e-3228-49ea-4b15f35422a3 for more details
             * @returns {object} - {success, message, code, data}
             */
            createPost: async(accessToken, postOptions) => {
                const method = 'POST';
                let path = '/posts';

                //Build request options
                let options = this._buildRequestOptions(method, path, accessToken, postOptions);

                //Return request
                return this._request(options, postOptions);
            },
        }
    }

    /**
     * @description Calls related to the users
     */
    get users() {
        return {
            /**
             * @description Returns the information about a user with given username. Requires read scope.
             * @function users.fetchUser()
             * @async
             * @param {string} accessToken - User authorization access token
             * @param {string} username - Username of a valid Gab.com account
             * @returns {object}
             */
            fetchUser: async(accessToken, username) => {
                if (!Utils.isString(username) || Utils.isStringEmpty(username)) Utils._WARN_('Invalid parameter', 'username must be of type: String and greater than 0 characters.');

                const method = 'GET';
                let path = `/users/${username}`;

                //Build request options
                let options = this._buildRequestOptions(method, path, accessToken);

                //Return request
                return this._request(options);
            },

            /**
             * @description Returns followers of given user. Requires read scope.
             * @function users.fetchUserFollowers()
             * @async
             * @param {string} accessToken - User authorization access token
             * @param {string} username - Username of a valid Gab.com account
             * @param {number|string} beforeCount - The index of followers start to fetch from
             * @returns {object}
             */
            fetchUserFollowers: async(accessToken, username, beforeCount) => {
                if (!Utils.isString(username) || Utils.isStringEmpty(username)) Utils._WARN_('Invalid parameter', 'username must be of type: String and greater than 0 characters.');

                const method = 'GET';
                let path = `/users/${username}/followers`;
                if (beforeCount) {
                    path += `?before=${beforeCount}`;
                }

                //Build request options
                let options = this._buildRequestOptions(method, path, accessToken);

                //Return request
                return this._request(options);
            },

            /**
             * @description Returns the users that given user is following. Requires read scope.
             * @function users.fetchUserFollowing()
             * @async
             * @param {string} accessToken - User authorization access token
             * @param {string} username - Username of a valid Gab.com account
             * @param {number|string} beforeCount - The index of following start to fetch from
             * @returns {object}
             */
            fetchUserFollowing: async(accessToken, username, beforeCount) => {
                if (!Utils.isString(username) || Utils.isStringEmpty(username)) Utils._WARN_('Invalid parameter', 'username must be of type: String and greater than 0 characters.');

                const method = 'GET';
                let path = `/users/${username}/following`;
                if (beforeCount) {
                    path += `?before=${beforeCount}`;
                }

                //Build request options
                let options = this._buildRequestOptions(method, path, accessToken);

                //Return request
                return this._request(options);
            },

            /**
             * @description Returns the feed of given user. Requires read scope.
             * @function users.fetchUserFeed()
             * @async
             * @param {string} accessToken - User authorization access token
             * @param {string} username - Username of a valid Gab.com account
             * @param {string|date} beforeDate - ISO8601 datetime to load older posts
             * @returns {object}
             */
            fetchUserFeed: async(accessToken, username, beforeDate) => {
                if (!Utils.isString(username) || Utils.isStringEmpty(username)) Utils._WARN_('Invalid parameter', 'username must be of type: String and greater than 0 characters.');

                const method = 'GET';
                let path = `/users/${username}/feed`;
                if (beforeDate) {
                    path += `?before=${beforeDate}`;
                }

                //Build request options
                let options = this._buildRequestOptions(method, path, accessToken);

                //Return request
                return this._request(options);
            },

            /**
             * @description Follows given user or creates a follow request if the target user is private. Requires engage-user scope.
             * @function users.followUser()
             * @async
             * @param {string} accessToken - User authorization access token
             * @param {number|string} userId - User ID of a valid Gab.com account
             * @returns {object}
             */
            followUser: async(accessToken, userId) => {
                if (Utils.isNumber(userId)) userId = userId.toString();
                if (!Utils.isString(userId) || Utils.isStringEmpty(userId)) Utils._WARN_('Invalid parameter', 'userId must be of type: String and greater than 0 characters.');

                const method = 'POST';
                let path = `/users/${userId}/follow`;

                //Build request options
                let options = this._buildRequestOptions(method, path, accessToken);

                //Return request
                return this._request(options);
            },

            /**
             * @description Unfollows given user. Requires engage-user scope.
             * @function users.unfollowUser()
             * @async
             * @param {string} accessToken - User authorization access token
             * @param {number|string} userId - User ID of a valid Gab.com account
             * @returns {object}
             */
            unfollowUser: async(accessToken, userId) => {
                if (Utils.isNumber(userId)) userId = userId.toString();
                if (!Utils.isString(userId) || Utils.isStringEmpty(userId)) Utils._WARN_('Invalid parameter', 'userId must be of type: String and greater than 0 characters.');

                const method = 'DELETE';
                let path = `/users/${userId}/follow`;

                //Build request options
                let options = this._buildRequestOptions(method, path, accessToken);

                //Return request
                return this._request(options);
            },
        }
    }

    /**
     * @description Calls related to the popular route
     */
    get popular() {
        return {
            /**
             * @description Returns the popular feed. Requires read scope.
             * @function popular.fetchPopularFeed()
             * @async
             * @param {string} accessToken - User authorization access token
             * @returns {object}
             */
            fetchPopularFeed: async(accessToken) => {
                const method = 'GET';
                let path = '/popular/feed/';

                //Build request options
                let options = this._buildRequestOptions(method, path, accessToken);

                //Return request
                return this._request(options);
            },

            /**
             * @description Returns popular users. Requires read scope.
             * @function popular.fetchPopularUsers()
             * @async
             * @param {string} accessToken - User authorization access token
             * @returns {object}
             */
            fetchPopularUsers: async(accessToken) => {
                const method = 'GET';
                let path = '/popular/users/';

                //Build request options
                let options = this._buildRequestOptions(method, path, accessToken);

                //Return request
                return this._request(options);
            },
        }
    }

    /**
     * @description Calls related to posts
     */
    get posts() {
        return {
            /**
             * @description Upvotes given post. Requires engage-post scope.
             * @function posts.upvotePost()
             * @async
             * @param {string} accessToken - User authorization access token
             * @param {number|string} postId - Post ID of a valid Gab.com post
             * @returns {object}
             */
            upvotePost: async(accessToken, postId) => {
                if (Utils.isNumber(postId)) postId = postId.toString();
                if (!Utils.isString(postId) || Utils.isStringEmpty(postId)) Utils._WARN_('Invalid parameter', 'postId must be of type: String and greater than 0 characters.');

                const method = 'POST';
                let path = `/posts/${postId}/upvote`;

                //Build request options
                let options = this._buildRequestOptions(method, path, accessToken);

                //Return request
                return this._request(options);
            },

            /**
             * @description Removes the upvote for given post. Requires engage-post scope.
             * @function posts.removeUpvotePost()
             * @async
             * @param {string} accessToken - User authorization access token
             * @param {number|string} postId - Post ID of a valid Gab.com post
             * @returns {object}
             */
            removeUpvotePost: async(accessToken, postId) => {
                if (Utils.isNumber(postId)) postId = postId.toString();
                if (!Utils.isString(postId) || Utils.isStringEmpty(postId)) Utils._WARN_('Invalid parameter', 'postId must be of type: String and greater than 0 characters.');

                const method = 'DELETE';
                let path = `/posts/${postId}/upvote`;

                //Build request options
                let options = this._buildRequestOptions(method, path, accessToken);

                //Return request
                return this._request(options);
            },

            /**
             * @description Downvotes given post. Requires engage-post scope.
             * @function posts.downvotePost()
             * @async
             * @param {string} accessToken - User authorization access token
             * @param {number|string} postId - Post ID of a valid Gab.com post
             * @returns {object}
             */
            downvotePost: async(accessToken, postId) => {
                if (Utils.isNumber(postId)) postId = postId.toString();
                if (!Utils.isString(postId) || Utils.isStringEmpty(postId)) Utils._WARN_('Invalid parameter', 'postId must be of type: String and greater than 0 characters.');

                const method = 'POST';
                let path = `/posts/${postId}/downvote`;

                //Build request options
                let options = this._buildRequestOptions(method, path, accessToken);

                //Return request
                return this._request(options);
            },

            /**
             * @description Removes the downvote for given post. Requires engage-post scope.
             * @function posts.removeDownvotePost()
             * @async
             * @param {string} accessToken - User authorization access token
             * @param {number|string} postId - Post ID of a valid Gab.com post
             * @returns {object}
             */
            removeDownvotePost: async(accessToken, postId) => {
                if (Utils.isNumber(postId)) postId = postId.toString();
                if (!Utils.isString(postId) || Utils.isStringEmpty(postId)) Utils._WARN_('Invalid parameter', 'postId must be of type: String and greater than 0 characters.');

                const method = 'DELETE';
                let path = `/posts/${postId}/downvote`;

                //Build request options
                let options = this._buildRequestOptions(method, path, accessToken);

                //Return request
                return this._request(options);
            },

            /**
             * @description Reposts given post. Requires engage-post scope.
             * @function posts.repostPost()
             * @async
             * @param {string} accessToken - User authorization access token
             * @param {number|string} postId - Post ID of a valid Gab.com post
             * @returns {object}
             */
            repostPost: async(accessToken, postId) => {
                if (Utils.isNumber(postId)) postId = postId.toString();
                if (!Utils.isString(postId) || Utils.isStringEmpty(postId)) Utils._WARN_('Invalid parameter', 'postId must be of type: String and greater than 0 characters.');

                const method = 'POST';
                let path = `/posts/${postId}/repost`;

                //Build request options
                let options = this._buildRequestOptions(method, path, accessToken);

                //Return request
                return this._request(options);
            },

            /**
             * @description Remove repost record for given post. Requires engage-post scope.
             * @function posts.removeRepostPost()
             * @async
             * @param {string} accessToken - User authorization access token
             * @param {number|string} postId - Post ID of a valid Gab.com post
             * @returns {object}
             */
            removeRepostPost: async(accessToken, postId) => {
                if (Utils.isNumber(postId)) postId = postId.toString();
                if (!Utils.isString(postId) || Utils.isStringEmpty(postId)) Utils._WARN_('Invalid parameter', 'postId must be of type: String and greater than 0 characters.');

                const method = 'DELETE';
                let path = `/posts/${postId}/repost`;

                //Build request options
                let options = this._buildRequestOptions(method, path, accessToken);

                //Return request
                return this._request(options);
            },

            /**
             * @description Returns the details of given post. Requires engage-post scope.
             * @function posts.fetchPostDetails()
             * @async
             * @param {string} accessToken - User authorization access token
             * @param {number|string} postId - Post ID of a valid Gab.com post
             * @returns {object}
             */
            fetchPostDetails: async(accessToken, postId) => {
                if (Utils.isNumber(postId)) postId = postId.toString();
                if (!Utils.isString(postId) || Utils.isStringEmpty(postId)) Utils._WARN_('Invalid parameter', 'postId must be of type: String and greater than 0 characters.');

                const method = 'GET';
                let path = `/posts/${postId}`;

                //Build request options
                let options = this._buildRequestOptions(method, path, accessToken);

                //Return request
                return this._request(options);
            },
        }
    }

    /**
     * @description Calls related to groups
     */
    get groups() {
        return {
            /**
            * @description Returns a list of groups with more activities recently. Requires read scope.
            * @function groups.fetchGroups()
            * @async
            * @param {string} accessToken - User authorization access token
            * @returns {object}
            */
            fetchGroups: async(accessToken) => {
                const method = 'GET';
                let path = '/groups';

                //Build request options
                let options = this._buildRequestOptions(method, path, accessToken);

                //Return request
                return this._request(options);
            },

            /**
             * @description Returns details of given group. Requires read scope.
             * @function groups.fetchGroupDetails()
             * @async
             * @param {string} accessToken - User authorization access token
             * @param {string} groupId - Id of Gab.com group
             * @returns {object}
             */
            fetchGroupDetails: async(accessToken, groupId) => {
                if (!Utils.isString(groupId) || Utils.isStringEmpty(groupId)) Utils._WARN_('Invalid parameter', 'groupId must be of type: String and greater than 0 characters.');

                const method = 'GET';
                let path = `/groups/${groupId}`;

                //Build request options
                let options = this._buildRequestOptions(method, path, accessToken);

                //Return request
                return this._request(options);
            },

            /**
             * @description Returns a list of given group's members. Requires read scope.
             * @function groups.getGroupUsers()
             * @async
             * @param {string} accessToken - User authorization access token
             * @param {string} groupId - Id of Gab.com group
             * @param {number|string} beforeCount - The index of users start to fetch from
             * @returns {object}
             */
            getGroupUsers: async(accessToken, groupId, beforeCount) => {
                if (!Utils.isString(groupId) || Utils.isStringEmpty(groupId)) Utils._WARN_('Invalid parameter', 'groupId must be of type: String and greater than 0 characters.');

                const method = 'GET';
                let path = `/groups/${groupId}/users`;
                if (beforeCount) {
                    path += `?before=${beforeCount}`;
                }

                //Build request options
                let options = this._buildRequestOptions(method, path, accessToken);

                //Return request
                return this._request(options);
            },

            /**
             * @description Returns a list of given group's moderation logs. Requires read scope.
             * @function groups.getGroupModerationLogs()
             * @async
             * @param {string} accessToken - User authorization access token
             * @param {string} groupId - Id of Gab.com group
             * @returns {object}
             */
            getGroupModerationLogs: async(accessToken, groupId) => {
                if (!Utils.isString(groupId) || Utils.isStringEmpty(groupId)) Utils._WARN_('Invalid parameter', 'groupId must be of type: String and greater than 0 characters.');

                const method = 'GET';
                let path = `/groups/${groupId}/moderation-logs`;

                //Build request options
                let options = this._buildRequestOptions(method, path, accessToken);

                //Return request
                return this._request(options);
            },
        }
    }

    /**
     * @description Internal helper to handle authorization callback request
     * @async
     * @function _handleAuthorizationCallbackRequest
     * @param {string} code - Code retrieved from Gab.com access request as a query string in our given redirect url
     * @returns {object} { expirationDate, expiresIn, accessToken, refreshToken }
     */
    async _handleAuthorizationCallbackRequest(code) {
        //Check if parameters are valid
        if (!Utils.isString(code) || Utils.isStringEmpty(code)) Utils._WARN_('Invalid parameter', 'code must be of type: String and greater than 0 characters.');

        const method = 'POST';
        let path = `/oauth/token`;

        //Create required post data object
        let postData = JSON.stringify({
            code,
            grant_type: 'authorization_code',
            client_id: this._clientId,
            redirect_uri: this._redirectUri,
            client_secret: this._secret,
        });

        //Set headers
        let headers = {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData, 'utf8'),
        };

        //Set https.request options
        let options = {
            path,
            headers,
            method,
            host: Constants.HOST,
            port: 443,
        };

        //Make request now
        let results = undefined;
        try {
            results = await this._request(options, postData);
            results = results['data'] || undefined;
        }
        catch (error) {
            Utils._WARN_('Authorization Error', error);
        }

        //Return now
        return this._extractAccessTokenDataFromResults(results);
    }

    /**
     * @description Extract access token data from results from /oauth/token calls
     * @function _extractAccessTokenDataFromResults
     * @param {object} results - Results (body) from request
     * @returns {object} { expirationDate, expiresIn, accessToken, refreshToken }
     */
    _extractAccessTokenDataFromResults(results) {
        if (!Utils.isObject(results)) Utils._WARN_('Invalid parameter', 'results must be of type: Object.');

        //Set expiration data base on expires_in (in seconds)
        let expirationDate = new Date();
        expirationDate.setSeconds(expirationDate.getSeconds() + results.expires_in);

        let data = {
            expirationDate,
            expiresIn: results.expires_in,
            accessToken: results.access_token,
            refreshToken: results.refresh_token,
        };

        //Return data object
        return data;
    }

    /**
     * @description Build options for https.request
     * @function _buildRequestOptions
     * @param {string} method - One of GabAPIClient.ACCEPTED_METHODS
     * @param {string} path - Relative path for API
     * @param {string} accessToken - User authorization access token
     * @param {object|string} postData - Post data
     * @returns {Promise} Body of https request data results
     */
    _buildRequestOptions(method, path, accessToken, postData) {
        //Check if parameters are valid
        if (!Utils.isString(accessToken) || Utils.isStringEmpty(accessToken)) Utils._WARN_('Invalid parameter', 'You must set the accessToken to a string in order to have any successful API calls.');

        //Create headers with Bearer ACCESS_TOKEN
        let headers = {
            "Authorization": `Bearer ${accessToken}`,
        };

        //Check if has post data
        if (postData) {
            //If not already stringified, do it now
            if (!Utils.isString(postData)) postData = JSON.stringify(postData);

            //Add to headers
            headers['Content-Type'] = 'application/json';
            headers['Content-Length'] = Buffer.byteLength(postData, 'utf8');
        }

        //Transform to uppercase
        method = method.toUpperCase();

        //Make relative path
        path = `/v${Constants.VERSION}${path}`;

        //Create options
        let options = {
            path,
            headers,
            method,
            host: Constants.HOST,
            port: 443,
        };

        //Return options
        return options;
    }

    /**
     * @description Perform https request
     * @function _request
     * @param {object} options - https.request options
     * @param {object} postData - (optional) JSON.Stringified object
     * @returns {Promise} Body of https request data results
     */
    _request(options, postData) {
        return new Promise((resolve, reject) => {
            //Perform request
            let req = https.request(options, (res) => {
                let body = [];

                //Set body on data
                res.on('data', (chunk) => {
                    body.push(chunk);
                });

                //On end, end the Promise
                res.on('end', () => {
                    try {
                        body = Buffer.concat(body);
                        body = body.toString();

                        //Check if page is returned instead of JSON
                        if (body.startsWith('<!DOCTYPE html>')) Utils._WARN_('Invalid request', 'There was a problem with your request. The parameter(s) you gave are missing or incorrect.');

                        //Attempt to parse
                        body = JSON.parse(body);
                    }
                    catch (error) {
                        reject(error);
                    };

                    //Create return object
                    let returnObject = {
                        success: !(res.statusCode < 200 || res.statusCode >= 300),
                        message: res.statusMessage,
                        code: res.statusCode,
                        data: body,
                    };

                    resolve(returnObject);
                });
            });

            //On error, reject the Promise
            req.on('error', (error) => reject(error));

            //If has postData, write to request
            if (postData) {
                req.write(postData);
            }

            //End request
            req.end();
        });
    }
}

//Set Constants
GabAPIClient.SCOPES = Constants.SCOPES;
GabAPIClient.VERSION = Constants.VERSION;
GabAPIClient.REQUESTS_PER_MINUTE = Constants.REQUESTS_PER_MINUTE;
GabAPIClient.ACCEPTED_METHODS = Constants.ACCEPTED_METHODS;
GabAPIClient.MIME_TYPES = Constants.MIME_TYPES;

//

module.exports = exports = GabAPIClient;