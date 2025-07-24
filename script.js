// --- INICIALIZACIÓN SUPABASE ---
const supabaseUrl = 'https://dzbgomlfxwutejxtzbaz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6YmdvbWxmeHd1dGVqeHR6YmF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNzg1NzgsImV4cCI6MjA2ODk1NDU3OH0.6foIQEbpA4gIYCK2hB4mxd2Bi2FckXqJz40C6yiY_AE';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// --- CARRITO ---
let carrito = [];

document.addEventListener('DOMContentLoaded', async () => {
  await cargarProductos();
  iniciarAnimaciones();
  actualizarCarrito();
});

// --- FUNCIONES ---

async function cargarProductos() {
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .order('nombre', { ascending: true });

  if (error) {
    console.error('Error al cargar productos:', error);
    return;
  }

  const contenedor = document.getElementById('productos-contenedor');
  contenedor.innerHTML = '';

  data.forEach(producto => {
    const div = document.createElement('div');
    div.className = 'producto';
    div.innerHTML = `
      <img src="${producto.imagen_url}" alt="${producto.nombre}" />
      <div class="info">
        <p class="descripcion"><b>${producto.nombre}</b> <br>${producto.descripcion}</p>
        <p class="precio">$${producto.precio}</p>
        <a href="#" class="btn-consultar" onclick="consultarProducto('${producto.nombre}', ${producto.precio}, '${producto.imagen_url}')">
          Consultar <i class="fab fa-whatsapp"></i>
        </a>
        <a href="#" class="btn-agregar" onclick="agregarAlCarrito('${producto.nombre}', ${producto.precio}, '${producto.imagen_url}')">
          <i class="fas fa-cart-plus"></i> Agregar al carrito
        </a>
      </div>
    `;
    contenedor.appendChild(div);
  });
}

function iniciarAnimaciones() {
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
}

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

  const numero = "543794284970";
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
