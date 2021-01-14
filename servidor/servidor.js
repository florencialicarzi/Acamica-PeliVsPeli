var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var controlador = require("./controlador/competenciasController")

var app = express();

app.use(cors());
 
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.get("/competencias", controlador.buscarCompetencias);
app.post("/competencias", controlador.crearCompetencias);
app.get("/generos", controlador.obtenerGenero);
app.get("/directores", controlador.obtenerDirector);
app.get("/actores", controlador.obtenerActor);
app.get("/competencias/:id/peliculas", controlador.obtenerOpciones);
app.post('/competencias/:comp_id/voto', controlador.regVoto);
app.get('/competencias/:id/resultados', controlador.obtenerResultado);
app.delete('/competencias/:id/votos', controlador.bajaVotos);
app.get('/competencias/:id', controlador.obtenerDatos);
app.delete('/competencias/:id', controlador.eliminarCompetencia);
app.put('/competencias/:id', controlador.modificarNombre);

var puerto = '8080';

app.listen(puerto, function () {
  console.log( "Escuchando en el puerto " + puerto );
});	
	
