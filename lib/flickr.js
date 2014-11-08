'use strict';

/* SDK Modules */
const {Cu} = require('chrome');
Cu.import('resource://gre/modules/Task.jsm');
Cu.import('resource://gre/modules/Promise.jsm');
const Request = require('sdk/request').Request;

/* Modules */
const logger = require('logger.js').NewTabLogger;

/* Constants */
const FLICKR_SEARCH_URL = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&nojsoncallback=1';
const FLICKR_API_KEY = '7080b3a250ac855dcb96395939b61e57&'; //TODO
const FLICKR_TAGS = 'auroraborealis,cityscape,fog,landscape,longexposure,meteor,nightscape,rain,scenic,seascape,sunrise,sunset';
const FLICKR_TAG_MODE = 'any';
const FLICKR_LICENSE = '1,2,3,4,5,6,7';
const FLICKR_SORT = 'interestingness-desc';
const FLICKR_PRIVACY_FILTER = '1';
const FLICKR_SAFE_SEARCH = '1';
const FLICKR_MEDIA = 'photos';
const FLICKR_EXTRAS = 'original_format,owner_name,url_o';
const FLICKR_REQUEST_URL = FLICKR_SEARCH_URL
    + '&api_key=' + FLICKR_API_KEY
    + '&tags=' + FLICKR_TAGS
    + '&tag_mode=' + FLICKR_TAG_MODE
    + '&license=' + FLICKR_LICENSE
    + '&sort=' + FLICKR_SORT 
    + '&privacy_filter=' + FLICKR_PRIVACY_FILTER
    + '&safe_search=' + FLICKR_SAFE_SEARCH
    + '&media=' + FLICKR_MEDIA
    + '&extras=' + FLICKR_EXTRAS;
const FLICKR_MIN_WIDTH = 1920;
const FLICKR_MIN_HEIGHT = 1080;
const FLICKR_OWNER_MAX_LENGTH = 30;
const FLICKR_TITLE_MAX_LENGTH = 80;

/**
 * Flickr module.
 */
var NewTabFlickr = {

    /**
     * Returns a promise that is fulfilled with the photos retrieved from
     * Flickr.
     */
    getPhotos: function(minNumPhotos, maxNumPhotos) {
        logger.log('Requesting photos from Flickr.');
        return new Promise(function(resolve, reject) {
            //request photos
            Request({
                url: FLICKR_REQUEST_URL,
                onComplete: function(response) {
                    if(response.status != 200) {
                        logger.error('Flickr photos request failed.');
                        reject(new Error('Flicker photos request failed.'));
                        return;
                    }
                    var json = JSON.parse(response.text);
                    var photos = json.photos.photo;
                    //filter photos
                    NewTabFlickr.filterPhotos(photos, minNumPhotos, maxNumPhotos).
                        then(resolve);
                }
            }).get();
        });
    },

    /**
     * Returns a promise that is fulfilled with the filtered photos.
     */
    filterPhotos: function(photos, minNumPhotos, maxNumPhotos) {
        return Task.spawn(function() {
            let filteredPhotos = [];

            //filter specified number of images
            for (let i = 0; i < photos.length; i++) {

                if(filteredPhotos.length == maxNumPhotos) {
                    break;
                }

                let photo = photos[i];
                let width = parseInt(photo.width_o, 10);
                let height = parseInt(photo.height_o, 10);
                
                //check url, min width, and min height                
                if(!photo.url_o || width < FLICKR_MIN_WIDTH
                    || height < FLICKR_MIN_HEIGHT) {
                    continue;
                }

                //add photo
                filteredPhotos.push(NewTabFlickr.getPhotoObject(photo));
            }

            //could not find minimum number of photos
            if(filterPhotos.length < minNumPhotos) {
                throw 'Only ' + filteredPhotos.length + ' photos found (minimum of '
                    + minNumPhotos + ' required).';
            }

            return filteredPhotos;
        });
    },

    /**
     * Returns a photo object with the desired properties.
     */
    getPhotoObject: function(photo) {
        return {
            id: photo.id,
            imageUrl: photo.url_o,
            original_format: photo.original_format,
            owner: photo.ownername.substring(0, FLICKR_OWNER_MAX_LENGTH),
            title: photo.title.substring(0, FLICKR_TITLE_MAX_LENGTH)
        }
    }
};

exports.NewTabFlickr = NewTabFlickr;
