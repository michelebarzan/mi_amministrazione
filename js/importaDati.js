var databases;
var tabelleCheckboxesAggiornaAnagrafiche=[];
var errorMessages=[];
var hot;
var hot3;
var view;

window.addEventListener("load", async function(event)
{
    /*Swal.fire
    ({
        title: "Controllo accesso esclusivo...",
        html: '<i style="color:4C91CB" class="fad fa-spinner-third fa-spin fa-4x"></i>',
        showConfirmButton:false,
        showCloseButton:false,
        allowEscapeKey:false,
        allowOutsideClick:false,
        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
    });*/
	Swal.fire
    ({
        title: "Controllo accesso esclusivo...",
        html: '<i style="color:white" class="fad fa-spinner-third fa-spin fa-4x"></i>',
		background:"transparent",
        showConfirmButton:false,
        showCloseButton:false,
        allowEscapeKey:false,
        allowOutsideClick:false,
        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="white";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
    });
	
    var check=await checkAccessoEsclusivoImportaDati();
    setTimeout(function()
    {
        if(!check)
        {
            Swal.close();
            getElencoLogImportazioni();
            insertAccessoEsclusivoImportaDati();
        }
        else
        {
            Swal.fire
            ({
                icon: 'warning',
                title: check+' sta usando la pagina',
                width:550,
                showCancelButton: true,
                showConfirmButton: true,
                cancelButtonText: `Procedi comunque (non consigliato)`,
                confirmButtonText: `Riprova`,
                onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-confirm")[0].style.fontSize="14px";document.getElementsByClassName("swal2-cancel")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
            }).then((result) =>
            {
                if (result.value)
                {
                    Swal.fire
                    ({
                        title: "Controllo accesso esclusivo...",
                        html: '<i style="color:4C91CB" class="fad fa-spinner-third fa-spin fa-4x"></i>',
                        showConfirmButton:false,
                        showCloseButton:false,
                        allowEscapeKey:false,
                        allowOutsideClick:false,
                        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
                    });
                    location.reload();
                }
                else
                {
                    deleteAccessoEsclusivoImportaDati();
                    insertAccessoEsclusivoImportaDati();
                    Swal.close();
                    getElencoLogImportazioni();
                }
            })
        }
    }, 1500);
});
window.onbeforeunload = function() 
{
	deleteAccessoEsclusivoImportaDati();
};
function insertAccessoEsclusivoImportaDati()
{
    $.post("insertAccessoEsclusivoImportaDati.php",
    function(response, status)
    {
        if(status=="success")
        {
            //console.log(response);
        }
    });
}
function deleteAccessoEsclusivoImportaDati()
{
    $.post("deleteAccessoEsclusivoImportaDati.php",
    function(response, status)
    {
        if(status=="success")
        {
            //console.log(response);
        }
    });
}
function checkAccessoEsclusivoImportaDati()
{
    return new Promise(function (resolve, reject) 
    {
        $.get("checkAccessoEsclusivoImportaDati.php",
        function(response, status)
        {
            if(status=="success")
            {
                resolve(JSON.parse(response));
            }
            else
                resolve("error");
        });
    });
}
async function importaTutto(button)
{
    //button.disabled=true;
    var icon=button.getElementsByTagName("i")[0];
    icon.className="fad fa-spinner-third fa-spin";

    databases=["BeB","grimaldi","po00","spareti","NEWPAN"];

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
    $("#selectScegliDatabase").hide(50,"swing");
}
/*async function getSelectsScegliDatabase()
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
}*/
async function getSelectsScegliDatabase()
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
        databases=selected;

        var outerContainer=document.createElement("div");
        outerContainer.setAttribute("class","importazione-mi-bd-tecnico-outer-container");
        outerContainer.setAttribute("id","importazioneMiDdTecnicoOuterContainer");

        Swal.fire
        ({
            title: "Importazione database ("+databases.join(',')+")",
            width: 550,
            position:"top",
            //html: '<i style="color:4C91CB" class="fad fa-spinner-third fa-spin fa-4x"></i>',
            html:outerContainer.outerHTML,
            showConfirmButton:false,
            showCloseButton:false,
            allowEscapeKey:false,
            allowOutsideClick:false,
            onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="black";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
        });

        var tot_rows=0;
        var tot_time_elapsed_secs=0;

        var row=document.createElement("div");
        row.setAttribute("class","importazione-mi-bd-tecnico-row");
        row.setAttribute("id","result_row_aggiornamenti");

        var span=document.createElement("span");
        span.setAttribute("style","color:black;font-weight: bold;");
        span.innerHTML="Aggiornamenti";
        row.appendChild(span);

        var span=document.createElement("span");
        span.setAttribute("style","margin-left:auto");
        span.setAttribute("id","result_span_aggiornamenti");
        span.innerHTML='<i style="color:#4C91CB;font-size:14px" class="fad fa-spinner-third fa-spin"></i>';
        row.appendChild(span);

        document.getElementById("importazioneMiDdTecnicoOuterContainer").appendChild(row);document.getElementById("importazioneMiDdTecnicoOuterContainer").scrollTop = document.getElementById("importazioneMiDdTecnicoOuterContainer").scrollHeight;

        var response=await aggiornamentiTabelleTxt(databases);
        console.log(response);

        if(response.result=="ok")
            document.getElementById("result_span_aggiornamenti").innerHTML='<i style="color:#70B085;font-size:14px" class="fad fa-check-circle"></i>';
        else
            document.getElementById("result_span_aggiornamenti").innerHTML='<i style="color:#d43f3a;font-size:14px" class="fad fa-times-circle"></i>';
        document.getElementById("result_span_aggiornamenti").style.marginLeft="5px";

        var span=document.createElement("span");
        span.setAttribute("style","margin-left:auto;font-size:12px");
        span.innerHTML="<b>"+response.time_elapsed_secs+"</b> secondi";
        document.getElementById("result_row_aggiornamenti").insertBefore(span,document.getElementById("result_span_aggiornamenti"));

        tot_time_elapsed_secs+=parseFloat(response.time_elapsed_secs);
        errorMessages=[];

        var tabelle=['doghe','doghelm','doghelr','dogherf','doghex','pannellis','pesicab','soffitti','tabcolli','travinf','travsup','cabine','cabkit','kit','kitpan','pannelli','DIBpaS','pannellil','DIBpan','sviluppi','dibsvi','cesoiati','DIBces','mater','DIBldr','tabrinf','DIBrin','rinfpiede','DIBrinp','lanacer','DIBlcr','corridoi','dibcor','carrelli','dibcar','DIBlams','DIBldrs','DIBrind','DIBtri','DIBtrs','cab_colli','cabsof','dibdog','cavallotti'];

        var result="ok";
        for (let index = 0; index < tabelle.length; index++)
        {
            const tabella = tabelle[index];

            var row=document.createElement("div");
            row.setAttribute("class","importazione-mi-bd-tecnico-row");
            row.setAttribute("id","result_row_"+tabella);

            var span=document.createElement("span");
            span.setAttribute("style","color:black;font-weight: bold;");
            span.innerHTML=tabella;
            row.appendChild(span);

            var span=document.createElement("span");
            span.setAttribute("style","margin-left:auto");
            span.setAttribute("id","result_span_"+tabella);
            span.innerHTML='<i style="color:#4C91CB;font-size:14px" class="fad fa-spinner-third fa-spin"></i>';
            row.appendChild(span);

            document.getElementById("importazioneMiDdTecnicoOuterContainer").appendChild(row);document.getElementById("importazioneMiDdTecnicoOuterContainer").scrollTop = document.getElementById("importazioneMiDdTecnicoOuterContainer").scrollHeight;

            var response=await importaTabellaTxt(tabella,databases);
            console.log(response);
            if(response.length==0 || response.result=="error")
            {
                document.getElementById("result_span_"+tabella).innerHTML='<i style="color:#d43f3a;font-size:14px" class="fad fa-times-circle"></i>';
                document.getElementById("result_span_"+tabella).style.marginLeft="5px";

                var span=document.createElement("span");
                span.setAttribute("style","margin-left:auto;font-size:12px");
                span.innerHTML="<b>0</b> righe inserite";
                document.getElementById("result_row_"+tabella).insertBefore(span,document.getElementById("result_span_"+tabella));
            }
            else
            {
                if(response.errorMessages.length>0)
                    errorMessages.push(response.errorMessages);

                if(response.result=="ok")
                    document.getElementById("result_span_"+tabella).innerHTML='<i style="color:#70B085;font-size:14px" class="fad fa-check-circle"></i>';
                else
                    document.getElementById("result_span_"+tabella).innerHTML='<i style="color:#d43f3a;font-size:14px" class="fad fa-times-circle"></i>';
                document.getElementById("result_span_"+tabella).style.marginLeft="5px";

                var span=document.createElement("span");
                span.setAttribute("style","margin-left:auto;font-size:12px");
                span.innerHTML="<b>"+response.rows+"</b> righe inserite in <b>"+response.time_elapsed_secs+"</b> secondi";
                document.getElementById("result_row_"+tabella).insertBefore(span,document.getElementById("result_span_"+tabella));

                tot_rows+=response.rows;
                tot_time_elapsed_secs+=parseFloat(response.time_elapsed_secs);
            }
        }

        tot_time_elapsed_secs=tot_time_elapsed_secs.toFixed(2);

        var row=document.createElement("div");
        row.setAttribute("class","importazione-mi-bd-tecnico-row");
        row.setAttribute("id","result_row_operazioni_finali");

        var span=document.createElement("span");
        span.setAttribute("style","color:black;font-weight: bold;");
        span.setAttribute("id","result_text_operazioni_finali");
        row.appendChild(span);

        var span=document.createElement("span");
        span.setAttribute("style","margin-left:auto");
        span.setAttribute("id","result_span_operazioni_finali");
        row.appendChild(span);

        document.getElementById("importazioneMiDdTecnicoOuterContainer").appendChild(row);document.getElementById("importazioneMiDdTecnicoOuterContainer").scrollTop = document.getElementById("importazioneMiDdTecnicoOuterContainer").scrollHeight;

        document.getElementById("result_span_operazioni_finali").innerHTML='<i style="color:#70B085;font-size:14px" class="fad fa-check-circle"></i>';
        document.getElementById("result_span_operazioni_finali").style.marginLeft="5px";

        document.getElementById("result_text_operazioni_finali").innerHTML="Esito";

        var span=document.createElement("span");
        span.setAttribute("style","margin-left:auto;font-size:12px;color#4C91CB");
        span.innerHTML="<b>"+tot_rows+"</b> righe inserite in <b>"+tot_time_elapsed_secs+"</b> secondi";
        document.getElementById("result_row_operazioni_finali").insertBefore(span,document.getElementById("result_span_operazioni_finali"));

        //console.log(errorMessages);

        var row=document.createElement("div");
        row.setAttribute("class","importazione-mi-bd-tecnico-row");
        row.setAttribute("id","result_row_error_messages");

        var span=document.createElement("span");
        span.setAttribute("style","margin-left:auto");
        span.setAttribute("id","result_span_error_messages");
        row.appendChild(span);

        document.getElementById("importazioneMiDdTecnicoOuterContainer").appendChild(row);document.getElementById("importazioneMiDdTecnicoOuterContainer").scrollTop = document.getElementById("importazioneMiDdTecnicoOuterContainer").scrollHeight;

        if(errorMessages.length==0)
                document.getElementById("result_span_error_messages").innerHTML='<i style="color:#70B085;font-size:14px" class="fad fa-check-circle"></i>';
            else
                document.getElementById("result_span_error_messages").innerHTML='<i style="color:#d43f3a;font-size:14px" class="fad fa-times-circle"></i>';
            document.getElementById("result_span_error_messages").style.marginLeft="5px";

        var span=document.createElement("span");
        span.setAttribute("style","margin-left:auto;font-size:12px;color#4C91CB;text-decoration:underline;cursor:pointer");
        span.setAttribute("title","Visualizza errori");
        span.setAttribute("onclick","alertErrorMessages()");
        span.innerHTML="Errori in <b>"+errorMessages.length+"</b> tabelle";
        document.getElementById("result_row_error_messages").insertBefore(span,document.getElementById("result_span_error_messages"));

        var button=document.createElement("button");
        button.setAttribute("id","btnImportazioneMiDdTecnico");
        button.setAttribute("onclick","Swal.close()");
        button.innerHTML='<span>Chiudi</span>';

        document.getElementById("importazioneMiDdTecnicoOuterContainer").appendChild(button);document.getElementById("importazioneMiDdTecnicoOuterContainer").scrollTop = document.getElementById("importazioneMiDdTecnicoOuterContainer").scrollHeight;

        var JSONdatabases=JSON.stringify(databases);
        $.post("inserisciLogImortazione.php",
        {
            risultato:result,
            JSONdatabases
        },
        function(response, status)
        {
            if(status=="success")
            {
                getElencoLogImportazioni();
            }
        });
    }
}
function alertErrorMessages()
{
    var errorMessagesArray=[];
    errorMessages.forEach(errorMessagesElement =>
    {
        errorMessagesElement.forEach(errorMessage =>
        {
            errorMessagesArray.push(errorMessage);
        });
    });

    var ul=document.createElement("ul");
    ul.setAttribute("style","text-align:left");

    var li=document.createElement("li");

    var b=document.createElement("b");
    b.innerHTML="Errori: "+errorMessagesArray.length;
    li.appendChild(b);

    var div=document.createElement("div");
    div.setAttribute("id","containerErroriImportazione");
    div.setAttribute("style","display:block");
    div.innerHTML="<br>"+errorMessagesArray.join('<br>')+"<br>";
    li.appendChild(div);

    ul.appendChild(li);

    Swal.fire
    ({
        icon:"warning",
        title: "Errori importazione ("+databases.join(',')+")",
        html:ul.outerHTML,
        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
    });
}
function aggiornamentiTabelleTxt(databases)
{
    return new Promise(function (resolve, reject) 
    {
        var JSONdatabases=JSON.stringify(databases);
        $.post("aggiornamentiTabelleTxt.php",
        {
            JSONdatabases
        },
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
function getTabelleImportazioneTxt()
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getTabelleImportazioneTxt.php",
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
function importaTabellaTxt(tabella,databases)
{
    return new Promise(function (resolve, reject) 
    {
        var JSONdatabases=JSON.stringify(databases);
        $.post("importaTabellaTxt.php",
        {
            tabella,
            JSONdatabases
        },
        function(response, status)
        {
            if(status=="success")
            {
                try {
                    resolve(JSON.parse(response));
                } catch (error) {
                    //Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                    console.log(response);
                    resolve([]);
                }
            }
            else
            {
                //Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                console.log(response);
                resolve([]);
            }
        });
    });
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
function checkOptionScegliDatabase(option)
{
    var options=document.getElementsByClassName("custom-select-option");
    for (let index = 0; index < options.length; index++)
    {
        var element = options[index];
        var checkbox_element=element.getElementsByClassName("custom-select-checkbox")[0];
        checkbox_element.setAttribute("class","custom-select-item custom-select-checkbox fal fa-square");
        element.setAttribute("checked","false");
    }

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
            option.setAttribute("onclick","checkOptionScegliDatabase(this,'"+database+"')");

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
        confirmButton.setAttribute("onclick","getSelectsScegliDatabase()");
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

    $("#selectScegliDatabase").show(50,"swing");
    
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
    try
    {
        if(e.target.id!="bntImportaSingoloDatabase" && e.target.parentElement.id!="bntImportaSingoloDatabase" && e.target.className.indexOf("custom-select-item")==-1 && e.target.className!="custom-select-outer-container")
            closePopupScegliDatabase();
        if(e.target.id!="bntAggiornaAnagrafiche" && e.target.parentElement.id!="bntAggiornaAnagrafiche" && e.target.className.indexOf("custom-select-item")==-1 && e.target.className!="custom-select-outer-container")
            closePopupAggiornaAnagrafiche();
        if(e.target.id!="bntSvuotaDistinte" && e.target.parentElement.id!="bntSvuotaDistinte" && e.target.className.indexOf("custom-select-item")==-1 && e.target.className!="custom-select-outer-container")
            closePopupSvuotaDistinte();
    }
    catch (error) {}
}
function closePopupAggiornaAnagrafiche()
{
    $("#selectAggiornaAnagrafiche").hide(50,"swing");
}
function closePopupSvuotaDistinte()
{
    $("#selectSvuotaDistinte").hide(50,"swing");
}
async function getElencoLogImportazioni()
{
    try {hot.destroy();} catch (error) {}

    document.getElementById("importaDatiContainer").style.overflowY="";

    var button=document.getElementById("bntLogImportazioni");
    button.getElementsByTagName("span")[0].style.color="#4C91CB";
    button.getElementsByTagName("i")[0].style.color="#4C91CB";

    document.getElementById("bntMateriePrime").getElementsByTagName("span")[0].style.color="";
    document.getElementById("bntMateriePrime").getElementsByTagName("i")[0].style.color="";

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

    /*var button=document.createElement("button");
    button.setAttribute("class","");
    button.setAttribute("onclick","");
    button.innerHTML='<span>Log importazioni</span>';
    tableTitle.appendChild(button);

    var button=document.createElement("button");
    button.setAttribute("class","");
    button.setAttribute("onclick","");
    button.innerHTML='<span>Log importazioni</span>';
    tableTitle.appendChild(button);*/

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
    try {
        var tableWidth=document.getElementById("logImportazioniTable").offsetWidth-8;
        var tableColWidth=(20*tableWidth)/100;

        var tbodyHeight=document.getElementById("logImportazioniTable").offsetHeight-25;
        $("#logImportazioniTable tbody").css({"max-height":tbodyHeight+"px"});
        
        $("#logImportazioniTable th").css({"width":tableColWidth+"px"});
        $("#logImportazioniTable td").css({"width":tableColWidth+"px"});
    } catch (error) {}
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
function toggleCheckboxSvuotaDistinte(checked)
{
    var checkboxes=document.getElementsByClassName("importazione-mi-bd-tecnico-checkbox-svuota-distinte");
    for (let index = 0; index < checkboxes.length; index++)
    {
        const checkbox = checkboxes[index];
        checkbox.checked=checked;
        if(checked)
            checkbox.parentElement.style.display="flex";
        else
            checkbox.parentElement.style.display="none";
    }
}
function toggleCheckboxAggiornaAnagrafiche(checked)
{
    var checkboxes=document.getElementsByClassName("importazione-mi-bd-tecnico-checkbox-aggiorna-anagrafiche");
    for (let index = 0; index < checkboxes.length; index++)
    {
        const checkbox = checkboxes[index];
        checkbox.checked=checked;
        if(checked)
            checkbox.parentElement.style.display="flex";
        else
            checkbox.parentElement.style.display="none";
    }
}
async function getPopupImportaDatabase(btn)
{
	Swal.fire
    ({
        title: "Caricamento in corso...",
        html: '<i style="color:white" class="fad fa-spinner-third fa-spin fa-4x"></i>',
		background:"transparent",
        showConfirmButton:false,
        showCloseButton:false,
        allowEscapeKey:false,
        allowOutsideClick:false,
        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="white";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
    });
	
    var distinte=['materie_prime_pannelli','materie_prime_cabine','materie_prime_kit','materie_prime_sottoinsiemi_corridoi','lane_pannelli','traversine_inferiori_kit','traversine_superiori_kit','rinforzi_piede_pannelli','rinforzi_pannelli','rinforzi_kit','lane_ceramiche_kit','pannelli_cabine','cavallotti','kit_sottoinsiemi_corridoi','kit_cabine','cabine_carrelli','pannelli_kit','lavorazioni_lamiere','lavorazioni_lana','lavorazioni_sviluppi'];
    var anagrafiche=["carrelli","sottoinsiemi_corridoi","cabine","kit","pannelli","rinforzi_piede","lamiere","sviluppi","traversine_superiori","lane_ceramiche","traversine_inferiori","rinforzi","lane","cesoiati"];

    var outerContainer=document.createElement("div");
    outerContainer.setAttribute("class","importazione-mi-bd-tecnico-outer-container");
    outerContainer.setAttribute("style","border:none");

    var row=document.createElement("div");
    row.setAttribute("class","importazione-mi-bd-tecnico-row");
    row.setAttribute("style","margin-left:-20px;margin-right:-20px;background-color:#ddd;width:calc(100% + 40px);border:none;padding-left:30px;padding-right:30px;");

    var span=document.createElement("span");
    span.setAttribute("style","color:black;font-weight: bold;text-decoration:underline");
    span.innerHTML="Svuota distinte";
    row.appendChild(span);

    var checkbox=document.createElement("input");
    checkbox.setAttribute("style","margin-left:auto");
    checkbox.setAttribute("onchange","toggleCheckboxSvuotaDistinte(this.checked)");
    checkbox.setAttribute("type","checkbox");
    checkbox.setAttribute("checked","checked");
    row.appendChild(checkbox);

    outerContainer.appendChild(row);

    for (let index = 0; index < distinte.length; index++)
    {
        const distinta = distinte[index];
        
        var row=document.createElement("div");
        row.setAttribute("class","importazione-mi-bd-tecnico-row");
        if(index==0)
            row.setAttribute("style","border-top: 1px solid #ddd;margin-top:20px");

        if(index == distinte.length - 1)
            row.setAttribute("style","margin-bottom:20px");
        
        var checkbox=document.createElement("input");
        checkbox.setAttribute("style","margin-right:10px");
        checkbox.setAttribute("class","importazione-mi-bd-tecnico-checkbox-svuota-distinte");
        checkbox.setAttribute("type","checkbox");
        checkbox.setAttribute("distinta",distinta);
        checkbox.setAttribute("onchange","setCookie('checked_"+distinta+"',this.checked.toString())");

        var checked=await getCookie("checked_"+distinta);
        if(checked=="true")
            checkbox.setAttribute("checked","checked");

        row.appendChild(checkbox);

        var span=document.createElement("span");
        span.setAttribute("style","color:black;font-weight: bold;");
        span.innerHTML=distinta;
        row.appendChild(span);

        outerContainer.appendChild(row);
    }

    var row=document.createElement("div");
    row.setAttribute("class","importazione-mi-bd-tecnico-row");
    row.setAttribute("style","margin-left:-20px;margin-right:-20px;background-color:#ddd;width:calc(100% + 40px);border:none;padding-left:30px;padding-right:30px;");

    var span=document.createElement("span");
    span.setAttribute("style","color:black;font-weight: bold;text-decoration:underline");
    span.innerHTML="Aggiorna anagrafiche";
    row.appendChild(span);

    var checkbox=document.createElement("input");
    checkbox.setAttribute("style","margin-left:auto");
    checkbox.setAttribute("onchange","toggleCheckboxAggiornaAnagrafiche(this.checked)");
    checkbox.setAttribute("type","checkbox");
    checkbox.setAttribute("checked","checked");
    row.appendChild(checkbox);

    outerContainer.appendChild(row);

    for (let index = 0; index < anagrafiche.length; index++)
    {
        const anagrafica = anagrafiche[index];
        
        var row=document.createElement("div");
        row.setAttribute("class","importazione-mi-bd-tecnico-row");
        if(index==0)
            row.setAttribute("style","border-top: 1px solid #ddd;margin-top:20px");
        
        var checkbox=document.createElement("input");
        checkbox.setAttribute("style","margin-right:10px");
        checkbox.setAttribute("class","importazione-mi-bd-tecnico-checkbox-aggiorna-anagrafiche");
        checkbox.setAttribute("type","checkbox");
        checkbox.setAttribute("anagrafica",anagrafica);
        checkbox.setAttribute("onchange","setCookie('checked_"+anagrafica+"',this.checked.toString())");

        var checked=await getCookie("checked_"+anagrafica);
        if(checked=="true")
            checkbox.setAttribute("checked","checked");

        row.appendChild(checkbox);

        var span=document.createElement("span");
        span.setAttribute("style","color:black;font-weight: bold;");
        span.innerHTML=anagrafica;
        row.appendChild(span);

        outerContainer.appendChild(row);
    }

    var button=document.createElement("button");
    button.setAttribute("id","btnImportazioneMiDdTecnico");
    button.setAttribute("onclick","checkSvuotaDistinte()"); 
    button.innerHTML='<span>Conferma</span>';
    outerContainer.appendChild(button);

    Swal.fire
    ({
        title: "Importazione database",
        width: 550,
        position:"top",
        //html: '<i style="color:4C91CB" class="fad fa-spinner-third fa-spin fa-4x"></i>',
        html:outerContainer.outerHTML,
        showConfirmButton:false,
        showCloseButton:true,
        allowEscapeKey:false,
        allowOutsideClick:false,
        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="black";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
    });
}
function checkSvuotaDistinte()
{
    var checkboxesAggiornaAnagrafiche=document.getElementsByClassName("importazione-mi-bd-tecnico-checkbox-aggiorna-anagrafiche");
    for (let index = 0; index < checkboxesAggiornaAnagrafiche.length; index++)
    {
        const checkbox = checkboxesAggiornaAnagrafiche[index];
        if(checkbox.checked)
        {
            tabelleCheckboxesAggiornaAnagrafiche.push(checkbox.getAttribute("anagrafica"));
        }
    }

    var svuota_distinte=false;
    var tabelle=[];

    var checkboxes=document.getElementsByClassName("importazione-mi-bd-tecnico-checkbox-svuota-distinte");
    for (let index = 0; index < checkboxes.length; index++)
    {
        const checkbox = checkboxes[index];
        if(checkbox.checked)
        {
            svuota_distinte=true;
            tabelle.push(checkbox.getAttribute("distinta"));
        }
    }
    if(svuota_distinte)
        svuotaDistinte(tabelle,true);
    else
        checkAggiornaAnagrafiche();
}
function checkAggiornaAnagrafiche()
{
    var aggiorna_anagrafiche=false;
    var tabelle=tabelleCheckboxesAggiornaAnagrafiche;
    if(tabelle.length>0)
        aggiorna_anagrafiche=true;

    console.log(tabelle);
    console.log(aggiorna_anagrafiche);
    if(aggiorna_anagrafiche)
        aggiornaAnagrafiche(tabelle,true);
    else
        importaDatabase();
}
async function importaDatabase()
{
    var outerContainer=document.createElement("div");
    outerContainer.setAttribute("class","importazione-mi-bd-tecnico-outer-container");
    outerContainer.setAttribute("id","importazioneMiDdTecnicoOuterContainer");

    Swal.fire
    ({
        title: "Importazione database",
        width: 550,
        position:"top",
        //html: '<i style="color:4C91CB" class="fad fa-spinner-third fa-spin fa-4x"></i>',
        html:outerContainer.outerHTML,
        showConfirmButton:false,
        showCloseButton:false,
        allowEscapeKey:false,
        allowOutsideClick:false,
        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="black";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
    });

    var tabelle=await getTabelleMiDbTecnico();
    var tot_rows=0;
    var tot_time_elapsed_secs=0;

    for (let index = 0; index < tabelle.length; index++)
    {
        const tabella = tabelle[index];

        var row=document.createElement("div");
        row.setAttribute("class","importazione-mi-bd-tecnico-row");
        row.setAttribute("id","result_row_"+tabella);

        var span=document.createElement("span");
        span.setAttribute("style","color:black;font-weight: bold;");
        span.innerHTML=tabella;
        row.appendChild(span);

        var span=document.createElement("span");
        span.setAttribute("style","margin-left:auto");
        span.setAttribute("id","result_span_"+tabella);
        span.innerHTML='<i style="color:#4C91CB;font-size:14px" class="fad fa-spinner-third fa-spin"></i>';
        row.appendChild(span);

        document.getElementById("importazioneMiDdTecnicoOuterContainer").appendChild(row);document.getElementById("importazioneMiDdTecnicoOuterContainer").scrollTop = document.getElementById("importazioneMiDdTecnicoOuterContainer").scrollHeight;

        var response=await importaTabella(tabella);
        console.log(response);

        if(response.result=="ok")
            document.getElementById("result_span_"+tabella).innerHTML='<i style="color:#70B085;font-size:14px" class="fad fa-check-circle"></i>';
        else
            document.getElementById("result_span_"+tabella).innerHTML='<i style="color:#d43f3a;font-size:14px" class="fad fa-times-circle"></i>';
        document.getElementById("result_span_"+tabella).style.marginLeft="5px";

        var span=document.createElement("span");
        span.setAttribute("style","margin-left:auto;font-size:12px");
        span.innerHTML="<b>"+response.rows+"</b> righe inserite in <b>"+response.time_elapsed_secs+"</b> secondi";
        document.getElementById("result_row_"+tabella).insertBefore(span,document.getElementById("result_span_"+tabella));

        tot_rows+=response.rows;
        tot_time_elapsed_secs+=parseFloat(response.time_elapsed_secs);
    }

    tot_time_elapsed_secs=tot_time_elapsed_secs.toFixed(2);

    var row=document.createElement("div");
    row.setAttribute("class","importazione-mi-bd-tecnico-row");
    row.setAttribute("id","result_row_operazioni_finali");

    var span=document.createElement("span");
    span.setAttribute("style","color:black;font-weight: bold;");
    span.setAttribute("id","result_text_operazioni_finali");
    span.innerHTML="Operazioni finali";
    row.appendChild(span);

    var span=document.createElement("span");
    span.setAttribute("style","margin-left:auto");
    span.setAttribute("id","result_span_operazioni_finali");
    span.innerHTML='<i style="color:#4C91CB;font-size:14px" class="fad fa-spinner-third fa-spin"></i>';
    row.appendChild(span);

    document.getElementById("importazioneMiDdTecnicoOuterContainer").appendChild(row);document.getElementById("importazioneMiDdTecnicoOuterContainer").scrollTop = document.getElementById("importazioneMiDdTecnicoOuterContainer").scrollHeight;

    var response=await cleanColonnaImportazione();
    console.log(response);

    document.getElementById("result_span_operazioni_finali").innerHTML='<i style="color:#70B085;font-size:14px" class="fad fa-check-circle"></i>';
    document.getElementById("result_span_operazioni_finali").style.marginLeft="5px";

    document.getElementById("result_text_operazioni_finali").innerHTML="Esito";

    var span=document.createElement("span");
    span.setAttribute("style","margin-left:auto;font-size:12px;color#4C91CB");
    span.innerHTML="<b>"+tot_rows+"</b> righe inserite in <b>"+tot_time_elapsed_secs+"</b> secondi";
    document.getElementById("result_row_operazioni_finali").insertBefore(span,document.getElementById("result_span_operazioni_finali"));

    var button=document.createElement("button");
    button.setAttribute("id","btnImportazioneMiDdTecnico");
    button.setAttribute("onclick","Swal.close()");
    button.innerHTML='<span>Chiudi</span>';

    document.getElementById("importazioneMiDdTecnicoOuterContainer").appendChild(button);document.getElementById("importazioneMiDdTecnicoOuterContainer").scrollTop = document.getElementById("importazioneMiDdTecnicoOuterContainer").scrollHeight;

    var JSONdatabases=JSON.stringify(["db_tecnico"]);
    $.post("inserisciLogImortazione.php",
    {
        risultato:"ok",
        JSONdatabases
    },
    function(response, status)
    {
        if(status=="success")
        {
            getElencoLogImportazioni();
        }
    });
}
function cleanColonnaImportazione()
{
    return new Promise(function (resolve, reject) 
    {
        $.post("cleanColonnaImportazione.php",
        function(response, status)
        {
            if(status=="success")
            {
                try {
                    resolve(JSON.parse(response));
                } catch (error) {
                    Swal.fire({icon:"error",title: "Errore. Impossibile ripristinare lo stato di importazione. Contatta l'amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                    console.log(response);
                    resolve([]);
                }
            }
            else
            {
                Swal.fire({icon:"error",title: "Errore. Impossibile ripristinare lo stato di importazione. Contatta l'amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                console.log(response);
                resolve([]);
            }
        });
    });
}
function importaTabella(tabella)
{
    return new Promise(function (resolve, reject) 
    {
        $.post("importaTabellaMiDdTecnico.php",
        {
            tabella
        },
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
function getTabelleMiDbTecnico()
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getTabelleMiDbTecnico.php",
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
function getPopupAggiornaAnagrafiche(button)
{
    closePopupAggiornaAnagrafiche();

    if(document.getElementById("selectAggiornaAnagrafiche")==null)
    {
        var selectOuterContainer=document.createElement("div");
        selectOuterContainer.setAttribute("class","custom-select-outer-container");
        selectOuterContainer.setAttribute("id","selectAggiornaAnagrafiche");

        document.body.appendChild(selectOuterContainer);

        anagrafiche=["carrelli","sottoinsiemi_corridoi","cabine","kit","pannelli","rinforzi_piede","lamiere","sviluppi","traversine_superiori","lane_ceramiche","traversine_inferiori","rinforzi","lane","cesoiati"];

        anagrafiche.forEach(function(anagrafica)
        {
            var option=document.createElement("button");
            option.setAttribute("class","custom-select-item custom-select-option");
            option.setAttribute("value",anagrafica);
            option.setAttribute("checked","false");
            option.setAttribute("onclick","checkOptionAggiornaAnagrafiche(this,'"+anagrafica+"')");

            var checkbox=document.createElement("i");
            checkbox.setAttribute("class","custom-select-item custom-select-checkbox fal fa-square");
            checkbox.setAttribute("value",anagrafica);
            option.appendChild(checkbox);

            var span=document.createElement("span");
            span.setAttribute("class","custom-select-item custom-select-span");
            span.innerHTML=anagrafica;
            option.appendChild(span);

            selectOuterContainer.appendChild(option);
        });
        
        var confirmButton=document.createElement("button");
        confirmButton.setAttribute("class","custom-select-item custom-select-confirm-button");
        confirmButton.setAttribute("onclick","getSelectsAggiornaAnagrafiche()");
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

    $("#selectAggiornaAnagrafiche").show(50,"swing");
    
    setTimeout(function(){
        $("#selectAggiornaAnagrafiche").css
        ({
            "left":left+"px",
            "top":top+"px",
            "display":"flex",
            "width":width+"px"
        });
    }, 120);
}
async function getSelectsAggiornaAnagrafiche()
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

    closePopupAggiornaAnagrafiche();

    if(selected.length==0)
    {
        Swal.fire({icon:"error",title: "Nessuna tabella selezionata",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
    }
    else
    {
        tabelle=selected;
        aggiornaAnagrafiche(tabelle,false);
    }
    
}
async function aggiornaAnagrafiche(tabelle,run_importazione)
{
    var outerContainer=document.createElement("div");
    outerContainer.setAttribute("class","importazione-mi-bd-tecnico-outer-container");
    outerContainer.setAttribute("id","importazioneMiDdTecnicoOuterContainer");

    Swal.fire
    ({
        title: "Aggiornamento anagrafiche",
        width: 550,
        position:"top",
        //html: '<i style="color:4C91CB" class="fad fa-spinner-third fa-spin fa-4x"></i>',
        html:outerContainer.outerHTML,
        showConfirmButton:false,
        showCloseButton:false,
        allowEscapeKey:false,
        allowOutsideClick:false,
        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="black";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
    });

    var tot_rows=0;
    var tot_time_elapsed_secs=0;

    for (let index = 0; index < tabelle.length; index++)
    {
        const tabella = tabelle[index];

        var row=document.createElement("div");
        row.setAttribute("class","importazione-mi-bd-tecnico-row");
        row.setAttribute("id","result_row_"+tabella);

        var span=document.createElement("span");
        span.setAttribute("style","color:black;font-weight: bold;");
        span.innerHTML=tabella;
        row.appendChild(span);

        var span=document.createElement("span");
        span.setAttribute("style","margin-left:auto");
        span.setAttribute("id","result_span_"+tabella);
        span.innerHTML='<i style="color:#4C91CB;font-size:14px" class="fad fa-spinner-third fa-spin"></i>';
        row.appendChild(span);

        document.getElementById("importazioneMiDdTecnicoOuterContainer").appendChild(row);document.getElementById("importazioneMiDdTecnicoOuterContainer").scrollTop = document.getElementById("importazioneMiDdTecnicoOuterContainer").scrollHeight;

        var response=await aggiornaAnagrafica(tabella);
        console.log(response);

        if(response.result=="ok")
            document.getElementById("result_span_"+tabella).innerHTML='<i style="color:#70B085;font-size:14px" class="fad fa-check-circle"></i>';
        else
            document.getElementById("result_span_"+tabella).innerHTML='<i style="color:#d43f3a;font-size:14px" class="fad fa-times-circle"></i>';
        document.getElementById("result_span_"+tabella).style.marginLeft="5px";

        var span=document.createElement("span");
        span.setAttribute("style","margin-left:auto;font-size:12px");
        span.innerHTML="<b>"+response.rows+"</b> righe aggiornate in <b>"+response.time_elapsed_secs+"</b> secondi";
        document.getElementById("result_row_"+tabella).insertBefore(span,document.getElementById("result_span_"+tabella));

        tot_rows+=response.rows;
        tot_time_elapsed_secs+=parseFloat(response.time_elapsed_secs);
    }

    tot_time_elapsed_secs=tot_time_elapsed_secs.toFixed(2);

    var row=document.createElement("div");
    row.setAttribute("class","importazione-mi-bd-tecnico-row");
    row.setAttribute("id","result_row_operazioni_finali");

    var span=document.createElement("span");
    span.setAttribute("style","color:black;font-weight: bold;");
    span.setAttribute("id","result_text_operazioni_finali");
    row.appendChild(span);

    var span=document.createElement("span");
    span.setAttribute("style","margin-left:auto");
    span.setAttribute("id","result_span_operazioni_finali");
    row.appendChild(span);

    document.getElementById("importazioneMiDdTecnicoOuterContainer").appendChild(row);document.getElementById("importazioneMiDdTecnicoOuterContainer").scrollTop = document.getElementById("importazioneMiDdTecnicoOuterContainer").scrollHeight;

    document.getElementById("result_span_operazioni_finali").innerHTML='<i style="color:#70B085;font-size:14px" class="fad fa-check-circle"></i>';
    document.getElementById("result_span_operazioni_finali").style.marginLeft="5px";

    document.getElementById("result_text_operazioni_finali").innerHTML="Esito";

    var span=document.createElement("span");
    span.setAttribute("style","margin-left:auto;font-size:12px;color#4C91CB");
    span.innerHTML="<b>"+tot_rows+"</b> righe aggiornate in <b>"+tot_time_elapsed_secs+"</b> secondi";
    document.getElementById("result_row_operazioni_finali").insertBefore(span,document.getElementById("result_span_operazioni_finali"));

    var button=document.createElement("button");
    button.setAttribute("id","btnImportazioneMiDdTecnico");

    if(run_importazione)
    {
        button.setAttribute("onclick","importaDatabase()");
        button.innerHTML='<span>Prosegui</span>';
    }
    else
    {
        button.setAttribute("onclick","Swal.close()");
        button.innerHTML='<span>Chiudi</span>';
    }

    document.getElementById("importazioneMiDdTecnicoOuterContainer").appendChild(button);document.getElementById("importazioneMiDdTecnicoOuterContainer").scrollTop = document.getElementById("importazioneMiDdTecnicoOuterContainer").scrollHeight;
}
function aggiornaAnagrafica(tabella)
{
    return new Promise(function (resolve, reject) 
    {
        $.post("aggiornaAnagraficaMiDdTecnico.php",
        {
            tabella
        },
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
function checkOptionAggiornaAnagrafiche(option)
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
function getPopupSvuotaDistinte(button)
{
    closePopupSvuotaDistinte();

    if(document.getElementById("selectSvuotaDistinte")==null)
    {
        var selectOuterContainer=document.createElement("div");
        selectOuterContainer.setAttribute("class","custom-select-outer-container");
        selectOuterContainer.setAttribute("id","selectSvuotaDistinte");

        document.body.appendChild(selectOuterContainer);

        var distinte=['materie_prime_pannelli','materie_prime_cabine','materie_prime_kit','materie_prime_sottoinsiemi_corridoi','lane_pannelli','traversine_inferiori_kit','traversine_superiori_kit','rinforzi_piede_pannelli','rinforzi_pannelli','rinforzi_kit','lane_ceramiche_kit','pannelli_cabine','cavallotti','kit_sottoinsiemi_corridoi','kit_cabine','cabine_carrelli','pannelli_kit','lavorazioni_lamiere','lavorazioni_lana','lavorazioni_sviluppi'];

        distinte.forEach(function(distinta)
        {
            var option=document.createElement("button");
            option.setAttribute("class","custom-select-item custom-select-option");
            option.setAttribute("value",distinta);
            option.setAttribute("checked","false");
            option.setAttribute("onclick","checkOptionSvuotaDistinte(this,'"+distinta+"')");

            var checkbox=document.createElement("i");
            checkbox.setAttribute("class","custom-select-item custom-select-checkbox fal fa-square");
            checkbox.setAttribute("value",distinta);
            option.appendChild(checkbox);

            var span=document.createElement("span");
            span.setAttribute("class","custom-select-item custom-select-span");
            span.innerHTML=distinta;
            option.appendChild(span);

            selectOuterContainer.appendChild(option);
        });
        
        var confirmButton=document.createElement("button");
        confirmButton.setAttribute("class","custom-select-item custom-select-confirm-button");
        confirmButton.setAttribute("onclick","getSelectsSvuotaDistinte()");
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

    $("#selectSvuotaDistinte").show(50,"swing");
    
    setTimeout(function(){
        $("#selectSvuotaDistinte").css
        ({
            "left":left+"px",
            "top":top+"px",
            "display":"flex",
            "width":"auto"
        });
    }, 120);
}
async function getSelectsSvuotaDistinte()
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

    closePopupSvuotaDistinte();

    if(selected.length==0)
    {
        Swal.fire({icon:"error",title: "Nessuna tabella selezionata",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
    }
    else
    {
        tabelle=selected;
        svuotaDistinte(tabelle,false);
    }
    
}
async function svuotaDistinte(tabelle,run_importazione)
{
    var outerContainer=document.createElement("div");
    outerContainer.setAttribute("class","importazione-mi-bd-tecnico-outer-container");
    outerContainer.setAttribute("id","importazioneMiDdTecnicoOuterContainer");

    Swal.fire
    ({
        title: "Svuota distinte",
        width: 550,
        position:"top",
        //html: '<i style="color:4C91CB" class="fad fa-spinner-third fa-spin fa-4x"></i>',
        html:outerContainer.outerHTML,
        showConfirmButton:false,
        showCloseButton:false,
        allowEscapeKey:false,
        allowOutsideClick:false,
        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="black";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
    });

    var tot_rows=0;
    var tot_time_elapsed_secs=0;

    var anagrafiche=[];

    for (let index = 0; index < tabelle.length; index++)
    {
        const tabella = tabelle[index];

        //['','','','','','','','','','','','','',''];
        
        if(tabella=="materie_prime_pannelli" || tabella=="rinforzi_piede_pannelli" || tabella=="lane_pannelli" || tabella=="rinforzi_pannelli")
            anagrafiche.push("pannelli");
        if(tabella=="pannelli_cabine" || tabella=="materie_prime_cabine" || tabella=="kit_cabine")
            anagrafiche.push("cabine");
        if(tabella=="materie_prime_kit" || tabella=="traversine_inferiori_kit" || tabella=="rinforzi_kit" || tabella=="traversine_superiori_kit" || tabella=="pannelli_kit" || tabella=="lane_ceramiche_kit")
            anagrafiche.push("kit");
        if(tabella=="materie_prime_sottoinsiemi_corridoi" || tabella=="kit_sottoinsiemi_corridoi")
            anagrafiche.push("sottoinsiemi_corridoi");
        if(tabella=="cabine_carrelli")
            anagrafiche.push("carrelli");

        var row=document.createElement("div");
        row.setAttribute("class","importazione-mi-bd-tecnico-row");
        row.setAttribute("id","result_row_"+tabella);

        var span=document.createElement("span");
        span.setAttribute("style","color:black;font-weight: bold;");
        span.innerHTML=tabella;
        row.appendChild(span);

        var span=document.createElement("span");
        span.setAttribute("style","margin-left:auto");
        span.setAttribute("id","result_span_"+tabella);
        span.innerHTML='<i style="color:#4C91CB;font-size:14px" class="fad fa-spinner-third fa-spin"></i>';
        row.appendChild(span);

        document.getElementById("importazioneMiDdTecnicoOuterContainer").appendChild(row);document.getElementById("importazioneMiDdTecnicoOuterContainer").scrollTop = document.getElementById("importazioneMiDdTecnicoOuterContainer").scrollHeight;

        var response=await svuotaDistinta(tabella);
        console.log(response);

        if(response.result=="ok")
            document.getElementById("result_span_"+tabella).innerHTML='<i style="color:#70B085;font-size:14px" class="fad fa-check-circle"></i>';
        else
            document.getElementById("result_span_"+tabella).innerHTML='<i style="color:#d43f3a;font-size:14px" class="fad fa-times-circle"></i>';
        document.getElementById("result_span_"+tabella).style.marginLeft="5px";

        var span=document.createElement("span");
        span.setAttribute("style","margin-left:auto;font-size:12px");
        span.innerHTML="<b>"+response.rows+"</b> righe eliminate in <b>"+response.time_elapsed_secs+"</b> secondi";
        document.getElementById("result_row_"+tabella).insertBefore(span,document.getElementById("result_span_"+tabella));

        tot_rows+=response.rows;
        tot_time_elapsed_secs+=parseFloat(response.time_elapsed_secs);
    }

    var uniqueAnagrafiche = [];
    $.each(anagrafiche, function(i, el){
        if($.inArray(el, uniqueAnagrafiche) === -1) uniqueAnagrafiche.push(el);
    });
    var response=await updateColonnaImportazione(uniqueAnagrafiche);
    console.log(response);

    tot_time_elapsed_secs=tot_time_elapsed_secs.toFixed(2);

    var row=document.createElement("div");
    row.setAttribute("class","importazione-mi-bd-tecnico-row");
    row.setAttribute("id","result_row_operazioni_finali");

    var span=document.createElement("span");
    span.setAttribute("style","color:black;font-weight: bold;");
    span.setAttribute("id","result_text_operazioni_finali");
    row.appendChild(span);

    var span=document.createElement("span");
    span.setAttribute("style","margin-left:auto");
    span.setAttribute("id","result_span_operazioni_finali");
    row.appendChild(span);

    document.getElementById("importazioneMiDdTecnicoOuterContainer").appendChild(row);document.getElementById("importazioneMiDdTecnicoOuterContainer").scrollTop = document.getElementById("importazioneMiDdTecnicoOuterContainer").scrollHeight;

    document.getElementById("result_span_operazioni_finali").innerHTML='<i style="color:#70B085;font-size:14px" class="fad fa-check-circle"></i>';
    document.getElementById("result_span_operazioni_finali").style.marginLeft="5px";

    document.getElementById("result_text_operazioni_finali").innerHTML="Esito";

    var span=document.createElement("span");
    span.setAttribute("style","margin-left:auto;font-size:12px;color#4C91CB");
    span.innerHTML="<b>"+tot_rows+"</b> righe eliminate in <b>"+tot_time_elapsed_secs+"</b> secondi";
    document.getElementById("result_row_operazioni_finali").insertBefore(span,document.getElementById("result_span_operazioni_finali"));

    var button=document.createElement("button");
    button.setAttribute("id","btnImportazioneMiDdTecnico");

    if(run_importazione)
    {
        button.setAttribute("onclick","checkAggiornaAnagrafiche()");
        button.innerHTML='<span>Prosegui</span>';
    }
    else
    {
        button.setAttribute("onclick","Swal.close()");
        button.innerHTML='<span>Chiudi</span>';
    }

    document.getElementById("importazioneMiDdTecnicoOuterContainer").appendChild(button);document.getElementById("importazioneMiDdTecnicoOuterContainer").scrollTop = document.getElementById("importazioneMiDdTecnicoOuterContainer").scrollHeight;
}
function updateColonnaImportazione(anagrafiche)
{
    return new Promise(function (resolve, reject) 
    {
        var JSONanagrafiche=JSON.stringify(anagrafiche);
        $.post("updateColonnaImportazione.php",
        {
            JSONanagrafiche
        },
        function(response, status)
        {
            if(status=="success")
            {
                resolve(response);
            }
        });
    });
}
function svuotaDistinta(tabella)
{
    return new Promise(function (resolve, reject) 
    {
        $.post("svuotaDistintaMiDdTecnico.php",
        {
            tabella
        },
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
function checkOptionSvuotaDistinte(option)
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
async function getTabellaMateriePrime(button)
{
    view="tabellaMateriePrime";

    document.getElementById("bntLogImportazioni").getElementsByTagName("span")[0].style.color="";
    document.getElementById("bntLogImportazioni").getElementsByTagName("i")[0].style.color="";

    button.getElementsByTagName("span")[0].style.color="#4C91CB";
    button.getElementsByTagName("i")[0].style.color="#4C91CB";

    document.getElementById("importaDatiContainer").style.width="calc(100% - 100px)";
    document.getElementById("importaDatiContainer").style.maxWidth="calc(100% - 100px)";
    document.getElementById("importaDatiContainer").style.minWidth="calc(100% - 100px)";
    document.getElementById("importaDatiContainer").style.padding="0px";
    document.getElementById("importaDatiContainer").style.marginLeft="50px";
    document.getElementById("importaDatiContainer").style.marginRight="50px";

    //document.getElementById("importaDatiContainer").style.paddingRight="15px";

    var container = document.getElementById('importaDatiContainer');
    container.innerHTML="";

    Swal.fire
    ({
        width:"100%",
        background:"transparent",
        title:"Caricamento in corso...",
        html:'<i class="fad fa-spinner-third fa-spin fa-3x" style="color:white"></i>',
        allowOutsideClick:false,
        showCloseButton:false,
        showConfirmButton:false,
        allowEscapeKey:false,
        showCancelButton:false,
        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.fontWeight="bold";document.getElementsByClassName("swal2-title")[0].style.color="white";}
    });

    var materiePrime=await getMateriePrime();

    Swal.close();

    var height=container.offsetHeight;

    if(materiePrime.data.length>0)
    {
		try {hot.destroy();} catch (error) {}

        hot = new Handsontable
        (
            container,
            {
                data: materiePrime.data,
                rowHeaders: true,
                manualColumnResize: true,
                colHeaders: materiePrime.colHeaders,
                className: "htMiddle",
                filters: true,
                dropdownMenu: true,
                headerTooltips: true,
                language: 'it-IT',
                contextMenu: true,
                columnSorting: true,
                width:"100%",
                height,
                columns:materiePrime.columns,
                afterChange: (changes) =>
                {
                    if(changes!=null)
                    {
                        changes.forEach(([row, prop, oldValue, newValue]) =>
                        {
                            if(prop!="id_materia_prima")
                            {
                                var id_materia_prima=hot.getDataAtCell(row, 0);
                                aggiornaRigaMateriePrime(id_materia_prima,prop,newValue,oldValue);
                            }
                        });
                    }
                },
                afterCreateRow: (index,amount,source) =>
                {
                    creaRigaMateriePrime(index);
                },
                beforeRemoveRow: (index,amount,physicalRows,source)  =>
                {
                    for (let i = 0; i < physicalRows.length; i++)
                    {
                        const indice = physicalRows[i];
                        var id_materia_prima=hot.getDataAtCell(indice, 0);
                        eliminaRigaMateriePrime(id_materia_prima);
                    }
                }
            }
        );
        document.getElementById("hot-display-license-info").remove();
        $(".handsontable .changeType").css
        ({
            "background": "#eee",
            "border-radius": "0",
            "border": "none",
            "color": "#404040",
            "font-size": "14px",
            "line-height": "normal",
            "padding": "0px",
            "margin": "0px",
            "float": "right"
        });
    }
}
function aggiornaRigaMateriePrime(id_materia_prima,colonna,valore,oldValue)
{
    $.get("aggiornaRigaMateriePrime.php",{id_materia_prima,colonna,valore,oldValue},
    function(response, status)
    {
        if(status=="success")
        {
            if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
            {
                Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                console.log(response);
            }
        }
    });
}
function creaRigaMateriePrime(index)
{
    $.get("creaRigaMateriePrime.php",
    function(response, status)
    {
        if(status=="success")
        {
            if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
            {
                Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                console.log(response);
            }
            else
                hot.setDataAtCell(index, 0, response);
        }
    });
}
function eliminaRigaMateriePrime(id_materia_prima)
{
    Swal.fire
    ({
        title: "Caricamento in corso...",
        html: '<i style="color:white" class="fad fa-spinner-third fa-spin fa-4x"></i>',
		background:"transparent",
        showConfirmButton:false,
        showCloseButton:false,
        allowEscapeKey:false,
        allowOutsideClick:false,
        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="white";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
    });
    
    $.get("eliminaRigaMateriePrime.php",{id_materia_prima},
    function(response, status)
    {
        if(status=="success")
        {
            Swal.close();
            if(response.toLowerCase().indexOf("vincolo_di_chiave")>-1)
            {
                Swal.fire
                ({
                    icon:"error",
                    title: "Errore. Questa materia prima è gia stata utilizzata e non può essere eliminata",
                    onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}
                }).then((result) =>
                {
                    getTabellaMateriePrime(document.getElementById("bntMateriePrime"));
                });
                console.log(response);
            }
            if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
            {
                Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                console.log(response);
            }
        }
    });
}
function getMateriePrime()
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getMateriePrimeHot.php",
        function(response, status)
        {
            if(status=="success")
            {
                if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                {
                    Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                    console.log(response);
                    resolve([]);
                }
                else
                {
                    try {
                        resolve(JSON.parse(response));
                    } catch (error) {
                        Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                        console.log(response);
                        resolve([]);
                    }
                }
            }
        });
    });
}
function getTable(table,orderBy,orderType)
{
    getEditableTable
    ({
        table,
        primaryKey: "id_materia_prima",
        editable: true,
        container:'importaDatiContainer',
        noFilterColumns:['descrizione','um'],
        orderBy:orderBy,
        orderType:orderType,
        readOnlyColumns:["id_materia_prima"]
    });
}
function editableTableLoad()
{

}
function getPopupSvuotaDatabaseTxt(button)
{
	Swal.fire
	({
		icon: 'warning',
		title: "Vuoi svuotare tutti i database txt?",
		width:550,
		showCancelButton: true,
		showConfirmButton: true,
		cancelButtonText: `Annulla`,
		confirmButtonText: `Elimina`,
		onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-confirm")[0].style.fontSize="14px";document.getElementsByClassName("swal2-cancel")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
	}).then((result) =>
	{
		if (result.value)
		{
			button.disabled=true;
			var icon=button.getElementsByTagName("i")[0];
			icon.className="fad fa-spinner-third fa-spin";

			Swal.fire
			({
				title: "Eliminazione in corso...",
				html: '<i style="color:4C91CB" class="fad fa-spinner-third fa-spin fa-4x"></i>',
				showConfirmButton:false,
				showCloseButton:false,
				allowEscapeKey:false,
				allowOutsideClick:false,
				onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
			});

			$.post("svuotaDatabaseTxt.php",
			function(response, status)
			{
				if(status=="success")
				{
					if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
					{
						Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}});
						console.log(response);
					}
					else
					{
						Swal.fire
						({
							icon:"success",
							showConfirmButton:false,
							showCloseButton:true,
							title: "Database txt svuotati",
							onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
						});
					}
				}
			});

			button.disabled=false;
			icon.className="fad fa-eraser";
		}
	});
}
function getPopupSvuotaDatabaseSql(button)
{
	Swal.fire
	({
		icon: 'warning',
		title: "Vuoi svuotare il database sql?",
		width:550,
		showCancelButton: true,
		showConfirmButton: true,
		cancelButtonText: `Annulla`,
		confirmButtonText: `Elimina`,
		onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-confirm")[0].style.fontSize="14px";document.getElementsByClassName("swal2-cancel")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
	}).then((result) =>
	{
		if (result.value)
		{
			button.disabled=true;
			var icon=button.getElementsByTagName("i")[0];
			icon.className="fad fa-spinner-third fa-spin";

			Swal.fire
			({
				title: "Eliminazione in corso...",
				html: '<i style="color:4C91CB" class="fad fa-spinner-third fa-spin fa-4x"></i>',
				showConfirmButton:false,
				showCloseButton:false,
				allowEscapeKey:false,
				allowOutsideClick:false,
				onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
			});

			$.post("svuotaDatabaseSql.php",
			function(response, status)
			{
				if(status=="success")
				{
					if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
					{
						Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}});
						console.log(response);
					}
					else
					{
						Swal.fire
						({
							icon:"success",
							showConfirmButton:false,
							showCloseButton:true,
							title: "Database sql svuotato",
							onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
						});
					}
				}
			});

			button.disabled=false;
			icon.className="fad fa-eraser";
		}
	});
}
function getPopupRaggruppamenti()
{
    var outerContainer=document.createElement("div");
    outerContainer.setAttribute("id","containerPopupRaggruppamenti");
    outerContainer.setAttribute("style","width:calc(100% - 40px);height:550px;margin-left:20px;margin-right:20px;margin-top:15px");

    outerContainer.innerHTML="<i class='fad fa-spinner-third fa-spin'></i>";

    Swal.fire
    ({
        width:"90%",
        title:"Raggruppamenti materie prime",
        background:"#f1f1f1",
        html:outerContainer.outerHTML,
        allowOutsideClick:false,
        showCloseButton:true,
        showConfirmButton:true,
        allowEscapeKey:false,
        showCancelButton:false,
        onOpen : function()
                {
                    document.getElementsByClassName("swal2-popup")[0].style.padding="0px";
                    document.getElementsByClassName("swal2-header")[0].style.boxSizing="border-box";
                    document.getElementsByClassName("swal2-header")[0].style.paddingLeft="20px";
                    document.getElementsByClassName("swal2-header")[0].style.paddingTop="15px";
                    document.getElementsByClassName("swal2-header")[0].style.display="flex";
                    document.getElementsByClassName("swal2-header")[0].style.alignItems="center";
                    document.getElementsByClassName("swal2-header")[0].style.flexDirection="row";
                    document.getElementsByClassName("swal2-header")[0].style.justifyContent="flex-start";
                    document.getElementsByClassName("swal2-title")[0].style.margin="0px";
                    document.getElementsByClassName("swal2-confirm")[0].style.display="none";
                    document.getElementsByClassName("swal2-content")[0].style.fontFamily="initial";
                    document.getElementsByClassName("swal2-content")[0].style.fontSize="initial";
                    document.getElementsByClassName("swal2-header")[0].style.width="calc(100% - 50px)";

                    var alertSpan=document.createElement("div");
                    alertSpan.setAttribute("style","font-family:'Montserrat',sans-serif;font-size:12px;margin-left:auto;color:red");
                    alertSpan.setAttribute("id","alertSpanRaggruppamentiMateriePrime");
                    document.getElementsByClassName("swal2-header")[0].appendChild(alertSpan);

                    setTimeout(() => {
                        getHotRaggruppamentiMateriePrime();
                    }, 100);
                }
    }).then((result) => 
    {
        if(view=="tabellaMateriePrime")
            getTabellaMateriePrime(document.getElementById("bntMateriePrime"));
    });
}
async function getHotRaggruppamentiMateriePrime()
{
    var container = document.getElementById("containerPopupRaggruppamenti");
    container.innerHTML="";

    var table="raggruppamenti_materie_prime";

    var response=await getHotRaggruppamentiMateriePrimeData(table);

    var height=container.offsetHeight;

    if(response.data.length>0)
    {
		if(hot3!=undefined)
			hot3.destroy();
        hot3 = new Handsontable
        (
            container,
            {
                data: response.data,
                rowHeaders: true,
                manualColumnResize: true,
                colHeaders: response.colHeaders,
                filters: true,
                dropdownMenu: true,
                headerTooltips: true,
                language: 'it-IT',
                contextMenu: true,
                width:"100%",
                columnSorting: true,
                height,
                columns:response.columns,
                afterChange: (changes) =>
                {
                    if(changes!=null)
                    {
                        changes.forEach(([row, prop, oldValue, newValue]) =>
                        {
                            if(prop!=response.primaryKey)
                            {
                                var id=hot3.getDataAtCell(row, 0);
                                aggiornaRigaHotRaggruppamentiMateriePrime(id,prop,newValue,table,response.primaryKey);
                            }
                        });
                    }
                },
                afterCreateRow: (index,amount,source) =>
                {
                    creaRigaHotRaggruppamentiMateriePrime(index,table,response.primaryKey);
                },
                beforeRemoveRow: (index,amount,physicalRows,source)  =>
                {
                    for (let i = 0; i < physicalRows.length; i++)
                    {
                        const indice = physicalRows[i];
                        var id=hot3.getDataAtCell(indice, 0);
                        eliminaRigaHotRaggruppamentiMateriePrime(id,table,response.primaryKey);
                    }
                },
                afterDropdownMenuShow: (dropdownMenu) =>
                {
                    document.getElementsByClassName("htDropdownMenu")[0].style.zIndex="9999";
                },
                afterContextMenuShow: (dropdownMenu) =>
                {
                    document.getElementsByClassName("htContextMenu")[0].style.zIndex="9999";
                }
            }
        );
        document.getElementById("hot-display-license-info").remove();
        $(".handsontable .changeType").css
        ({
            "background": "#eee",
            "border-radius": "0",
            "border": "none",
            "color": "#404040",
            "font-size": "14px",
            "line-height": "normal",
            "padding": "0px",
            "margin": "0px",
            "float": "right"
        });

        if(response.n==1)
            document.getElementById("alertSpanRaggruppamentiMateriePrime").innerHTML="";
        if(response.n>1)
            document.getElementById("alertSpanRaggruppamentiMateriePrime").innerHTML="Può essere utilizzato solo un gruppo per calcolare il progettato in modo alternativo. <b><u>IL PROGRAMMA POTREBBE NON FUNZIONARE CORRETTAMENTE</u></b>";
        if(response.n==0)
            document.getElementById("alertSpanRaggruppamentiMateriePrime").innerHTML="Almeno un gruppo deve essere utilizzato per calcolare il progettato in modo alternativo. <b><u>IL PROGRAMMA POTREBBE NON FUNZIONARE CORRETTAMENTE</u></b>"; 
    }
}
function aggiornaRigaHotRaggruppamentiMateriePrime(id,colonna,valore,table,primaryKey)
{
    $.get("aggiornaRigaHotRaggruppamentiMateriePrime.php",{id,colonna,valore,table,primaryKey},
    function(response, status)
    {
        if(status=="success")
        {
            if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
            {
                Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                console.log(response);
            }
            else
            {
                if(response==1)
                    document.getElementById("alertSpanRaggruppamentiMateriePrime").innerHTML="";
                if(response>1)
                    document.getElementById("alertSpanRaggruppamentiMateriePrime").innerHTML="Può essere utilizzato solo un gruppo per il calcolo del fabbisogno. <b><u>IL PROGRAMMA POTREBBE NON FUNZIONARE CORRETTAMENTE</u></b>";
                if(response==0)
                    document.getElementById("alertSpanRaggruppamentiMateriePrime").innerHTML="Almeno un gruppo deve essere utilizzato per il calcolo del fabbisogno. <b><u>IL PROGRAMMA POTREBBE NON FUNZIONARE CORRETTAMENTE</u></b>"; 
            }
        }
    });
}
function creaRigaHotRaggruppamentiMateriePrime(index,table,primaryKey)
{
    $.get("creaRigaHotRaggruppamentiMateriePrime.php",{table,primaryKey},
    function(response, status)
    {
        if(status=="success")
        {
            if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
            {
                Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                console.log(response);
            }
            else
                hot3.setDataAtCell(index, 0, response);
        }
    });
}
function eliminaRigaHotRaggruppamentiMateriePrime(id,table,primaryKey)
{
    $.get("eliminaRigaHotRaggruppamentiMateriePrime.php",{id,table,primaryKey},
    function(response, status)
    {
        if(status=="success")
        {
            if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
            {
                Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                console.log(response);
            }
        }
    });
}
function getHotRaggruppamentiMateriePrimeData(table)
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getHotRaggruppamentiMateriePrimeData.php",{table},
        function(response, status)
        {
            if(status=="success")
            {
                if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                {
                    Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                    console.log(response);
                    resolve([]);
                }
                else
                {
                    try {
                        resolve(JSON.parse(response));
                    } catch (error) {
                        Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                        console.log(response);
                        resolve([]);
                    }
                }
            }
        });
    });
}
async function getPopupSPPesoQntCabine()
{
    var data=await getDataSPPesoQntCabine();
	Swal.fire
	({
		icon: 'warning',
		title: "Vuoi ricalcolare il peso delle cabine? La procedura può impiegare fino a 10 minuti. Gli utenti collegati portebbero riscontrare problemi",
        html:"Ultimo aggiornamento: <b>"+data+"</b>",
		width:550,
		showCancelButton: true,
		showConfirmButton: true,
		cancelButtonText: `Annulla`,
		confirmButtonText: `Conferma`,
		onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-confirm")[0].style.fontSize="14px";document.getElementsByClassName("swal2-cancel")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
	}).then((result) =>
	{
		if (result.value)
		{
			Swal.fire
			({
				title: "Aggiornamento in corso...",
				html: '<i style="color:4C91CB" class="fad fa-spinner-third fa-spin fa-4x"></i>',
				showConfirmButton:false,
				showCloseButton:false,
				allowEscapeKey:false,
				allowOutsideClick:false,
				onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
			});

			$.post("runSPPesoQntCabine.php",
			function(response, status)
			{
				if(status=="success")
				{
					if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
					{
						Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}});
						console.log(response);
					}
					else
					{
						Swal.fire
						({
							icon:"success",
							showConfirmButton:false,
							showCloseButton:true,
							title: "Peso cabine ricalcolato",
							onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
						});
					}
				}
			});
		}
	});
}
function getDataSPPesoQntCabine()
{
    return new Promise(function (resolve, reject) 
    {
        $.post("getDataSPPesoQntCabine.php",
        function(response, status)
        {
            if(status=="success")
            {
                if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                {
                    Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                    console.log(response);
                    resolve('');
                }
                else
                    resolve(response);
            }
        });
    });
}