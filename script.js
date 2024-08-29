import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-storage.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDnKcHS41_TH5jzmT2gIEU6-h4C_dnIML8",
    authDomain: "fablab2-88ab1.firebaseapp.com",
    projectId: "fablab2-88ab1",
    storageBucket: "fablab2-88ab1.appspot.com",
    messagingSenderId: "30169496903",
    appId: "1:30169496903:web:a7060677c0513fe1ea6062",
    measurementId: "G-TL1F53C259"
};

// Inicialización de Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Variable global para almacenar los productos
let products = [];

// Función para cargar productos y renderizarlos
async function loadAndRenderProducts() {
    try {
        // Obtén los productos de Firebase
        const querySnapshot = await getDocs(collection(db, 'productos'));
        products = []; // Limpiar la lista de productos

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            products.push({
                id: doc.id, // Guarda el ID del documento
                name: data.nombre,
                price: data.precio,
                image: data.imageUrl || 'https://via.placeholder.com/150' // Imagen por defecto si no hay URL
            });
        });

        // Renderiza los productos en el catálogo
        renderProducts(products);
    } catch (e) {
        console.error('Error al cargar los productos: ', e);
    }
}

// Función para renderizar los productos
function renderProducts(productsList) {
    const catalog = document.getElementById('catalog');
    catalog.innerHTML = ''; // Limpiar catálogo

    productsList.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';

        // Formateo del precio
        const formattedPrice = new Intl.NumberFormat('es-GT', {
            style: 'currency',
            currency: 'GTQ'
        }).format(product.price);

        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" style="width: 100%; height: auto; max-width: 150px; max-height: 100px;">
            <h3>${product.name}</h3>
            <p>Precio: ${formattedPrice}</p>
            <button onclick="deleteProduct('${product.id}')">Me interesa</button>
        `;

        catalog.appendChild(productCard);
    });
}

// Función para filtrar productos
function filterProducts() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchInput)
    );
    renderProducts(filteredProducts);
}

// Evento para la búsqueda
document.getElementById('searchInput').addEventListener('input', filterProducts);

// Función para eliminar un producto
async function deleteProduct(id) {
    try {
        await deleteDoc(doc(db, 'productos', id));
        alert('Producto eliminado.');
        loadAndRenderProducts(); // Vuelve a cargar y renderizar productos
    } catch (e) {
        console.error('Error al eliminar el producto: ', e);
        alert('Error al eliminar el producto.');
    }
}

// Inicializar carga y renderizado de productos
loadAndRenderProducts();
