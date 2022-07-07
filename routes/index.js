import { Router } from "express";
const router = Router();
import Product from '../controllers/productController.js'
import Cart from '../controllers/cartController.js'

const cart = new Cart('./filesystem/cartContainer.txt')
const product = new Product('./filesystem/productos.txt')

let admin = true

router.get('/productos', product.getProducts)
router.get('/productos/:id', product.getProduct)
router.post('/productos', checkIfAdmin, product.postProducts)
router.put('/productos/:id', checkIfAdmin, product.putProduct)
router.delete('/productos/:id', checkIfAdmin, product.deleteProduct)

router.post('/carrito', cart.postCart)
router.delete('/carrito/:id', cart.deleteCart)
router.get('/carrito/:id/productos', cart.getProductsInCart)
router.post('/carrito/:id/productos', cart.postProductToCart)
router.delete('/carrito/:id/productos/:id_prod', cart.deleteProductInCart)

function checkIfAdmin(req, res, next){
    admin ? next() : res.status(401).json({ error: -1, descripcion: "Ruta no autorizada" })
}

export default router;