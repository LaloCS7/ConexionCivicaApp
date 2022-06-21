export interface LoginData {
    correo:   string;
    password: string;
}

export interface RegisterData {
    nombre:   string;
    correo:   string;
    password: string;
}

export interface LoginResponse{
    usuario: Usuario;
    token:   string
}

export interface Usuario {
    rol:    string;
    estado: boolean;
    google: boolean;
    nombre: string;
    correo: string;
    uid:    string;
    img?:   string
}

export interface Location {
    latitude:  number;
    longitude: number;
}


//Reportes
export interface ReportsResponse {
    total:     number;
    productos: Producto[];
}

export interface Producto {
    //Nota: Cambiar Producto por Reporte, actualizar nombre por descripción 
    //y añadir campo latitud y longitud
    precio:    number;
    _id:       string;
    nombre:    string;
    categoria: Categoria;
    usuario:   Categoria;
    img?:      string;
}


//Categorias
export interface CategoriesResponse {
    total:      number;
    categorias: Categoria[];
}

export interface Categoria {
    _id:      string;
    nombre:   string;
    usuario?: CreadoPor;
}


export interface CreadoPor {
    _id:    string;
    nombre: string;
}
