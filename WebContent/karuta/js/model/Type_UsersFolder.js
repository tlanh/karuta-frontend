/* =======================================================
	Copyright 2020 - ePortfolium - Licensed under the
	Educational Community License, Version 2.0 (the "License"); you may
	not use this file except in compliance with the License. You may
	obtain a copy of the License at

	http://opensource.org/licenses/ECL-2.0

	Unless required by applicable law or agreed to in writing,
	software distributed under the License is distributed on an "AS IS"
	BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
	or implied. See the License for the specific language governing
	permissions and limitations under the License.
   ======================================================= */
	
var usersfolders_byid = {};
var usersfolders_list = [];
var bin_usersfolder_list = [];
var currentDisplayedUsersFolderId = null;
var root_usersfolder = '0';
var pagegNavbar_list = ["top","bottom"];
var number_of_usersfolders = 0;
/// Check namespace existence
if( UIFactory === undefined )
{
  var UIFactory = {};
}

/// Define our type
//==================================
UIFactory["UsersFolder"] = function(node)
//==================================
{
	this.id = $(node).attr('id');
	this.node = node;
	this.code_node = $("code",node);
	this.code = this.code_node.text();
	//------------------------------
	this.label_node = [];
	for (var i=0; i<languages.length;i++){
		this.label_node[i] = $("label[lang='"+languages[i]+"']",node);
		if (this.label_node[i].length==0) {
			var newElement = createXmlElement("label");
			$(newElement).attr('lang', languages[i]);
			$(newElement).text(karutaStr[languages[languages[i]],'new']);
			$(node)[0].appendChild(newElement);
			this.label_node[i] = $("label[lang='"+languages[i]+"']",node);
		}
	}
	//------------------------------
	this.attributes = {};
	this.attributes["code"] = this.code_node;
	this.attributes["label"] = this.label_node;
	//------------------------------
	this.date_modified = $(node).attr('modified');
	this.owner = $(node).attr('owner');
	if ($(node).attr('ownerid')!=undefined)
		this.ownerid = $(node).attr('ownerid');
	else
		this.ownerid = null;
	if ($(node).attr('nb_folders')!=undefined) {
		this.nb_folders = $(node).attr('nb_folders');		
	} else this.nb_folders = 0;
	if ($(node).attr('nb_users')!=undefined) {
		this.nb_users = $(node).attr('nb_users');
	} else this.nb_users = 0;
	this.loadedStruct = false;
	this.folders_list = [];
	this.loadedFolder = false;
	this.pageindex = '1';
	this.chidren_list = {};
	this.display = {};
}

//==================================
UIFactory["UsersFolder"].displayAll = function(dest,type,langcode)
//==================================
{
	number_of_bins = 0;
	$("#usersfolders").html($(""));
	UIFactory["UsersFolder"].displayTree(dest,type,langcode);
	number_of_usersfolders = usersfolders_list.length;
	//--------------------------------------
	if (number_of_usersfolders==0) {
		$("#usersfolders-label").hide();
	} else {
		$("#usersfolders-nb").html(number_of_usersfolders);
	}
	//--------------------------------------
	//--------------------------------------
	if (!USER.admin)
		$("#users-nb").hide();
	$('[data-toggle=tooltip]').tooltip({html: true, trigger: 'hover'}); 

};

//==================================
UIFactory["UsersFolder"].displayTree = function(dest,type,langcode,parentid)
//==================================
{
	if (langcode==undefined || langcode==null)
		langcode = LANGCODE;
	var list = [];
	if (parentid==undefined || parentid==null)
		list = usersfolders_list;
	else list = usersfolders_byid[parentid].folders_list;
	var html="";
	for (var i = 0; i < list.length; i++) {
		html += list[i].getTreeNodeView(dest,type,langcode);
	}
	document.getElementById(dest).innerHTML = html;
	document.getElementById('nb_folders_'+usersfolders_byid[parentid].id).innerHTML = usersfolders_byid[parentid].nb_folders;
}

//==================================
UIFactory["UsersFolder"].prototype.getTreeNodeView = function(dest,type,langcode)
//==================================
{
	//---------------------	
	var folder_label = this.label_node[langcode].text();
	var html = "";
	if (type=='list') {
		html += "<div  class='treeNode usersfolder'>";
		html += "	<div id='usersfolder_"+this.id+"' class='row-label folder-row'>";
		if (this.nb_folders>0){
			html += "		<span id='toggle_usersfolder_"+this.id+"' class='closeSign";
			html += " toggledNode";
			html += "' onclick=\"javascript:loadAndDisplayUsersFolderStruct('collapse_usersfolder_"+this.id+"','"+this.id+"');\"></span>";
		} else {
			html += "<span class='no-toggledNode'>&nbsp;</span>"
		}
		html += "		<span id='treenode-usersfolderlabel_"+this.id+"' onclick=\"javascript:loadAndDisplayUsersFolderContent('folder-users','"+this.id+"');\" class='folder-label'>"+folder_label+"&nbsp;</span><span class='badge number_of_folders' id='nb_folders_"+this.id+"'>"+this.nb_folders+"</span>";
		html += "&nbsp;<span class='badge number_of_items' id='number_of_usersfolder_items_"+this.id+"'>"+this.nb_users+"</span>";
		html += "	</div>";
		html += "	<div id='collapse_usersfolder_"+this.id+"' class='nested'></div>";
		html += "</div><!-- class='usersfolder'-->";
	}
	if (type=='select1' || type=='select') {
		var html = "<input name='"+name+"' value='"+gid+"' type=";
		if (type=='select')
			html += "'checkbox'";
		else
			html += "'radio'";
		if (attr!=null && value!=null)
			html += " "+attr+"='"+value+"'";
		html += "> "+label+" </input>";
		html += "<div id='select-usersfolder_"+this.id+"' class='treeNode select-folder'>";
		html += "	<div class='row-label'>";
		html += "		<span id='toggle_select-usersfolder_"+this.id+"' class='closeSign";
		if (this.nb_folders>0){
			html += " toggledNode";
		}
		html += "' onclick=\"javascript:loadAndDisplayUsersFolderStruct('collapse_select-usersfolder_"+this.id+"','"+this.id+"');\"></span>";
		html += "		<span id='treenode-usersfolderlabel_"+this.id+"' onclick=\"javascript:loadAndDisplayUsersFolderContent('select-folder-users','"+this.id+"');\" class='folder-label'>"+folder_label+"&nbsp;</span><span class='badge number_of_folders' id='select-number_of_usersfolders"+this.id+"'>"+this.nb_folders+"</span>";
		html += "&nbsp;<span class='badge number_of_items' id='select-number_of_usersfolder_items_"+this.id+"'>"+this.nb_users+"</span>";
		html += "	</div>";
		html += "	<div id='collapse_select-usersfolder_"+this.id+"' class='nested'></div>";
		html += "</div><!-- id='select-usersfolder_...'-->";
	}
	return html;
}

//==================================
UIFactory["UsersFolder"].displayFolderContent = function(dest,id,langcode,index_class)
//==================================
{
	$("#"+dest).show();
	localStorage.setItem('currentDisplayedUsersFolder',id);
	$("#"+dest).html("");
	var type = "list";
	if (langcode==null)
		langcode = LANGCODE;
	var usersfolder = usersfolders_byid[id];
	//---------------------
	var html = "";
	var foldercode = usersfolder.code;
	var owner = (Users_byid[usersfolder.ownerid]==null) ? "":Users_byid[usersfolder.ownerid].getView(null,'firstname-lastname',null);

	var folder_label = usersfolder.label_node[langcode].text();
	if (folder_label==undefined || folder_label=='' || folder_label=='&nbsp;')
		folder_label = '- no label in '+languages[langcode]+' -';
	html += "<div id='content-usersfolder_"+usersfolder.id+"' class='usersfolder-header'>";
	html += "	<div class='row row-label'>";
	html += "		<div class='col-1'/>";
	html += "		<div class='col-4 folder-label' id='usersfolderlabel_"+usersfolder.id+"' >"+folder_label+"</div>";
	html += "		<div class='col-2 d-none d-md-block folder-label'>"+owner+"</div>";
	html += "		<div class='col-3 d-none d-sm-block comments' id='usersfolder-comments_"+usersfolder.date_modified.substring(0,10)+"'> </div><!-- comments -->";
	html += "		<div class='col-1'>";
	//------------ buttons ---------------
	html += UIFactory.UsersFolder.getAdminMenu(usersfolder,false);
	//---------------------------------------
	html += "		</div><!-- class='col-1' -->";
	html += "		<div class='col-1'>";
	//------------------------ menu-burger
	if (USER.admin || (USER.creator && !USER.limited) ) {
		html += "			<div class='dropdown folder-menu'>";
		html += "				<button  class='btn dropdown-toggle' data-toggle='dropdown'></button>";
		html += "				<ul class='dropdown-menu dropdown-menu-right' role='menu'>";
		html += "					<a class='dropdown-item' onclick=\"UIFactory['User'].callCreate();\" >"+karutaStr[LANG]['create_user']+"</a>";
		html += "					<a class='dropdown-item' onclick=\"UIFactory['UsesFolder'].callCreate();\" >"+karutaStr[LANG]['create_folder']+"</a>";
		html += "				</ul>";
		html += "			</div>";
	}
	//------------------------end menu-burger
	html += "		</div><!-- class='col-1' -->";
	html += "	</div><!-- class='row' -->";
	html += "</div><!-- class='usersfolder'-->";
	//----------------------
//	html += "<div id='"+index_class+pagegNavbar_list[0]+"' class='navbar-pages'>";
//	html += "</div><!-- class='navbar-pages'-->";
	// ----------------------
	html += "<div id='folder-users-pages' class='usersfolder-pages'>";
	html += "</div><!-- class='usersfolder-pages'-->";
	// ----------------------
	html += "<div id='"+index_class+pagegNavbar_list[1]+"' class='navbar-pages'>";
	html += "</div><!-- class='navbar-pages'-->";
	//----------------------

	$("#"+dest).append($(html));
}

//==================================
UIFactory["UsersFolder"].prototype.displayFolderContentPage = function(dest,type,langcode,index_class)
//==================================
{
	$("#"+dest).html("");
	if (langcode==null)
		langcode = LANGCODE;
	if (type==undefined || type==null)
		type = 'list';
	var html = "";

	var list = this.folders_list;
	if (list!=undefined) {
		for (var i=0; i<list.length;i++){
			var item = list[i];
			var destid = dest+"_item-usersfolder_"+item.id;
			html += "<div class='row item item-folder' id='"+destid+"'>";
			html += item.getView(destid+item.id,type,langcode);
			html += "</div>";
		}
	}
	html += "<hr/>"
	var list = this.chidren_list[this.pageindex];
	if (list!=undefined) {
	for (var i=0; i<list.length;i++){
			var item = list[i]['obj'];
			var destid = dest+"_item-user_"+item.id;
			html += "<div class='row item item-user' id='"+destid+"'>";
			html += item.getView(destid,'list2',langcode);
			html += "</div>";
		}
	}
	$("#"+dest).html($(html));
	var nb_index = Math.ceil((this.nb_users)/nbItem_par_page);
	if (nb_index>1) {
		displayPagesNavbar(nb_index,this.id,langcode,parseInt(this.pageindex),index_class,'loadAndDisplayUsersFolderContentPage',dest,"list");		
		$(".navbar-pages").show();
	} else {
		$(".navbar-pages").hide();
	}
	$(window).scrollTop(0);
}

//==================================
UIFactory["UsersFolder"].prototype.getView = function(dest,type,langcode)
//==================================
{
	if (dest!=null) {
		this.display[dest] = langcode;
	}
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------	
	var folder_label = this.label_node[langcode].text();
	var owner = (Users_byid[this.ownerid]==null) ? "":Users_byid[this.ownerid].getView(null,'firstname-lastname',null);
	var tree_type='<span class="fa fa-folder" aria-hidden="true"></span>';
	var html = "";
	if (type=='list') {
		html += "<div class='folder-label col-10 col-md-4' title=\""+this.code+"\" class='folder-label' >"+folder_label+" "+tree_type+"</div>";
		if (USER.creator && !USER.limited) {
			html += "<div class='col-2 d-none d-md-block'><span class='usersfolder-owner' >"+owner+"</span></div>";
			html += "<div class='col-3 d-none d-md-block'><span class='usersfolder-code' >"+this.code+"</span></div>";
		}
		if (this.date_modified!=null)
			html += "<div class='col-2 d-none d-md-block'>"+this.date_modified.substring(0,10)+"</div>";
		//------------ buttons ---------------
		html += "<div class='col-1'>";
		if (USER.admin || (this.owner=='Y') || (USER.creator && !USER.limited)) {
			html += UIFactory.UsersFolder.getAdminMenu(this,true);
		}
		html += "</div><!-- class='col' -->";
		//------------------------------------
	}
	if (type=='bin') {
		if (USER.admin || (USER.creator && !USER.limited) ){
			html += "<div class='col-md-1 col-sm-1 hidden-xs'></div>";
			html += "<div class='col-md-3 col-sm-3 col-xs-9'><a class='folder-label' >"+folder_label+"</a> "+tree_type+"</div>";
			html += "<div class='col-md-2 col-sm-2 hidden-xs '><a class='usersfolder-owner' >"+owner+"</a></div>";
			html += "<div class='col-md-2 col-sm-2 hidden-xs' >"+this.code+"</a></div>";
			if (this.date_modified!=null)
				html += "<div class='col-md-2 col-sm-2 hidden-xs'>"+this.date_modified.substring(0,10)+"</div>";
			html += "<div class='col-md-2 col-sm-2 col-xs-3'>";
			html += "<div class='btn-group folder-menu'>";
			html += "<button class='btn' onclick=\"UIFactory['UsersFolder'].restore('"+this.id+"')\" data-toggle='tooltip' data-placement='right' data-title='"+karutaStr[LANG]["button-restore"]+"'>";
			html += "<i class='fas fa-trash-restore'></i>";
			html += "</button>";
			html += " <button class='btn' onclick=\"confirmDelObject('"+this.id+"','UsersFolder')\" data-toggle='tooltip' data-placement='top' data-title='"+karutaStr[LANG]["button-delete"]+"'>";
			html += "<i class='fa fa-times'></i>";
			html += "</button>";
			html += "</div>";
			html += "</div><!-- class='col-md-2' -->";
		}
	}
	if (type=='select') {
		if (USER.admin || (USER.creator && !USER.limited) ){
			html += "<div class='col-md-1 col-xs-1'>"+this.getSelector(null,null,'select_folders',true)+"</div>";
			html += "<div class='col-md-3 col-sm-5 col-xs-7'><a class='folder-label' >"+folder_label+"</a> "+tree_type+"</div>";
			html += "<div class='col-md-3 hidden-sm hidden-xs '><a class='usersfolder-owner' >"+owner+"</a></div>";
			html += "<div class='col-md-3 col-sm-2 hidden-xs' >"+this.code+"</a></div>";
			html += "<div class='col-md-1 col-xs-2'>"+this.date_modified.substring(0,10)+"</div>";
		}
	}
	return html;
}

//======================
UIFactory["UsersFolder"].getAdminMenu = function(self,list)
//======================
{	
	var html = "";
	html += "<div class='dropdown folder-menu'>";
	if (USER.admin) {
		html += "	<button id='dropdown-usersfolder"+self.id+"' data-toggle='dropdown' class='btn dropdown-toggle'></button>";
		html += "	<div class='dropdown-menu dropdown-menu-right' aria-labelledby='dropdown-usersfolder"+self.id+"'>";
		html += "		<a class='dropdown-item' onclick=\"UIFactory.UsersFolder.callRename('"+self.id+"',null,"+list+")\" ><i class='fa fa-edit'></i> "+karutaStr[LANG]["rename"]+"</a>";
		html += "		<a class='dropdown-item' onclick=\"UIFactory['UsersFolder'].callMove('"+self.id+"')\" ><i class='button fas fa-random'></i> "+karutaStr[LANG]['move']+"</a>";
		html += "		<a class='dropdown-item' id='remove-"+self.id+"' style='display:block' onclick=\"UIFactory['UsersFolder'].remove('"+self.id+"')\" ><i class='far fa-trash-alt'></i> "+karutaStr[LANG]["button-delete"]+"</a>";
		html += "	</div>";
	} else {
		html += "	<button  data-toggle='dropdown' class='btn dropdown-toggle' style='visibility:hidden'>&nbsp;<span class='caret'></span>&nbsp;</button>";		
	}
	html += "			</div><!-- class='btn-group' -->";
	return html;
}

//==================================
UIFactory["UsersFolder"].prototype.getSelector = function(attr,value,name,checkbox)
//==================================
{
	var gid = this.id;
	var label = this.label_node.text();
	var html = "<input name='"+name+"' value='"+gid+"' type=";
	if (checkbox)
		html += "'checkbox'";
	else
		html += "'radio'";
	if (attr!=null && value!=null)
		html += " "+attr+"='"+value+"'";
	html += "> "+label+" </input>";
	return html;
};

//==================================
UIFactory["UsersFolder"].remove = function(id) 
//==================================
{
	var url = serverBCK_API+"/usersfolders/usersfolder/" + id + "?active=0";
	$.ajax({
		type : "PUT",
		contentType: "application/xml",
		dataType : "text",
		url : url,
		data : "",
		success : function(data) {
			UIFactory["UsersFolder"].displayAll('usersfolders','list');
			UIFactory["UsersFolder"].displayBin('bin','bin');
			$('[data-toggle=tooltip]').tooltip({html: true, trigger: 'hover'}); 

		},
		error : function(jqxhr,textStatus) {
			alertHTML("Error in remove : "+jqxhr.responseText);
		}
	});
};

//==================================
UIFactory["UsersFolder"].restore = function(id) 
//==================================
{
	var url = serverBCK_API+"/usersfolders/usersfolder/" + id + "?active=1";
	$.ajax({
		type : "PUT",
		contentType: "application/xml",
		dataType : "text",
		url : url,
		data : "",
		success : function(data) {
			for (var i=0;i<bin_list.length;i++){
				if (bin_list[i]!=null && bin_list[i].id==id) {
					usersfolders_list[usersfolders_list.length] = bin_list[i];
					usersfolders_byid[id] = bin_list[i];
					bin_list[i] = null;
					//---- sort portfolios_list ---
					var tableau1 = new Array();
					for (var k=0; k<usersfolders_list.length; k++){
						if (usersfolders_list[k]!=null){
						tableau1[tableau1.length] = [usersfolders_list[k].code_node.text(),usersfolders_list[k].id];
						}
					}
					var newTableau1 = tableau1.sort(sortOn1);
					usersfolders_list = [];
					for (var l=0; l<newTableau1.length; l++){
						usersfolders_list[l] = usersfolders_byid[newTableau1[l][1]]
					}
					//-----------------------------
					break;
				}
			}
			UIFactory["UsersFolder"].displayBin('bin','bin');
			UIFactory["UsersFolder"].displayAll('usersfolders','list');
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Error in restore : "+jqxhr.responseText);
		}
	});
};

//==================================
UIFactory["UsersFolder"].callRename = function(id,langcode,list)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var footer = "<button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	var self = usersfolders_byid[id];
	$("#edit-window-footer").html(footer);
	$("#edit-window-title").html(karutaStr[LANG]['rename']);
	var div = $("<div></div>");
	var htmlFormObj = $("<form class='form-horizontal'></form>");
	$(div).append($(htmlFormObj));
	if ((self.owner=='Y' && !USER.xlimited) || USER.admin) {
		var htmlCodeGroupObj = $("<div class='form-group'></div>")
		var htmlCodeLabelObj = $("<label for='code_"+id+"' class='col-sm-3 control-label'>Code</label>");
		var htmlCodeDivObj = $("<div class='col-sm-9'></div>");
		var htmlCodeInputObj = $("<input id='code_"+id+"' type='text' class='form-control' name='input_code' value=\""+self.code+"\">");
		$(htmlCodeInputObj).change(function (){
			UIFactory["UsersFolder"].rename(self,langcode,list);
		});
		$(htmlCodeDivObj).append($(htmlCodeInputObj));
		$(htmlCodeGroupObj).append($(htmlCodeLabelObj));
		$(htmlCodeGroupObj).append($(htmlCodeDivObj));
		$(htmlFormObj).append($(htmlCodeGroupObj));
	}
	if ((self.owner=='Y') || USER.admin) {
		var htmlLabelGroupObj = $("<div class='form-group'></div>")
		var htmlLabelLabelObj = $("<label for='code_"+portfolioid+"' class='col-sm-3 control-label'>"+karutaStr[LANG]['label']+"</label>");
		var htmlLabelDivObj = $("<div class='col-sm-9'></div>");
		var htmlLabelInputObj = $("<input id='label_"+portfolioid+"_"+langcode+"' type='text' class='form-control' value=\""+self.label_node[langcode].text()+"\">");
		$(htmlLabelInputObj).change(function (){
			UIFactory["UsersFolder"].rename(self,langcode,list);
		});
		$(htmlLabelDivObj).append($(htmlLabelInputObj));
		$(htmlLabelGroupObj).append($(htmlLabelLabelObj));
		$(htmlLabelGroupObj).append($(htmlLabelDivObj));
		$(htmlFormObj).append($(htmlLabelGroupObj));
	}

	$("#edit-window-body").html(div);
	$("#code_help").popover({ 
	    placement : 'right',
	    container : 'body',
	    title:karutaStr[LANG]['help-label'],
	    html : true,
	    trigger:'click hover',
	    content: karutaStr[LANG]['help_text_rename']
	});

	$('#edit-window').modal('show');
};

//==================================
UIFactory["UsersFolder"].rename = function(itself,langcode,list)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	var oldcode = $(itself.code);
	var code = $.trim($("#code_"+itself.id).val());
	//---------- test if new code already exists
	$(itself.code_node).text(code);
	itself.code = code;
	var label = $.trim($("#label_"+itself.id+"_"+langcode).val());
	$(itself.label_node[langcode]).text(label);
	var xml = "";
	xml +="		<usersfolder>";
	xml +="			<code>"+code+"</code>";
	for (var i=0; i<languages.length;i++){
		xml +="			<label lang='"+languages[i]+"'>"+$(itself.label_node[i]).text()+"</label>";	
	}
	xml +="		</usersfolder>";
	strippeddata = xml.replace(/xmlns=\"http:\/\/www.w3.org\/1999\/xhtml\"/g,"");  // remove xmlns attribute
	var callback = function () {
		$("#treenode-usersfolderlabel_"+itself.id).html($(label));
		if (list)
			$("#item-usersfolder_"+itself.id).html($(itself.getView('item-usersfolder_'+itself.id,'list')));
		else {
			$("#usersfolderlabel_"+itself.id).html($(label));
		}
	};
	UICom.query("PUT",serverBCK_API+'/usersfolders/usersfolder/'+itself.id+'',callback,"text",strippeddata);
};

//==================================
UIFactory["UsersFolder"].prototype.update = function(node)
//==================================
{
	var current_node = this.node;
	if ($("code",node)!=undefined){
		this.code_node = $("code",node);
		this.code = $(this.code_node).text();
//		$("code",current_node).replaceWith( $("code",node));
		$("code",current_node).text( $("code",node));
	}
	if ($(node).attr('modified')!=undefined) {
		this.date_modified = $(node).attr('modified');
		$("code",current_node).replaceWith( $("code",node));
	}
	//------------------------------
	for (var i=0; i<languages.length;i++){
		if ($("label[lang='"+languages[i]+"']",node)!=undefined){
			this.label_node[i] = $("label[lang='"+languages[i]+"']",node);
			if (this.label_node[i].length==0) {
				var newElement = createXmlElement("label");
				$(newElement).attr('lang', languages[i]);
				$(newElement).text(karutaStr[languages[languages[i]],'new']);
				$(node)[0].appendChild(newElement);
				this.label_node[i] = $("label[lang='"+languages[i]+"']",node);
			}			
			$("label[lang='"+languages[i]+"']",current_node).text(this.label_node[i].text());
		}
	}
	this.node = current_node;
}

//==================================
UIFactory["UsersFolder"].createFolder = function()
//==================================
{
	$("#edit-window-title").html(karutaStr[LANG]['create_folder']);
	$("#edit-window-footer").html("");
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var create_button = "<button id='create_button' class='btn'>"+karutaStr[LANG]['Create']+"</button>";
	var obj = $(create_button);
	$(obj).click(function (){
		var code = $("#code").val();
		var label = $("#label").val();
		if (code!='' && label!='') {
			var url = serverBCK_API+"/usersfolders";
			var data = "<usersfolder<code>"+code+"</code><label lang='"+LANG+"'>"+label+"</label></usersfolder>";
			$.ajax({
				type : "POST",
				contentType: "application/xml",
				dataType : "xml/text",
				url : url,
				data : data,
				success : function(data) {
					$("#refresh").click();
					//--------------------------
					$('#edit-window').modal('hide');
				},
				error : function(jqxhr,textStatus) {
					alertHTML("Error : "+jqxhr.responseText);
					//--------------------------
					$('#edit-window').modal('hide');
				}
			});
		} else {
			if (code=='')
				alertHTML(karutaStr[LANG]['code-not-null']);
			if (label=='')
				alertHTML(karutaStr[LANG]['label-not-null']);
		}
	});
	$("#edit-window-footer").append(obj);
	var footer = " <button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Cancel']+"</button>";
	$("#edit-window-footer").append($(footer));

	var html = "<div class='form-horizontal'>";
	html += "<div class='form-group'>";
	html += "		<label for='code' class='col-sm-3 control-label'>Code</label>";
	html += "		<div class='col-sm-9'>";
	html += "			<input id='code' type='text' class='form-control'>";
	html += "		</div>";
	html += "</div>";
	html += "<div class='form-group'>";
	html += "		<label for='label' class='col-sm-3 control-label'>"+karutaStr[LANG]['label']+"</label>";
	html += "		<div class='col-sm-9'>";
	html += "			<input id='label' type='text' class='form-control'>";
	html += "		</div>";
	html += "</div>";
	html += "</div>";
	$("#edit-window-body").html(html);
	//--------------------------
	$('#edit-window').modal('show');
};

//==================================
UIFactory["UsersFolder"].del = function(id) 
//==================================
{
	var url = serverBCK_API+"/usersfolders/usersfolder/" + id;
	$.ajax({
		type : "DELETE",
		contentType: "application/xml",
		dataType : "xml",
		url : url,
		data : "",
		success : function(data) {
			var pos_item = 0;
			for (var i=0;i<bin_usersfolder_list.length;i++){
				if (bin_usersfolder_list[i]!=null && bin_usersfolder_list[i].id==id) {
					bin_usersfolder_list[i] = null;
					pos_item = i;
					break;
				}
			}
			var new_length = bin_usersfolder_list.length-1;
			for (var i=pos_item;i<new_length;i++){
				bin_usersfolder_list[i] = bin_usersfolder_list[i+1];
			}
			if ($("#bin").length>0) { // not a batch call
				UIFactory["UsersFolder"].displayBin('bin','bin');
				$('[data-toggle=tooltip]').tooltip({html: true, trigger: 'hover'}); 

			}
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Error in del : "+jqxhr.responseText);
		}
	});
};

//==================================
UIFactory["UsersFolder"].parse = function(data) 
//==================================
{
	usersfolders_byid = {};
	usersfolders_list = [];		
	var items = $("usersfolder",data);
	var tableau1 = new Array();
	for (var i = 0; i < items.length; i++) {
		var id = $(items[i]).attr('id');
		usersfolders_byid[id] = new UIFactory["UsersFolder"](items[i]);
		var code = usersfolders_byid[id].code;
		tableau1[i] = [code,id];
	}
	var newTableau1 = tableau1.sort(sortOn1);
	for (var i=0; i<newTableau1.length; i++){
		usersfolders_list[i] = usersfolders_byid[newTableau1[i][1]]
	}
};

//==================================
UIFactory["UsersFolder"].parseStructure = function(data,parentid) 
//==================================
{
	var items = $("usersfolder",data);
	var tableau1 = new Array();
	for (var i = 0; i < items.length; i++) {
		var id = $(items[i]).attr('id');
		if (usersfolders_byid[id]==undefined){
			usersfolders_byid[id] = new UIFactory["UsersFolder"](items[i]);
		} else
			usersfolders_byid[id].update(items[i]);			
		var code = usersfolders_byid[id].code;
		tableau1[i] = [code,id];
	}
	if (usersfolders_byid[parentid]!=undefined){
		var newTableau1 = tableau1.sort(sortOn1);
		for (var i=0; i<newTableau1.length; i++){
			usersfolders_byid[parentid].folders_list[i] = usersfolders_byid[newTableau1[i][1]]
		}
		usersfolders_byid[parentid].loadedStruct = true;
		usersfolders_byid[parentid].nb_folders = usersfolders_byid[parentid].folders_list.length;
	}
};

//==================================
UIFactory["UsersFolder"].parseChildren = function(data,parentid) 
//==================================
{
	var children = $(data).children();

	var list = [];
	for( var i=0; i<children.length; ++i ) {
		var child = children[i];
		var tagname = $(child)[0].tagName;
		if("USERSFOLDER"==tagname || "USER"==tagname) {
			var id = $(child).attr("id");
			list[i] = {};
			list[i]['type'] = tagname;
			if("USERSFOLDER"==tagname) {
				if (usersfolders_byid[id]==undefined)
					usersfolders_byid[id] = new UIFactory["UsersFolder"](child);
				else usersfolders_byid[id].update(child);
				list[i]['obj'] = usersfolders_byid[id];
			} else {
				if (Users_byid[id]==undefined)
					Users_byid[id] = new UIFactory["User"](child);
				//else Users_byid[id].update(child);
				list[i]['obj'] = Users_byid[id];
			}
		}
	}
	usersfolders_byid[parentid].chidren_list[usersfolders_byid[parentid].pageindex] = list;
};

//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------

//==================================
function loadAndDisplayUsersFolderStruct(dest,id,langcode) {
//==================================
	$("#wait-window").show();
	toggleElt('closeSign','openSign','usersfolder_'+id);
	if (!usersfolders_byid[id].loadedStruct)
		loadUsersFolderStruct(dest,id,langcode);
	else {
//		UIFactory.Folder.displayTree(dest,'list',langcode,id);
	}
	$("#wait-window").hide();
}

//==============================
function loadUsersFolderStruct(dest,id,langcode)
//==============================
{
	if (karuta_backend_version.startsWith("x2.")) {
		$("#usersfolders").hide();
		$("#bin-usersfolders").hide();
		$("#create-folder-button").hide();
		$("#users-in-rootfolder").show();
		$("#users-in-bin").show();
//		$("#users-label").html("<span>"+karutaStr[LANG]["active_users"]+"</span>");
//		$("#bin-usersfolders-label").html("<span>"+karutaStr[LANG]["inactive_users"]+"</span>");
	} else {
		if (id=="active") { //root folder
			var data = "<usersfolders id='active' nb_folders='3' nb_users='0'>"
				+"<usersfolder id='1' nb_folders='0' nb_users='3' owner='Y'  ownerid='1' modified='2019-12-02 12:19:02.0'><code>folder1</code><label lang='en'>System Users</label><label lang='fr'>Usagers Système</label></usersfolder>"
				+"<usersfolder id='2' nb_folders='3' nb_users='7' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>folder2</code><label lang='en'>Folder 2</label><label lang='fr'>Dossier 2</label></usersfolder>"
				+"<usersfolder id='3' nb_folders='2' nb_users='2' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>folder3</code><label lang='en'>Folder 3</label><label lang='fr'>Dossier 3</label></usersfolder>"
				+"</userfolders>";
			
		}
		if (id=="2") { 
			var data = "<usersfolders id='2' nb_folders='3' nb_users='0'>"
				+"<usersfolder id='2.1' nb_folders='0' nb_users='5' owner='Y'  ownerid='1' modified='2019-12-02 12:19:02.0'><code>folder1</code><label lang='en'>System Users</label><label lang='fr'>dossier2.1</label></usersfolder>"
				+"<usersfolder id='2.2' nb_folders='3' nb_users='52' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>folder2</code><label lang='en'>Folder 2</label><label lang='fr'>Dossier 2.2</label></usersfolder>"
				+"<usersfolder id='2.3' nb_folders='2' nb_users='2' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>folder3</code><label lang='en'>Folder 3</label><label lang='fr'>Dossier 2.3</label></usersfolder>"
				+"</userfolders>";
			
		}
		if (id=="inactive") { //bin folder
			var data = "<usersfolders d='inactive' nb_folders='0' nb_users='1'>"
					+"<usersfolder id='4' nb_folders='2' nb_users='2' owner='Y'  ownerid='20' modified='2019-12-02 12:19:02.0'><code>folder3</code><label lang='en'>Folder 3</label><label lang='fr'>Dossier 3</label></usersfolder>"
					+"</userfolders>";
			
		}
		UIFactory["UsersFolder"].parseStructure(data,id);
		UIFactory["UsersFolder"].displayTree(dest,'list',langcode,id);
	}
/*		$.ajax({
			id : id,
			type : "GET",
			dataType : "xml",
			url : serverBCK_API+"/folder/usersfolder/"+id+"?type=structure",
			success : function(data) {
				UIFactory["UsersFolder"].parse_add(data);
				UIFactory["UsersFolder"].displayTree(dest,'list',langcode,id);
			},
			error : function(jqxhr,textStatus) {
			}
		});
	}
*/

}

//==================================
function loadAndDisplayUsersFolderContent(dest,id,langcode,type) {
//==================================
	$("#wait-window").show();
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	if (id=="0" && usersfolders_byid[id]==undefined) {
		$("#folder-users").html("<div id='active'></div>");
		fill_list_usersOLD();
	} else if (id=="1" && usersfolders_byid[id]==undefined) {
		$("#folder-users").html("<div id='inactive'></div>");
		fill_list_usersOLD();
	} else {
		if (usersfolders_byid[id].nb_folders > 0){
			loadAndDisplayUsersFolderStruct('collapse_usersfolder_'+id,id,langcode)
		}
		toggleOpenElt('closeSign','openSign','usersfolder_'+id);
		var index_class = 1;
		UIFactory.UsersFolder.displayFolderContent(dest,id,langcode,index_class);
		selectElt('usersfolder','usersfolder_'+id);
		var dest_page = dest + '-pages';
		var list = usersfolders_byid[id].chidren_list[usersfolders_byid[id].pageindex];
		if (list==undefined||list==null){
			loadUsersFolderContent(dest_page,id,langcode,type,index_class);		
		}
		else {
			usersfolders_byid[id].displayFolderContentPage(dest_page,type,langcode,index_class);		
		}
	}
	$(window).scrollTop(0);
	$("#wait-window").hide();
}

//==================================
function loadAndDisplayUsersFolderContentPage(dest,type,id,langcode,pageindex,index_class) {
//==================================
	$("#wait-window").show();
	usersfolders_byid[id].pageindex = ""+pageindex;
	var list = usersfolders_byid[id].chidren_list[usersfolders_byid[id].pageindex];
	if (list==undefined||list==null)
		loadUsersFolderContent(dest,id,langcode,type,pageindex);
	else {
		usersfolders_byid[id].displayFolderContentPage(dest,type,langcode,index_class);		
	}
	$("#wait-window").hide();
}

//==============================
function loadUsersFolderContent(dest,id,langcode,type,index_class)
//==============================
{
	var pageindex = usersfolders_byid[id].pageindex;
	var nb_users = usersfolders_byid[id].nb_users;
	var data = "";
	if (id=='1' && index_class==1) {
		data =  "<usersfolder id='1' nb_folders='0' nb_users='3'>";
		data += "<user id='1'><username>root</username><firstname>root</firstname><lastname></lastname><admin>1</admin><designer>0</designer><email>null</email><active>1</active><substitute>0</substitute><other></other></user>";
		data += "<user id='2'><username>sys_public</username><firstname>System public account (users with account)</firstname><lastname></lastname><admin>0</admin><designer>0</designer><email>null</email><active>1</active><substitute>0</substitute><other></other></user>";
		data += "<user id='3'><username>public</username><firstname>Public account (World)</firstname><lastname></lastname><admin>0</admin><designer>0</designer><email>null</email><active>1</active><substitute>0</substitute><other></other></user>";
		data += "</usersfolder>";
	}
	if (id=='2') {
		if (index_class==1) {
		data =  "<usersfolder id='2' nb_folders='3' nb_users='7'>";
		data += "<user id='4'><username>olivier</username><firstname>Olivier</firstname><lastname>Gerbé</lastname><admin>0</admin><designer>0</designer><email>olivier.gerbe@gmail.com</email><active>1</active><substitute>0</substitute><other></other></user>";
		data += "<user id='5'><username>saint-exupery@litterature.fr</username><firstname>Antoine</firstname><lastname>de Saint-Exupéry</lastname><admin>0</admin><designer>0</designer><email>saint-exupery@litterature.fr</email><active>1</active><substitute>0</substitute><other></other></user>";
		data += "<user id='6'><username>beaudelaire@litterature.fr</username><firstname>Charles</firstname><lastname>Beaudelaire</lastname><admin>0</admin><designer>0</designer><email>beaudelaire@litterature.fr</email><active>1</active><substitute>0</substitute><other></other></user>";
		data += "<user id='7'><username>hugo@litterature.fr</username><firstname>Victor</firstname><lastname>Hugo</lastname><admin>0</admin><designer>0</designer><email>hugo@litterature.fr</email><active>1</active><substitute>0</substitute><other></other></user>";
		data += "</usersfolder>";
		}
		if (index_class==2) {
			data =  "<usersfolder id='2' nb_folders='3' nb_users='7'>";
			data += "<user id='8'><username>flaubert@litterature.fr</username><firstname>Gustave</firstname><lastname>Flaubert</lastname><admin>0</admin><designer>0</designer><email>flaubert@litterature.fr</email><active>1</active><substitute>0</substitute><other></other></user>";
			data += "<user id='9'><username>maupassant@litterature.fr</username><firstname>Guy</firstname><lastname>de Maupassant</lastname><admin>0</admin><designer>0</designer><email>maupassant@litterature.fr</email><active>1</active><substitute>0</substitute><other></other></user>";
			data += "<user id='10'><username>camus@litterature.fr</username><firstname>Albert</firstname><lastname>Camus</lastname><admin>0</admin><designer>0</designer><email>camus@litterature.fr</email><active>1</active><substitute>0</substitute><other></other></user>";
			data += "</usersfolder>";
		}
	}
	UIFactory.UsersFolder.parseChildren(data,id); 
	usersfolders_byid[id].displayFolderContentPage(dest,type,langcode,index_class);

/*
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/usersfolders/usersfolder/"+id+"?type=children&r="+pageindex+"&limit=100",
		success : function(data) {
			UIFactory["UsersFolder"].parseChildren(data,id); 
			usersfolders_byid[id].displayFolderContentPage(dest,type,langcode,index_class);		
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Server Error GET active: "+textStatus);
		}
	});
	
*/
}

/*=======================================*/
/*========		À DÉPLACER		=========*/
/*=======================================*/

//*** à déplacer dans karuta.js
//=======================================================================
function confirmDelObject(id,type) 
// =======================================================================
{
	document.getElementById('delete-window-body').innerHTML = karutaStr[LANG]["confirm-delete"];
	var buttons = "<button class='btn' onclick=\"javascript:$('#delete-window').modal('hide');\">" + karutaStr[LANG]["Cancel"] + "</button>";
	buttons += "<button class='btn btn-danger' onclick=\"javascript:$('#delete-window').modal('hide');UIFactory."+type+".del('"+uuid+"')\">" + karutaStr[LANG]["button-delete"] + "</button>";
	document.getElementById('delete-window-footer').innerHTML = buttons;
	$('#delete-window').modal('show');
}


//*** à déplacer pour remplacer dans users.js

//==============================
function getUsersList2()
//==============================
{
	var html = "";
//	var text0 = karutaStr[LANG]['users-folders'];
	var text0 = karutaStr[LANG]['folders'];
	var text1 = karutaStr[LANG]['users-in-rootfolder'];
	html += "<div id='gutter'></div>";
	html += "<div id='userslist-rightside'>";
	//-----------------------------------------------------------
		html += "<div id='folder-users'></div>";
	//-----------------------------------------------------------
	html += "</div><!--div id='userslist-rightside'-->";

	html += "<div id='userslist-leftside'>";
	//--------------------FOLDERS---------------------------------------
	html += "<h3><i class='far fa-address-book fa-lg' ></i><span id='usersfolders-label'>"+text0+"</span>&nbsp<span class='folders-nb badge' id='usersfolders-nb'></span>";
	html +="	<button class='btn list-btn' onclick='UIFactory.UsersFolder.createFolder()'>"+karutaStr[LANG]['create_folder']+"</button>";
	html += "</h3>";
	html += "<div id='usersfolders' class='tree user'></div>";

	//--------------------USERS--------------------------------------
	html += "<h3 id='users-in-rootfolder'>";
	html += "	<span id='users-label'>"+text1+"</span>&nbsp<span class='users-nb badge' id='users-nb'></span>";
	html += "	<button class='btn list-btn' onclick=\"loadAndDisplayUsersFolderContent('folder-users','0');$(window).scrollTop(0);$('.project').removeClass('active');\">"+ karutaStr[LANG]["see"] + "</button>";
	html += "</h3>";

	if (USER.admin) {
		//---------------------BIN-------------------------------------
		var text2 = karutaStr[LANG]['bin']+" - "+karutaStr[LANG]['inactive_users'];
		html += "<h3 id='bin-usersfolders-label'>"+text2+"&nbsp<span class='bin-nb badge' id='bin-usersfolders-nb'></span>";
		html += "<button class='btn list-btn' onclick=\"UIFactory.UsersFolder.displayBin('folder-users','bin');$(window).scrollTop(0);$('.project').removeClass('active');\">"+ karutaStr[LANG]["see-bin"] + "</button>";
		html += "</h3>";
	}
	//-----------------------------------------------------------
	var text3 = karutaStr[LANG]['temporary_users'];
	html += "	<h3 id='temporary-users' style='display:none'>"+text3;
	html += "		&nbsp<button class='btn list-btn' onclick=\"confirmDelTemporaryUsers()\">";
	html += 		karutaStr[LANG]["delete-temporary-users"];
	html += "		</button>";
	html += "	</h3>";
	//-----------------------------------------------------------
	html += "</div><!--div id='userslist-leftside'-->";

	return html;
}



//==============================
function initUsersFolders()
//==============================
{
	var data = "<usersfolder id='active' nb_folder='0' nb_user='0' owner='Y'  ownerid='1'><code>1</code><label lang='en'>"+karutaStr['en']['folders']+"</label><label lang='fr'>"+karutaStr['fr']['folders']+"</label></usersfolder>";
	usersfolders_byid['active'] = new UIFactory["UsersFolder"](data);
	data = "<usersfolder id='bin' nb_folders='0' nb_users='0' owner='Y'  ownerid='1'><code>temporary</code><label lang='en'>"+karutaStr['en']['temporary_users']+"</label><label lang='fr'>"+karutaStr['fr']['temporary']+"</label></usersfolder>";
	usersfolders_byid['temporary'] = new UIFactory["UsersFolder"](data);
	data = "<usersfolder id='inactive' nb_folders='0' nb_users='0' owner='Y'  ownerid='1'><code>1</code><label lang='en'>"+karutaStr['en']['bin']+" - "+karutaStr['en']['inactive_users']+"</label><label lang='fr'>"+karutaStr['fr']['bin']+" - "+karutaStr['fr']['inactive_users']+"</label></usersfolder>";
	usersfolders_byid['inactive'] = new UIFactory["UsersFolder"](data);
}

