var path = require('path');

// Postgres DATABASE_URL = postgress://user:password@host:port/database
// SQLIte DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6]||null);
var user = (url[2]||null);
var pwd = (url[3]||null);
var protocol = (url[1]||null);
var dialect = (url[1]||null);
var port = (url[5]||null);
var host = (url[4]||null);
var storage = process.env.DATABASE_STORAGE;


// Cargar modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd,
	{ dialect: protocol,
	  protocol: protocol,
	  port: port,
	  host: host,	
	  storage: storage, // solo SQLite, lo lee de .env donde hemos puesto "quiz.sqlite"
	  omitNull: true
	}
);

var Quiz = sequelize.import(path.join(__dirname,'quiz'));

exports.Quiz = Quiz;

// sequelize.sync() crea e inicializa tabla de preguntas en BD
// then(..)/success(..) ejecuta el manejador una vez creada la tabla
// 
sequelize.sync().then(function() {
	Quiz.count().then(function(count) {
      if (count === 0) {
      	console.log('Primera pregunta');
      	Quiz.create({ pregunta: 'Capital de Italia',
      	              respuesta: 'Roma'
      	           });
      	console.log('Segunda pregunta');
      	Quiz.create({ pregunta: 'Capital de España',
      	              respuesta: 'Madrid'
      	           })
      	.then(function() { console.log('BBDD inicializada con dos preguntas')});
      };
	});
});
