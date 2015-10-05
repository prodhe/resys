/*
 * Re:sys
 *
 * Reservation system using jQuery
 *
 */


/*
 * Manage layout
 */
function addrow() {
    // get current columns
    var n;
    n = $('#grid').find('tr:first').children().length;
    // add proper amount of columns to new row
    if (n == 0) {
        $('#grid').append($('<tr>').append($('<td>')));
    } else {
        $('#grid').append($('<tr>'));
        while (n > 0) {
            $('#grid').find('tr:last').append($('<td>'));
            n--;
        }
    }
}
function delrow() {
    $('#grid tr:last').remove();
}
function addcol() {
    $('#grid').children().append($('<td>'));
}
function delcol() {
    $('#grid').children().find('td:last').remove();
}


/*
 * Selection (for functionality)
 * see document.ready at the bottom for UI selection
 */

var toggleselect = function() {
    $(this).toggleClass("selected");

    if ($(this).hasClass("selected")) {
        $(this).append($('<i>').addClass("fa fa-check"));
    } else {
        $(this).children().remove();
    }
};


/*
 * Mouseover
 */

var popupshow = function(e) {
    $('#infopopup').text($(this).attr('data-name')).show();
    $('#infopopup').css({left: e.pageX+10, top: e.pageY+10});
};
var popuphide = function() {
    $('#infopopup').hide();
};


/*
 * Actions
 */

function togglefloor() {
    $('.selected:not(.reserved)').toggleClass("floor").each(toggleselect);
}

function reserve() {
    if ($('.selected:not(.reserved)').length > 0) {
        $('#respopup').dialog({
            title: "Boka",
            height: 170,
            modal: true,
            buttons: {
               "Ok": function() {
                   var name = $('#formname').val();
                   if (name != "") {
                       $('.selected:not(.reserved)').attr('data-name', name).addClass("reserved")
                       .hover(popupshow, popuphide).mousemove(popupshow)
                       .each(toggleselect);
                   }
                   $(this).dialog("close");
                   $('#formname').val("");
               }
            }
        });
    }
}

function editreservation() {
    var obj = $('.reserved.selected');
    if (obj.length == 1) {
        $('#formname').val(obj.attr('data-name'));
        $('#respopup').dialog({
            title: "Redigera",
            height: 170,
            modal: true,
            buttons: {
               "Ok": function() {
                   var name = $('#formname').val();
                   if (name != "") {
                       obj.attr('data-name', name);
                   }
                   $(this).dialog("close");
                   $('#formname').val("");
               }
            }
        });
        /*var name = prompt("Bokad av:", obj.attr('data-name'));
        if (name != "") {
            obj.attr('data-name', name);
        }*/
    }
}

function showreservations() {
    var names = "";
    $('.reserved').each(function() {
        names += $(this).attr('data-name') + "<br />";
    });
    names = (names == "") ? "Inga bokningar." : names;
    $('<p>' + names + '</p>').dialog({
        title: "Bokningar",
        height: 300,
        modal: true,
        buttons: {
            "Ok": function() {
                $(this).dialog("close");
            }
        }
    });
}

function release() {
    if ($('.selected.reserved').length > 0) {
        var names = "";
        $('.selected.reserved').each(function() {
            names += $(this).attr('data-name') + "<br />";
        });
        $('<p>Följande avbokas:<br />' + names + '<br />Är du säker?</p>').dialog({
            title: "Avboka",
            resizable: false,
            height: 300,
            modal: true,
            buttons: {
                "Ok": function() {
                    $('.selected.reserved').attr('data-name', "").removeClass("reserved").off("mouseenter mouseleave mousemove").each(toggleselect);
                    $(this).dialog("close");
                },
                "Avbryt": function() {
                    $(this).dialog("close");
                }
            }
        });
    }
}

function exportgrid() {
    $('#rawdata').val($('#grid').html()).select();
}

function importgrid() {
    $('#grid').children().remove();
    $('#grid').html($('#rawdata').val());
    // make the imported td cells clickable and hoverable
    /*$('#grid').find('td').click(toggleselect)*/
    $('#grid').find('.reserved').hover(popupshow, popuphide).mousemove(popupshow);
}


/*
 * Information popups from header
 */

function showinfo() {
    var t = "";
    t += "";
    t += "<b>Allmänt</b><br />";
    t += "Re:sys är ett system för att överblicka någon form av platsbokning. Det kräver ingen inloggning och vill man spara ";
    t += "data mellan sessioner, exporterar och importerar man med övre raden. Re:sys skrevs den 12 september 2015 av Petter ";
    t += "Rodhelind. Projektet har nått funktionsduglig status, men kommer säkerligen uppdateras när andan faller på.";
    t += "<br /><br />";
    t += "All data körs bara i minnet på besökande webbläsare och inget sparas på servern eller kan ses av andra användare."
    t += "<br /><br />";
    t += "<b>Ramverk</b><br />";
    t += "Applikationen använder sig av <em>jQuery</em>, <em>jQuery UI</em>, <em>Font Awesome</em> samt <em>Bootstrap</em>.";
    t += "<br /><br />";
    t += "<b>Texteditor</b><br />";
    t += "Vim såklart.<br /><br />";
    t += "<kbd>:wq</kbd>";
    $('<p>' + t + '</p>').dialog({
        title: "Information",
        height: 400,
        width: 500
    });
}

function showhelp() {
    var t = "";
    t += "<b>Allmänt</b><br />";
    t += "Över rutnät finns en kontrollpanel, som innehåller bokning, redigering, avbokning och totalrapport. ";
    t += "Utöver detta finns det designknappar: pilarna lägger till och tar bort kolumner och månen växlar mellan ";
    t += "att visa rutan eller inte. Med den funktionen kan man rita upp hur sittplatserna ser ut och på så vis ";
    t += "skaffa sig en bättre överblick.<br /><br />";
    t += "- Lägg till och ta bort totalt antal rader och kolumner med pilarna i kontrollpanelen<br />";
    t += "- Markera en eller flera celler genom att klicka och dra med musen.<br />";
    t += "- Klicka på halvmånen för att växla huruvida de markerade cellerna ska synas eller inte. Tänk 'golv' ";
    t += "i en samlingslokal.<br />";
    t += "- Vid bokning anges bara ett fält och det får innehålla vad som helst, vanligtvis namn och/eller datum ";
    t += "för bokning/betalning.<br />";
    t += "<br />";
    t += "<b>Att spara</b><br />";
    t += "Eftersom allt körs live i webbläsaren utan bakomliggande serverinfrastruktur, finns det tyvärr ingen ";
    t += "möjlighet att automatiskt spara sitt arbete. Metoden är att <em>exportera till textraden och spara i ";
    t += "en egen textfil på datorn</em>. Nästa gång man behöver arbeta med bokning, klistrar man in texten och ";
    t += "importerar till tabellen.";
    t += "<br /><br />";
    t += "<em>2015-09-12</em>";
    $('<p>' + t + '</p>').dialog({
        title: "Hjälp",
        height: 450,
        width: 600
    });
}
/*
 * When document is loaded
 */

$(document).ready(function() {

    /*
     * Base setup of n x n
     */
    var n = 8;
    // clear current
    $('#grid').children().remove();
    // add given rows and cols
    while (n > 0) {
        addrow();
        // only add col if more than one row
        if (n > 1) addcol();
        n--;
    }

    /*
     * Activate mouse popup for buttons
     */
    $('button').hover(popupshow, popuphide).mousemove(popupshow);

    /* 
     * Activate UI selection
     */
    $('#grid').selectable({
        filter: "td",
        selected: function(e,ui) {
            $('td.ui-selected:not(.selected)').each(toggleselect);
        },
        unselected: function(e,ui) {
            $('td.selected').each(toggleselect);
        }
    });

});

/*
 * Confirm leaving in case of non-saved actions
 */
$(window).bind('beforeunload', function(){
      return 'Allt arbete kommer att försvinna, om du inte har exporterat och sparat undan din nuvarande session.';
});
