
addEventListener('DOMContentLoaded', async(e)=>{

    let peticion = await fetch('./config.json');
    let data = await peticion.json();
    console.log(data);


    document.querySelector("#tipoDeFactura").insertAdjacentText('afterbegin', data.Informacion['Tipo-De-Factura']);


    let link = document.createElement('LINK');
    let myLinkObj = {
        rel:"shortcut icon",
        href: data.Header.Logo,
        type: "image/png"
    }
    Object.assign(link, myLinkObj);
    let img = document.createElement('IMG');
    img.src = data.Header.Logo;
    img.width = "97";

    document.querySelector("#logo").insertAdjacentElement('afterbegin', img);
    document.head.insertAdjacentElement('beforeend', link);

    let headerEmpresa = `
    <strong>${data.Header.Empresa.Nombre}</strong><br>
        ${data.Header.Empresa.Direccion}<br>
        ${data.Header.Empresa.Departamento}<br>`;
    let title = document.createElement('TITLE');
    title.insertAdjacentText('afterbegin', data.Header.Empresa.Nombre);

    document.head.insertAdjacentElement('afterbegin',title);
    document.querySelector("#headerEmpresa").insertAdjacentHTML('afterbegin', headerEmpresa);


    // Codigo de barras
    JsBarcode("#barcode", "Hola como estas :V");

    // Codigo de qr
    qr = new QRious({
        element: document.getElementById('qr-code'),
        size: 200,
        value: "Miguel Angel"
    });


})