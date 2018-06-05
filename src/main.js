/* This is a file to make a connection to the DBS */ 

const nodeJt400 = require('node-jt400');
const fs = require('fs');
const XLSX = require('xlsx');
const axios = require('axios');

// La configuracion para la conexion con el DBS

const config = {
    host: '10.108.168.130',
    user: 'xupr46agd',
    password: 'agd@174q'
};

// Se crea el pool de conexiones con el uso de la configuracion

const pool = nodeJt400.pool(config);

// El SQL statement para obtener las ordenes de trabajo en proceso para M&E - sin notas para que no se complique

const statement = 'SELECT concat(trim(a.wono), concat( \'-\', b.wosgno)) as wono, a.cuno, a.cunm, a.eqmfmd, a.eqmfsn FROM libr46.wophdrs0 a LEFT JOIN libr46.wopsegs0 b on a.wono=b.wono WHERE STNO IN (\'65\', \'66\', \'67\', \'68\', \'69\') AND ACTI=? ORDER BY wono';
const queryconsts = ['O'];

// LLamado a la funcion de se encarga de hacer la actualizacion

downloadWip(pool, statement, queryconsts);

// El grupo de funciones de ayuda que se encargan de hacer la tarea
// La funcion principal que agrupa todas las actividades

function downloadWip(pool, statement, queryconsts) {
    pool.query(statement, queryconsts)
        .then(function (result) {
            updateDMWip(writeExcelFile(result));
        })
        .fail(function (error) {
            fs.appendFile('errors.log', Date.toString() + ': ' + error.toString(), function (err) {
                if (err) throw err;
            });
        });
}

// La funcion que escribe el archivo de Excel que se codifica en base64
// para ser enviado a traves de la API de device magic

function writeExcelFile(wipData) {
    const xlFileName = 'dmWipWo.xlsx';
    const ws = XLSX.utils.json_to_sheet(wipData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'WORK_ORDERS');
    XLSX.writeFile(wb, xlFileName);
    return xlFileName;
}

// La funcion que empuja la informacion directamente a device magic
// No se valida la existencia del archivo porque este mismo programa
// es el que lo escribe en disco. Se deberia hacer?

function updateDMWip(filename) {
    const dmWipWo = fs.readFileSync(filename);
    const payload = new Buffer(dmWipWo).toString('base64');
    const dmUrl = ' https://www.devicemagic.com/api/resources/40339.json';
    const updateObject = {
        resource: {
            file: {
                file_name: filename,
                file_data: payload,
                content_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            }
        }
    };
    const config = {
        url: dmUrl,
        method: 'put',
        headers: { 'Authorization': 'Basic X3kyQVBncWZ2OHBLQmRoaGJucTI6eA==' },
        data: updateObject,
    };

    // Empuja el archivo codificado a la base de datos de Device Magic
    // En caso de error deberia escribir algo en un archivo de texto de registros

    axios(config)
        .then(function(response) {
            return response.status;
        })
        .catch(function(error) {
            fs.appendFile('errors.log', Date.toString() + ': ' + error.toString(), function (err) {
                if (err) throw err;
            }
            );
        });
}
