

var device    = require( 'express-device' )

/**
 * somehow, device cannot manipulate express.js properly,
 * so that enableDeviceHelpers is not exposed. thus, we 
 * copy the method and use it here
 */

enableDeviceHelpers = function () {
    var app = this.app || this;
    var check_request = function (req) {
        if (typeof req.device === 'undefined') {
            throw new Error('Must enable the device capture by using app.use(device.capture())');
        }

        return true;
    };

    var is_desktop = function (req, res, next) {
        check_request(req);
        res.locals.is_desktop = req.device.type === 'desktop';
        if (next) {
            next();
        }
    };
    app.use(is_desktop);
    var is_mobile = function (req, res, next) {
        check_request(req);
        res.locals.is_mobile = req.device.type === 'phone' || req.device.type === 'tablet';
        if (next) {
            next();
        }
    };
    app.use(is_mobile);
    var is_phone = function (req, res, next) {
        check_request(req);
        res.locals.is_phone = req.device.type === 'phone';
        if (next) {
            next();
        }
    };
    app.use(is_phone);
    var is_tablet = function (req, res, next) {
        check_request(req);
        res.locals.is_tablet = req.device.type === 'tablet';
        if (next) {
            next();
        }
    };
    app.use(is_tablet);
    var is_tv = function (req, res, next) {
        check_request(req);
        res.locals.is_tv = req.device.type === 'tv';
        if (next) {
            next();
        }
    };
    app.use(is_tv);
    var is_bot = function (req, res, next) {
        check_request(req);
        res.locals.is_bot = req.device.type === 'bot';
        if (next) {
            next();
        }
    };
    app.use(is_bot);
    var device_type = function (req, res, next) {
        check_request(req);
        res.locals.device_type = req.device.type;
        if (next) {
            next();
        }
    };
    app.use(device_type);
};



module.exports = exports = function( app ){
    app.use( device.capture() )
    
    // because express has been instantiated
    // before express-device was loaded, we need
    // to apply the enableDeviceHelpers method
    // from the express prototype to our 
    // instantiated express app
    enableDeviceHelpers.call( app )

}
