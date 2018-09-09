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

function GSide(callback) {
    unit = callback();
    console.log(unit);
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
        gup = g + 1;
        console.log("the value for gup is " + gup);
    }

    CalculateMaxG(gside, gup, unit);

}

function CalculateMaxG(gside, gup, unit) {
    if (gside >= gup) {
        maxG = gside;
    }
    else {
        maxG = gup;
    }

    console.log("the value for maxg is " + maxG);
    SaveGrip(gside, gup, maxG, unit);
}

function SaveGrip(gside, gup, maxG, unit) {

    grip = document.getElementsByClassName('grip');
    for (var i = 0; i < grip.length; i++) {
        if (grip[i].checked) {
            friction = grip[i].value;

        }

    }
    console.log(friction);

    GetForce(gside, gup, maxG, friction, unit);
}

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
        document.getElementById('mforce').value = force;
    }
    else {
        document.getElementById('force').value = force;
    }
    jtorque = force * jlength;
    GetOrientation(side, gup, jlength, maxWt, jtorque);
}

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

    GetM(side, up, orientation, jtorque, unit);
}

function GetM(side, up, orientation, jtorque) {
    if (orientation === "Left-Right") {
        Ma = side + jtorque;
    }
    else {
        Ma = up + jtorque;
    }
    if (unit === "metric") {
        document.getElementById('mmainch').value = Ma * 0.11298;

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
        document.getElementById('mmbmcinch').value = Mb * 0.11298;
    }
    else {
        document.getElementById('mbmcinch').value = Mb;
        document.getElementById('mbmcfoot').value = Mb / 12;
    }


    GetModel(Ma, Mb, unit);
}

function GetModel(Ma, Mb, unit) {
    $.ajax({
        url: '/Grippers/FindModels',
        dataType: 'JSON',
        type: 'GET',
        data: { Ma: Ma, Mb: Mb },
        contentType: 'application/json; charset=utf-8',
        success: function (models) {
            if (Array.isArray(models)) {
                if (unit === "metric") {
                    psi = document.getElementById('mpsi').value;
                    psi = psi * 14.5038;

                    console.log(models);
                    var mtable = document.getElementById("mmodeltable");
                    for (var i = 0; i < 2; i++) {
                        var mrow = mtable.insertRow(-1);
                        var mcell1 = mrow.insertCell(0);
                        var mcell2 = mrow.insertCell(1);
                        var mcell3 = mrow.insertCell(2);
                        var mcell4 = mrow.insertCell(3);
                        var mcell5 = mrow.insertCell(4);
                        var mcell6 = mrow.insertCell(5);

                        var mforceOD = models[i].Force_OD * psi / 100;
                        mforceOD = parseFloat(mforceOD * 4.44822).toFixed(3);
                        var mforceID = models[i].Force_ID * psi / 100;
                        mforceID = parseFloat(mforceID * 4.44822).toFixed(3);

                        var mMa = parseFloat(models[i].Ma * 0.11298).toFixed(3);
                        var mMb = parseFloat(models[i].Mb_Mc * 0.11298).toFixed(3);
                        var mStroke = models[i].Stroke__in_;
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

                        mcell1.innerHTML = models[i].GripperName;
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

                        var forceOD = models[j].Force_OD * psi / 100;
                        var forceID = models[j].Force_ID * psi / 100;

                        cell1.innerHTML = models[j].GripperName;
                        cell2.innerHTML = models[j].Ma;
                        cell3.innerHTML = models[j].Mb_Mc;
                        cell4.innerHTML = models[j].Stroke__in_;
                        cell5.innerHTML = forceOD;
                        cell6.innerHTML = forceID;

                    }
                }
                document.getElementById('btn').style.display = "none";
                document.getElementById('mbtn').style.display = "none";
                document.getElementById('hiddendiv').style.display = "block";

            }
            else {
                alert(models);
                document.getElementById('btn').style.display = "none";
                document.getElementById('mbtn').style.display = "none";
                document.getElementById('hiddendiv2').style.display = "block";
            }
        }

    });
}

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
    document.getElementById("hiddendiv").style.display = "none";
    document.getElementById("hiddendiv2").style.display = "none";
    document.getElementById('btn').style.display = "block";
    document.getElementById('mbtn').style.display = "block";
}

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

    console.log(formdata);
    SendEmail(formdata, user, email);

}

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