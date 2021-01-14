var con = require("../lib/conexion_bd");

console.log("<<< Empieza a ejecutarse el controlador");

 function buscarCompetencias(req, res) {

        var sql = "SELECT * FROM competencias WHERE estado = 1";

        con.query(sql, function(error, resultado, fields) {
            if (error) {
                console.log("Hubo un error en la consulta", error.message);
                return res.status(404).send("Hubo un error en la consulta");
            }
            res.send(resultado);

        });
    }

 function obtenerOpciones(req, res) {

    var id = req.params.id;
    var sqlCompetencia = "SELECT nombre, genero_id, actor_id, director_id FROM competencias WHERE id = " + id + ";";
        
    console.log(">>> SELECCIONANDO COMPETENCIA Y OBTENIENDO DATOS");
    console.log(sqlCompetencia);

        con.query(sqlCompetencia, function(error, competencia){
            if (error) {
            	console.log("Errorcito");
                return res.status(500).json(error);
            }
            
            console.log( competencia);
            console.log("/////////////////////////////////////////////////");

            var queryPeliculas = "SELECT DISTINCT pelicula.id, poster, titulo, genero_id FROM pelicula LEFT JOIN actor_pelicula ON pelicula.id = actor_pelicula.pelicula_id LEFT JOIN director_pelicula ON pelicula.id = director_pelicula.pelicula_id WHERE 1 = 1";
            var genero = competencia[0].genero_id;
            var actor = competencia[0].actor_id;
            var director = competencia[0].director_id;
            
            if (genero == null) {
                genero = "'%'";
            }   

             if (actor == null) {
                actor = "'%'";
            }  

             if (director == null) {
                director = "'%'";
            }           
                   
            
            var sqlFiltros = " and pelicula.genero_id like " + genero + " and actor_pelicula.actor_id like " + actor + " and director_pelicula.director_id like " + director + " "; 

            var query = queryPeliculas + sqlFiltros + ' ORDER BY RAND() LIMIT 2 ;';                    
            
            console.log(">>> OBTENIENDO 2 PELICULAS AL AZAR");
            console.log(query)
            console.log("/////////////////////////////////////////////////");
            

                con.query(query, function(error, peliculas){    
                    if (error) {
                        return res.status(500).json(error);
                    }
                        
                    var response = {
                        'peliculas': peliculas,
                        'competencia': competencia[0].nombre
                    };

                    res.send(response);
                });

     });
}

function regVoto (req,res){
    var comp_id= req.params.comp_id;
    var idPelicula = req.body.idPelicula;
    var sql = "INSERT INTO registroVotos (competencia_id, pelicula_id) values (" + comp_id + ", " + idPelicula + ")";
   
    console.log(">>> REGISTRAR VOTOS");
    console.log(sql);
    console.log("//////////////////////////////////////////////////");

        con.query(sql,function (error, resultado){
            if (error) {
                console.log("Error al registrar el voto", error.message);
                return res.status(500).json(error);
            }
            var response = {
                'voto': resultado.insertId,
            };

        res.status(200).send(response);
    })
}

function obtenerResultado (req,res){
    var comp_id = req.params.id; 
    var sql = "SELECT pelicula_id, COUNT (*) AS votos, pelicula.poster, pelicula.titulo FROM registroVotos JOIN competencias ON registroVotos.competencia_id = competencias.id JOIN pelicula ON registroVotos.pelicula_id = pelicula.id WHERE registroVotos.competencia_id = " + comp_id + " GROUP BY competencia_id, pelicula_id HAVING COUNT(*) >= 1 ORDER BY votos DESC LIMIT 3";
    
    console.log(">>> RESULTADOS TOP 3 MAS VOTADAS");
    console.log(sql);
    console.log("/////////////////////////////////////////////////");

        con.query(sql, function (error, datos){
            if (error) {
                console.log("Error al obtener resultados", error.message);
                return res.status(404).send(error);
            }

            var resultadosComp = {
                competencia:datos[0].nombre,
                resultados:[],
            }

            datos.forEach(function(element, num){
                var response = {
                pelicula_id:datos[num].pelicula_id,
                poster:datos[num].poster,
                titulo:datos[num].titulo,
                votos: datos[num].votos
                }
                resultadosComp.resultados.push(response);
            });

        res.status(200).send(resultadosComp);
    });                 
}

function crearCompetencias(req,res) {

    var nombreCompetencia = req.body.nombre;
    var genero_comp = req.body.genero === '0' ? null : req.body.genero;
    var director_comp = req.body.director === '0' ? null : req.body.director;
    var actor_comp = req.body.actor === '0' ? null : req.body.actor;

    var sql = "INSERT INTO competencias (nombre, genero_id, director_id, actor_id, estado) VALUES ('" + nombreCompetencia + " '," + genero_comp + "," + director_comp + "," + actor_comp + ", 1);";

    console.log(">>> NUEVA COMPETENCIA A CREAR");
    console.log(sql);
    console.log("/////////////////////////////////////////////////");

     con.query(sql, function(error, resultado) {
        if (error) {
            return res.status(500).send(error);
        }

        var response = {
            'competencia': resultado
        };

        res.send(response);
    });
}

function bajaVotos (req, res){
    var comp_id = req.params.id;
    var sql = "DELETE FROM registroVotos WHERE competencia_id = " + comp_id;

    console.log(">>> ELIMINAR VOTOS DE LA COMPETENCIA");
    console.log(sql);
    console.log("/////////////////////////////////////////////////");

        con.query(sql, function (error, resultado){
            if (error) {
                return res.status(500).send(error);
            }
        res.send(resultado); 
    });
} 

function obtenerGenero(req, res){

     var sql = "SELECT * FROM genero"
        con.query(sql, function (error, resultado){
            if (error) {
                console.log("Error al cargar generos", error.message);
                return res.status(500).send(error);
            }
            res.send(resultado);
       });
}

function obtenerDirector(req, res){

     var sql = "SELECT * FROM director"
        con.query(sql, function (error, resultado){
            if (error) {
                console.log("Error al cargar generos", error.message);
                return res.status(500).send(error);
            }
            res.send(resultado);
       });
}

function obtenerActor(req, res){

     var sql = "SELECT * FROM actor"
        con.query(sql, function (error, resultado){
            if (error) {
                console.log("Error al cargar generos", error.message);
                return res.status(500).send(error);
            }
            res.send(resultado);
       });
}

function eliminarCompetencia (req, res){
    var comp_id = req.params.id;

    var sql = "UPDATE competencias SET estado = 0 WHERE id =" + comp_id + ";";

    console.log(">>> DAR BAJA A LA COMPETENCIA");
    console.log(sql);
    console.log("/////////////////////////////////////////////////");

        con.query(sql, function (error, resultado){
            if(error){
                return res.status(500).send("Error al eliminar competencia")
            }

        res.status(200).send("eliminacion completa");     
    });
}

function obtenerDatos(req, res){
    var comp_id = req.params.id;
    var sql = "SELECT competencias.id, competencias.nombre, genero.nombre genero, director.nombre director, actor.nombre actor FROM competencias LEFT JOIN genero ON genero_id = genero.id LEFT JOIN director ON director_id= director.id LEFT JOIN actor ON actor_id= actor.id WHERE competencias.id = " + comp_id + ";";  

    console.log(">>> OBTENER DATOS COMPETENCIA");
    console.log(sql);
    console.log("/////////////////////////////////////////////////");

        con.query(sql, function(error, resultado){
            if (error) {
                return res.status(500).json(error);
            }

            var response = {
                'id': resultado,
                'nombre': resultado[0].nombre,
                'genero_nombre': resultado[0].genero,
                'actor_nombre': resultado[0].actor,
                'director_nombre': resultado[0].director
            }
        res.send(response);    
    });
}

function modificarNombre(req, res) {
    var comp_id = req.params.id;
    var nombre = req.body.nombre;
    var sql = "UPDATE competenciaS SET nombre = '"+ nombre +"' WHERE id = "+ comp_id +";";

    console.log(">>> OBTENER DATOS COMPETENCIA");
    console.log(sql);
    console.log("/////////////////////////////////////////////////");

        con.query(sql,function(error,resultado){
            if(error){
                return res.status(500).send("Error")
            }
            if (resultado.length == 0){
            
                return res.status(404).send("Ninguna competencia con ese id");
            } else {
                var response = {
                    'id': resultado
                };    
            }        
        res.send(response);
    });
}

module.exports = {
	buscarCompetencias : buscarCompetencias,
	obtenerOpciones : obtenerOpciones,
    regVoto : regVoto,
    obtenerResultado : obtenerResultado,
    crearCompetencias : crearCompetencias,
    bajaVotos: bajaVotos,
    obtenerGenero : obtenerGenero,
    obtenerDirector : obtenerDirector,
    obtenerActor : obtenerActor,
    eliminarCompetencia : eliminarCompetencia,
    obtenerDatos : obtenerDatos,
    modificarNombre : modificarNombre,
}