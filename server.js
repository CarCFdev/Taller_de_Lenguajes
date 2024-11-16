 /*const puppeteer = require ('puppeteer');
//puppeteer es una version de chrome a nivel de codigo, que nos sirve para acceder al navegador
//random useragent sirve para cuando navegas, tu navegador internamente le avisa a la pagina web desde que navegador estas visitando a dicha pagina
//esto es para que el desarrollador sepa si tienes las librerias que sean compatibles con el navegador desde donde se entro 
// randonuseragent le envia esos datos generados aleatoriamente para simular interaccion humana, se genera cada vez que se realiza una petición 
const ExcelJS= require('exceljs');
const randomUseragent = require('random-useragent');


const saveExcel = (data) => {
    const workbook = new ExcelJS.Workbook()
    const fileName = `lista-de-lenguajes.xlsx`
    const sheet = workbook.addWorksheet(`Resultados`)

    const reColumnas = [{ header: 'nombre', key: 'name'
    }];


    sheet.columns = reColumnas;

    sheet.addRows(data);
    workbook.xlsx.writeFile(fileName).then((e)=>{
        console.log('se creo exitosamente');

    })
    .catch(()=>{
        console.log('se rompio el codigo y no se guardo nada');
        
    })




}


const inicializacion = async ()  => {
    //genera usheragent aleatorios desde cualquier navegador
    const header = randomUseragent.getRandom();
    // abro el navegador para eso inicializo 
    const browser = await puppeteer.launch();
    //creo un nueva pestaña
    const page = await browser.newPage();

    await page.setUserAgent(header);
    //le indico desde que pantalla estoy abriendo el navegador para que no se confunda y me devuelva la informacion acorde a ese formato
    await page.setViewport({width:1920, height:1080});
    //le indico la pagina que tiene que visitar y visita en esa linea 
    await page.goto('https://keepcoding.io/blog/lenguajes-de-programacion-mas-usados/');
    //toma un screenshot de lo que vea 
    await page.screenshot({path:'example.png'});
    // luego se cierra para liberar memoria
   
    //espera hasta que vea la clase que quiero 
   // await page.waitForSelector('.elementor-widget-container');

    await page.waitForSelector('.entry-content');

    const listaDeLenguajes = await page.$$('.ez-toc-section');
   // let data= []
    for (const item of listaDeLenguajes){

        const objNombre = await item.$('strong');
        
        const getnombre = await page.evaluate(objNombre => objNombre.innerText, objNombre);

        
        
        console.log(getnombre);

       
    }

    await browser.close();
   // saveExcel(data);
}


inicializacion();

*/

const puppeteer = require('puppeteer');
const randomUseragent = require('random-useragent');
const ExcelJS = require('exceljs');

// Funcion para guardar los datos en Excel
const saveExcel = (data) => {
    const workbook = new ExcelJS.Workbook();
    const fileName = `Ranking_Segun_BambuMobile.xlsx`;
    const sheet = workbook.addWorksheet('Resultados');

    const reColumnas = [{ header: 'nombre', key: 'name' }];
    sheet.columns = reColumnas;
    sheet.addRows(data);

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

     
        await page.goto('https://bambu-mobile.com/10-lenguajes-de-programacion-mas-usados/');
        await page.waitForSelector('.elementor-heading-title'); // Espera a que los la pagina sea visibles

        // Selecciono LOS ELEMENTOS QUE DESEO EN BASE A LA CLASE EN LA QUE SE ENCUENTRAN
        const listaDeLenguajes = await page.$$('h3.elementor-heading-title.elementor-size-default');
        
        let data = [];

        
        for (const item of listaDeLenguajes) {
            const getnombre = await page.evaluate(el => el.innerText, item);
            
            //ME QUEDO CON LOS TEXTOS QUE NO EMPIEZAN CON CARACTERISTICAS Y FILTRO LOS QUE TIENEN NUMERO ADELANTE DEL TEXTO
            if (/^\d+\.\s/.test(getnombre) && !getnombre.includes("Características")) {
              
              
                console.log('Nombre:', getnombre); 

                data.push({ name: getnombre });
            }
        }

        await browser.close();

    saveExcel(data);

}
inicializacion(); 
