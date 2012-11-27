var cryptojs_md5 = require('./cryptojs-rollups/md5');
var cryptojs_hmac_sha256 = require('./cryptojs-rollups/hmac-sha256');

exports.sign = function(secret,data) {
    var hmac = cryptojs_hmac_sha256.HMAC_SHA256(secret);
    hmac.update(data);
    return hmac.finalize().toString();
};

exports.hash = function(requestBody) {
    return cryptojs_md5.MD5(requestBody).toString();
};