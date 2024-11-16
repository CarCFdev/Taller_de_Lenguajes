
const puppeteer = require('puppeteer');
const randomUseragent = require('random-useragent');
const ExcelJS = require('exceljs');

// Funcion para guardar los datos en Excel
const saveExcel = (date) => {
    const workbook = new ExcelJS.Workbook();
    const fileName = `RANKING_SEGUN_ITPATAGONIA.xlsx`;
    const sheet = workbook.addWorksheet('Resultados');

    const reColumnas = [{ header: 'nombre', key: 'name' }];
    sheet.columns = reColumnas;
    sheet.addRows(date);

    workbook.xlsx.writeFile(fileName)
        .then(() => {
            console.log('Se creó exitosamente el archivo Excel');
        })
        .catch((error) => {
            console.error('Hubo un error al guardar el archivo:', error);
        });
};

// Funcion principal que inicializa la web para empezar a hacer scraping 
const inicializacion = async () => {
        //genero usuarios ramdon que interactuan con la pagina desde distintas ip y buscadores cambia por cada peticion que hagamos
        const header = randomUseragent.getRandom();
        // launch inicializa un nuevo proceso de navegacion en segundo plano y el objeto headless me permite ejecutar configurar al navegador 
        //para que no  muestre una ventana grafica haciendolo mas eficiente
        //esto ayuda al rendimiento
        const browser = await puppeteer.launch({ headless: true });

        const page = await browser.newPage();
        await page.setUserAgent(header);
        await page.setViewport({ width: 1920, height: 1080 });

     
        await page.goto('https://itpatagonia.com/10-lenguajes-de-programacion-mas-demandados-2024/');
        await page.waitForSelector('.inner-post'); // Espera a que los la pagina sea visibles

        // Selecciono LOS ELEMENTOS QUE DESEO EN BASE A LA CLASE EN LA QUE SE ENCUENTRAN
        const listaDeLenguajes = await page.$$('h2.wp-block-heading strong');
        
        let date = [];

        
        for (const item of listaDeLenguajes) {
            const getnombre = await page.evaluate(el => el.innerText, item);
            
            //ME QUEDO CON LOS TEXTOS QUE EMPIEZAN CON UN NUMERO QUE SON LOS QUE ESTAN EN EL RANKING
           
            if (getnombre && /^\d/.test(getnombre)) {
                console.log('Nombre:', getnombre);
                date.push({ name: getnombre });
            }
        
        }
         

        await browser.close();

    saveExcel(date);

}
inicializacion(); 
