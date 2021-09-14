
addEventListener('DOMContentLoaded', async(e)=>{

    let peticion = await fetch('./config.json');
    let peticion2 = await fetch('./css/color.css');
    let data = await peticion.json();
    let obj = await peticion2.text();
    let color = JSON.parse(Object(obj).slice(5).replace(/[$;]/g,'",').replace(/[$#]/g,'"#').replace(/[$-]/g,'').replace(/color/g,'"color').replace(/[$:]/g,'":').replace(/[$\r]/g,'').replace(/[$\n]/g,'').replace(/[$ ]/g,'').replace(/,}/g,'}'));
    console.log(data);
    console.log(color);

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
        NIT: ${data.Header.Empresa.NIT}<br>
        ${data.Header.Empresa.Direccion}<br>
        ${data.Header.Empresa.Departamento}<br>`;
    let title = document.createElement('TITLE');
    title.insertAdjacentText('afterbegin', data.Header.Empresa.Nombre);
    document.head.insertAdjacentElement('afterbegin',title);
    document.querySelector("#headerEmpresa").insertAdjacentHTML('afterbegin', headerEmpresa);


    const plantillaContactos = (data)=>{
        let fragmen = document.createDocumentFragment();
        let p = document.createElement('P');
        fragmen.append(p)
        for(let key in data){
            let strong = document.createElement('STRONG');
            let texto = document.createTextNode(`${key} :`);
            strong.appendChild(texto);
            fragmen.children[0].appendChild(strong);
            for(let [id, value] of Object.entries(data[key])){
                let a = document.createElement('A');
                let br = document.createElement('BR');
                a.href = value.Valor;
                a.insertAdjacentText('afterbegin', value.Nombre);
                fragmen.children[0].appendChild(a);
                fragmen.children[0].appendChild(br);
            }
        }
        return fragmen.children[0];
    }

    //Header Contactos
    document.querySelector("#headerContactos").insertAdjacentElement('afterbegin',plantillaContactos(data.Header.Contactos));


    // Codigo de qr
    qr = new QRious({
        element: document.getElementById('qr-code'),
        value: JSON.stringify(data.Header["Token-Verificacion"])
    });
    qr.set({
        foreground: color.colorPrincipal,
        size: 150,
        background: color.colorFondoQrBarras
    });

    //Section-Autorizacion Responsable
    let sectionAutorizacionResponsable = `
    <strong>Facturar a</strong><br>
    ${data['Section-Autorizacion'].Responsable.Nombre}<br>
    ${data['Section-Autorizacion'].Responsable.Empresa}<br>
    ${data['Section-Autorizacion'].Responsable['Dirrecion-Completa']}<br>`;
    document.querySelector("#sectionAutorizacionResponsable").insertAdjacentHTML('afterbegin', sectionAutorizacionResponsable);

    document.querySelector("#sectionAutorizacionResponsable").insertAdjacentHTML('beforeend', plantillaContactos(data['Section-Autorizacion'].Responsable.Contactos).innerHTML);
 

   


    //Section-Autorizacion Responsable
    let sectionAutorizacionAutorizacion = `
    <strong>Aprobado por</strong><br>
    ${data['Section-Autorizacion'].Autorizacion.Nombre}<br>
    ${data['Section-Autorizacion'].Autorizacion.Empresa}<br>
    ${data['Section-Autorizacion'].Autorizacion['Dirrecion-Completa']}<br>`;
    document.querySelector("#sectionAutorizacionAutorizacion").insertAdjacentHTML('afterbegin', sectionAutorizacionAutorizacion);

    document.querySelector("#sectionAutorizacionAutorizacion").insertAdjacentHTML('beforeend', plantillaContactos(data['Section-Autorizacion'].Autorizacion.Contactos).innerHTML);


    // Section-Autorizacion Facturado
    // Codigo de barras
    JsBarcode("#barcode", JSON.stringify(data['Section-Autorizacion'].Facturado['Numero-Factura']), {
        lineColor: color.colorPrincipal,
        height: 40,
        width: 1.5,
        displayValue: false,
        background: color.colorFondoQrBarras
    });

    //Section-Detalle Proveedor
    let ListaProvedores = ``;
    for(let [id, value] of Object.entries(data['Section-Detalle'].Proveedor)){
        ListaProvedores += `
        <tr class="invoice_detail">
            <td width="20%"><a class="control removeRow" >x</a><span contenteditable>${value['N-Vendedor']}</span></td>
            <td width="22%" style="text-align:center;"><span contenteditable>${value['Nombre']}</span></td>
            <td width="22%"><span contenteditable>${value['Orden-Compra']}</span></td>
            <td width="34%"><span contenteditable>${value['Términos-y-condiciones']}</span></td>
        </tr>`
    }
    document.querySelector("#sectionDetalleProveedor").insertAdjacentHTML('afterbegin', ListaProvedores);
    //Eliminar fila de la tabla proveedor
    document.querySelector("#sectionDetalleProveedor").addEventListener("click", (e)=>{
        if(e.target.nodeName == "A"){
            e.target.parentNode.parentNode.remove();
        }
        e.preventDefault();
    })
    //Nueva fila del proveedor
    document.querySelector("#nuevaFilaVendedor").addEventListener("click", (e)=>{
        let plantilla = `
        <tr class="invoice_detail">
            <td width="20%"><a class="control removeRow" >x</a><span contenteditable>Codigo</span></td>
            <td width="22%" style="text-align:center;"><span contenteditable>Nombre Completo</span></td>
            <td width="22%"><span contenteditable>Generar Orden</span></td>
            <td width="34%"><span contenteditable>Medio de pago</span></td>
        </tr>
        `;
        document.querySelector("#sectionDetalleProveedor").insertAdjacentHTML('beforeend', plantilla);
        e.preventDefault();
    })



    document.querySelector('#sectionDetalleCompra').addEventListener('keydown',(e)=>{
        var el = e.target;
        setTimeout(function(){
          el.style.cssText = 'height:auto; overflow-y: hidden; resize: none;';
          el.style.cssText = 'height:' + (el.scrollHeight+5) + 'px; overflow-y: hidden; resize: none;';
        },0);
    });
    let subTotal = 0;
    let TotalApagarIva = 0;
    let ListaCompra = "";
    let subTotalIva = 0;
    for(let [id, value] of Object.entries(data['Section-Detalle'].Compra)){
        subTotalIva = value.Precio * ((value.Iva / 100) * value.Cantidad);
        TotalApagarIva += subTotalIva;
        let iva = (value.Precio * value.Cantidad) + subTotalIva;
        subTotal += iva;
        ListaCompra += `
        <tr>
          <td width='5%'><a class="control removeRow">x</a> <span contenteditable>${value['N-Vendedor']}</span></td>
          <td width='5%'><span contenteditable>${value.Codigo}</span></td>
          <td width='50%'><textarea rows="3" style="resize: none;">${value.Descripcion}</textarea></td>
          <td class="amount"><input type="text" value="${value.Cantidad}" /></td>
          <td width="20%" class="rate"><input type="text" value="${new Intl.NumberFormat("de-DE").format(value.Precio)}" /></td>
          <td width="18%" class="tax taxrelated"><input type="text" value="${value.Iva}" /></td>
          <td width="10%" class="sum">${new Intl.NumberFormat("de-DE").format(iva)}</td>
        </tr>`;
    }
    document.querySelector("#sectionDetalleCompra").insertAdjacentHTML('afterbegin', ListaCompra);
    document.querySelector("#ivaApagar").insertAdjacentHTML('afterbegin', data.Iva);
    document.querySelector("#totalApagar").insertAdjacentText('afterbegin', new Intl.NumberFormat("de-DE").format(Math.round(subTotal + (subTotal * (data.Iva / 100)))));
    document.querySelector("#subIvaApagar").innerHTML = "";
    document.querySelector("#subIvaApagar").insertAdjacentText('afterbegin', new Intl.NumberFormat("de-DE").format(TotalApagarIva));
    let tbCompras = '#sectionDetalleCompra';
    let calcularFactura = (e)=>{
        let listaNodos = document.querySelectorAll(`[id="sectionDetalleCompra"] tr td input, .sum`);
        let valor = [];
        let subTotal = 0;
        let subTotalIva = 0;
        let TotalApagarIva = 0;
        for(let [id, valu] of Object.entries(listaNodos)){
            if(valu.nodeName!="TD"){
                valu.value = new Intl.NumberFormat("de-DE").format(valu.value.replace(/[$.]/g,''));
                valor.push(parseInt(valu.value.replace(/[$.]/g,'')));
            }else{
                subTotalIva = (valor[1] * (valor[2] / 100)) * valor[0];
                TotalApagarIva += subTotalIva;
                let iva = (valor[1] * valor[0]) + subTotalIva;
                valu.textContent = new Intl.NumberFormat("de-DE").format(iva);
                subTotal += iva;
                valor = [];
            }
        }
        document.querySelector("#totalApagar").innerHTML = "";
        document.querySelector("#subIvaApagar").innerHTML = "";
        document.querySelector("#subIvaApagar").insertAdjacentText('afterbegin', new Intl.NumberFormat("de-DE").format(TotalApagarIva));
        document.querySelector("#totalApagar").insertAdjacentText('afterbegin', new Intl.NumberFormat("de-DE").format(Math.round(subTotal + (subTotal * (data.Iva / 100)))));
    }
    document.querySelector(tbCompras).addEventListener("change", (e)=>{
        calcularFactura(e);
    })
    document.querySelector(tbCompras).addEventListener("click", (e)=>{
        if(e.target.nodeName == "A"){
            e.target.parentNode.parentNode.remove();
            calcularFactura(e);
        }
        e.preventDefault();
    })
    document.querySelector("#nuevaFilaCompra").addEventListener("click", (e)=>{
        let plantilla = `<tr>
          <td width='5%'><a class="control removeRow">x</a> <span contenteditable>N° Vendedor</span></td>
          <td width='5%'><span contenteditable>Código</span></td>
          <td width='60%'><textarea rows="1">Descripción del producto</textarea></td>
          <td class="amount"><input type="text" value="0"/></td>
          <td width="20%" class="rate"><input type="text" value="0" /></td>
          <td width="15%" class="tax taxrelated"><input type="text" value="0" /></td>
          <td width="10%" class="sum">0</td>
        </tr>`;
        document.querySelector("#sectionDetalleCompra").insertAdjacentHTML('beforeend', plantilla);
        e.preventDefault();
    })



    //Footer Mensaje
    document.querySelector("#FooterMensaje").insertAdjacentText('afterbegin', data.Footer.Mensaje);








         
 




    

    

})