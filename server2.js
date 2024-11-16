const puppeteer = require('puppeteer');
const randomUseragent = require('random-useragent');
const ExcelJS = require('exceljs');

// Funcion para guardar los datos en Excel
const saveExcel = (datos) => {
    const workbook = new ExcelJS.Workbook();
    const fileName = `Ranking_Segun_Kodigo_Org.xlsx`;
    const sheet = workbook.addWorksheet('Resultados');

    const reColumnas = [{ header: 'Nombre', key: 'name' }];
    sheet.columns = reColumnas;
    sheet.addRows(datos);

    workbook.xlsx.writeFile(fileName)
        .then(() => {
            console.log('Se creó exitosamente el archivo Excel');
        })
        .catch((error) => {
            console.error('Hubo un error al guardar el archivo:', error);
        });
};

const inicializacion = async () => {
    const header = randomUseragent.getRandom();
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.setUserAgent(header);
    await page.setViewport({ width: 1920, height: 1080 });

    
    await page.goto('https://kodigo.org/cuales-son-los-10-lenguajes-de-programacion-mas-usados-en-la-actualidad/');
    await page.waitForSelector('.elementor-widget-container h3'); // Espero que la pagina  sea visible

    // Selecciono los elementos h3 que tienen un b y dentro esta el texto
    const listaDeLenguajes = await page.$$('.elementor-widget-container h3');

    let datos = [];

    for (const item of listaDeLenguajes) {
        const getnombre = await page.evaluate(el => {
            const boldElement = el.querySelector('b');
            return boldElement ? boldElement.innerText : null; // Obtiene el texto que esta en la etiqueta b
        }, item);
      
        
        if (getnombre && /^\d/.test(getnombre)) {
            console.log('Nombre:', getnombre);
            datos.push({ name: getnombre });
        }
    
    }

    await browser.close();
    saveExcel(datos);
}

inicializacion();
