var cryptojs = require('./cryptojs');
var httpfacade = require('./httpfacade');

exports.create = function(options) {
    var Pusher = {};
    Pusher.options = options;

    Pusher.domain = 'api.pusherapp.com';

    Pusher.auth = function(socketId, channel, channelData) {
        var returnHash = {}
        var channelDataStr = ''
        if (channelData) {
            channelData = JSON.stringify(channelData);
            channelDataStr = ':' + channelData;
            returnHash['channel_data'] = channelData;
        }
        var stringToSign = socketId + ':' + channel + channelDataStr;
        returnHash['auth'] = this.options.key + ':' + cryptojs.sign(this.options.secret,stringToSign);
        return(returnHash);
    }

    Pusher.trigger = function(channel, event, message, socketId, callback) {
        if (typeof callback === 'undefined') {
            callback = socketId;
            socketId = '';
        }
        var timestamp = parseInt(new Date().getTime() / 1000);
        var requestBody = JSON.stringify(message);
        var hash = cryptojs.hash(requestBody);

        var params = [
            'auth_key=', this.options.key,
            '&auth_timestamp=', timestamp,
            '&auth_version=', '1.0',
            '&body_md5=', hash,
            '&name=', event
        ];
        if (socketId) {
            params.push('&socket_id=', socketId);
        }
        var queryString = params.join('');

        var path = '/apps/' + this.options.appId + '/channels/' + channel + '/events';
        var signData = ['POST', path, queryString].join('\n');
        var signature = cryptojs.sign(this.options.secret,signData);
        path = path + '?' + queryString + '&auth_signature=' + signature;
        httpfacade.post("https://" + this.domain + path,requestBody,callback);
        return this;
    }
    return Pusher;
};