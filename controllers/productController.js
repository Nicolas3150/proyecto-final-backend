import fs from 'fs'

export default class Product {
    constructor(fileName) {
        this.fileName = fileName
    }

    getProducts = async (req, res) => {
        try {
            const productos = JSON.parse(await fs.promises.readFile(this.fileName, 'utf-8'))
            res.json(productos)
        } catch (err) {
            console.log(`Hubo un error: ${err}`)
        }
    }

    getProduct = async (req, res) => {
        try {
            const id = Number(req.params.id)
            if (isNaN(id)) {
                return res.json({ error: "El parametro no es un numero." })
            }
            const productos = JSON.parse(await fs.promises.readFile(this.fileName, 'utf-8'))
            const productFilter = productos.filter(product => product.id === id)
            if (!productFilter.length) return res.status(404).json({ error: "Producto no encontrado" })
            res.json(productFilter)
        } catch (err) {
            console.log(`Hubo un error: ${err}`)
        }
    }

    postProducts = async (req, res) => {
        try {
            const { title, description, code, thumbnail, price, stock } = req.body;
            const prod = { title, description, code, thumbnail, price, stock }
            const productos = JSON.parse(await fs.promises.readFile(this.fileName, 'utf-8'))
            prod.id = (productos.length !== 0) ? productos[productos.length - 1].id + 1 : 1
            prod.timestamp = Date.now()
            productos.push(prod)
            await fs.promises.writeFile(this.fileName, JSON.stringify(productos))
            res.status(201).json(prod)
        } catch (err) {
            console.log(`Hubo un error: ${err}`)
        }
    }

    putProduct = async (req, res) => {
        try {
            const { title, description, code, thumbnail, price, stock } = req.body;
            const productos = JSON.parse(await fs.promises.readFile(this.fileName, 'utf-8'))
            productos.forEach(prod => {
                if (prod.id === Number(req.params.id)) {
                    prod.title = title
                    prod.description = description
                    prod.code = code
                    prod.thumbnail = thumbnail
                    prod.price = price
                    prod.stock = stock
                }
            })
            await fs.promises.writeFile(this.fileName, JSON.stringify(productos))
            res.sendStatus(200)
        } catch (err) {
            console.log(`Hubo un error: ${err}`)
        }
    }

    deleteProduct = async (req, res) => {
        try {
            const id = Number(req.params.id)
            let productos = JSON.parse(await fs.promises.readFile(this.fileName, 'utf-8'))
            productos = productos.filter(prod => prod.id !== id)
            await fs.promises.writeFile(this.fileName, JSON.stringify(productos))
            res.sendStatus(200)
        } catch (err) {
            console.log(`Hubo un error: ${err}`)
        }
    }
}