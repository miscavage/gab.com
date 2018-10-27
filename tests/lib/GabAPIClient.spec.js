//Modules
const fs = require('fs');
const mocha = require('mocha');
const chai = require('chai');
var should = chai.should();

//Helpers
const GabAPIClient = require('../../lib/GabAPIClient');

const shared = require('../shared');

const CLIENT_ID = '<%ENTER_YOUR_GAB_CLIENT_ID_HERE%>';
const SECRET = '<%ENTER_YOUR_GAB_SECRET_HERE%>';
const TEST_ACCESS_TOKEN = '<%ENTER_YOUR_GAB_USER_ACCESS_TOKEN_HERE%>';
const REDIRECT_URI = 'http://www.example.com';

const DEFAULT_SCOPES = [
                            GabAPIClient.SCOPES.READ,
                            GabAPIClient.SCOPES.WRITE_POST,
                            GabAPIClient.SCOPES.ENGAGE,
                            GabAPIClient.SCOPES.ENGAGE_USER,
                            GabAPIClient.SCOPES.NOTIFICATIONS,
                        ];

describe('GabAPIClient', function () {
    beforeEach(function (done) {
        this.Gab = new GabAPIClient(CLIENT_ID, SECRET);
        this.Gab.setScopes(DEFAULT_SCOPES);
        this.Gab.redirectUri = REDIRECT_URI;

        done();
    });

    describe('secret', function () {
        it('should return self on setSecret', function (done) {
            this.Gab.setSecret('test').should.equal(this.Gab);

            done();
        });

        it('should return string on get', function (done) {
            this.Gab.secret.should.be.a.string;

            done();
        });
    });

    describe('clientId', function () {
        it('should return self on setClientId', function (done) {
            this.Gab.setClientId('test').should.equal(this.Gab);

            done();
        });

        it('should return string on get', function (done) {
            this.Gab.clientId.should.be.a.string;

            done();
        });
    });

    describe('redirectUri', function () {
        it('should return error on invalid setRedirectUri', function (done) {
            let _Gab = this.Gab;
            (function () {
                _Gab.setRedirectUri('test').should.equal(this.Gab);
            }).should.throw(Error, /Invalid URL: test/);

            done();
        });

        it('should return self on valid setRedirectUri', function (done) {
            this.Gab.setRedirectUri('http://www.example.com').should.equal(this.Gab);

            done();
        });

        it('should return string on get', function (done) {
            this.Gab.redirectUri.should.be.a.string;

            done();
        });
    });

    describe('scopes', function () {
        it('should return self on setScopes', function (done) {
            this.Gab.setScopes(DEFAULT_SCOPES).should.equal(this.Gab);

            done();
        });

        it('should return array on get', function (done) {
            this.Gab.scopes.should.equal(DEFAULT_SCOPES);

            done();
        });

        it('should return string on getScopesForRequest', function (done) {
            this.Gab.getScopesForRequest().should.be.a.string;

            done();
        });

    });

    describe('authorizationURL', function () {
        it('should return string on get', function (done) {
            this.Gab.authorizationURL.should.be.a.string;

            done();
        });
    });

    describe('currentUser', function () {
        describe('fetch', function() {
            beforeEach(function(done) {
                this.Gab.currentUser.fetch(TEST_ACCESS_TOKEN).then((data) => {
                    this.data = data;
                    done();
                });
            });

            shared.shouldBeAValidRequest();
        });

        describe('fetchNotifications', function () {
            before(function (done) {
                this.Gab.currentUser.fetchNotifications(TEST_ACCESS_TOKEN, 209933501).then((data) => {
                    this.data = data;
                    done();
                });
            });

            shared.shouldBeAValidRequest(this.data);
        });

        describe('fetchFeed', function () {
            before(function (done) {
                this.Gab.currentUser.fetchFeed(TEST_ACCESS_TOKEN, '2018-09-03T19:35:47+00:00').then((data) => {
                    this.data = data;
                    done();
                });
            });

            shared.shouldBeAValidRequest(this.data);
        });

        describe('createPost', function () {
            before(function (done) {
                this.Gab.currentUser.createPost(TEST_ACCESS_TOKEN, {
                    body: 'API Test Post'
                }).then((data) => {
                    this.data = data;
                    done();
                });
            });

            shared.shouldBeAValidRequest(this.data);
        });

        describe('createMediaAttachment', function () {
            before(function (done) {
                //Imaginary image...
                let fileName = 'example.jpeg';
                let fileMimeType = GabAPIClient.MIME_TYPES.JPEG;
                let filePath = __dirname + '/' + fileName;

                //Read the image file
                fs.readFile(filePath, async (err, file) => {
                    this.Gab.currentUser.createMediaAttachment(TEST_ACCESS_TOKEN, file, fileName, fileMimeType).then((data) => {
                        this.data = data;
                        done();
                    });
                });
            });

            shared.shouldBeAValidRequest(this.data);
        });

        describe('createPostWithAttachment', function () {
            before(function (done) {
                //Imaginary image...
                let fileName = 'example.jpeg';
                let fileMimeType = GabAPIClient.MIME_TYPES.JPEG;
                let filePath = __dirname + '/' + fileName;

                //Read the image file
                fs.readFile(filePath, async (err, file) => {
                    this.Gab.currentUser.createPostWithAttachment(TEST_ACCESS_TOKEN, [
                        { file, fileName, fileMimeType }
                    ], {
                            body: 'API Test Post'
                        }).then((data) => {
                            this.data = data;
                            done();
                        })
                });
            });

            shared.shouldBeAValidRequest(this.data);
        });
    });

    describe('users', function() {
        describe('fetchUser', function () {
            before(function (done) {
                this.Gab.users.fetchUser(TEST_ACCESS_TOKEN, 'a').then((data) => {
                    this.data = data;
                    done();
                });
            });

            shared.shouldBeAValidRequest(this.data);
        });

        describe('fetchUserFollowers', function () {
            before(function (done) {
                this.Gab.users.fetchUserFollowers(TEST_ACCESS_TOKEN, 'a', 67190).then((data) => {
                    this.data = data;
                    done();
                });
            });

            shared.shouldBeAValidRequest(this.data);
        });

        describe('fetchUserFollowing', function () {
            before(function (done) {
                this.Gab.users.fetchUserFollowing(TEST_ACCESS_TOKEN, 'a', 900).then((data) => {
                    this.data = data;
                    done();
                });
            });

            shared.shouldBeAValidRequest(this.data);
        });

        describe('fetchUserFeed', function () {
            before(function (done) {
                this.Gab.users.fetchUserFeed(TEST_ACCESS_TOKEN, 'a', '2018-09-03T19:35:47+00:00').then((data) => {
                    this.data = data;
                    done();
                });
            });

            shared.shouldBeAValidRequest(this.data);
        });

        describe('followUser', function () {
            before(function (done) {
                this.Gab.users.followUser(TEST_ACCESS_TOKEN, 431).then((data) => {
                    this.data = data;
                    done();
                });
            });

            shared.shouldBeAValidRequest(this.data);
        });

        describe('unfollowUser', function () {
            before(function (done) {
                this.Gab.users.unfollowUser(TEST_ACCESS_TOKEN, 431).then((data) => {
                    this.data = data;
                    done();
                });
            });

            shared.shouldBeAValidRequest(this.data);
        });
    });

    describe('popular', function () {
        describe('fetchPopularFeed', function () {
            before(function (done) {
                this.Gab.popular.fetchPopularFeed(TEST_ACCESS_TOKEN).then((data) => {
                    this.data = data;
                    done();
                });
            });

            shared.shouldBeAValidRequest(this.data);
        });

        describe('fetchPopularUsers', function () {
            before(function (done) {
                this.Gab.popular.fetchPopularUsers(TEST_ACCESS_TOKEN).then((data) => {
                    this.data = data;
                    done();
                });
            });

            shared.shouldBeAValidRequest(this.data);
        });
    });

    describe('groups', function () {
        describe('fetchGroupDetails', function () {
            before(function (done) {
                this.Gab.groups.fetchGroupDetails(TEST_ACCESS_TOKEN, 'c2b004fd-e78c-4c17-8d25-f37c8bd0ae6e').then((data) => {
                    this.data = data;
                    done();
                });
            });

            shared.shouldBeAValidRequest(this.data);
        });

        describe('getGroupUsers', function () {
            before(function (done) {
                this.Gab.groups.getGroupUsers(TEST_ACCESS_TOKEN, 'c2b004fd-e78c-4c17-8d25-f37c8bd0ae6e', 1002).then((data) => {
                    this.data = data;
                    done();
                });
            });

            shared.shouldBeAValidRequest(this.data);
        });

        describe('getGroupModerationLogs', function () {
            before(function (done) {
                this.Gab.groups.getGroupModerationLogs(TEST_ACCESS_TOKEN, 'c2b004fd-e78c-4c17-8d25-f37c8bd0ae6e').then((data) => {
                    this.data = data;
                    done();
                });
            });

            shared.shouldBeAValidRequest(this.data);
        });
    });

    describe('posts', function () {
        describe('upvotePost', function () {
            before(function (done) {
                this.Gab.posts.upvotePost(TEST_ACCESS_TOKEN, 38454192).then((data) => {
                    this.data = data;
                    done();
                });
            });

            shared.shouldBeAValidRequest(this.data);
        });

        describe('removeUpvotePost', function () {
            before(function (done) {
                this.Gab.posts.removeUpvotePost(TEST_ACCESS_TOKEN, 38454192).then((data) => {
                    this.data = data;
                    done();
                });
            });

            shared.shouldBeAValidRequest(this.data);
        });

        describe('downvotePost', function () {
            before(function (done) {
                this.Gab.posts.downvotePost(TEST_ACCESS_TOKEN, 38454192).then((data) => {
                    this.data = data;
                    done();
                });
            });

            shared.shouldBeAValidRequest(this.data);
        });

        describe('removeDownvotePost', function () {
            before(function (done) {
                this.Gab.posts.removeDownvotePost(TEST_ACCESS_TOKEN, 38454192).then((data) => {
                    this.data = data;
                    done();
                });
            });

            shared.shouldBeAValidRequest(this.data);
        });

        describe('repostPost', function () {
            before(function (done) {
                this.Gab.posts.repostPost(TEST_ACCESS_TOKEN, 38454192).then((data) => {
                    this.data = data;
                    done();
                });
            });

            shared.shouldBeAValidRequest(this.data);
        });

        describe('removeRepostPost', function () {
            before(function (done) {
                this.Gab.posts.removeRepostPost(TEST_ACCESS_TOKEN, 38454192).then((data) => {
                    this.data = data;
                    done();
                });
            });

            shared.shouldBeAValidRequest(this.data);
        });

        describe('fetchPostDetails', function () {
            before(function (done) {
                this.Gab.posts.fetchPostDetails(TEST_ACCESS_TOKEN, 38454192).then((data) => {
                    this.data = data;
                    done();
                });
            });

            shared.shouldBeAValidRequest(this.data);
        });
    });
});
