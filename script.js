// script.js

// Animación de aparición suave al cargar productos
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
