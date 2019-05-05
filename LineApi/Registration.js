var request = require('request');

exports.getName = function(user_id, callback) {
    var get_profile_options = {
        url: 'https://api.line.me/v2/bot/profile/' + user_id,
        proxy: process.env.FIXIE_URL,
        json: true,
        headers: {
            'Authorization': 'Bearer {' + process.env.LINE_CHANNEL_ACCESS + '}'
        }
    };
    request.get(get_profile_options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body['displayName']);
            callback(body['displayName']);
        } else {
            console.log('getName:: ERROR:  ' + error);
            console.log('getName:: response:  ' + JSON.stringify(response));
            console.log('getName:: body:  ' + JSON.stringify(body));
        }
    })
}