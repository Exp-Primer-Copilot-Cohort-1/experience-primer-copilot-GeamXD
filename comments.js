// Create web server application with Node.js
// Run: node comments.js
// URL: http://localhost:3000

var http = require('http');
var fs = require('fs');
var qs = require('querystring');
var ejs = require('ejs');

// Read HTML File
var index_page = fs.readFileSync('./index.ejs', 'utf8');
var other_page = fs.readFileSync('./other.ejs', 'utf8');
var style_css = fs.readFileSync('./style.css', 'utf8');

var server = http.createServer(getFromClient);

server.listen(3000);
console.log('Server start!');

// Create server processing
function getFromClient(request, response)
{
    var url_parts = url.parse(request.url, true);
    switch (url_parts.pathname)
    {
        // Top page
        case '/':
            response_index(request, response);
            break;

        // other page
        case '/other':
            response_other(request, response);
            break;

        // style sheet
        case '/style.css':
            response.writeHead(200, {'Content-Type': 'text/css'});
            response.write(style_css);
            response.end();
            break;

        // Error page
        default:
            response.writeHead(200, {'Content-Type': 'text/plain'});
            response.end('no page...');
            break;
    }
}

// Create top page
function response_index(request, response)
{
    // POST process
    if (request.method == 'POST')
    {
        var body = '';

        // Get data from form
        request.on('data', (data) => {
            body += data;
        });

        // End of data
        request.on('end', () => {
            var post_data = qs.parse(body);
            var name = post_data['name'];
            var comment = post_data['comment'];
            var data = {
                'name': name,
                'comment': comment
            };
            var data_str = ejs.render(index_page, data);
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.write(data_str);
            response.end();
        });
    }
    else
    {
        // GET process
        var msg = '※何か書いてください。';
        var content = ejs.render(index_page, {
            title: 'Index',
            content: msg,
        });
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(content);
        response.end();
