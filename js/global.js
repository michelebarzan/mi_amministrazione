function setCookie(name,value)
{
    $.post("setCookie.php",{name,value},
    function(response, status)
    {
        if(status!="success")
            console.log(status);
    });
}
function getCookie(name)
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getCookie.php",{name},
        function(response, status)
        {
            if(status=="success")
            {
                resolve(response);
            }
            else
                reject({status});
        });
    });
}
function getSessionValue(name)
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getSessionValue.php",{name},
        function(response, status)
        {
            if(status=="success")
            {
                resolve(response);
            }
            else
                reject({status});
        });
    });
}
function setSessionValue(name,value)
{

}
function getMiWebappParams()
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getMiWebappParams.php",
        function(response, status)
        {
            if(status=="success")
            {
                resolve(JSON.parse(response));
            }
            else
                reject({status});
        });
    });
}