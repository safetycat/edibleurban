/**
 * image uploader can send form data objects (https://developer.mozilla.org/en/docs/Web/API/FormData)
 * which have an image in and post them to the media endpoint in wp-api of wordpress
 */

// scripts/app/src/shared//ImageUploader.js
angular.module('App.Common')
    .service('ImageUploader', ['$rootScope', '$http', function ($rootScope, $http) {

            var iu = this; // stash pointer to context
            $http.defaults.headers.post['X-WP-Nonce'] = CONFIG.api_nonce;
            /**
             * uploads to media endpoint in wordpress wp-api which
             * creates a new file on the server in the media library
             * and returns info about the file incl. full url
             * @param  {FomrData} fd        : see https://developer.mozilla.org/en/docs/Web/API/FormData
             * @param  {string}   filename  : string - the file name unchanged from local
             * @return {xhrpromise}         : returns async promise for resolving in the original caller
             */
            iu.post = function(fd, filename) {
                return $http.post($rootScope.api + '/media', fd, {
                    transformRequest:angular.identity,
                    headers: { 'Content-Type': undefined, 'Content-Disposition': 'attachment;filename='+filename }
                });
            };

        }]);