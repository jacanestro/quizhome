var models = require('../models/models.js');

/*
exports.question = function(req,res) {
	models.Quiz.findAll().success(function(quiz) {
	  res.render('quizes/question', { pregunta: quiz[0].pregunta})
	})
};
*/
exports.load = function(req,res,next,quizId) {
	models.Quiz.find(quizId).then (
		function(quiz) {
			if (quiz) {
				req.quiz = quiz;
				next();
			}
			else {
				next(new Error('No existe el quiId=' + quizId));
			}
		}
	).catch(function(error) { next(error);});
};


exports.index = function(req, res) {
	var search = "%";

	if (req.query.search != undefined) {
		search = "%" + req.query.search + "%";
		search = search.trim().replace(/\s/g,"%");
	}

	//models.Quiz.findAll({where:["upper(pregunta) like ?", search.toUpperCase()], order: 'pregunta ASC'}).then(
	models.Quiz.findAll({where:["pregunta like ?", search], order: 'pregunta ASC'}).then(
		function(quizes) {
			res.render('quizes/index', { quizes: quizes, temp: search, errors: []});
		}
	).catch(function(error) { next(error);})
};

/*
exports.index = function(req,res) {

	models.Quiz.findAll().then(function(quizes) {
		res.render('quizes/index.ejs', { quizes:quizes });
	}).catch(function(error) { next(error);})
};
*/

exports.show = function(req,res) {
  	res.render('quizes/show', { quiz: req.quiz });
};

exports.answer = function(req,res) {
	var resultado = 'incorrecta';
	  if (req.query.respuesta === req.quiz.respuesta) {
	  	resultado = 'correcta';
	  }
	  res.render('quizes/answer', { quiz: req.quiz, respuesta: resultado });
};

exports.author = function(req, res) {
	res.render('quizes/author');
};