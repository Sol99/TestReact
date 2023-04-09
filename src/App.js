import { useState, useEffect } from "react";
import "./app.css";

// const productos = [
//   {
//     cantidad: "2",
//     Nombre: "Cargador Celular",
//     "Precio U": "$100",
//   },
// ];

function App() {
  //Defino los hooks- Creamos los estados para guardar el valor
  const [cantidad, setCantidad] = useState(0);
  const [idProducto, setIdProducto] = useState(0);
  const [carrito, setCarrito] = useState([]);
  const [fecha, setFecha] = useState("");

  useEffect(() => {
    setCarrito([]);
  }, []);

  function addProduct(e) {
    //prevenimos el comportamiento por defecto
    e.preventDefault();
    let url = "https://fakestoreapi.com/products/" + idProducto;
    console.log(url);
    fetch(url, { method: "GET" })
      //en response se guarda la salida del fetch
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        //Agregamos la hora y fecha
        crearFecha();
        if (carrito.some((p) => p.id == idProducto)) {
          setCarrito(
            carrito.map((producto) => {
              if (producto.id == idProducto) {
                producto.cantidad =
                  parseFloat(producto.cantidad) + parseFloat(cantidad);
              }
              return producto;
            })
          );
        } else {
          //Agrega producto
          json.cantidad = cantidad;
          setCarrito([...carrito, json]);
        }
      })
      .catch((error) => console.log(error));
  }

  //Manejo de fechas
  function rellenar(numero) {
    return numero.toString().padStart(2, "0");
  }
  function crearFecha() {
    if (carrito.length == 0) {
      let date = new Date();
      let fecha = [
        rellenar(date.getDate()),
        rellenar(date.getMonth() + 1),
        date.getFullYear(),
      ].join("/");
      let hora = [rellenar(date.getHours()), rellenar(date.getMinutes())].join(
        ":"
      );
      setFecha(fecha + "-" + hora);
    }
  }

  function eliminarObjeto(id) {
    setCarrito(carrito.filter((p) => p.id !== id));
  }

  return (
    <div>
      <div id="title" className="p-5 d-flex align-items-center">
        <img src={require("./img/tienda.png")} height="150" alt="tienda" />
        <h1>Tienda - El topo</h1>
      </div>

      <div className="style-form">
        <form onSubmit={addProduct}>
          <p id="add-product">Agrega los productos al carro de compra</p>
          <div className="row d-flex justify-content-center">
            <div className="col-md-3">
              <input
                type="number"
                name="data_cantidad"
                id="cantidad"
                className="form-control"
                placeholder="Cantidad"
                onChange={(e) => setCantidad(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <input
                type="number"
                name="data_producto"
                id="producto"
                className="form-control"
                placeholder="ID del producto"
                onChange={(e) => setIdProducto(e.target.value)}
                min="1"
                max="99"
              />
            </div>
            <div className="col-md-3">
              <button
                type="submit"
                value="Submit"
                className="btn btn-primary style-button "
              >
                Agregar
              </button>
            </div>
          </div>
        </form>

        {carrito.length == 0 ? (
          <div className="mx-5 mt-4 pt-5">
            <h5>Carrito de compra vacio</h5>
            <p className="mx-5 mt-4">
              No hay productos en el carro aún, prueba agregando arriba con su
              ID y la cantidad que deseas ingresar
            </p>
          </div>
        ) : (
          <div>
            <h2 className="pt-5 fs-5">
              Carrito de compra - Fecha de inicio: {fecha}
            </h2>
            <table className="table table-striped">
              <thead>
                <tr className="style-text-table">
                  <th>Cantidad</th>
                  <th>Nombre</th>
                  <th>Precio U</th>
                  <th>Precio T</th>
                  <th>Foto</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {carrito.map((producto, index) => {
                  let path = producto.image;
                  return (
                    <tr key={index}>
                      <th>{producto.cantidad}</th>
                      <td>{producto.title}</td>
                      <td>{producto.price}</td>
                      <td>{producto.price * cantidad}</td>
                      <td>
                        <img src={path} alt="producto" height="100" />
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => eliminarObjeto(producto.id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
