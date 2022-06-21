import React, { createContext, useState, useEffect } from 'react';
import { ImagePickerResponse } from 'react-native-image-picker';
import cafeApi from '../api/cafeApi';
import { Producto, ReportsResponse } from '../interfaces/appInterfaces';


type ReportsContextProps = {
    reports: Producto[];
    loadReports: () => Promise<void>;
    addReport: ( categoryId: string, reportDescription: string) => Promise<Producto>;
    updateReport: ( categoryId: string, reportDescription: string, reportId: string ) => Promise<void>;
    deleteReport: ( id: string ) => Promise<void>; 
    loadReportById: ( id: string ) => Promise<Producto>; 
    uploadImage: ( data: any, id: string ) => Promise<void>; //TODO: cambiar any
} 


export const ReportsContext = createContext({} as ReportsContextProps);


export const ReportsProvider = ({ children }: any) => {

    const [reports, setReports] = useState<Producto[]>([]);

    useEffect(() => {
        loadReports();
    }, [])
    

    const loadReports = async () => {
        const resp = await cafeApi.get<ReportsResponse>('/productos?limite=50');
        /* setReports([ ...reports, ...resp.data.productos ]); */
        setReports([ ...resp.data.productos ]);
    }

    const addReport = async ( categoryId: string, reportDescription: string ): Promise<Producto> => {
        console.log('addReport');
        const resp = await cafeApi.post<Producto>('/productos', {
            nombre: reportDescription,
            categoria: categoryId
        });
        setReports([ ...reports, resp.data ]);
        
        return resp.data;
    }

    //No se utiliza ya que no tenemos actualizacion de reportes
    const updateReport = async ( categoryId: string, reportDescription: string, reportId: string ) => {
        console.log('updateReport');
        const resp = await cafeApi.put<Producto>(`/productos/${ reportId }`, {
            nombre: reportDescription,
            categoria: categoryId
            
        });
        setReports( reports.map( repor => {
            return (repor._id === reportId)
                ?  resp.data
                : repor;  
        }));
    }

    //No hay funcion para borrar en la app
    const deleteReport = async ( id: string ) => {
    }

    const loadReportById = async ( id: string ): Promise<Producto> => {
        const resp = await cafeApi.get<Producto>(`productos/${ id }`);
        return resp.data;
        
    }

    //Funcion para cargar la imagen
    const uploadImage = async ( data: ImagePickerResponse, id: string ) => {
        const fileToUpload = {
            uri: data.assets![0].uri,
            type: data.assets![0].type,
            name: data.assets![0].fileName
        };

        const formData = new FormData();
        formData.append('archivo', fileToUpload);

        try {   
            const resp = await cafeApi.put(`/uploads/productos/${ id }`, formData, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
                transformRequest: () => {
                return formData;
                },
            });
        } catch (error) {
                console.log(error);
        }
    };


    return(
        <ReportsContext.Provider value={{
            reports,
            loadReports,
            addReport,
            updateReport,
            deleteReport,
            loadReportById,
            uploadImage
        }}>
            { children }
        </ReportsContext.Provider>
    )
}