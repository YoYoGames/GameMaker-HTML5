// **********************************************************************************************************************
//
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
//
// File:            Function_ClickableButton.js
// Created:         16/02/2011
// Author:          Mike
// Project:         HTML5
// Description:
//
// **********************************************************************************************************************


var g_ButtonIDLookup =[];
var g_ButtonIDCounter =0;






// #############################################################################################
/// Function:<summary>
///             Create a DOM button
///          </summary>
///
/// In:     <param name="_x">X coordinate</param>
///         <param name="_y">Y coordinate</param>
///         <param name="_tpe">Texture page entry</param>
///         <param name="_URL">URL to open</param>
///         <param name="_target">Target for window</param>
///         <param name="_params">window paramaters</param>
/// Out:    <returns>
///             The new Button ID
///         </returns>
// #############################################################################################
function disableSelection(target){

    if (typeof target.onselectstart!="undefined") //IE route
    {
        target.onselectstart=function(){return false;};
    }
    else if (typeof target.style.MozUserSelect!="undefined") //Firefox route
    {
        target.style.MozUserSelect="none";
    }
    else //All other route (ie: Opera)
    {
        target.onmousedown=function(){return false;};
    }

    target.style.cursor = "default";
}

function BE_CreateButton( _x, _y,  _tpe, _URL, _target, _params)
{
    // Create a DIV which holds the image, and "clips" the texture page
	var obj = document.getElementById("canvas").parentNode;
	var canv = document.getElementById("canvas");
    var dv1 = document.createElement("div");
    
    dv1.style.cssText = "-moz-user-select: -moz-none;-khtml-user-select: none;-webkit-user-select: none;-ms-user-select: none;user-select: none;";
    dv1.draggable = false;
    dv1.setAttribute("id", "gamemaker_image");
  
    dv1.style.position="absolute";
    dv1.tpe = _tpe;
    var left = _x+ _tpe.tpe_XOffset;//-_tpe.tpe_x + _tpe.tpe_XOffset;
    var top = _y + _tpe.tpe_YOffset;//-_tpe.tpe_y + _tpe.tpe_YOffset;
   
   
    dv1.style.left = left+"px";
    dv1.style.top = top+"px";
    dv1.style.width=_tpe.tpe_CropWidth+"px";        
    dv1.style.height=_tpe.tpe_CropHeight+"px";               // appears to be the "center" offset
   
    dv1.style.padding = "0px";
    dv1.style.margin = "0px";
    dv1.style.border = "0px";
  
    disableSelection(dv1);
    
    
    dv1.angle = 0;
    dv1.x = _x;
    dv1.y = _y;

	// Add image INTO link container    

    var newlink = document.createElement('button');
    newlink.onmousemove = onMouseMove;
    newlink.type = "button";

    newlink.style.cursor = dv1.style.cursor = canv.style.cursor;

    newlink.style.width = _tpe.tpe_CropWidth + "px";
    newlink.style.height = _tpe.tpe_CropHeight + "px";

    newlink.style.opacity = "1.0";

    newlink.style.backgroundColor = "rgba(0, 0, 0, 0.0)";
    newlink.style.border = "0px";
    
    //newlink.style.cssText += "background: rgba(0, 0, 0, 0.0); border:0px;";
 //   newlink.style.cssText += "width:"+_tpe.tpe_CropWidth+"px;height:"+_tpe.tpe_CropHeight+"px;background: rgba(0, 0, 0, 0.0); border:0px;";

    newlink.style.backgroundImage = "url(" + _tpe.tpe_texture.src + ")";
   // newlink.style.cssText += "background-image:url(" + _tpe.tpe_texture.src + ");";

    newlink.style.backgroundPosition = (-_tpe.tpe_x) + "px " + (-_tpe.tpe_y) + "px";
    //background-position:-"+(_tpe.tpe_x)+"px -"+(_tpe.tpe_y)+"px;";
    //newlink.style.setAttribute("background-image", "url(\'" + _tpe.tpe_texture.src + "\');");
    //newlink.style.setAttribute("backgroundPosition","-"+(_tpe.tpe_x)+"px -"+(_tpe.tpe_y)+"px;");

    newlink.onclick = function(){
            if((_URL.substring(0, 6) == "http:/") || (_URL.substring(0, 6) == "https:")){
                var Popup=window.open(_URL,_target,_params);return false;
               } else
               {
				//
               	// Callbacks MUST be called "callback_??????" The obfuscater detects this
               	// naming convention and DOES NOT OBFUSCATED THESE SPECIAL LABELS!!
				//
                var pFunc = eval("gml_Script_" + _URL);
                if (pFunc) pFunc(null,null,_target,_params);
                return false;
            }
    };
    
    dv1.insertBefore(newlink, null);
    
    obj.insertBefore(dv1, null);
    return dv1;
}

// #############################################################################################
/// Function:<summary>
///          	Add a button
///          </summary>
///
/// In:     <param name="_x">X coordinate</param>
///         <param name="_y">Y coordinate</param>
///         <param name="_tpe">Texture page entry</param>
///         <param name="_URL">URL to open</param>
///         <param name="_target">Target for window</param>
///         <param name="_params">window paramaters</param>
/// Out:	<returns>
///				The new Button ID
///			</returns>
// #############################################################################################
function clickable_add( _x, _y,  _tpe, _URL, _target, _params ) 
{
    g_ButtonIDLookup[g_ButtonIDCounter] = BE_CreateButton(yyGetReal(_x), yyGetReal(_y),  _tpe, yyGetString(_URL), yyGetString(_target), yyGetString(_params));
    return g_ButtonIDCounter++;
}

function clickable_add_ext( _x, _y,  _tpe, _URL, _target, _params,_scale ,_alpha) 
{
    _x = yyGetReal(_x);
    _y = yyGetReal(_y);
    _URL = yyGetString(_URL);
    _target = yyGetString(_target);
    _params = yyGetString(_params);

	g_ButtonIDLookup[g_ButtonIDCounter] = BE_CreateButton(_x, _y,  _tpe, _URL, _target, _params);
	clickable_change_ext(g_ButtonIDCounter,_tpe,_x,_y, yyGetReal(_alpha), yyGetReal(_scale));
	
    return g_ButtonIDCounter++;
}


// #############################################################################################
/// Function:<summary>
///             Does a button exist?
///          </summary>
///
/// In:     <param name="_id">Button ID</param>
// #############################################################################################
function clickable_exists(_id) 
{
    var div1 = g_ButtonIDLookup[yyGetInt32(_id)];
    if (div1) {
        return true;
    } else {
        return false;
    }
}


// #############################################################################################
/// Function:<summary>
///             Delete a button
///          </summary>
///
/// In:     <param name="_id">Button ID</param>
// #############################################################################################
function clickable_delete( _id) 
{
    _id = yyGetInt32(_id);

    var div1 = g_ButtonIDLookup[_id]; 
    if( div1 ){
         div1.parentNode.removeChild( div1);
         g_ButtonIDLookup[_id] = undefined;
    }
}

function clickable_change( _id,_tpe,_x,_y)
{
    var div1 = g_ButtonIDLookup[yyGetInt32(_id)]; 
    if( div1 )
    {
        if(div1.firstChild)
        {
            var butt = div1.firstChild;
        
            var left = yyGetReal(_x) + _tpe.tpe_XOffset;
            var top = yyGetReal(_y) + _tpe.tpe_YOffset;
   
    
            div1.style.left = left+"px";
            div1.style.top = top+"px";
            div1.style.width= (_tpe.tpe_CropWidth)+"px";        
            div1.style.height=(_tpe.tpe_CropHeight)+"px"; 
            
            butt.style.left = div1.style.left;
            butt.style.right = div1.style.top; 
            
            
            butt.style.width =div1.style.width;
            butt.style.height =div1.style.height;
            
            //butt.style.cssText += "background-position:-"+(_tpe.tpe_x)+"px -"+(_tpe.tpe_y)+"px;";

            butt.style.backgroundPosition = (-_tpe.tpe_x) + "px " + (-_tpe.tpe_y) + "px";
        //    butt.style.backgroundPositionX = "-" + (_tpe.tpe_x) + "px";
       //     butt.style.backgroundPositionY = "-" + (_tpe.tpe_y) + "px;";
            
            var writeurl = true;
            var texurl = "url(" + _tpe.tpe_texture.src + ")";
         
            if(typeof(butt.style.backgroundImage)!= undefined)
            {
                
                if(butt.style.backgroundImage == texurl)
                {
                    writeurl = false;
                }
            }
            
            if(writeurl==true)
            {
                butt.style.backgroundImage = texurl;
            }
            
        //    butt.style.cssText += "background-image:url(\'" + _tpe.tpe_texture.src + "\');background-position:-"+(_tpe.tpe_x)+"px -"+(_tpe.tpe_y)+"px;";
        }
    }
}

// #############################################################################################
/// Function:<summary>
///             Set button Position
///          </summary>
///
/// In:     <param name="_id">Button ID</param>
///         <param name="_x">New X coordinate</param>
///         <param name="_y">New Y coordinate</param>
// #############################################################################################
function clickable_change_ext( _id, _tpe,_x,_y, _scale,_alpha )
{
    _id = yyGetInt32(_id);
    _x = yyGetReal(_x);
    _y = yyGetReal(_y);
    _scale = yyGetReal(_scale);
    _alpha = yyGetReal(_alpha);

	clickable_change(_id, _tpe, _x, _y);
    
    var div1 = g_ButtonIDLookup[_id]; 
    if( div1 ){
       // var tpe =  g_ButtonIDLookup[_id].tpe;
        var butt = div1.firstChild;
        
        if( div1.x !=_x){
            div1.style.left = _x+"px";
            div1.x = _x;
        }
        if( div1.y !=_y){
            div1.style.top = _y+"px";
            div1.y = _y;
        }
        
        if(butt)
        {
           // butt.scale(_alpha,_alpha);

            butt.style.width = div1.style.width = (_tpe.tpe_CropWidth * _scale) + "px";
            butt.style.height = div1.style.height = (_tpe.tpe_CropHeight * _scale) + "px";  
            
            
         //   butt.style.cssText += "background-position:-"+(tpe.tpe_x*_scale)+"px -"+(tpe.tpe_y*_scale)+"px;";
            var scalefac = (_scale * _tpe.tpe_texture.width * 100) / (_tpe.tpe_CropWidth);
            
           
            
          //  butt.style.backgroundSize = scalefac+"%";
       //     butt.style.cssText += "background-size: " + (_scale * _tpe.tpe_texture.width) + "px " + (_scale * _tpe.tpe_texture.height) + "px;";
            butt.style.backgroundSize =  (_scale * _tpe.tpe_texture.width) + "px " + (_scale * _tpe.tpe_texture.height) + "px";

            var wid = (-_tpe.tpe_x * _scale);
            var hei = (-_tpe.tpe_y * _scale);
            
            butt.style.backgroundPosition = wid + "px " +  hei + "px";
           // butt.style.cssText += "background-position:-"+(tpe.tpe_x*_scale)+"px -"+(tpe.tpe_y*_scale)+"px;";
            if (butt.style.opacity != _alpha)
                butt.style.opacity = _alpha;
        }
    }
}

// #############################################################################################
/// Function:<summary>
///             Set button style according to the provided ds_map key:value pairs
///          </summary>
// #############################################################################################
function clickable_set_style(_button, _styleMap) {

    var div1 = g_ButtonIDLookup[yyGetInt32(_button)]; 
    var pMap = g_ActiveMaps.Get(yyGetInt32(_styleMap));    
    if (div1 && pMap) {

        var butt = div1.firstChild; 
        if (butt) {
        
            for (var key in pMap) {
                if (!pMap.hasOwnProperty(key)) continue;
                
                butt.style[key] = pMap[key];
            }
        }        
    }
}




