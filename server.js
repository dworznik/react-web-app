var _ = require('lodash');
var express = require('express');
var path = require('path');
var httpProxy = require('http-proxy');
var http = require('http');
var proxy = httpProxy.createProxyServer({
    changeOrigin: true,
    ws: true
});
var app = express();
var isProduction = process.env.NODE_ENV === 'production';
var port = isProduction ? process.env.PORT : 3000;
var publicPath = path.resolve(__dirname, 'public');

app.use(express.static(publicPath));

var data = [{
    "quote_collateral_bp": 5000,
    "denom_asset": "~BTC:SATOSHIS",
    "base_asset": "USLV",
    "base_principal": 50000000,
    "quote_multiplier": 1.00,
    "base_collateral_bp": 5000,
    "base_principal_hi": 52500000,
    "quote_principal": 50000000,
    "quote_principal_hi": 52500000,
    "principal_lo": 47500000,
    "quote_principal_lo": 47500000,
    "base_multiplier": 1.00,
    "base_principal_lo": 47500000,
    "principal_hi": 52500000,
    "swap_duration": 20563200,
    "funding_source": {
        "tx_id": "2435d848e74bb0486cab55f02b8c47801be36e0e410371e9ab9f57bff63129cd",
        "tx_out": 0
    },
    "quote_asset": "DSLV",
    "principal": 50000000
}, {
    "quote_collateral_bp": 2000,
    "denom_asset": "~BTC:SATOSHIS",
    "base_asset": "SDOW",
    "base_principal": 15000000,
    "quote_multiplier": 1.00,
    "base_collateral_bp": 2000,
    "base_principal_hi": 18000000,
    "quote_principal": 15000000,
    "quote_principal_hi": 18000000,
    "principal_lo": 12000000,
    "quote_principal_lo": 12000000,
    "base_multiplier": 1.00,
    "base_principal_lo": 12000000,
    "principal_hi": 18000000,
    "swap_duration": 1209600,
    "funding_source": {
        "tx_id": "4b346ebbd290977e2b423a1b98dc2b3d1989b2abe841084998122d948db0adb9",
        "tx_out": 0
    },
    "quote_asset": "UDOW",
    "principal": 15000000
}, {
    "quote_collateral_bp": 2000,
    "denom_asset": "~BTC:SATOSHIS",
    "base_asset": "SDOW",
    "base_principal": 15000000,
    "quote_multiplier": 1.00,
    "base_collateral_bp": 2000,
    "base_principal_hi": 18000000,
    "quote_principal": 15000000,
    "quote_principal_hi": 18000000,
    "principal_lo": 12000000,
    "quote_principal_lo": 12000000,
    "base_multiplier": 1.00,
    "base_principal_lo": 12000000,
    "principal_hi": 18000000,
    "swap_duration": 1209600,
    "funding_source": {
        "tx_id": "4b346ebbd290977e2b423a1b98dc2b3d1989b2abe841084998122d948db0adb9",
        "tx_out": 0
    },
    "quote_asset": "UDOW",
    "principal": 15000000
}];

// app.post('/data', function(req, res) {

//     var rows = [];
//     for (var i = 0; i < 1000; i++) {
//         data.forEach(function(row) {
//             var inc = Math.floor(Math.random() * 11);
//             var r = _.clone(row);
//             r.base_principal += inc;
//             rows.push(r);
//         });
//     }
//     res.json({
//         result: {
//             results: rows
//         }
//     });
// });

app.all('/v1', function(req, res) {
    proxy.web(req, res, {
        target: 'https://beta.ultra-coin.com:30051'
        // target: 'http://localhost:7000'
    });
});


if (!isProduction) {

    var bundle = require('./server/bundle.js');
    bundle();
    app.all('/build/*', function(req, res) {
        proxy.web(req, res, {
            target: 'http://127.0.0.1:3001'
        });
    });
    app.all('/socket.io*', function(req, res) {
        proxy.web(req, res, {
            target: 'http://127.0.0.1:3001'
        });
    });


    proxy.on('error', function(e) {
        // Just catch it
    });

    // We need to use basic HTTP service to proxy
    // websocket requests from webpack
    var server = http.createServer(app);

    server.on('upgrade', function(req, socket, head) {
        proxy.ws(req, socket, head);
    });

    server.listen(port, function() {
        console.log('Server running on port ' + port);
    });

} else {

    // And run the server
    app.listen(port, function() {
        console.log('Server running on port ' + port);
    });

}
