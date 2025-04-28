import { readFile, writeFile } from 'fs/promises'

const file = await readFile('./Productos.json', 'utf-8')

const Productos = JSON.parse(file)




//Importamos express
import express from 'express'
//Importamos dotenv
import dotenv from 'dotenv'

//Traemos nuestras variables de entorno
dotenv.config()

//creamos instancia de app
const app = express()

//Configuramos el puerto
const port = process.env.PORT || 3000

//Para que nuestra app entienda los json
app.use(express.json());

//levantamos servidor, nuestro servidor se va levantar, recibe como parametro el puerto y se agrega una funcion anonima
app.listen(port, () =>{
    console.log(`Servidor levantado en puerto ${port}`)
})



  //para probar si funciona el json

  app.get('/Productos', (req, res) =>{
    res.status(200).json(Productos)
  })
  

  /*-----------------METODO GET-POST-PUT-DELETE--------------------------------------------*/

  //Metodo get para que solo devuelva la marca de los Productos que son CARAMELOS
  app.get('/Producto/:Categ', (req, res) =>{
    const cat= req.params.Categ
    const result = Productos.filter(e => e.categoría == cat)

    if (result){
        const marcas = result.map(e => e.marca);
        res.status(200).json(marcas)
    }
    else{
        res.send(404)
    }
  })

  // Metodo get para que me de los productos que sean menor o igual al precio indicado, pero solo el nombre y la descripcion del producto
  app.get('/ProductoPrecio/:Max', (req, res) =>{

    const pre= req.params.Max
    const result = Productos.filter(e => e.precio < pre)

    if(result){
        const info = result.map(e =>({
            nom: e.nombre,
            descripcion: e.desc
        }));
        res.status(200).json(info)
    }
    else{
        res.send(404).json
    }
  })

  //Metodo post para acceder al stock de los productos
  app.post('/ProductoPos', (req, res) =>{

    const Stoc = req.body.Producto
    const result = Productos.filter(e => e.stock < Stoc)

    if(result){
        
        res.status(200).json(result)
    }
    else{
        res.send(404).json
    }
  })

  // Metodo post para mostar los que tienen el mismo id, pero solo el nombre, precio, imagen
  app.post('/ProductoPosId', (req, res) =>{

    const Id = req.body.Producto
    const result = Productos.filter(e => e.id == Id)

    if(result){
        
        const infoid = result.map(e =>({
            nom: e.nombre,
            prec: e.precio,
            img: e.imagen
        }));

        res.status(200).json(infoid)
    }
    else{
        res.send(404).json
    }
  })

  //Metodo put para modificar el precio de un producto
app.put('/Producto/price/update/:ProductId', (req, res) =>{
    const Id= req.params.ProductId
    const Nuevo_Precio = req.body.Price

    try{
        const index = Productos.findIndex(e => e.id == Id)

        if(index !== -1){
            Productos[index].precio = Nuevo_Precio
            writeFile('./Productos.json', JSON.stringify(Productos,null,2));
            res.status(200).json('Se modifico el precio correctamente')
        }
        else{
            res.status(400).json('no se pudo modificar el precio')
        }

    }
    catch (error){
       res.send(500).json(error)
    }
})

//Metodo Delete para elminar producto, duplique un producto con un numero de id diferente para poder elminarlo y que queden los originales
// Probar con el id de producto 125

app.delete('/Producto/delete/:ProductId', (req, res) =>{
    const usuario_id = req.params.ProductId

    try{
        const index = Productos.findIndex( e => e.id == usuario_id)

        if(index !== -1){
            Productos.splice(index,1)
            writeFile('./Productos.json', JSON.stringify(Productos,null,2));
            res.status(200).json('Producto elminado correctamente')
        }
        else{
            res.status(400).json('no se pudo Elimnar el producto')
        }
    }
    catch(error){
        res.send(500).json('Error al eliminar producto')
    }
} )


