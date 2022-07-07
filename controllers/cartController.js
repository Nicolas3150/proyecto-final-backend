import fs from 'fs'

export default class Cart {
    constructor(fileName) {
        this.fileName = fileName
    }

    postCart = async (req, res) => {
        try {
            const cart = { products: [] }
            const cartContainer = JSON.parse(await fs.promises.readFile(this.fileName, 'utf-8'))
            cart.id = (cartContainer.length !== 0) ? cartContainer[cartContainer.length - 1].id + 1 : 1
            cart.timestamp = Date.now()
            cartContainer.push(cart)
            await fs.promises.writeFile(this.fileName, JSON.stringify(cartContainer))
            res.status(201).json(cart.id)
        } catch (err) {
            console.log(`Hubo un error: ${err}`)
        }
    }

    deleteCart = async (req, res) => {
        try {
            const id = Number(req.params.id)
            let cartContainer = JSON.parse(await fs.promises.readFile(this.fileName, 'utf-8'))
            cartContainer = cartContainer.filter(cart => cart.id !== id)
            await fs.promises.writeFile(this.fileName, JSON.stringify(cartContainer))
            res.sendStatus(200).json(cartContainer)
        } catch (err) {
            console.log(`Hubo un error: ${err}`)
        }
    }

    getProductsInCart = async (req, res) => {
        try {
            const id = Number(req.params.id)
            if (isNaN(id)) {
                return res.json({ error: "El parametro no es un numero." })
            }
            const cartContainer = JSON.parse(await fs.promises.readFile(this.fileName, 'utf-8'))
            const cartFilter = cartContainer.find(cart => cart.id === id)
            if (!cartFilter) return res.status(404).json({ error: "Carrito no encontrado" })
            res.json(cartFilter.products)
        } catch (err) {
            console.log(`Hubo un error: ${err}`)
        }
    }

    postProductToCart = async (req, res) => {
        try {
            const id = Number(req.params.id)
            const { id_prod } = req.body
            const cartContainer = JSON.parse(await fs.promises.readFile(this.fileName, 'utf-8'))
            const cartFind = cartContainer.find(cart => cart.id === id)
            if (cartFind === undefined) {
                return res.status(404).json({ error: "Carrito no encontrado" })
            }
            const productos = JSON.parse(await fs.promises.readFile('./filesystem/productos.txt', 'utf-8'))
            const productFind = productos.find(prod => prod.id === Number(id_prod))
            if (productFind === undefined) {
                return res.status(404).json({ error: "Producto no encontrado" })
            }
            cartFind.products.push(productFind)
            await fs.promises.writeFile(this.fileName, JSON.stringify(cartContainer))
            res.status(201).json(cartFind)
        } catch (err) {
            console.log(`Hubo un error: ${err}`)
        }
    }

    deleteProductInCart = async (req, res) => {
        try {
            const { id, id_prod } = req.params
            const cartContainer = JSON.parse(await fs.promises.readFile(this.fileName, 'utf-8'))
            const cartFind = cartContainer.find(cart => cart.id === Number(id))
            console.log(cartFind)
            cartFind.products = (cartFind.products).filter(product => product.id !== Number(id_prod))
            await fs.promises.writeFile(this.fileName, JSON.stringify(cartContainer))
            res.sendStatus(200)
        } catch (err) {
            console.log(`Hubo un error: ${err}`)
        }
    }
}