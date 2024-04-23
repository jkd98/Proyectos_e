import Proyecto from "../models/Proyecto.js"

/**
 * Esta función crea un nuevo proyecto
 */
const crearProyecto = async (req, res) => {
    try {
        const nuevoProyecto = new Proyecto(req.body);
        const proyectoGuardado = await nuevoProyecto.save();
        return res.json({ msg: "Proyecto creado correctamente", proyecto: proyectoGuardado });
    } catch (error) {
        console.error('Error al crear el proyecto:', error);
        return res.status(500).json({ msg: "Error al crear el proyecto" });
    }
}

/**
 * Esta función lista todos los proyectos
 */
const listarProyectos = async (req, res) => {
    try {
        const proyectos = await Proyecto.find();
        return res.json({ msg: "Lista de proyectos:", datos: proyectos });
    } catch (error) {
        console.error('Error al obtener la lista de proyectos:', error);
        return res.status(500).json({ msg: "Error al obtener la lista de proyectos" });
    }
}

/**
 * Esta función obtiene un proyecto por su ID
 */
const obtenerProyectoPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const proyecto = await Proyecto.findOne({'_id':id});
        if (!proyecto) {
            return res.status(404).json({ msg: "No se encontró el proyecto" });
        }
        return res.json({ msg: "Proyecto encontrado:", datos: proyecto });
    } catch (error) {
        console.error('Error al obtener el proyecto por ID:', error);
        return res.status(500).json({ msg: "Error al obtener el proyecto por ID" });
    }
}

/**
 * Esta función actualiza un proyecto por su ID
 */
const actualizarProyecto = async (req, res) => {
    const { id } = req.params;
    try {
        const proyectoActualizado = await Proyecto.findByIdAndUpdate(id, req.body, { new: true });
        if (!proyectoActualizado) {
            return res.status(404).json({ msg: "No se encontró el proyecto" });
        }
        return res.json({ msg: "Proyecto actualizado correctamente", datos: proyectoActualizado });
    } catch (error) {
        console.error('Error al actualizar el proyecto:', error);
        return res.status(500).json({ msg: "Error al actualizar el proyecto" });
    }
}

/**
 * Esta función elimina un proyecto por su ID
 */
const eliminarProyecto = async (req, res) => {
    const { id } = req.params;
    try {
        const proyectoEliminado = await Proyecto.findByIdAndDelete(id);
        if (!proyectoEliminado) {
            return res.status(404).json({ msg: "No se encontró el proyecto" });
        }
        return res.json({ msg: "Proyecto eliminado correctamente" });
    } catch (error) {
        console.error('Error al eliminar el proyecto:', error);
        return res.status(500).json({ msg: "Error al eliminar el proyecto" });
    }
}

const buscarProyectosPorFiltros = async (req, res) => {
    try {
        // Obtener los filtros de la solicitud
        const { tienePiezas, fecha } = req.body;

        // Construir el objeto de consulta en base a los filtros
        const consulta = {};

        if (tienePiezas !== undefined) {
            consulta['piezas'] = { $exists: tienePiezas };
        }

        if (fecha) {
            // Convertir la fecha a un objeto Date
            const fechaInicio = new Date(fecha);
            const fechaFin = new Date(fecha);
            fechaFin.setHours(23, 59, 59, 999); // Establecer la hora a las 23:59:59:999 para obtener todos los proyectos de ese día

            // Agregar la condición de fecha a la consulta
            consulta['fechaInicio'] = { $gte: fechaInicio, $lte: fechaFin };
        }

        // Realizar la búsqueda de proyectos con los filtros
        const proyectos = await Proyecto.find(consulta);

        // Retornar los proyectos encontrados
        return res.json({ msg: "Proyectos encontrados:", datos: proyectos });
    } catch (error) {
        console.error('Error al buscar proyectos por filtros:', error);
        return res.status(500).json({ msg: "Error al buscar proyectos por filtros" });
    }
}

const asignarPieza = async(req,res)=>{
    try {
        const { id } = req.params; // Obtén el ID del proyecto de los parámetros de la URL
        const { piezas } = req.body; // Obtén el array de piezas del cuerpo de la solicitud
    
    const proyecto = await Proyecto.findById(id);
    if (!proyecto) {
      return res.json({ message: 'No se encontró el proyecto' });
    }
let idProj = proyecto._id;
    // Actualiza el proyecto agregando nuevas piezas al campo "piezas" utilizando $addToSet
    const resultado = await Proyecto.updateOne(
      { '_id': proyecto._id },
      { $push: { 'piezas': { $each: piezas } } }
    );

    if (resultado.nModified > 0) {
      return res.status(200).json({ message: 'Piezas agregadas al proyecto correctamente' });
    } else {
      return res.json({ message: 'No se encontró el proyecto o no se realizaron cambios' });
    }
  } catch (error) {
    // Maneja los errores y envía una respuesta de error al cliente
    console.error('Error al agregar piezas al proyecto:', error);
    res.status(500).json({ message: 'Error al agregar piezas al proyecto', error: error.message });
  }
}


///////////
//Proyectos con Piezas
const obtenerProyectosConPiezas = async (req, res) => {
    try {
        // Buscar proyectos con al menos una pieza asociada
        const proyectosConPiezas = await Proyecto.find({ cantidadPiezas: { $gt: 0 } }); // Supongamos que 'cantidadPiezas' es el campo que indica la cantidad de piezas asociadas

        return res.json({ proyectosConPiezas });
    } catch (error) {
        console.error('Error al obtener proyectos con piezas:', error);
        return res.status(500).json({ msg: "Error al obtener proyectos con piezas" });
    }
}


//Proyectos por Fechas

const obtenerProyectosPorFecha = async (req, res) => {
    try {
        // Obtener proyectos ordenados por fecha de manera descendente
        const proyectosPorFecha = await Proyecto.find().sort({ fecha: -1 }); // Supongamos que 'fecha' es el campo que almacena la fecha del proyecto

        return res.json({ proyectosPorFecha });
    } catch (error) {
        console.error('Error al obtener proyectos por fecha:', error);
        return res.status(500).json({ msg: "Error al obtener proyectos por fecha" });
    }
}

export { obtenerProyectosPorFecha };
export { obtenerProyectosConPiezas };
export {
    crearProyecto,
    listarProyectos,
    obtenerProyectoPorId,
    actualizarProyecto,
    eliminarProyecto,
    buscarProyectosPorFiltros,
    asignarPieza
}
