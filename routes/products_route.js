const router = require('express').Router();
const { getAllProducts, modifyProduct, deleteProduct, createNewProduct } = require('../models/products_middlewares');

router.get('/', getAllProducts, (req, res) => {
	const refinedData = req.products.map((prod) => {
		return {
			id: prod.id,
			name: prod.name,
			description: prod.description,
			category: prod.category ? prod.category : 'n/a'
		};
	});

	res.render('home', {
		title: 'Termékek',
		products: true,
		stocks: false,
		groups: false,
		items: refinedData,
		categories: req.categories,
		showNext: req.limit * (+req.query.page ? +req.query.page : 1) < req.totalProducts,
		showPrev: req.query.page ? +req.query.page > 1 : false,
		maxPage: req.maxPage,
		totalProducts: req.totalProducts,
		nextPage: req.query.page ? +req.query.page + 1 : 2,
		prevPage: req.query.page ? +req.query.page - 1 : 1,
		lastPage: Math.ceil(req.totalProducts / req.limit),
		curentPage: req.query.page
	});
});

router.post('/', createNewProduct, (req, res) => {
	res.redirect('/products');
});

router.post('/:id', modifyProduct, (req, res) => {
	res.redirect('/products');
});

router.post('/del/:id', deleteProduct, (req, res) => {
	res.redirect('/products');
});

module.exports = router;
