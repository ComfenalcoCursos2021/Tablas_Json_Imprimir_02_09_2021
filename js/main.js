
addEventListener('DOMContentLoaded', async(e)=>{

    let peticion = await fetch('./config.json');
    let data = await peticion.json();
    console.log(data);

    //Informacion Tipo-De-Factura
    document.querySelector("#tipoDeFactura").insertAdjacentText('afterbegin', data.Informacion['Tipo-De-Factura']);

    //Header Logo
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

    //Header Empresa
    let headerEmpresa = `
    <strong>${data.Header.Empresa.Nombre}</strong><br>
        ${data.Header.Empresa.Direccion}<br>
        ${data.Header.Empresa.Departamento}<br>`;
    let title = document.createElement('TITLE');
    title.insertAdjacentText('afterbegin', data.Header.Empresa.Nombre);

    document.head.insertAdjacentElement('afterbegin',title);
    document.querySelector("#headerEmpresa").insertAdjacentHTML('afterbegin', headerEmpresa);

    //Header Contactos
    let fragmen = document.createDocumentFragment();
    let p = document.createElement('P');
    fragmen.append(p)
    for(let key in data.Header.Contactos){
        let texto = document.createTextNode(`${key} :`);
        fragmen.children[0].appendChild(texto);
        for(let [id, value] of Object.entries(data.Header.Contactos[key])){
            let a = document.createElement('A');
            let br = document.createElement('BR');
            a.href = value.Valor;
            a.insertAdjacentText('afterbegin', value.Nombre);
            fragmen.children[0].appendChild(a);
            fragmen.children[0].appendChild(br);
        }
    }
    document.querySelector("#headerContactos").insertAdjacentElement('afterbegin', fragmen.children[0]);





    let sectionAutorizacionResponsable = `
    <strong>Facturar a</strong><br>
    ${data['Section-Autorizacion'].Responsable.Nombre}<br>
    ${data['Section-Autorizacion'].Responsable.Empresa}<br>
    ${data['Section-Autorizacion'].Responsable['Dirrecion-Completa']}<br>`;
    document.querySelector("#sectionAutorizacionResponsable").insertAdjacentHTML('afterbegin', sectionAutorizacionResponsable);


    let sectionAutorizacionAutorizacion = `
    <strong>Aprobado por</strong><br>
    ${data['Section-Autorizacion'].Autorizacion.Nombre}<br>
    ${data['Section-Autorizacion'].Autorizacion.Empresa}<br>
    ${data['Section-Autorizacion'].Autorizacion['Dirrecion-Completa']}<br>`;
    document.querySelector("#sectionAutorizacionAutorizacion").insertAdjacentHTML('afterbegin', sectionAutorizacionAutorizacion);



    let ListaProvedores = ``;
    for(let [id, value] of Object.entries(data['Section-Detalle'].Proveedor)){
        ListaProvedores += `
        <tr class="invoice_detail">
            <td width="20%"><a class="control removeRow" href="#">x</a><span contenteditable>${value['N-Vendedor']}</span></td>
            <td width="22%" style="text-align:center;"><span contenteditable>${value['Nombre']}</span></td>
            <td width="22%"><span contenteditable>${value['Orden-Compra']}</span></td>
            <td width="34%"><span contenteditable>${value['Términos-y-condiciones']}</span></td>
        </tr>`
    }
    document.querySelector("#sectionDetalleProveedor").insertAdjacentHTML('afterbegin', ListaProvedores);

    let subTotal = 0;
    let ListaCompra = "";
    for(let [id, value] of Object.entries(data['Section-Detalle'].Compra)){
        let iva = value.Precio + (value.Precio * (value.Iva / 100));
        subTotal += iva;
        ListaCompra += `
        <tr>
          <td width='5%'><a class="control removeRow" href="#">x</a> <span contenteditable>${value['N-Vendedor']}</span></td>
          <td width='5%'><span contenteditable>${value.Codigo}</span></td>
          <td width='60%'><span contenteditable>${value.Descripcion}</span></td>
          <td class="amount"><input type="text" value="${value.Cantidad}" /></td>
          <td class="rate"><input type="text" value="${new Intl.NumberFormat("de-DE").format(value.Precio)}" /></td>
          <td class="tax taxrelated">${value.Iva}</td>
          <td class="sum">${new Intl.NumberFormat("de-DE").format(iva)}</td>
        </tr>`;
    }
    document.querySelector("#sectionDetalleCompra").insertAdjacentHTML('afterbegin', ListaCompra);

    document.querySelector("#ivaApagar").insertAdjacentHTML('afterbegin', data.Iva);


    document.querySelector("#totalApagar").insertAdjacentText('afterbegin', new Intl.NumberFormat("de-DE").format(subTotal + (subTotal * (data.Iva / 100))));

























    // Codigo de barras
    JsBarcode("#barcode", "Hola como esta");

    // Codigo de qr
    qr = new QRious({
        element: document.getElementById('qr-code'),
        size: 200,
        value: "Hola monica"
    });


})