# Gab.com API Client for Node.js

An easy to use Node.js wrapper for the Gab.com API with no dependencies.

## • Installation

Latest version: 0.0.3

`npm install gab.com`


## • Gab.com API Documentation

For complete API documentation, up-to-date parameters, reponses and errors, please refer to https://developers.gab.com.

## • Getting your API Keys

At the moment, access to the Gab.com API requires a Gab Pro membership. For more information on that, please refer to https://gab.ai/pro.

If you have Gab Pro already, in order to retrieve your Gab.com Developer API keys, login in and go to your account settings at https://gab.ai/settings/account then navigate to "Developer Apps" at  https://gab.ai/settings/clients.

Click on "Create App" then input your "App Name", "Description", and "Redirect URL" and save it.

Upon saving, you'll find your API "Client ID" and "Secret".

## • Quick Start Example

```javascript
//1. Import gab.com
const GabAPIClient = require('gab.com');

//2. Initiate the Gab API Client with your keys, redirect URI and appropriate scopes
const Gab = new GabAPIClient(GAB_API_CLIENT_ID, GAB_API_SECRET)
                  .setRedirectUri('http://127.0.0.1:3000/redirect');
                  .setScopes([
                      GabAPIClient.SCOPES.READ,
                  ]);
                  
//3. Set up your server
//In this case, we're just going to use the http module
const http = require('http');

//Create server
http.createServer(async(req, res) => {
    var url = req.url;
    
    //4. Set up a route on your sever to connect to the Gab.com OAuth URL
    if (url == '/connect') {
        //Redirect to Gab.authorizationURL
        //The GabAPIClient handles the OAuth
        //Upon completion, the user is redirected to the redirect URI you've set. 
        //In our case it's /redirect
        res.writeHead(302, {
            'Location': Gab.authorizationURL
        });
        res.end();
    }

    //5. Set up a route on your server that matches the redirect URI you've set in your Gab.com Developer account
    else if (url.indexOf('/redirect') > -1) {
        //The GabAPIClient handles the authorization and sends back the user's access token information
        let data = await Gab.handleAuthorizationRedirectRequest(req);

        console.log("Connection Data:", data)

        res.write('Successfully connected');
        res.end();
    }
});
```

## • Setting your Initial GabAPIClient Parameters
You'll need to set up a few parameters before using the GabAPIClient.
Upon instantiation, it's reccomended to set the Client ID and Secret. But you can also set them all individually or chain them like so:

```javascript
Gab.setClientId(GAB_API_CLIENT_ID)
    .setSecret(GAB_API_SECRET)
    .setRedirectUri('http://127.0.0.1:9999/redirect')
    .setScopes([
        GabAPIClient.SCOPES.READ,
        GabAPIClient.SCOPES.ENGAGE,
        GabAPIClient.SCOPES.NOTIFICATIONS,
        GabAPIClient.SCOPES.WRITE_POST,
        GabAPIClient.SCOPES.ENGAGE_USER,
    ]);
```

___
### Secret
The API Secret is required to be set before making any valid requests.


#### Setting the Secret
```javascript
Gab.setSecret(GAB_API_SECRET);
//Alternatively
Gab.secret = GAB_API_SECRET;
```

___
### Client ID
The API Client ID is required to be set before making any valid requests.


#### Setting the Client ID
```javascript
Gab.setClientId(GAB_API_CLIENT_ID);
//Alternatively
Gab.clientId = GAB_API_CLIENT_ID;
```

___
### Redirect URI
The Redirect URI is required to be set in order have a valid OAuth request for a user's access token data.


#### Setting the Redirect URI
```javascript
Gab.setRedirectUri('http://127.0.0.1:9999/redirect');
//Alternatively
Gab.redirectUri = 'http://127.0.0.1:9999/redirect';
```

___
### Scopes
As per the official Gab.com API documentation at https://developers.gab.com/#scopes, scopes are used to specify what your app wants to do on behalf of a user. As the developer, you specify which scopes you want to use according to the actions you require for your application.

The GabAPIClient provides a simple interface to set these currently supported scopes.

| Scope | GabAPIClient Constant | Description |
| --- | --- | --- |
read | `READ` | Read access to your profile and feeds
engage-user | `ENGAGE_USER` | Follow or mute users
engage-post | `ENGAGE_POST` | Vote, repost, quote or report posts
write-post | `WRITE_POST` | Send new posts
notifications | `NOTIFICATIONS` | Access notification


#### Setting Scopes
```javascript
Gab.setScopes([
    GabAPIClient.SCOPES.READ,
    GabAPIClient.SCOPES.ENGAGE,
    GabAPIClient.SCOPES.NOTIFICATIONS,
    GabAPIClient.SCOPES.WRITE_POST,
    GabAPIClient.SCOPES.ENGAGE_USER,
]);
//Alternatively
Gab.scopes = [
    GabAPIClient.SCOPES.READ,
    GabAPIClient.SCOPES.ENGAGE,
    GabAPIClient.SCOPES.NOTIFICATIONS,
    GabAPIClient.SCOPES.WRITE_POST,
    GabAPIClient.SCOPES.ENGAGE_USER,
];

```

___
## • Access Tokens
Gab.com currently supports the OAuth 2 specification.
The GabAPIClient has made it easy to retrive user access tokens.
You'll be required to set up all of the prior parameters before implementing the following steps.
    

### Getting Access Tokens
Set up a route on your sever to connect to the Gab.com OAuth URL. Then within that route, redirect to `Gab.authorizationURL`. Upon completion, the user is redirected to the redirect URI you've set. In our case it's `/redirect`.
```javascript
[...](req, res) => {
    res.writeHead(302, {
        'Location': Gab.authorizationURL
    });
    res.end();
};
```
    
Set up a route on your server that matches the redirect URI you've set in your Gab.com Developer account.
Then within that route, the GabAPIClient handles the authorization and sends back the user's access token information.
```javascript
[...](req, res) => {
    let data = await Gab.handleAuthorizationRedirectRequest(req);
    //data = { expirationDate, expiresIn, accessToken, refreshToken }
};
```

___
### Refreshing Access Tokens
In order to refresh any user access tokens, you'll be first required to have the user's `refresh_token`. You retrieve this value by first authenticating the user and getting the access tokens as described in the prior point.

When refreshing the token, you can only request identical or narrower scopes than the original access token.

Params:

- `refreshToken`: `String` - You can use refresh tokens to create a new access token to avoid expiration.

At any time in your application, simple call the following.
```javascript
let data = await Gab.refreshAccessToken(GAB_USER_REFRESH_TOKEN);
//data = { expirationDate, expiresIn, accessToken, refreshToken }
```

___
## • Making Calls
All calls require you to have a Gab.com user's access token.
All calls using the GabAPIClient are asynchronous.

All calls are returned in the following format:
```javascript
{
    success: Boolean,
    message: String,
    code: Number,
    data: Object
}
```

The GabAPIClient splits up the currently available calls outline in the official Gab.com API documentaion into five parts.

| Namespace | Usage | Description |
| --- | --- | --- |
`currentUser` | `Gab.currentUser[...]` | Calls related to the current user
`users` | `Gab.users[...]` | Calls related to the users
`popular` | `Gab.popular[...]` | Calls related to the popular route
`posts` | `Gab.posts[...]` | Calls related to posts
`groups` | `Gab.groups[...]` | Calls related to groups

___
### • Current User
Calls related to the current user.

#### `currentUser.fetch()`
Returns the information about logged-in user. 

Scope required: `read`

Params:

- `accessToken`: `String` - User authorization access token

Usage Example:
```javascript
let data = await Gab.currentUser.fetch(GAB_USER_ACCESS_TOKEN);
```

___
#### `currentUser.fetchNotifications()`
Returns latest notifications about logged-in user.

Scope required: `notifications`

Params:

- `accessToken`: `String` - User authorization access token
- `beforeNoficationId`: `{String|Number}` - (Optional) The notification ID to load older ones

Usage Example:
```javascript
let data = await Gab.currentUser.fetchNotifications(GAB_USER_ACCESS_TOKEN, 0);
```

___
#### `currentUser.fetchFeed()`
Returns the main feed of the logged-in user.

Scope required: `read`

Params:

- `accessToken`: `String` - User authorization access token
- `beforeDate`: `{String|Date}` - (Optional) ISO8601 datetime to load older posts

Usage Example:
```javascript
let data = await Gab.currentUser.fetchFeed(GAB_USER_ACCESS_TOKEN, '2018-10-10T12:30:00+00:00');
```

___
#### `currentUser.createPost()`
Creates a post for the logged-in user.

Scope required: `write-post`

Params:

- `accessToken`: `String` - User authorization access token
- `postOptions`: `Object` - Post options, see: https://developers.gab.com/#949155f0-821e-3228-49ea-4b15f35422a3 for more details

Usage Example:
```javascript
let data = await Gab.currentUser.createPost(GAB_USER_ACCESS_TOKEN, {
    body: 'Wassup'
});
```

___
#### `currentUser.createMediaAttachment()`
Creates a media attachment with given image.

Scope required: `write-post`

Params:

- `accessToken`: `String` - User authorization access token
- `file`: `Buffer` - File to upload. Might be jpeg, png or gif. Animated gifs are allowed. Might not be more than 4mb.
- `fileName`: `String` - File name
- `fileMimeType`: `String` - File mime type. Use GabAPIClient.MIME_TYPES[*] for valid options

| MIME Type | Usage |
| --- | --- |
`JPG` | `GabAPIClient.MIME_TYPES.JPG`
`JPEG` | `GabAPIClient.MIME_TYPES.JPEG`
`PNG` | `GabAPIClient.MIME_TYPES.PNG`
`GIF` | `GabAPIClient.MIME_TYPES.GIF`

Usage Example:
```javascript
//This is just an example... Feel free to use your own workflow
//Import File System module
const fs = require('fs');

//Imaginary image...
let fileName = 'example.jpeg';
let fileMimeType = GabAPIClient.MIME_TYPES.JPEG;
let filePath = __dirname + '/' + fileName;

//Read the image file
fs.readFile(filePath, async(err, file) => {
    let data = await Gab.currentUser.createMediaAttachment(GAB_USER_ACCESS_TOKEN, file, fileName, fileMimeType);
});
```

___
#### `currentUser.createPostWithAttachment()`
Creates a post with file(s) attachment.

Scope required: `write-post`

Params:

- `accessToken`: `String` - User authorization access token
- `fileOptions`: `Object[]` - [{file: Buffer, fileName: String, fileMimeType: String}, ...] - Max of 4 files. See currentUser.createMediaAttachment for more details.
- `postOptions`: `Object` - Post options, see: https://developers.gab.com/#949155f0-821e-3228-49ea-4b15f35422a3 for more details.

Usage Example:
```javascript
//This is just an example... Feel free to use your own workflow
//Import File System module
const fs = require('fs');

//Imaginary image...
let fileName = 'example.jpeg';
let fileMimeType = GabAPIClient.MIME_TYPES.JPEG;
let filePath = __dirname + '/' + fileName;

//Read the image file
fs.readFile(filePath, async(err, file) => {
    let data = await Gab.currentUser.createPostWithAttachment(GAB_USER_ACCESS_TOKEN, [
        { file, fileName, fileMimeType }
    ], {
        body: 'Test post'
    });
});
```

___
### • Users
Calls related to users.

#### `users.fetchUser()`
Returns the information about a user with given username.

Scope required: `read`

Params:

- `accessToken`: `String` - User authorization access token
- `username`: `String` - Username of a valid Gab.com account

Usage Example:
```javascript
let data = await Gab.users.fetchUser(GAB_USER_ACCESS_TOKEN, 'markmiscavage');
```

___
#### `users.fetchUserFollowers()`
Returns followers of given user.

Scope required: `read`

Params:

- `accessToken`: `String` - User authorization access token
- `username`: `String` - Username of a valid Gab.com account
- `beforeCount`: `{String|Number}` - (Optional) The index of followers start to fetch from

Usage Example:
```javascript
let data = await Gab.users.fetchUserFollowers(GAB_USER_ACCESS_TOKEN, 'markmiscavage', 15);
```

___
#### `users.fetchUserFollowing()`
Returns the users that given user is following.

Scope required: `read`

Params:

- `accessToken`: `String` - User authorization access token
- `username`: `String` - Username of a valid Gab.com account
- `beforeCount`: `{String|Number}` - (Optional) The index of following start to fetch from

Usage Example:
```javascript
let data = await Gab.users.fetchUserFollowing(GAB_USER_ACCESS_TOKEN, 'markmiscavage', 15);
```

___
#### `users.fetchUserFeed()`
Returns the feed of given user.

Scope required: `read`

Params:

- `accessToken`: `String` - User authorization access token
- `username`: `String` - Username of a valid Gab.com account
- `beforeDate`: `{String|Date}` - (Optional) ISO8601 datetime to load older posts

Usage Example:
```javascript
let data = await Gab.users.fetchUserFeed(GAB_USER_ACCESS_TOKEN, 'markmiscavage', '2018-10-10T12:30:00+00:00');
```

___
#### `users.followUser()`
Follows given user or creates a follow request if the target user is private.

Scope required: `engage-user`

Params:

- `accessToken`: `String` - User authorization access token
- `userId`: `{String|Number}` - User ID of a valid Gab.com account

Usage Example:
```javascript
let data = await Gab.users.followUser(GAB_USER_ACCESS_TOKEN, 'markmiscavage');
```

___
#### `users.unfollowUser()`
Unfollows given user.

Scope required: `engage-user`

Params:

- `accessToken`: `String` - User authorization access token
- `userId`: `{String|Number}` - User ID of a valid Gab.com account

Usage Example:
```javascript
let data = await Gab.users.unfollowUser(GAB_USER_ACCESS_TOKEN, 'markmiscavage');
```
___
### • Popular
Calls related to the popular route.

#### `popular.fetchPopularFeed()`
Returns the popular feed.

Scope required: `read`

Params:

- `accessToken`: `String` - User authorization access token

Usage Example:
```javascript
let data = await Gab.popular.fetchPopularFeed(GAB_USER_ACCESS_TOKEN);
```
___
#### `popular.fetchPopularUsers()`
Returns popular users.

Scope required: `read`

Params:

- `accessToken`: `String` - User authorization access token

Usage Example:
```javascript
let data = await Gab.popular.fetchPopularUsers(GAB_USER_ACCESS_TOKEN);
```
___
### • Posts
Calls related to posts.

#### `posts.upvotePost()`
Upvotes given post.

Scope required: `engage-post`

Params:

- `accessToken`: `String` - User authorization access token
- `postId`: `{Number|String}` - Post ID of a valid Gab.com post

Usage Example:
```javascript
let data = await Gab.posts.upvotePost(GAB_USER_ACCESS_TOKEN, 37996178);
```

___
#### `posts.removeUpvotePost()`
Removes the upvote for given post.

Scope required: `engage-post`

Params:

- `accessToken`: `String` - User authorization access token
- `postId`: `{Number|String}` - Post ID of a valid Gab.com post

Usage Example:
```javascript
let data = await Gab.posts.removeUpvotePost(GAB_USER_ACCESS_TOKEN, 37996178);
```

___
#### `posts.downvotePost()`
Downvotes given post.

Scope required: `engage-post`

Params:

- `accessToken`: `String` - User authorization access token
- `postId`: `{Number|String}` - Post ID of a valid Gab.com post

Usage Example:
```javascript
let data = await Gab.posts.downvotePost(GAB_USER_ACCESS_TOKEN, 37996178);
```

___
#### `posts.removeDownvotePost()`
Removes the downvote for given post.

Scope required: `engage-post`

Params:

- `accessToken`: `String` - User authorization access token
- `postId`: `{Number|String}` - Post ID of a valid Gab.com post

Usage Example:
```javascript
let data = await Gab.posts.removeDownvotePost(GAB_USER_ACCESS_TOKEN, 37996178);
```

___
#### `posts.repostPost()`
Reposts given post.

Scope required: `engage-post`

Params:

- `accessToken`: `String` - User authorization access token
- `postId`: `{Number|String}` - Post ID of a valid Gab.com post

Usage Example:
```javascript
let data = await Gab.posts.repostPost(GAB_USER_ACCESS_TOKEN, 37996178);
```

___
#### `posts.removeRepostPost()`
Remove repost record for given post.

Scope required: `engage-post`

Params:

- `accessToken`: `String` - User authorization access token
- `postId`: `{Number|String}` - Post ID of a valid Gab.com post

Usage Example:
```javascript
let data = await Gab.posts.removeRepostPost(GAB_USER_ACCESS_TOKEN, 37996178);
```

___
#### `posts.fetchPostDetails()`
Returns the details of given post.

Scope required: `engage-post`

Params:

- `accessToken`: `String` - User authorization access token
- `postId`: `{Number|String}` - Post ID of a valid Gab.com post

Usage Example:
```javascript
let data = await Gab.posts.fetchPostDetails(GAB_USER_ACCESS_TOKEN, 37996178);
```

___
### • Groups
Calls related to groups.

#### `groups.fetchGroups()`
Returns a list of groups with more activities recently.

Scope required: `read`

Params:

- `accessToken`: `String` - User authorization access token

Usage Example:
```javascript
let data = await Gab.groups.fetchGroups(GAB_USER_ACCESS_TOKEN);
```

___
#### `groups.fetchGroupDetails()`
Returns a list of groups with more activities recently.

Scope required: `read`

Params:

- `accessToken`: `String` - User authorization access token
- `groupId`: `String` - Id of Gab.com group

Usage Example:
```javascript
let data = await Gab.groups.fetchGroupDetails(GAB_USER_ACCESS_TOKEN, 'e1b2efa5-abb8-4cd6-a37d-50f1dba0d6c0');
```

___
#### `groups.getGroupUsers()`
Returns a list of given group's members.

Scope required: `read`

Params:

- `accessToken`: `String` - User authorization access token
- `groupId`: `String` - Id of Gab.com group
- `beforeCount`: `{Number|String}` - (Optional) The index of users start to fetch from

Usage Example:
```javascript
let data = await Gab.groups.getGroupUsers(GAB_USER_ACCESS_TOKEN, 'e1b2efa5-abb8-4cd6-a37d-50f1dba0d6c0', 0);
```

___
#### `groups.getGroupModerationLogs()`
Returns a list of given group's moderation logs.

Scope required: `read`

Params:

- `accessToken`: `String` - User authorization access token
- `groupId`: `String` - Id of Gab.com group

Usage Example:
```javascript
let data = await Gab.groups.getGroupModerationLogs(GAB_USER_ACCESS_TOKEN, 'e1b2efa5-abb8-4cd6-a37d-50f1dba0d6c0');
```

## • To-do

- Add prettier.
- Add eslint.

## • Say Hi

Tweet at me: [@markmiscavage](https://twitter.com/markmiscavage).

## • License

MIT License

Copyright (c) 2018 Mark Miscavage

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
