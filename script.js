let carrito = [];

document.addEventListener("DOMContentLoaded", () => {
  const productos = document.querySelectorAll(".producto");
  productos.forEach((producto, i) => {
    producto.style.opacity = 0;
    producto.style.transform = "translateY(30px)";
    setTimeout(() => {
      producto.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      producto.style.opacity = 1;
      producto.style.transform = "translateY(0)";
    }, i * 150);
  });
});

function agregarAlCarrito(nombre, precio, img) {
  const productoExistente = carrito.find(item => item.nombre === nombre);
  if (productoExistente) {
    productoExistente.cantidad++;
  } else {
    carrito.push({ nombre, precio, img, cantidad: 1 });
  }
  actualizarCarrito();
}

function disminuirCantidad(index) {
  if (carrito[index].cantidad > 1) {
    carrito[index].cantidad--;
  } else {
    carrito.splice(index, 1);
  }
  actualizarCarrito();
}

function aumentarCantidad(index) {
  carrito[index].cantidad++;
  actualizarCarrito();
}

function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  actualizarCarrito();
}

function actualizarCarrito() {
  const lista = document.getElementById("lista-carrito");
  const totalTexto = document.getElementById("total-carrito");
  const contador = document.getElementById("contador-carrito");

  lista.innerHTML = "";
  let total = 0;
  let cantidadTotal = 0;

  carrito.forEach((item, i) => {
    total += item.precio * item.cantidad;
    cantidadTotal += item.cantidad;

    let precioTexto = item.cantidad > 1 
      ? `$${item.precio} x ${item.cantidad} = $${item.precio * item.cantidad}`
      : `$${item.precio}`;

    const li = document.createElement("li");
    li.innerHTML = `
      <img src="${item.img}" alt="${item.nombre}" class="img-carrito" />
      <div class="detalle-carrito">
        <span>${item.nombre}</span>
        <span>${precioTexto}</span>
      </div>
      <div class="cantidad-control">
        <button onclick="disminuirCantidad(${i})">−</button>
        <button onclick="aumentarCantidad(${i})">+</button>
      </div>
      <button onclick="eliminarDelCarrito(${i})" class="btn-eliminar">×</button>
      <div class="cantidad-globito">${item.cantidad}</div>
    `;
    lista.appendChild(li);
  });

  totalTexto.textContent = `Total: $${total}`;
  contador.textContent = cantidadTotal;
}

function toggleCarrito() {
  const panel = document.getElementById("carrito-panel");
  panel.classList.toggle("abierto");
}

function enviarCarrito() {
  if (carrito.length === 0) {
    const boton = document.querySelector('.btn-consultar-carrito');
    if (boton) {
      boton.classList.add('vibrar');
      setTimeout(() => boton.classList.remove('vibrar'), 1000);
    }
    return;
  }

  const numero = "543794284970"; // Cambiar por tu número real
  let mensaje = "¡Hola! Estoy interesado en estos productos:\n\n";

  carrito.forEach((item, i) => {
    mensaje += `${i + 1}. ${item.nombre} - $${item.precio} x ${item.cantidad} = $${item.precio * item.cantidad}\n`;
  });

  mensaje += `\nTotal de la compra: $${carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0)}`;

  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
}

function consultarProducto(nombre, precio, img) {
  if (carrito.length === 0) {
    const numero = "543794284970";
    const mensaje = `Hola! Me interesa el producto: ${nombre} - $${precio}`;
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
  } else {
    enviarCarrito();
  }
}
