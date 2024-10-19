const express = require('express');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));


function obtenerPersonajes(callback) {
    const url = 'https://thronesapi.com/api/v2/Characters';

    https.get(url, (response) => {
        let data = '';

        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () => {
            try {
                const personajes = JSON.parse(data);
                callback(null, personajes);
            } catch (error) {
                callback(error, null);
            }
        });
    }).on('error', (error) => {
        callback(error, null);
    });
}


app.get('/', (req, res) => {
    const searchQuery = req.query.search || '';  

    obtenerPersonajes((error, personajes) => {
        if (error) {
            console.error('Error al obtener los personajes:', error);
            return res.status(500).send('Error al obtener los personajes.');
        }


        const personajesFiltrados = personajes.filter(personaje => 
            personaje.fullName.toLowerCase().includes(searchQuery.toLowerCase())
        );


        res.render('index', { personajes: personajesFiltrados, searchQuery });
    });
});


app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
