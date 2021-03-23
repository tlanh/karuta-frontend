/* =======================================================
	Copyright 2018 - ePortfolium - Licensed under the
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

/// Check namespace existence
if( UIFactory === undefined )
{
  var UIFactory = {};
}
 
//==================================
UIFactory["DocumentBlock"] = function( node )
//==================================
{
	this.id = $(node).attr('id');
	this.node = node;
	this.type = 'DocumentBlock';
	//--------------------
	this.document_node = $("asmContext:has(metadata[semantictag='docblock-document'])",node);
	this.document_nodeid = this.document_node.attr('id');
	this.document_editresroles = ($(this.document_node[0].querySelector("metadata-wad")).attr('editresroles')==undefined)?'':$(this.document_node[0].querySelector("metadata-wad")).attr('editresroles');
	//--------------------
	this.image_node = $("asmContext:has(metadata[semantictag='docblock-image'])",node);
	this.image_nodeid = this.image_node.attr('id');
	this.image_editresroles = ($(this.image_node[0].querySelector("metadata-wad")).attr('editresroles')==undefined)?'':$(this.image_node[0].querySelector("metadata-wad")).attr('editresroles');
	//--------------------
	this.cover_node = $("asmContext:has(metadata[semantictag='docblock-cover'])",node);
	this.cover_nodeid = this.cover_node.attr('id');
	this.cover_editresroles = ($(this.cover_node[0].querySelector("metadata-wad")).attr('editresroles')==undefined)?'':$(this.cover_node[0].querySelector("metadata-wad")).attr('editresroles');
	//--------------------
	this.multilingual = ($("metadata",node).attr('multilingual-node')=='Y') ? true : false;
	this.display = {};
};


/// Display
//==================================
UIFactory["DocumentBlock"].prototype.getView = function(dest,type,langcode)
//==================================
{
	var document = UICom.structure["ui"][this.document_nodeid];
	var image = UICom.structure["ui"][this.image_nodeid];
	var cover = UICom.structure["ui"][this.cover_nodeid];
	//---------------------
	UICom.structure.ui[this.document_nodeid].resource.blockparent = UICom.structure.ui[this.id];
	UICom.structure.ui[this.image_nodeid].resource.blockparent = UICom.structure.ui[this.id];
	UICom.structure.ui[this.cover_nodeid].resource.blockparent = UICom.structure.ui[this.id];
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	if (dest!=null) {
		this.display[dest] = {langcode: langcode, type : type};
	}
	//---------------------
	if (type==null)
		type = "standard";
	//---------------------
	var html = "";
	if (type=='standard'){
		//----------------------------------------
		var img_width = ($(image.resource.width_node[langcode]).text()!=undefined && $(image.resource.width_node[langcode]).text()!='') ? $(image.resource.width_node[langcode]).text() : "";
		var img_height = ($(image.resource.height_node[langcode]).text()!=undefined && $(image.resource.height_node[langcode]).text()!='') ? $(image.resource.height_node[langcode]).text() : "";
		if (img_width!="" && img_width.indexOf('px')<0)
			img_width += "px";
		if (img_height!="" && img_height.indexOf('px')<0)
			img_height += "px";
		var image_size = "";
		if (img_width!="")
			image_size += " width:"+img_width + ";";
		if (img_height!="")
			image_size += " height:" + img_height + ";";
		//----------------------------------------
		var filename = $(document.resource.filename_node[langcode]).text();
		html =  "<a style='text-decoration:none;color:inherit' id='file_"+document.id+"' href='../../../"+serverBCK+"/resources/resource/file/"+document.id+"?lang="+languages[langcode]+"'>";
		var style = "background-repeat:no-repeat; background-image:url('../../../"+serverBCK+"/resources/resource/file/"+image.id+"?lang="+languages[langcode]+"&timestamp=" + new Date().getTime()+"'); " +image_size;
		if (cover!=undefined && cover.resource.getValue()=='1')
			style += " background-size:cover;";
		html += "<div class='DocBlock' style=\""+style+"\">";
		style = UICom.structure["ui"][this.id].getLabelStyle();
		if (filename!="") {
			if (UICom.structure["ui"][this.id].getLabel(null,'none')!='')
				html += "<div id='label_"+this.id+"' class='block-title' style=\""+style+"\">"+UICom.structure["ui"][this.id].getLabel('label_'+this.id,'none')+"</div>";
			else
				html += "<div class='block-title' style=\""+style+"\">"+filename+"</div>";
		} else
			html += "<div class='block-title' style=\""+style+"\">"+karutaStr[LANG]['no-document']+"</div>";
		html += "</div>";
		html += "</a>";
	}
	return html;
};

//==================================
UIFactory["DocumentBlock"].prototype.displayView = function(dest,type,langcode)
//==================================
{
	var html = this.getView(dest,type,langcode);
	$("#"+dest).html(html);
	$("#std_node_"+this.id).attr('style','visibility:hidden');
	$("#menus-"+this.id).hide();
};

//==================================
UIFactory["DocumentBlock"].prototype.getButtons = function(dest,type,langcode)
//==================================
{
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	var html = "";
	if (this.document_editresroles.containsArrayElt(g_userroles) || this.image_editresroles.containsArrayElt(g_userroles)){
		html += "<span data-toggle='modal' data-target='#edit-window' onclick=\"javascript:getEditBox('"+this.id+"')\"><span class='button fas fa-pencil-alt' data-toggle='tooltip' data-title='"+karutaStr[LANG]["button-edit"]+"' data-placement='bottom'></span></span>";
	}
	if (html!="")
		html = "<div class='buttons-menus' id='btn-spec-"+this.id+"'>" + html + "</div><!-- #btn-+node.id -->";
	return html;
};

//==================================
UIFactory["DocumentBlock"].prototype.displayEditor = function(destid,type,langcode)
//==================================
{
	if (!USER.admin && g_userroles[0]!='designer')
		$("#edit-window").addClass("Block");
	//---------------------
	var document = UICom.structure["ui"][this.document_nodeid];
	var image = UICom.structure["ui"][this.image_nodeid];
	var cover = UICom.structure["ui"][this.cover_nodeid];
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	if (this.document_editresroles.containsArrayElt(g_userroles) || USER.admin || g_userroles[0]=='designer'){
		$("#"+destid).append($("<h4>"+karutaStr[LANG]['Document']+"</h4>"));
		document.resource.displayEditor(destid,type,langcode,this);
	}
	//---------------------
	if (this.image_editresroles.containsArrayElt(g_userroles) || USER.admin || g_userroles[0]=='designer'){
		$("#"+destid).append($("<h4>"+karutaStr[LANG]['Image']+"</h4>"));
		$("#"+destid).append($("<div>"+karutaStr[LANG]['block-image-size']+"</div>"));
		image.resource.displayEditor(destid,type,langcode,this);
	}
	//---------------------
	if (cover!=undefined && this.cover_editresroles.containsArrayElt(g_userroles) || USER.admin || g_userroles[0]=='designer'){
		$("#"+destid).append($("<h4>"+karutaStr[LANG]['coverage']+"</h4>"));
		cover.resource.displayEditor(destid,type,langcode,this);
	}
	//---------------------
	var graphicerroles = ($(UICom.structure.ui[this.id].metadatawad).attr('graphicerroles')==undefined)?'none':$(UICom.structure.ui[this.id].metadatawad).attr('graphicerroles');
	var editnoderoles = ($(UICom.structure.ui[this.id].metadatawad).attr('editnoderoles')==undefined)?'none':$(UICom.structure.ui[this.id].metadatawad).attr('editnoderoles');
	if (USER.admin || g_userroles[0]=='designer' || (graphicerroles.containsArrayElt(g_userroles) && editnoderoles.containsArrayElt(g_userroles)) || (graphicerroles.indexOf($UICom.structure.ui[this.id].userrole)>-1 && editnoderoles.indexOf($UICom.structure.ui[this.id])>-1)) {
		$("#"+destid).append($("<h4 style='margin-top:10px'>"+karutaStr[LANG]['css-styles']+"</h4>"));
	}
}

//==================================
UIFactory["DocumentBlock"].prototype.refresh = function()
//==================================
{
	for (dest in this.display) {
		$("#"+dest).html(this.getView(null,this.display[dest].type,this.display[dest].langcode));
	};

};
