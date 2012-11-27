var http = require('http');

exports.post = function(url,requestBody,callback) {
    // webpop
    if (http.post) {
      var options = {url: url, type: 'POST', headers: {'Content-Type': 'application/json'},
                     data: requestBody, cache: false};
        var response = http.request(options);
        if(callback) {
            if (!response || response.status != 200) {
                callback({status: response ? response.status : null}, options, null);
            } else {
                callback(null, options, response);
            }
        }
    } else {
        // fallback to node.js implementation for local testing
        var urlmod = require('url');
        var urlobj = urlmod.parse(url);
        var client = http.createClient(urlobj.port, urlobj.host);
        var request = client.request('POST', urlobj.path, {
            'host': urlobj.host,
            'content-type': 'application/json',
            'content-length': requestBody.toString('binary').length
        });

        if(callback) {
            client.addListener('error', function(error) {
                callback(error, request, null);
            });

            request.addListener('response', function(response) {
                callback(null, request, response);
            });
        }
        request.write(requestBody);
        request.end();
    }
}