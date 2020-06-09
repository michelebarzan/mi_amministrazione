var databases;
async function importaTutto(button)
{
    //button.disabled=true;
    var icon=button.getElementsByTagName("i")[0];
    icon.className="fad fa-spinner-third fa-spin";

    databases=["Beb","Grimaldi","po00","Spareti","newpan"];

    Swal.fire
    ({
        title: "Importazione in corso... ("+databases.join(',')+")",
        html: '<i style="color:4C91CB" class="fad fa-spinner-third fa-spin fa-4x"></i>',
        showConfirmButton:false,
        showCloseButton:false,
        allowEscapeKey:false,
        allowOutsideClick:false,
        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
    });

    var response=await importaDbTecnico();

    Swal.close();
    
    checkResponseImportaDbTecnico(response);

    //button.disabled=false;
    icon.className="fad fa-upload";
}
function importaDbTecnico()
{
    $(".action-bar-text-icon-button").prop("disabled",true);
    return new Promise(function (resolve, reject) 
    {
        var JSONdatabases=JSON.stringify(databases);
        $.post("importaDbTecnico.php",
        {
            JSONdatabases
        },
        function(response, status)
        {
            if(status=="success")
            {
                $(".action-bar-text-icon-button").prop("disabled",false);
                //console.log(response);
                resolve(response);
            }
            else
                resolve("error");
        });
    });
}
function closePopupScegliDatabase()
{
    $("#selectScegliDatabase").hide(300,"swing");
}
async function getSelects()
{
    var selected=[]

    var options=document.getElementsByClassName("custom-select-option");
    for (let index = 0; index < options.length; index++) 
    {
        const option = options[index];
        var checked=option.getAttribute("checked")=="true";
        if(checked)
            selected.push(option.value);
    }

    closePopupScegliDatabase();

    if(selected.length==0)
    {
        Swal.fire({icon:"error",title: "Nessun database selezionato",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
    }
    else
    {
        var button=document.getElementById("bntImportaSingoloDatabase");
        //button.disabled=true;
        var icon=button.getElementsByTagName("i")[0];
        icon.className="fad fa-spinner-third fa-spin";

        databases=selected;

        Swal.fire
        ({
            title: "Importazione in corso... ("+databases.join(',')+")",
            html: '<i style="color:4C91CB" class="fad fa-spinner-third fa-spin fa-4x"></i>',
            showConfirmButton:false,
            showCloseButton:false,
            allowEscapeKey:false,
            allowOutsideClick:false,
            onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
        });

        var response=await importaDbTecnico();

        Swal.close();

        checkResponseImportaDbTecnico(response);
        
        //button.disabled=false;
        icon.className="fad fa-file-upload";
    }
    
}
function checkResponseImportaDbTecnico(response)
{
    try {
        var arrayResponse=JSON.parse(response);
        var ul=document.createElement("ul");ul.setAttribute("style","text-align:left");
        var li=document.createElement("li");
        li.innerHTML="<b>Righe inserite: </b>"+arrayResponse["righeInserite"];
        ul.appendChild(li);
        var li=document.createElement("li");
        li.innerHTML="<b>Righe non inserite: </b>"+arrayResponse["righeNonInserite"];
        ul.appendChild(li);
        var li=document.createElement("li");
        var b=document.createElement("b");
        b.innerHTML="Errori: "+arrayResponse.errorMessages.length;
        li.appendChild(b);
        if(arrayResponse.errorMessages.length>0)
        {
            var button=document.createElement("button");
            button.setAttribute("id","buttonErroriImportazione");
            button.setAttribute("onclick","showDettagliErroriImportazione()");
            button.innerHTML="Dettagli";
            li.appendChild(button);

            var div=document.createElement("div");
            div.setAttribute("id","containerErroriImportazione");
            div.innerHTML="<br>"+arrayResponse["errorMessages"].join('<br>')+"<br>";
            li.appendChild(div);
        }
        //li.innerHTML="<b>Errori: </b>"+arrayResponse.errorMessages.length+"<button id='buttonErroriImportazione' onclick='showDettagliErroriImportazione()'>Dettagli</button><div id='containerErroriImportazione'>"+arrayResponse["errorMessages"].join('<br>')+"</div>";
        ul.appendChild(li);
        var li=document.createElement("li");
        li.innerHTML="<b>Tempo impiegato</b>"+arrayResponse["time_elapsed_secs"];
        ul.appendChild(li);
        Swal.fire
        ({
            icon:"success",
            title: "Importazione completata ("+databases.join(',')+")",
            html:ul.outerHTML,
            onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
        });
        logImortazione("ok");
    } catch (error) {
        Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
        console.log(error);
        console.log(response);
        logImortazione("error");
    }
}
function showDettagliErroriImportazione()
{
    $("#containerErroriImportazione").show("fast","swing");
}
function logImortazione(risultato)
{
    var JSONdatabases=JSON.stringify(databases);
    $.post("inserisciLogImortazione.php",
    {
        risultato,
        JSONdatabases
    },
    function(response, status)
    {
        if(status=="success")
        {
            getElencoLogImportazioni();
        }
        else
            resolve("error");
    });
}
function checkOption(option)
{
    var checked=option.getAttribute("checked")=="true";
    var checkbox=option.getElementsByClassName("custom-select-checkbox")[0];
    if(checked)
    {
        checkbox.setAttribute("class","custom-select-item custom-select-checkbox fal fa-square");
        option.setAttribute("checked","false");
    }
    else
    {
        checkbox.setAttribute("class","custom-select-item custom-select-checkbox fad fa-check-square");
        option.setAttribute("checked","true");
    }
}
function getPopupScegliDatabase(button)
{
    closePopupScegliDatabase();

    if(document.getElementById("selectScegliDatabase")==null)
    {
        var selectOuterContainer=document.createElement("div");
        selectOuterContainer.setAttribute("class","custom-select-outer-container");
        selectOuterContainer.setAttribute("id","selectScegliDatabase");

        document.body.appendChild(selectOuterContainer);

        databases=["Beb","Grimaldi","po00","Spareti","newpan"];

        databases.forEach(function(database)
        {
            var option=document.createElement("button");
            option.setAttribute("class","custom-select-item custom-select-option");
            option.setAttribute("value",database);
            option.setAttribute("checked","false");
            option.setAttribute("onclick","checkOption(this,'"+database+"')");

            var checkbox=document.createElement("i");
            checkbox.setAttribute("class","custom-select-item custom-select-checkbox fal fa-square");
            checkbox.setAttribute("value",database);
            option.appendChild(checkbox);

            var span=document.createElement("span");
            span.setAttribute("class","custom-select-item custom-select-span");
            span.innerHTML=database;
            option.appendChild(span);

            selectOuterContainer.appendChild(option);
        });
        
        var confirmButton=document.createElement("button");
        confirmButton.setAttribute("class","custom-select-item custom-select-confirm-button");
        confirmButton.setAttribute("onclick","getSelects()");
        var span=document.createElement("span");
        span.setAttribute("class","custom-select-item");
        span.innerHTML="Conferma";
        confirmButton.appendChild(span);
        var i=document.createElement("i");
        i.setAttribute("class","custom-select-item fad fa-check-double");
        confirmButton.appendChild(i);

        selectOuterContainer.appendChild(confirmButton);
    }
    
    var rect = button.getBoundingClientRect();

    var width=button.offsetWidth;
    var buttonHeight=button.offsetHeight;

    var left=rect.left;
    var top=rect.top+buttonHeight;

    $("#selectScegliDatabase").show(100,"swing");
    
    setTimeout(function(){
        $("#selectScegliDatabase").css
        ({
            "left":left+"px",
            "top":top+"px",
            "display":"flex",
            "width":width+"px"
        });
    }, 120);
}
window.addEventListener("click", windowClick, false);
function windowClick(e)
{
    if(e.target.id!="bntImportaSingoloDatabase" && e.target.parentElement.id!="bntImportaSingoloDatabase" && e.target.className.indexOf("custom-select-item")==-1 && e.target.className!="custom-select-outer-container")
    {
        closePopupScegliDatabase();
    }
}
async function getElencoLogImportazioni()
{
    var container=document.getElementById("importaDatiContainer");
    container.innerHTML="";

    var tableTitle=document.createElement("div");
    tableTitle.setAttribute("class","log-importazione-table-title");
    var i=document.createElement("i");
    i.setAttribute("class","fad fa-history");
    tableTitle.appendChild(i);
    var span=document.createElement("span");
    span.innerHTML="Log importazioni";
    tableTitle.appendChild(span);

    container.appendChild(tableTitle);

    var logImportazioni=await getLogImportazioni();

    var headers=
    [
        {
            value:"id_importazione",
            label:"#"
        },
        {
            value:"database",
            label:"Database"
        },
        {
            value:"utente",
            label:"Utente"
        },
        {
            value:"data",
            label:"Data importazione"
        },
        {
            value:"risultato",
            label:"Esito"
        },
    ];
    
    var table=document.createElement("table");
    table.setAttribute("id","logImportazioniTable");

    var thead=document.createElement("thead");
    var tr=document.createElement("tr");
    headers.forEach(function (header)
    {
        var th=document.createElement("th");
        th.setAttribute("class","logImportazioniTableCell"+header.value);
        th.innerHTML=header.label;
        tr.appendChild(th);
    });
    thead.appendChild(tr);
    table.appendChild(thead);

    var tbody=document.createElement("tbody");
    logImportazioni.forEach(function (logImportazione)
    {
        var tr=document.createElement("tr");
        headers.forEach(function (header)
        {
            var td=document.createElement("td");
            td.setAttribute("class","logImportazioniTableCell"+header.value);
            td.innerHTML=logImportazione[header.value];
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    
    container.appendChild(table);

    fixTable();
}
function fixTable()
{
    var tableWidth=document.getElementById("logImportazioniTable").offsetWidth-8;
    var tableColWidth=(20*tableWidth)/100;

    var tbodyHeight=document.getElementById("logImportazioniTable").offsetHeight-25;
    $("#logImportazioniTable tbody").css({"max-height":tbodyHeight+"px"});
    
    $("#logImportazioniTable th").css({"width":tableColWidth+"px"});
    $("#logImportazioniTable td").css({"width":tableColWidth+"px"});
}
function getLogImportazioni()
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getLogImportazioni.php",
        function(response, status)
        {
            if(status=="success")
            {
                try {
                    resolve(JSON.parse(response));
                } catch (error) {
                    Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                    console.log(response);
                    resolve([]);
                }
            }
            else
            {
                Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                console.log(response);
                resolve([]);
            }
        });
    });
}