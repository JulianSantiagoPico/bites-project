import Producto from "../models/Producto.js";

/**
 * @desc    Obtener todos los productos del restaurante
 * @route   GET /api/productos
 * @access  Private
 */
export const getProductos = async (req, res) => {
  try {
    const { categoria, disponible, destacado } = req.query;

    // Construir filtro
    const filter = {
      restauranteId: req.user.restauranteId,
    };

    // Filtrar por categoría si se proporciona
    if (categoria && categoria !== "Todo") {
      filter.categoria = categoria;
    }

    // Filtrar por disponibilidad si se proporciona
    if (disponible !== undefined) {
      filter.disponible = disponible === "true";
    }

    // Filtrar por destacado si se proporciona
    if (destacado !== undefined) {
      filter.destacado = destacado === "true";
    }

    const productos = await Producto.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: productos.length,
      data: {
        productos: productos.map((producto) => producto.toPublicJSON()),
      },
    });
  } catch (error) {
    console.error("Error en getProductos:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener los productos",
      error: error.message,
    });
  }
};

/**
 * @desc    Obtener un producto por ID
 * @route   GET /api/productos/:id
 * @access  Private
 */
export const getProductoById = async (req, res) => {
  try {
    const producto = await Producto.findOne({
      _id: req.params.id,
      restauranteId: req.user.restauranteId,
    });

    if (!producto) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado",
      });
    }

    res.json({
      success: true,
      data: {
        producto: producto.toPublicJSON(),
      },
    });
  } catch (error) {
    console.error("Error en getProductoById:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener el producto",
      error: error.message,
    });
  }
};

/**
 * @desc    Crear nuevo producto
 * @route   POST /api/productos
 * @access  Private (Admin)
 */
export const createProducto = async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      categoria,
      precio,
      imagen,
      disponible,
      destacado,
      tiempoPreparacion,
      tags,
    } = req.body;

    // Verificar si ya existe un producto con el mismo nombre en el restaurante
    const productoExistente = await Producto.findOne({
      nombre: nombre.trim(),
      restauranteId: req.user.restauranteId,
    });

    if (productoExistente) {
      return res.status(400).json({
        success: false,
        message: "Ya existe un producto con ese nombre en tu restaurante",
      });
    }

    // Crear nuevo producto
    const producto = await Producto.create({
      nombre: nombre.trim(),
      descripcion: descripcion?.trim() || null,
      categoria,
      precio,
      imagen: imagen || "🍽️",
      disponible: disponible !== undefined ? disponible : true,
      destacado: destacado || false,
      tiempoPreparacion: tiempoPreparacion || null,
      tags: tags || [],
      restauranteId: req.user.restauranteId,
      creadoPor: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Producto creado exitosamente",
      data: {
        producto: producto.toPublicJSON(),
      },
    });
  } catch (error) {
    console.error("Error en createProducto:", error);

    // Errores de validación de Mongoose
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => ({
        path: err.path,
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        message: "Error de validación",
        errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Error al crear el producto",
      error: error.message,
    });
  }
};

/**
 * @desc    Actualizar producto
 * @route   PUT /api/productos/:id
 * @access  Private (Admin)
 */
export const updateProducto = async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      categoria,
      precio,
      imagen,
      disponible,
      destacado,
      tiempoPreparacion,
      tags,
      activo,
    } = req.body;

    // Buscar el producto
    const producto = await Producto.findOne({
      _id: req.params.id,
      restauranteId: req.user.restauranteId,
    });

    if (!producto) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado",
      });
    }

    // Si se está cambiando el nombre, verificar que no exista otro con ese nombre
    if (nombre && nombre.trim() !== producto.nombre) {
      const productoExistente = await Producto.findOne({
        nombre: nombre.trim(),
        restauranteId: req.user.restauranteId,
        _id: { $ne: req.params.id },
      });

      if (productoExistente) {
        return res.status(400).json({
          success: false,
          message: "Ya existe otro producto con ese nombre",
        });
      }
    }

    // Actualizar campos
    if (nombre !== undefined) producto.nombre = nombre.trim();
    if (descripcion !== undefined)
      producto.descripcion = descripcion?.trim() || null;
    if (categoria !== undefined) producto.categoria = categoria;
    if (precio !== undefined) producto.precio = precio;
    if (imagen !== undefined) producto.imagen = imagen;
    if (disponible !== undefined) producto.disponible = disponible;
    if (destacado !== undefined) producto.destacado = destacado;
    if (tiempoPreparacion !== undefined)
      producto.tiempoPreparacion = tiempoPreparacion;
    if (tags !== undefined) producto.tags = tags;
    if (activo !== undefined) producto.activo = activo;

    producto.modificadoPor = req.user._id;

    await producto.save();

    res.json({
      success: true,
      message: "Producto actualizado exitosamente",
      data: {
        producto: producto.toPublicJSON(),
      },
    });
  } catch (error) {
    console.error("Error en updateProducto:", error);

    // Errores de validación de Mongoose
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => ({
        path: err.path,
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        message: "Error de validación",
        errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Error al actualizar el producto",
      error: error.message,
    });
  }
};

/**
 * @desc    Desactivar producto (soft delete)
 * @route   DELETE /api/productos/:id
 * @access  Private (Admin)
 */
export const deleteProducto = async (req, res) => {
  try {
    const producto = await Producto.findOne({
      _id: req.params.id,
      restauranteId: req.user.restauranteId,
    });

    if (!producto) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado",
      });
    }

    // Soft delete
    producto.activo = false;
    producto.disponible = false; // También marcar como no disponible
    producto.modificadoPor = req.user._id;
    await producto.save();

    res.json({
      success: true,
      message: "Producto desactivado exitosamente",
      data: {
        producto: producto.toPublicJSON(),
      },
    });
  } catch (error) {
    console.error("Error en deleteProducto:", error);
    res.status(500).json({
      success: false,
      message: "Error al desactivar el producto",
      error: error.message,
    });
  }
};

/**
 * @desc    Cambiar disponibilidad de producto
 * @route   PATCH /api/productos/:id/disponibilidad
 * @access  Private (Admin, Cocinero)
 */
export const toggleDisponibilidad = async (req, res) => {
  try {
    const { disponible } = req.body;

    if (disponible === undefined) {
      return res.status(400).json({
        success: false,
        message: "El campo 'disponible' es requerido",
      });
    }

    const producto = await Producto.findOne({
      _id: req.params.id,
      restauranteId: req.user.restauranteId,
    });

    if (!producto) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado",
      });
    }

    if (!producto.activo) {
      return res.status(400).json({
        success: false,
        message:
          "No se puede cambiar la disponibilidad de un producto inactivo",
      });
    }

    producto.disponible = disponible;
    producto.modificadoPor = req.user._id;
    await producto.save();

    res.json({
      success: true,
      message: `Producto marcado como ${
        disponible ? "disponible" : "no disponible"
      }`,
      data: {
        producto: producto.toPublicJSON(),
      },
    });
  } catch (error) {
    console.error("Error en toggleDisponibilidad:", error);
    res.status(500).json({
      success: false,
      message: "Error al cambiar la disponibilidad del producto",
      error: error.message,
    });
  }
};

/**
 * @desc    Obtener estadísticas de productos
 * @route   GET /api/productos/estadisticas
 * @access  Private
 */
export const getEstadisticas = async (req, res) => {
  try {
    const filter = { restauranteId: req.user.restauranteId };

    // Total de productos activos
    const totalProductos = await Producto.countDocuments({
      ...filter,
      activo: true,
    });

    // Productos disponibles
    const productosDisponibles = await Producto.countDocuments({
      ...filter,
      activo: true,
      disponible: true,
    });

    // Productos no disponibles
    const productosNoDisponibles = await Producto.countDocuments({
      ...filter,
      activo: true,
      disponible: false,
    });

    // Productos destacados
    const productosDestacados = await Producto.countDocuments({
      ...filter,
      activo: true,
      destacado: true,
    });

    // Productos por categoría
    const productosPorCategoria = await Producto.aggregate([
      { $match: { ...filter, activo: true } },
      {
        $group: {
          _id: "$categoria",
          cantidad: { $sum: 1 },
          precioPromedio: { $avg: "$precio" },
        },
      },
      { $sort: { cantidad: -1 } },
    ]);

    // Precio promedio general
    const precioPromedio = await Producto.aggregate([
      { $match: { ...filter, activo: true } },
      {
        $group: {
          _id: null,
          precioPromedio: { $avg: "$precio" },
          precioMinimo: { $min: "$precio" },
          precioMaximo: { $max: "$precio" },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        totalProductos,
        productosDisponibles,
        productosNoDisponibles,
        productosDestacados,
        productosPorCategoria,
        precios: precioPromedio[0] || {
          precioPromedio: 0,
          precioMinimo: 0,
          precioMaximo: 0,
        },
      },
    });
  } catch (error) {
    console.error("Error en getEstadisticas:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener estadísticas",
      error: error.message,
    });
  }
};

/**
 * @desc    Obtener productos destacados
 * @route   GET /api/productos/destacados
 * @access  Private
 */
export const getProductosDestacados = async (req, res) => {
  try {
    const productos = await Producto.find({
      restauranteId: req.user.restauranteId,
      activo: true,
      destacado: true,
      disponible: true,
    })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      count: productos.length,
      data: {
        productos: productos.map((producto) => producto.toPublicJSON()),
      },
    });
  } catch (error) {
    console.error("Error en getProductosDestacados:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener productos destacados",
      error: error.message,
    });
  }
};
