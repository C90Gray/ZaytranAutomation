var gside;
var friction;
var grip;
var gup;
var maxG;
var maxWt;
var force;
var orientation;
var Ma;
var Mb;
var jlength;
var jtorque;
var side;
var up;
var unit = "imperial";
var psi;
var currentPanel = '1';

//Function that gets which units are being shown on form (metric or imperial)
function GetUnits() {
    $('.panelControlBtn').on("click", function () {
        var ID = $(this).attr('data-id');
        if (ID !== currentPanel) {
            $(".panel").fadeOut('fast', function () {
                $("#panel" + ID).fadeIn('fast');
            });
            currentPanel = ID;
            if (currentPanel === '1') {
                $("#imp").css("background-color", "#3A3A3A");
                $("#imp").css("box-shadow", "2px 5px 15px rgba(0, 0, 0, 0.5)");
                $('#met').css("background-color", "#8F9491");
                $("#met").css("box-shadow", "none");
                unit = "imperial";
            }
            else if (currentPanel === '2') {
                $("#met").css("background-color", "#3A3A3A");
                $("#met").css("box-shadow", "2px 5px 15px rgba(0, 0, 0, 0.5)");
                $('#imp').css("background-color", "#8F9491");
                $("#imp").css("box-shadow", "none");
                unit = "metric";
            }

        }

    });
    return unit;
}

//ALL FUNCTIONS FOLLOWING GETUNITS() LOOK AT WHAT UNIT IS BEING SHOWN AND RETURN DIFFERENT INFORMATION DEPENDING ON THE UNIT
//ALL FUNCTIONS THAT GRAB METRIC INFORMATION THEN CONVERT THAT INFORMATION INTO IMPERIAL VALUES BECAUSE THE MODEL IN THE DB USES IMPERICAL VALUES


//GSide gets the value for the g force left to right
function GSide(callback) {
    unit = callback();
    if (unit === "metric") {
        gside = document.getElementById('mgside').value;
        if (gside === "") {
            gside = 0;
        }
        gside = parseFloat(gside);
        gside = gside / 9.80665;
        g = document.getElementById('mgup').value;
        if (g === "") {
            g = 0;
        }
        g = parseFloat(g);
        g = g / 9.80665;
        //since g force up down is always + 1, the value for gup is saved with +1 here instead of adding 1 every time gup is used
        gup = g + 1;
    }
    else {
        gside = document.getElementById('gside').value;
        if (gside === "") {
            gside = 0;
        }
        gside = parseFloat(gside);
        console.log("the value for gside is " + gside);
        g = document.getElementById('gup').value;
        if (g === "") {
            g = 0;
        }
        g = parseFloat(g);
        //since g force up down is always + 1, the value for gup is saved with +1 here instead of adding 1 every time gup is used
        gup = g + 1;
    }

    // values gside, gup and unit are then passed to CalculateMaxG function
    CalculateMaxG(gside, gup, unit);

}

//This function calculates MaxG
function CalculateMaxG(gside, gup, unit) {
    if (gside >= gup) {
        maxG = gside;
    }
    else {
        maxG = gup;
    }

    // the values are then passed to Save Grip function
    SaveGrip(gside, gup, maxG, unit);
}

//Gets the grip orientation (ID or OD)
function SaveGrip(gside, gup, maxG, unit) {

    grip = document.getElementsByClassName('grip');
    for (var i = 0; i < grip.length; i++) {
        if (grip[i].checked) {
            friction = grip[i].value;

        }

    }

    //passes info to GetForce function
    GetForce(gside, gup, maxG, friction, unit);
}

// this function gets the jaw length, max weight, and force values. The force values are then input into the form in the app requirements section
function GetForce(gside, gup, maxG, friction, unit) {
    if (unit === "metric") {
        jlength = document.getElementById('mjlength').value;
        jlength = parseFloat(jlength);
        jlength = jlength * 0.0393701;
        maxWt = document.getElementById('mMaxwt').value;
        maxWt = parseFloat(maxWt);
        maxWt = maxWt * 2.204622621;

    }
    else {
        jlength = document.getElementById('jlength').value;
        jlength = parseFloat(jlength);
        maxWt = document.getElementById('Maxwt').value;
        maxWt = parseFloat(maxWt);
    }

    side = maxWt * jlength * gside;
    force = maxWt * maxG * 0.8;
    if (friction === "Friction") {
        force = force * 4;
    }
    if (unit === "metric") {
        document.getElementById('mforce').value = Number(Math.round(force + 'e3') + 'e-3');
    }
    else {
        document.getElementById('force').value = force;
    }
    jtorque = force * jlength;

    //all info is then passed to GetOrientation function
    GetOrientation(side, gup, jlength, maxWt, jtorque);
}

//Gets jaw orientaion (Down, Up/Down, Left-Right)
function GetOrientation(side, gup, jlength, maxWt, jtourque, unit) {
    o = document.getElementById('orientation');
    orientation = o.options[o.selectedIndex].value;
    console.log(orientation);
    if (orientation === "Down") {
        up = 0;
    }
    else {
        up = gup * jlength * maxWt;
    }

    //passes to GetM
    GetM(side, up, orientation, jtorque, unit);
}

//This function calculates the values of Ma and Mb/Mc and inserts them into the form in the App Requirements section
function GetM(side, up, orientation, jtorque) {
    if (orientation === "Left-Right") {
        Ma = side + jtorque;
    }
    else {
        Ma = up + jtorque;
    }
    if (unit === "metric") {
        Ma = Ma * 0.11298;
        document.getElementById('mmainch').value = Number(Math.round(Ma + 'e3') + 'e-3');

    }
    else {
        document.getElementById('mainch').value = Ma;
        document.getElementById('mafoot').value = Ma / 12;
    }

    if (orientation === "Left-Right") {
        Mb = up;
    }
    else {
        Mb = side;
    }
    if (unit === "metric") {
        Mb = Mb * 0.11298;
        document.getElementById('mmbmcinch').value = Number(Math.round(Mb + 'e3') + 'e-3');
    }
    else {
        document.getElementById('mbmcinch').value = Mb;
        document.getElementById('mbmcfoot').value = Mb / 12;
    }

    //Then getmodel function is called
    GetModel(Ma, Mb, unit);
}

//This function querys the db and returns an array of models whos both Ma and Mb/Mc values are less than the Ma Mb/mc values calculated above in the order of lowest to highest price
function GetModel(Ma, Mb, unit) {
    var Specs = [];

    Specs.push({ ModelName: "MAGNUM-AL-130", Stroke: ".5 to 1.0 inches", ForceID: 29, ForceOD: 29, Ma: 212, MbMc: 141, Price: 400 });
    Specs.push({ ModelName: "MAGNUM-PET-130", Stroke: ".5 to 1.0 inches", ForceID: 29, ForceOD: 29, Ma: 88, MbMc: 99, Price: 500 });
    Specs.push({ ModelName: "GPAL-40", Stroke: "2 inches", ForceID: 132, ForceOD: 176, Ma: 295, MbMc: 302, Price: 599 });
    Specs.push({ ModelName: "MAGNUM-AL-450-26", Stroke: "1.02 inches", ForceID: 100, ForceOD: 100, Ma: 840, MbMc: 530, Price: 630 });
    Specs.push({ ModelName: "GPAL-100", Stroke: "3 inches", ForceID: 196, ForceOD: 230, Ma: 648, MbMc: 1080, Price: 849 });
    Specs.push({ ModelName: "GPAL-200", Stroke: "4 inches", ForceID: 364, ForceOD: 443, Ma: 1095, MbMc: 1825, Price: 1499 });
    Specs.push({ ModelName: "GP or GPL-400", Stroke: "2.5 to 6 inches", ForceID: 503.5, ForceOD: 636.2, Ma: 1743, MbMc: 2905, Price: 1947 });
    Specs.push({ ModelName: "XRAY-S-2200", Stroke: "7.87 to 13.77 inches", ForceID: 495, ForceOD: 590, Ma: 5712, MbMc: 5400, Price: 2700 });
    Specs.push({ ModelName: "XRAY-S-5800", Stroke: "7.87 inches", ForceID: 1300, ForceOD: 1300, Ma: 11400, MbMc: 7200, Price: 5700 });
    Specs.push({ ModelName: "Req Force Too High", Stroke: "100000", ForceID: 100000, ForceOD: 100000, Ma: 100000, MbMc: 100000, Price: 100000 });
    Specs.push({ ModelName: "Req Torque Too High", Stroke: "100000", ForceID: 100000, ForceOD: 100000, Ma: 100000, MbMc: 100000, Price: 100000 });

    var data = {
        UserMa: Ma,
        UserMb: Mb
    };

    var grips = {
        User: data,
        Specs: Specs
    };


    $.ajax({
        url: '/Grippers/FindModels',
        dataType: 'JSON',
        type: 'Post',
        data: JSON.stringify(grips),
        contentType: 'application/json; charset=utf-8',
        success: function (models) {

            console.log(models);

            if (Array.isArray(models)) {
                //the models are then added to their respectful tables.
                //we still need to get psi to calculate the Ma and Mb/Mc values that the models are capible of producing
                //the for loop only loops through the two lowest priced model items.
                //each loop generates more rows to the table and poplutates them with the correct information. 
                if (unit === "metric") {
                    psi = document.getElementById('mpsi').value;
                    psi = psi * 14.5038;

                    var mtable = document.getElementById("mmodeltable");
                    for (var i = 0; i < 2; i++) {
                        var mrow = mtable.insertRow(-1);
                        var mcell1 = mrow.insertCell(0);
                        var mcell2 = mrow.insertCell(1);
                        var mcell3 = mrow.insertCell(2);
                        var mcell4 = mrow.insertCell(3);
                        var mcell5 = mrow.insertCell(4);
                        var mcell6 = mrow.insertCell(5);

                        var mforceOD = models[i].ForceOD * psi / 100;
                        mforceOD = parseFloat(mforceOD * 4.44822).toFixed(3);
                        var mforceID = models[i].ForceID * psi / 100;
                        mforceID = parseFloat(mforceID * 4.44822).toFixed(3);

                        var mMa = parseFloat(models[i].Ma * 0.11298).toFixed(3);
                        var mMb = parseFloat(models[i].MbMc * 0.11298).toFixed(3);
                        var mStroke = models[i].Stroke;
                        var strokeArr = mStroke.split(" ");
                        if (strokeArr.length > 2) {
                            for (var k = 0; k < strokeArr.length; k++) {
                                strokeArr[k] = parseFloat(strokeArr[k] * 25.4).toFixed(3);
                            }

                            mStroke = strokeArr[0] + " to " + strokeArr[2] + " mm.";
                        }
                        else {
                            mStroke = parseFloat(strokeArr[0] * 25.4).toFixed(3);
                        }

                        mcell1.innerHTML = models[i].ModelName;
                        mcell2.innerHTML = mMa;
                        mcell3.innerHTML = mMb;
                        mcell4.innerHTML = mStroke;
                        mcell5.innerHTML = mforceOD;
                        mcell6.innerHTML = mforceID;

                    }
                }
                else {
                    psi = document.getElementById('psi').value;

                    console.log(models);
                    var table = document.getElementById("modeltable");
                    for (var j = 0; j < 2; j++) {
                        var row = table.insertRow(-1);
                        var cell1 = row.insertCell(0);
                        var cell2 = row.insertCell(1);
                        var cell3 = row.insertCell(2);
                        var cell4 = row.insertCell(3);
                        var cell5 = row.insertCell(4);
                        var cell6 = row.insertCell(5);

                        var forceOD = models[j].ForceOD * psi / 100;
                        var forceID = models[j].ForceID * psi / 100;

                        cell1.innerHTML = models[j].ModelName;
                        cell2.innerHTML = models[j].Ma;
                        cell3.innerHTML = models[j].MbMc;
                        cell4.innerHTML = models[j].Stroke;
                        cell5.innerHTML = forceOD;
                        cell6.innerHTML = forceID;

                    }
                }

                // after the table data is created, the function hides the submit button and shows the hidden div containing the save and refresh button
                document.getElementById('btn').style.display = "none";
                document.getElementById('mbtn').style.display = "none";
                document.getElementById('hiddendiv').style.display = "block";

            }
            else {
                alert(models);
                //if a form value was not submitted or there was an error returning the model array, the submit button hides and the hidden div with only the refresh button appears
                document.getElementById('btn').style.display = "none";
                document.getElementById('mbtn').style.display = "none";
                document.getElementById('hiddendiv2').style.display = "block";
            }
        }

    });
}

//this function only runs when the refresh button is clicked
//it first runs the GetUnit function to determine what unit form is displayed
//then it refreshes all the fields in the form, and deletes the bottom two rows of the table on that page
function ReloadForm(callback) {
    document.getElementById("myForm").reset();
    document.getElementById("myForm1").reset();
    document.getElementById("myForm2").reset();
    document.getElementById("myForm3").reset();
    if (callback() === "metric") {
        if (document.getElementById('mmodeltable').getElementsByTagName('tr').length > 1) {
            document.getElementById("mmodeltable").deleteRow(-1);
            document.getElementById("mmodeltable").deleteRow(-1);
        }
    }
    if (callback() === "imperial") {
        if (document.getElementById('modeltable').getElementsByTagName('tr').length > 1) {
            document.getElementById("modeltable").deleteRow(-1);
            document.getElementById("modeltable").deleteRow(-1);
        }
    }

    //it then hides the hidden divs and displays the submut buttons again
    document.getElementById("hiddendiv").style.display = "none";
    document.getElementById("hiddendiv2").style.display = "none";
    document.getElementById('btn').style.display = "block";
    document.getElementById('mbtn').style.display = "block";
}

//This function only runs if the save button is clicked
//it first calls the GetUnits function to see which form to save data from.
//It then gets the username and email info from the Customer Info section 
//it then pulls out all the info from the entire webpage and creates an array of objects with both field and value properties.
function SaveData(callback) {
    var user = document.getElementById('cname').value;
    var email = document.getElementById('email').value;
    var formdata = [];
    var units = callback;
    if (units === "metric") {
        var mgrip;
        var midod;
        var morient;
        idod = document.getElementsByClassName('IDOD');
        for (var j = 0; j < idod.length; j++) {
            if (idod[j].checked) {
                midod = idod[j].value;
            }
        }
        gr = document.getElementsByClassName('grip');
        for (var i = 0; i < gr.length; i++) {
            if (gr[i].checked) {
                mgrip = gr[i].value;

            }
        }

        mo = document.getElementById('orientation');
        morient = o.options[o.selectedIndex].value;

        var mtable = document.getElementById('mmodeltable');
        var model1 = mtable.rows[1].cells[0].innerHTML;
        var ma1 = mtable.rows[1].cells[1].innerHTML;
        var mbmc1 = mtable.rows[1].cells[2].innerHTML;
        var mstroke1 = mtable.rows[1].cells[3].innerHTML;
        var cforce1 = mtable.rows[1].cells[4].innerHTML;
        var oforce1 = mtable.rows[1].cells[5].innerHTML;
        var model2 = mtable.rows[2].cells[0].innerHTML;
        var ma2 = mtable.rows[2].cells[1].innerHTML;
        var mbmc2 = mtable.rows[2].cells[2].innerHTML;
        var mstroke2 = mtable.rows[2].cells[3].innerHTML;
        var cforce2 = mtable.rows[2].cells[4].innerHTML;
        var oforce2 = mtable.rows[2].cells[5].innerHTML;



        formdata.push({ Field: "FIELD", Value: "VALUE" });
        formdata.push({ Field: "***Application Description***", Value: "***Application Description***" });
        formdata.push({ Field: "Pressure (BAR)", Value: "" + document.getElementById('mpsi').value });
        formdata.push({ Field: "ID or OD", Value: "" + midod });
        formdata.push({ Field: "Max Part Weight (Kg)", Value: "" + document.getElementById('mMaxwt').value });
        formdata.push({ Field: "Grip Type", Value: "" + mgrip });
        formdata.push({ Field: "Jaw Length (mm)", Value: "" + document.getElementById('mjlength').value });
        formdata.push({ Field: "Jaw Orientation", Value: "" + morient });
        formdata.push({ Field: "Force Up/Down (m/s2)", Value: "" + document.getElementById('mgup').value });
        formdata.push({ Field: "Force Left/Righ (m/s2)", Value: "" + document.getElementById('mgside').value });
        formdata.push({ Field: "***Application Requirements***", Value: "***Application Requirements***" });
        formdata.push({ Field: "Force Required (N)", Value: "" + document.getElementById('mforce').value });
        formdata.push({ Field: "Ma (Joules)", Value: "" + document.getElementById('mmainch').value });
        formdata.push({ Field: "Mb/Mc (Joules)", Value: "" + document.getElementById('mmbmcinch').value });
        formdata.push({ Field: "***Reccomendations***", Value: "***Reccomendations***" });
        formdata.push({ Field: "Model Name", Value: "" + model1 });
        formdata.push({ Field: "Model Ma (Joules)", Value: "" + ma1 });
        formdata.push({ Field: "Model Mb (Joules)", Value: "" + mbmc1 });
        formdata.push({ Field: "Model Stroke (mm)", Value: "" + mstroke1 });
        formdata.push({ Field: "Model Closing Force (N)", Value: "" + cforce1 });
        formdata.push({ Field: "Model Opening Force (N)", Value: "" + oforce1 });
        formdata.push({ Field: "Model Name", Value: "" + model2 });
        formdata.push({ Field: "Model Ma (Joules)", Value: "" + ma2 });
        formdata.push({ Field: "Model Mb (Joules)", Value: "" + mbmc2 });
        formdata.push({ Field: "Model Stroke (mm)", Value: "" + mstroke2 });
        formdata.push({ Field: "Model Closing Force (N)", Value: "" + cforce2 });
        formdata.push({ Field: "Model Opening Force (N)", Value: "" + oforce2 });

    }
    else {
        var igrip;
        var iidod;
        var iorient;
        idod = document.getElementsByClassName('IDOD');
        for (var k = 0; k < idod.length; k++) {
            if (idod[k].checked) {
                iidod = idod[k].value;
            }
        }
        gr = document.getElementsByClassName('grip');
        for (var l = 0; l < gr.length; l++) {
            if (gr[l].checked) {
                igrip = gr[l].value;

            }
        }

        o = document.getElementById('orientation');
        iorient = o.options[o.selectedIndex].value;


        var itable = document.getElementById('modeltable');
        var imodel1 = itable.rows[1].cells[0].innerHTML;
        var ima1 = itable.rows[1].cells[1].innerHTML;
        var imbmc1 = itable.rows[1].cells[2].innerHTML;
        var istroke1 = itable.rows[1].cells[3].innerHTML;
        var icforce1 = itable.rows[1].cells[4].innerHTML;
        var ioforce1 = itable.rows[1].cells[5].innerHTML;
        var imodel2 = itable.rows[2].cells[0].innerHTML;
        var ima2 = itable.rows[2].cells[1].innerHTML;
        var imbmc2 = itable.rows[2].cells[2].innerHTML;
        var istroke2 = itable.rows[2].cells[3].innerHTML;
        var icforce2 = itable.rows[2].cells[4].innerHTML;
        var ioforce2 = itable.rows[2].cells[5].innerHTML;


        formdata.push({ Field: "FIELD", Value: "VALUE" });
        formdata.push({ Field: "***Application Description***", Value: "***Application Description***" });
        formdata.push({ Field: "Pressure (PSI)", Value: "" + document.getElementById('psi').value });
        formdata.push({ Field: "ID or OD", Value: "" + iidod });
        formdata.push({ Field: "Max Part Weight (lb)", Value: "" + document.getElementById('Maxwt').value });
        formdata.push({ Field: "Grip Type", Value: "" + igrip });
        formdata.push({ Field: "Jaw Length (in)", Value: "" + document.getElementById('jlength').value });
        formdata.push({ Field: "Jaw Orientation", Value: "" + iorient });
        formdata.push({ Field: "Force Up/Down (G Force)", Value: "" + document.getElementById('gup').value });
        formdata.push({ Field: "Force Left/Righ (G Force)", Value: "" + document.getElementById('gside').value });
        formdata.push({ Field: "***Application Requirements***", Value: "***Application Requirements***" });
        formdata.push({ Field: "Force Required (lb)", Value: "" + document.getElementById('force').value });
        formdata.push({ Field: "Ma (in/pounds)", Value: "" + document.getElementById('mainch').value });
        formdata.push({ Field: "Mb/Mc (in/pounds)", Value: "" + document.getElementById('mbmcinch').value });
        formdata.push({ Field: "Ma (ft/pounds)", Value: "" + document.getElementById('mafoot').value });
        formdata.push({ Field: "Mb/Mc (ft/pounds)", Value: "" + document.getElementById('mbmcfoot').value });
        formdata.push({ Field: "***Reccomendations***", Value: "***Reccomendations***" });
        formdata.push({ Field: "Model Name", Value: "" + imodel1 });
        formdata.push({ Field: "Model Ma (in/pound)", Value: "" + ima1 });
        formdata.push({ Field: "Model Mb (in/pound)", Value: "" + imbmc1 });
        formdata.push({ Field: "Model Stroke (in)", Value: "" + istroke1 });
        formdata.push({ Field: "Model Closing Force (lb)", Value: "" + icforce1 });
        formdata.push({ Field: "Model Opening Force (lb)", Value: "" + ioforce1 });
        formdata.push({ Field: "Model Name", Value: "" + imodel2 });
        formdata.push({ Field: "Model Ma (in/pound)", Value: "" + ima2 });
        formdata.push({ Field: "Model Mb (in/pound)", Value: "" + imbmc2 });
        formdata.push({ Field: "Model Stroke (in)", Value: "" + istroke2 });
        formdata.push({ Field: "Model Closing Force (lb)", Value: "" + icforce2 });
        formdata.push({ Field: "Model Opening Force (lb)", Value: "" + ioforce2 });

    }

    //it then sends all the data to the SendEmail function
    SendEmail(formdata, user, email);

}

//this function calls the SendPDFEmail method in the emails controller which converts the data to a pdf and emails it to the provided email address. 
function SendEmail(formvalues, username, email) {
    var Info = {
        Username: username,
        EmailAdd: email
    };
    var model = {
        FormValues: formvalues,
        Email: Info
    };
    $.ajax({
        url: '/Emails/SendPDFEmail',
        dataType: "JSON",
        type: 'POST',
        contentType: 'application/json;',
        data: JSON.stringify(model),
        success: function (alerttext) {
            alert(alerttext);
        }
    });
}