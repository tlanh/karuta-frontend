//==================================
function getURLParameter(sParam) {
//==================================
	var sPageURL = window.location.search.substring(1);
	var sURLVariables = sPageURL.split('&');
	for ( var i = 0; i < sURLVariables.length; i++) {
		var sParameterName = sURLVariables[i].split('=');
		if (sParameterName[0] == sParam) {
			return sParameterName[1];
		}
	}
}

//------------------------------
var iid = getURLParameter('i');
//------------------------------
var lang = getURLParameter('lang');
if (lang==null)
	lang = LANG ;
//-------------------------------


//==============================
function displayKarutaPublic()
//==============================
{
	var html = "";
	html += "<div id='main-container' class='container-fluid public-container'>";
	html += "<div class='row public-row'>";
	html += "	<div class='col-md-3'>";
	html += "		<div id='welcome'></div>";
	html += "		<div id='sidebar'></div>";
	html += "	</div>";
	html += "	<div class='col-md-9' id='contenu'></div>";
	html += "</div>";
	html += "</div>";
	$('body').html(html);
	
	$('body').append(EditBox());
	$('body').append(DeleteBox());
	$('body').append(savedBox());
	$('body').append(alertBox());
	$('body').append(messageBox());
	$('body').append(imageBox());
	$('body').append(previewBox());

	//---------------------------
	$("#welcome").html(welcome[LANG]);
	//----------------
	$.ajaxSetup({async: false});
	loadLanguages(function(data) {
		getLanguage();
	});
	$.ajax({
		type : "GET",
		dataType : "text",
		url : serverBCK+"/direct?i=" + iid,
		success : function(data) {
			g_uuid = data;
			$.ajax({ // get group-role for the user
				Accept: "application/xml",
				type : "GET",
				dataType : "xml",
				url : serverBCK_API+"/credential/group/" + g_uuid,
				success : function(data) {
					var usergroups = $("group",data);
					for (var i=0;i<usergroups.length;i++) {
						g_userroles[i+1] = $("role",usergroups[i]).text();
					}
					g_userroles[0] = g_userroles[1]; // g_userroles[0] played role by designer
				}
			});
			//----------------
			$.ajax({
				type : "GET",
				dataType : "xml",
				url : serverBCK_API+"/credential",
				data: "",
				success : function(data) {
					USER = new UIFactory["User"]($("user",data));
				},
				error : function( jqXHR, textStatus, errorThrown ) {
					if (jqXHR.status=="401") {
						window.location = "login.htm?i="+iid+"&lang="+lang;
					}						
				}
			});
			//----------------
			$.ajax({
				type : "GET",
				dataType : "text",
				url : serverBCK_API+"/nodes/node/" + g_uuid  +"/portfolioid",
				success : function(data) {
					g_portfolioid = data;
				}
			});
			//----------------
			$.ajax({
				type : "GET",
				dataType : "xml",
				url : serverBCK_API+"/nodes/node/" + g_uuid,
				success : function(data) {
					g_edit = true; //no edit button
					g_portfolio_current = data;
					UICom.parseStructure(data);
					var depth = 99;
					var rootnode = UICom.structure['ui'][g_uuid];
					if (rootnode.asmtype=='asmRoot' || rootnode.asmtype=='asmStructure')
						depth = 1;
					setCSSportfolio(data);
					setLanguage(lang,'publichtm');
					if (rootnode.asmtype=='asmRoot' || rootnode.asmtype=='asmStructure')
						UIFactory["Portfolio"].displaySidebar(UICom.structure['tree'][g_uuid],'sidebar','standard',LANGCODE,false,g_uuid);
					$("#contenu").html("<div id='page' uuid='"+g_uuid+"'></div>");
					var semtag =  ($("metadata",rootnode.node)[0]==undefined || $($("metadata",rootnode.node)[0]).attr('semantictag')==undefined)?'': $($("metadata",rootnode.node)[0]).attr('semantictag');
					if (semtag == 'bubble_level1') {
						$("#main-container").html("");
						UICom.structure["ui"][g_uuid].displayNode('standard',UICom.structure['tree'][g_uuid],'main-container',depth,LANGCODE,true);
					}
					else
						UICom.structure["ui"][g_uuid].displayNode('standard',UICom.structure['tree'][g_uuid],'contenu',depth,LANGCODE,true);
					var welcomes = $("asmUnit:has(metadata[semantictag*='WELCOME'])",data);
					if (welcomes.length==0) // for backward compatibility
						welcomes = $("asmUnit:has(metadata[semantictag*='welcome-unit'])",data);
					if (welcomes.length>0){
						var welcomeid = $(welcomes[0]).attr('id');
						$("#sidebar_"+welcomeid).click();
					} else {
						var root = $("asmRoot",data);
						var rootid = $(root[0]).attr('id');
						$("#sidebar_"+rootid).click();
					}
				}
			});
		},
		error : function( jqXHR, textStatus, errorThrown ) {
			alert("Get portfolio: "+jqXHR.status + " "+errorThrown)
		}
	});
	$(document).click(function(e) {
		if (!$(e.target).is('.tooltip')) {
			$('.tooltip').hide();
		}
	});
	$.ajaxSetup({async: true});
}


