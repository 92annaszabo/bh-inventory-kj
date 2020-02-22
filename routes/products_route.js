const router = require('express').Router();
const sqlite3 = require('sqlite3').verbose();

const dummyCats = ['Számítástechnika', 'Konyhatechnika', 'Fűtéstechnika', 'Árnyékolástechnika'];

const db = new sqlite3.Database('inventory.db');

router.get('/', (req, res) => {
    db.serialize(function () {
        db.all("SELECT id, name, category, description from products", (err, products) => {
            if (err != null) {
                console.error(err.toString());
            }

            db.all("SELECT * FROM categories", (err, results) => {
                if (err != null) {
                    console.error(err.toString());
                }

                res.render('home', {
                    title: 'Termékek',
                    products: true,
                    stocks: false,
                    groups: false,
                    items: products,
                    categories: results
                })
            })
        });
    });
})


router.post('/', (req, res) => {
    const { product_name, product_cat, product_desc } = req.body;

    if (product_name && product_cat) {
        db.serialize(function () {
            db.run(`INSERT INTO products(name, category, description) VALUES ("${product_name}", "${product_cat}", "${product_desc}")`, (err) => {
                if (err != null) {
                    console.error(err.toString())
                }
            });

            db.get(`SELECT id FROM products WHERE name = "${product_name}" AND category = "${product_cat}"`, (err, result) => {
                if (err != null) {
                    console.error(err.toString())
                }

                db.run(`INSERT INTO inventory(product_id, stock) VALUES (${result.id}, 0)`, (err) => {
                    if (err != null) {
                        console.error(err.toString())
                    }
                })
                res.redirect('/products');
            })
        })
    }
})

router.post('/:id', (req, res) => {
    const itemId = req.params.id;

    const { product_name, product_cat } = req.body;
    db.serialize(function () {

        if (product_name && product_cat) {
            db.run(`UPDATE products SET name = "${product_name}", category = "${product_cat}" WHERE id = ${+itemId}`, (err) => {
                if (err != null) {
                    console.error(err.toString())
                }
            })
        }
    })

    res.redirect('/products');
})

router.post('/del/:id', (req, res) => {
    const delId = req.params.id;
    db.serialize(function () {
        db.run(`DELETE FROM products WHERE id = ${delId}`, (err) => {
            if (err != null) {
                console.error(err.toString())
            }
        })
        db.run(`DELETE FROM inventory WHERE product_id = ${delId}`, (err) => {
            if (err != null) {
                console.error(err.toString())
            }
        })
    })
    res.redirect('/products');
})

module.exports = router;