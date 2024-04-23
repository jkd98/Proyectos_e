import express,{json} from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import conectarDB from './config/database.js';
import proyectoRoutes from "./routes/proyectoRouter.js";
import piezaRoutes from "./routes/piezasRouter.js";

const app = express();
dotenv.config();
conectarDB();
app.use(express.json());

const whiteList = [process.env.FRONTEND_URL];
const corsOptions = {
    origin:function(origin,callback){
        // Comprobar en la lista blanca
        if(whiteList.includes(origin)){
            // Puede consultar la API
            callback(null,true);
        }else{
            // No esta permitido
            callback(new Error("Error de CORS"));
        };
    }
};
app.use(cors(corsOptions));

app.use('/app/proyecto',proyectoRoutes);
app.use('/app/pieza',piezaRoutes);


//puerto del servidor 
//const port = process.env.port || 3000;
const port = 4000;

app.listen(port,()=>{ console.log("Servidor Corriendo", port);})

