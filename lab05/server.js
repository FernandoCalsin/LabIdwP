const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const server = http.createServer((req, res) => {
    console.log(`Petición recibida: ${req.method} ${req.url}`);

    if (req.url === '/' && req.method === 'GET') {
        const filePath = path.join(__dirname, 'public', 'index.html');
        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('Error al cargar la página');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(content);
            }
        });

    } else if (req.url === '/style.css' && req.method === 'GET') {
        const filePath = path.join(__dirname, 'public', 'style.css');
        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('Archivo CSS no encontrado');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/css; charset=utf-8' });
                res.end(content);
            }
        });

    } else if (req.url === '/api/estudiantes' && req.method === 'GET') {
        const filePath = path.join(__dirname, 'data', 'estudiantes.json');
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Error al leer la base de datos' }));
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(data);
            }
        });
    } else if (req.url === '/api/estudiantes' && req.method === 'POST') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const nuevoEstudiante = JSON.parse(body);
                const filePath = path.join(__dirname, 'data', 'estudiantes.json');

                fs.readFile(filePath, 'utf-8', (err, data) => {
                    const estudiantes = JSON.parse(data);

                    estudiantes.push(nuevoEstudiante);

                    fs.writeFile(filePath, JSON.stringify(estudiantes, null, 2), () => {
                        res.writeHead(201, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(nuevoEstudiante));
                    });
                });
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'JSON enviado no válido' }));
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Recurso no encontrado' }));
    }
});

server.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});