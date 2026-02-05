// @if feature("flexpanel")
const Yoga = require('/yoga-wasm-base64-csm.js');
var g_yoga = null;
var g_yogaConfig = null;
var g_UILayers = null;

/// Global flag: **true** after the first UI-layer layout pass has completed.
var g_UILayersInit = false;

async function flexpanel_init()
{
	g_yoga = await Yoga();
    g_yogaConfig = g_yoga["Config"]["create"]();
}
flexpanel_init();

const YGAlignAuto = 0;
const YGAlignFlexStart = 1;
const YGAlignCenter = 2;
const YGAlignFlexEnd = 3;
const YGAlignStretch = 4;
const YGAlignBaseline = 5;
const YGAlignSpaceBetween = 6;
const YGAlignSpaceAround = 7;
const YGAlignSpaceEvenly = 8;
const YGDirectionInherit = 0;
const YGDirectionLTR = 1;
const YGDirectionRTL = 2;
const YGDisplayFlex = 0;
const YGDisplayNone = 1;
const YGFlexDirectionColumn = 0;
const YGFlexDirectionColumnReverse = 1;
const YGFlexDirectionRow = 2;
const YGFlexDirectionRowReverse = 3;
const YGGutterColumn = 0;
const YGGutterRow = 1;
const YGGutterAll = 2;
const YGJustifyFlexStart = 0;
const YGJustifyCenter = 1;
const YGJustifyFlexEnd = 2;
const YGJustifySpaceBetween = 3;
const YGJustifySpaceAround = 4;
const YGJustifySpaceEvenly = 5;
const YGPositionTypeStatic = 0;
const YGPositionTypeRelative = 1;
const YGPositionTypeAbsolute = 2;
const YGUnitUndefined = 0;
const YGUnitPoint = 1;
const YGUnitPercent = 2;
const YGUnitAuto = 3;
const YGWrapNoWrap = 0;
const YGWrapWrap = 1;
const YGWrapWrapReverse = 2;
const YGEdgeLeft = 0;
const YGEdgeTop = 1;
const YGEdgeRight = 2;
const YGEdgeBottom = 3;
const YGEdgeStart = 4;
const YGEdgeEnd = 5;
const YGEdgeHorizontal = 6;
const YGEdgeVertical = 7;
const YGEdgeAll = 8;
const YGMeasureModeUndefined = 0;
const YGMeasureModeAtMost = 2;
const YGMeasureModeExactly = 1;


var g_positionType = {
	"static" : YGPositionTypeStatic,
	"relative" : YGPositionTypeRelative,
	"absolute" : YGPositionTypeAbsolute,
};

var g_alignType = {
	"auto" : YGAlignAuto,
	"flex-start" : YGAlignFlexStart,
	"center" : YGAlignCenter,
	"flex-end" : YGAlignFlexEnd,
	"stretch" : YGAlignStretch,
	"baseline" : YGAlignBaseline,
	"space-between" : YGAlignSpaceBetween,
	"space-around" : YGAlignSpaceAround,
	"space-evenly" : YGAlignSpaceEvenly,
	"initial" : YGAlignStretch,
};

var g_wrapType = {
	"initial" : YGWrapNoWrap,
	"no-wrap" : YGWrapNoWrap,
	"wrap" : YGWrapWrap,
	"wrap-reverse" : YGWrapWrapReverse,
};

var g_displayType = {
	"flex" : YGDisplayFlex,
	"none" : YGDisplayNone,
};

var g_flexDirectionType = {
	"column" : YGFlexDirectionColumn,
	"column-reverse" : YGFlexDirectionColumnReverse,
	"row" : YGFlexDirectionRow,
	"row-reverse" : YGFlexDirectionRowReverse,
};

var g_justifyType = {
	"flex-start" : YGJustifyFlexStart,
	"center" : YGJustifyCenter,
	"flex-end" : YGJustifyFlexEnd,
	"space-between" : YGJustifySpaceBetween,
	"space-around" : YGJustifySpaceAround,
	"space-evenly" : YGJustifySpaceEvenly,
};

var g_directionType = {
	"ltr" : YGDirectionLTR,
	"rtl" : YGDirectionRTL,
	"inherit" : YGDirectionInherit,
};

var g_contextYoga = new Map();



function FLEXPANEL_StringToEnum( _type, _value)
{
	return _type[ _value ] ?? -1;
}

function FLEXPANEL_SetCSSValue( _node, _value, _set, _setPercent, _setAuto )
{
	var unit = 1;
	if (typeof(_value) == "string") {
		if (_value == "auto" ) unit=3;
		else {
			if (_value.endsWith("%")) {
				unit = 2;
			} // end if

			_value = parseFloat(_value)
		} // end else
	} // end if
	else {
		_value = yyGetReal(_value);
	} // end else

	switch( unit )
	{
	case 1: _set( _node, _value ); break;
	case 2: _setPercent( _node, _value ); break;
	case 3: if (_setAuto != undefined) _setAuto( _node, _value ); break;
	}
}

function FLEXPANEL_SetCSSValueEdge( _node, _value, _edge, _set, _setPercent )
{
	var unit = 1;
	if (typeof(_value) == "string") {
		if (_value.endsWith("%")) {
			unit = 2;
		} // end if

		_value = parseFloat(_value)
	} // end if
	else {
		_value = yyGetReal(_value);
	} // end else

	switch( unit )
	{
	case 1: _set( _node, _value, _edge ); break;
	case 2: _setPercent( _node, _value, _edge ); break;
	}
}

function FLEXPANEL_GetContext(_node)
{
	return g_contextYoga.get( _node["K"]["M"] );	
}

function FLEXPANEL_CreateContext(_node)
{
	g_contextYoga.set( _node["K"]["M"], {} );
}

function FLEXPANEL_AreNodeRefsEqual(_node1, _node2)
{
	/* Yoga seems to give us distinct Node wrappers for the same underlying YGNode, so we can't
	 * just compare node references for equality.
	*/

	return _node1["K"]["M"] == _node2["K"]["M"];
}

// #######################################################################################
function FLEXPANEL_Init_From_Struct(_node, _struct, _from_wad)
{
	var context = FLEXPANEL_GetContext(_node);

	var layerElements = undefined;

	for( var key in _struct) {
		if (!_struct.hasOwnProperty(key)) continue;

		var value = _struct[key];

		// translate the JS key back to a GML level key
        if (typeof g_obf2var != "undefined" && g_obf2var.hasOwnProperty(key)) {
            key = g_obf2var[key];
        } // end if

        if (key.startsWith("gml")) {
        	key = key.substring(3);
        }

		switch( key )
		{
		case "nodes":
			// TODO : need to remove all the children
			flexpanel_node_remove_all_children(_node);
			for( var n=0; n<value.length; ++n) {

				var child = g_yoga["Node"]["createWithConfig"](g_yogaConfig);
				FLEXPANEL_CreateContext( child );
				_node.insertChild( child, n );

				FLEXPANEL_Init_From_Struct( child, value[n], _from_wad );

			} // end for
			break;
		case "alignContent":
			_node.setAlignContent( FLEXPANEL_StringToEnum(g_alignType, value) );
			break;
		case "alignItems":
			_node.setAlignItems( FLEXPANEL_StringToEnum(g_alignType, value) );
			break;
		case "alignSelf":
			_node.setAlignSelf( FLEXPANEL_StringToEnum(g_alignType, value) );
			break;
		case "aspectRatio":
			_node.setAspectRatio( yyGetReal(value) );
			break;
		case "display":
			_node.setDisplay( FLEXPANEL_StringToEnum(g_displayType, value) );
			break;
		case "flex":
			value = yyGetReal(value);
			_node.setFlex( value );
			context.flex = value;
			break;
		case "flexGrow":
			_node.setFlexGrow( yyGetReal(value) );
			break;
		case "flexBasis":
			FLEXPANEL_SetCSSValue( _node, value, function( n, v ) { n.setFlexBasis(v) }, function( n, v ) { n.setFlexBasisPercent(v) }, function( n, v ) { n.setFlexBasisAuto(); } );
			break;
		case "flexShrink":
			_node.setFlexShrink( yyGetReal(value));
			break;
		case "flexDirection":
			_node.setFlexDirection( FLEXPANEL_StringToEnum(g_flexDirectionType, value) );
			break;
		case "flexWrap":
			_node.setFlexWrap( FLEXPANEL_StringToEnum(g_wrapType, value) );
			break;
		case "gapColumn":
			_node.setGap( YGGutterColumn, yyGetReal(value) );
			break;
		case "gapRow":
		case "rowGap":
			_node.setGap( YGGutterRow, yyGetReal(value) );
			break;
		case "gap":
			_node.setGap( YGGutterAll, yyGetReal(value) );
			break;
		case "justifyContent":
			_node.setJustifyContent( FLEXPANEL_StringToEnum(g_justifyType, value) );
			break;
		case "direction":
			// RK :: no direction on a node
			//_node.setDirection( FLEXPANEL_StringToEnum(g_directionType, value) );
			context.direction = FLEXPANEL_StringToEnum(g_directionType, value);
			break;
		case "marginLeft":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeLeft, function( n, v, e ) { n.setMargin(e, v) }, function( n, v, e ) { n.setMarginPercent(e, v) } );
			break;
		case "marginRight":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeRight, function( n, v, e ) { n.setMargin(e, v) }, function( n, v, e ) { n.setMarginPercent(e, v) } );
			break;
		case "marginTop":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeTop, function( n, v, e ) { n.setMargin(e, v) }, function( n, v, e ) { n.setMarginPercent(e, v) } );
			break;
		case "marginBottom":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeBottom, function( n, v, e ) { n.setMargin(e, v) }, function( n, v, e ) { n.setMarginPercent(e, v) } );
			break;
		case "marginStart":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeStart, function( n, v, e ) { n.setMargin(e, v) }, function( n, v, e ) { n.setMarginPercent(e, v) } );
			break;
		case "marginEnd":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeEnd, function( n, v, e ) { n.setMargin(e, v) }, function( n, v, e ) { n.setMarginPercent(e, v) } );
			break;
		case "marginHorizontal":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeHorizontal, function( n, v, e ) { n.setMargin(e, v) }, function( n, v, e ) { n.setMarginPercent(e, v) } );
			break;
		case "marginVertical":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeVertical, function( n, v, e ) { n.setMargin(e, v) }, function( n, v, e ) { n.setMarginPercent(e, v) } );
			break;
		case "margin":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeAll, function( n, v, e ) { n.setMargin(e, v) }, function( n, v, e ) { n.setMarginPercent(e, v) } );
			break;
		case "marginInline":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeLeft, function( n, v, e ) { n.setMargin(e, v) }, function( n, v, e ) { n.setMarginPercent(e, v) } );
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeRight, function( n, v, e ) { n.setMargin(e, v) }, function( n, v, e ) { n.setMarginPercent(e, v) } );
			break;
		case "paddingLeft":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeLeft, function( n, v, e ) { n.setPadding(e, v) }, function( n, v, e ) { n.setPaddingPercent(e, v) } );
			break;
		case "paddingRight":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeRight, function( n, v, e ) { n.setPadding(e, v) }, function( n, v, e ) { n.setPaddingPercent(e, v) } );
			break;
		case "paddingTop":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeTop, function( n, v, e ) { n.setPadding(e, v) }, function( n, v, e ) { n.setPaddingPercent(e, v) } );
			break;
		case "paddingBottom":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeBottom, function( n, v, e ) { n.setPadding(e, v) }, function( n, v, e ) { n.setPaddingPercent(e, v) } );
			break;
		case "paddingStart":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeStart, function( n, v, e ) { n.setPadding(e, v) }, function( n, v, e ) { n.setPaddingPercent(e, v) } );
			break;
		case "paddingEnd":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeEnd, function( n, v, e ) { n.setPadding(e, v) }, function( n, v, e ) { n.setPaddingPercent(e, v) } );
			break;
		case "paddingHorizontal":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeHorizontal, function( n, v, e ) { n.setPadding(e, v) }, function( n, v, e ) { n.setPaddingPercent(e, v) } );
			break;
		case "paddingVertical":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeVertical, function( n, v, e ) { n.setPadding(e, v) }, function( n, v, e ) { n.setPaddingPercent(e, v) } );
			break;
		case "padding":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeAll, function( n, v, e ) { n.setPadding(e, v) }, function( n, v, e ) { n.setPaddingPercent(e, v) } );
			break;
		case "borderLeft":
			_node.setBorder( YGEdgeLeft, yyGetReal(value));
			break;
		case "borderRight":
			_node.setBorder( YGEdgeRight, yyGetReal(value));
			break;
		case "borderTop":
			_node.setBorder( YGEdgeTop, yyGetReal(value));
			break;
		case "borderBottom":
			_node.setBorder( YGEdgeBottom, yyGetReal(value));
			break;
		case "borderStart":
			_node.setBorder( YGEdgeStart, yyGetReal(value));
			break;
		case "borderEnd":
			_node.setBorder( YGEdgeEnd, yyGetReal(value));
			break;
		case "borderHorizontal":
			_node.setBorder( YGEdgeHorizontal, yyGetReal(value));
			break;
		case "borderVertical":
			_node.setBorder( YGEdgeVertical, yyGetReal(value));
			break;
		case "borderWidth":
		case "border":
			_node.setBorder( YGEdgeAll, yyGetReal(value));
			break;
		case "positionLeft":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeLeft, function( n, v, e ) { n.setPosition(e, v) }, function( n, v, e ) { n.setPositionPercent(e, v) } );
			break;
		case "positionRight":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeRight, function( n, v, e ) { n.setPosition(e, v) }, function( n, v, e ) { n.setPositionPercent(e, v) } );
			break;
		case "positionTop":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeTop, function( n, v, e ) { n.setPosition(e, v) }, function( n, v, e ) { n.setPositionPercent(e, v) } );
			break;
		case "positionBottom":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeBottom, function( n, v, e ) { n.setPosition(e, v) }, function( n, v, e ) { n.setPositionPercent(e, v) } );
			break;
		case "start":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeStart, function( n, v, e ) { n.setPosition(e, v) }, function( n, v, e ) { n.setPositionPercent(e, v) } );
			break;
		case "end":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeEnd, function( n, v, e ) { n.setPosition(e, v) }, function( n, v, e ) { n.setPositionPercent(e, v) } );
			break;
		case "horizontal":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeHorizontal, function( n, v, e ) { n.setPosition(e, v) }, function( n, v, e ) { n.setPositionPercent(e, v) } );
			break;
		case "vertical":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeVertical, function( n, v, e ) { n.setPosition(e, v) }, function( n, v, e ) { n.setPositionPercent(e, v) } );
			break;
		case "position":
		case "positionType":
			_node.setPositionType( FLEXPANEL_StringToEnum(g_positionType, value) );
			break;
		case "clipContent":
			// FD :: content clipping is stored on the context
			context.clip_content = yyGetBool(value);
			break;
		case "minWidth":
			FLEXPANEL_SetCSSValue( _node, value, function( n, v ) { n.setMinWidth(v) }, function( n, v ) { n.setMinWidthPercent(v) }, undefined );
			break;
		case "maxWidth":
			FLEXPANEL_SetCSSValue( _node, value, function( n, v ) { n.setMaxWidth(v) }, function( n, v ) { n.setMaxWidthPercent(v) }, undefined );
			break;
		case "minHeight":
			FLEXPANEL_SetCSSValue( _node, value, function( n, v ) { n.setMinHeight(v) }, function( n, v ) { n.setMinHeightPercent(v) }, undefined );
			break;
		case "maxHeight":
			FLEXPANEL_SetCSSValue( _node, value, function( n, v ) { n.setMaxHeight(v) }, function( n, v ) { n.setMaxHeightPercent(v) }, undefined );
			break;
		case "width":
			FLEXPANEL_SetCSSValue( _node, value, function( n, v ) { n.setWidth(v) }, function( n, v ) { n.setWidthPercent(v) }, function( n, v ) { n.setWidthAuto() } );
			break;
		case "height":
			FLEXPANEL_SetCSSValue( _node, value, function( n, v ) { n.setHeight(v) }, function( n, v ) { n.setHeightPercent(v) }, function( n, v ) { n.setHeightAuto() } );
			break;
		case "name":
			FLEXPANEL_GetContext(_node).name = value;
			break;
		case "data":
			FLEXPANEL_GetContext(_node).data = value;
			break;
		case "layerElements":
			layerElements = value;
			break;
		case "__yyIsGMLObject":
		case "__type": break;
		default:
			//console.log( "flexpanel_create_node : unknown struct key " + key );
			break;
		}
	}

	if(layerElements !== undefined)
	{
		context.elements = [];

		for(var i = 0; i < layerElements.length; ++i)
		{
			var element_data = layerElements[i];

			if(element_data === undefined)
			{
				continue;
			}

			var element_type = _from_wad
				? element_data.type
				: yyGetString(variable_struct_get(element_data, "type"));

			if(element_type === "Instance")
			{
				context.elements.push(new UILayerInstanceElement(element_data, _from_wad));
			}
			else if(element_type === "Sequence")
			{
				context.elements.push(new UILayerSequenceElement(element_data, _from_wad));
			}
			else if(element_type === "Sprite")
			{
				context.elements.push(new UILayerSpriteElement(element_data, _from_wad));
			}
			else if(element_type === "Text")
			{
				context.elements.push(new UILayerTextElement(element_data, _from_wad));
			}
		}
	}
}

// #######################################################################################
function FLEXPANEL_Handle_Struct( _node, _struct, _from_wad)
{
	var s = _struct;
	if (typeof(_struct) != "object") {
		s = json_parse(_struct)
	} // end if

	FLEXPANEL_Init_From_Struct(_node, s, _from_wad);
}


// #######################################################################################
function flexpanel_create_node( _struct )
{	
	var ret = g_yoga["Node"]["createWithConfig"](g_yogaConfig);
	FLEXPANEL_CreateContext(ret);
	FLEXPANEL_Handle_Struct( ret, _struct, false );
	return ret;
}

// #######################################################################################
function flexpanel_delete_node( _node, _recursive )
{
	var context = FLEXPANEL_GetContext(_node);

	if(context.IsUILayerRoot)
	{
		yyError("The root node of a UI layer cannot be deleted");
		return;
	}

	if(context.elements !== undefined)
	{
		for(var i = 0; i < context.elements.length; ++i)
		{
			context.elements[i].destroy_element();
		}
	}

	var children;
	if(_recursive)
	{
		children = [];

		for(var i = 0; i < _node.getChildCount(); ++i)
		{
			children.push(_node.getChild(i));
		}
	}

	g_yoga["Node"]["destroy"](_node);

	if(_recursive)
	{
		while(children.length > 0)
		{
			flexpanel_delete_node(children.pop(), _recursive);
		}
	}
}

// #######################################################################################
function flexpanel_node_insert_child( _node, _child, _index)
{
	/*
	* After we remove the last child, the 'UILayers_Layout_node_prepare' function call 
	* will convert any childless node into a leaf (by adding a measure function),
	* which *disallows* adding children later.  Clear the assigned measure
	* function first so the node becomes a regular container again.
	*/
	if (_node.getChildCount() === 0) {
		_node.unsetMeasureFunc();   // restore container behaviour
	}

	_node.insertChild( _child, _index );

	/* Walk up the hierarchy to see if we are being inserted into a UI layer. */
	var root = _node;
	var depth = 0;
	for(var p = root; p; p = p.getParent())
	{
		if(depth == 0)
		{
			depth = UILayers_node_get_max_element_order(p);
		}

		root = p;
	}

	var root_context = FLEXPANEL_GetContext(root);
	if(root_context.IsUILayerRoot)
	{
		var child_context = FLEXPANEL_GetContext(_child);

		UILayers_Layout_node_prepare(_node); //Restore the measure function

		/* Fiddle around with the element order to try and get "predictable" draw ordering when
		 * creating new elements at runtime.
		*/

		var ourdepth = UILayers_node_get_max_element_order_recursive(_child);

		if(child_context.elements !== undefined)
		{
			for(var i = 0; i < child_context.elements.length; ++i)
			{
				child_context.elements[i].m_order += depth - ourdepth - 1;
			}
		}

		/* Create layer elements (instances, sprites, etc). */
		var ui_layer = UILayers_Get_By_Node(root);
		UILayers_Create_node_elements(_child, ui_layer.layer, true);

		/* Update layout from root (only if layer is visible) */
		var pLayer = ui_layer.layer;
		if (pLayer.m_visible) {
			if (pLayer.IsGUISpaceLayer())
			{
				var gui_rect = Calc_GUI_Matrices_And_Rect();
				UILayers_Layout_layer(ui_layer, gui_rect, eLAYER_GUI_IN_GUI);
			}
			else {
				var view_rect = UILayers_Calculate_Initial_View_Rect();
				UILayers_Layout_layer(ui_layer, view_rect, eLAYER_GUI_IN_VIEW);
			}
		}
	}
}

// #######################################################################################
function flexpanel_node_remove_child( _node, _child )
{
	_node.removeChild(_child);
}

// #######################################################################################
function flexpanel_node_remove_all_children( _node )
{	
	while( _node.getChildCount() ) {
		_node.removeChild( _node.getChild(0) );
	} // end while
}

// #######################################################################################
function flexpanel_node_get_num_children( _node )
{	
	return _node.getChildCount();
}

// #######################################################################################
function FLEXPANEL_Find_Child(_node, _name)
{
	var ret = undefined;
	var context = FLEXPANEL_GetContext(_node);
	if (context.name == _name) {
		ret = _node;
	}

	if (ret == undefined) {
		var numChildren = _node.getChildCount();
		for( var n=0; (ret == undefined) && (n<numChildren); ++n) {
			var child = _node.getChild(n);
			ret = FLEXPANEL_Find_Child(child, _name);
		} // end for
	}
	return ret;
}

// #######################################################################################
function flexpanel_node_get_child( _node, _indexOrString )
{	
	if (typeof(_indexOrString) == "string") {
		return FLEXPANEL_Find_Child( _node, _indexOrString );
	} // end if
	else {
		_indexOrString = yyGetReal(_indexOrString);
		return _node.getChild( _indexOrString );
	}
}

// #######################################################################################
function flexpanel_node_get_child_hash( _node, _indexOrString ) { return flexpanel_node_get_child(_node, _indexOrString ); }

// #######################################################################################
function flexpanel_node_get_parent( _node )
{
	return 	_node.getParent();
}

// #######################################################################################
function flexpanel_node_get_name( _node )
{	
	var context = FLEXPANEL_GetContext(_node);
	return context.name;
}

// #######################################################################################
function flexpanel_node_set_name( _node, _name )
{	
	var context = FLEXPANEL_GetContext(_node);
	context.name = _name;
}

// #######################################################################################
function flexpanel_node_get_data( _node )
{	
	var context = FLEXPANEL_GetContext(_node);
	if (context.data == undefined) {

		context.data = new GMLObject();

	} // end if
	return context.data;
}

// #######################################################################################
function flexpanel_node_set_data( _node, _data )
{	
	var context = FLEXPANEL_GetContext(_node);
	context.data = _data;
}

// #######################################################################################
function FLEXPANEL_EnumToString(_enum, _value)
{
	var ret = undefined;
	for( var key in _enum) {
		if (!_enum.hasOwnProperty(key)) continue;

		var value = _enum[key];
		if (value == _value) {
			ret = key;
			break;
		} // end if
	} // end for
	return ret;
}

// #######################################################################################
function FLEXPANEL_SetIfNotDefault( _ret, _name, _value, _default, _enum)
{
	if (_default != "isnan" ? (_value != _default) : !isNaN(_value)) {
		if (_enum != undefined) {
			// convert the number to a string
			_value = FLEXPANEL_EnumToString( _enum, _value );
		} // end if
	    variable_struct_set(_ret, _name, _value);
	}
}

// #######################################################################################
function FLEXPANEL_SetIfNotDefaultV( _ret, _name, _value, _default)
{
	if (_value == undefined) return;
	if (_default != "isnan" ? (_value.value != _default) : !isNaN(_value.value)) {
		switch( _value.unit )
		{
		case YGUnitPoint:
	    	variable_struct_set(_ret, _name, _value.value);
	    	break;
		case YGUnitAuto:
	    	variable_struct_set(_ret, _name, "auto");
	    	break;
		case YGUnitPercent:
	    	variable_struct_set(_ret, _name, _value.value+"%");
	    	break;
		} // end swiutch
	}
}

// #######################################################################################
function flexpanel_node_get_struct( _node )
{
	var ret = {};
    ret.__yyIsGMLObject = true;	
	var context = FLEXPANEL_GetContext(_node);
    FLEXPANEL_SetIfNotDefault( ret, "alignContent", _node.getAlignContent(), YGAlignFlexStart );
    FLEXPANEL_SetIfNotDefault( ret, "alignItems", _node.getAlignItems(), YGAlignStretch, g_alignType );
    FLEXPANEL_SetIfNotDefault( ret, "alignSelf", _node.getAlignSelf(), YGAlignAuto );
    FLEXPANEL_SetIfNotDefault( ret, "aspectRatio", _node.getAspectRatio(), "isnan" );
    FLEXPANEL_SetIfNotDefault( ret, "display", _node.getDisplay(), YGDisplayFlex, g_displayType  );
    FLEXPANEL_SetIfNotDefault( ret, "flex", context.flex, undefined  );
    FLEXPANEL_SetIfNotDefault( ret, "flexGrow", _node.getFlexGrow(), 0  );
    FLEXPANEL_SetIfNotDefault( ret, "flexShrink", _node.getFlexShrink(), 0  );
    FLEXPANEL_SetIfNotDefault( ret, "flexBasis", _node.getFlexBasis(), "isnan"  );
    FLEXPANEL_SetIfNotDefault( ret, "flexDirection", _node.getFlexDirection(), YGFlexDirectionColumn, g_flexDirectionType  );
    FLEXPANEL_SetIfNotDefault( ret, "flexWrap", _node.getFlexWrap(), YGWrapNoWrap, g_wrapType  );
    FLEXPANEL_SetIfNotDefault( ret, "gapColumn", _node.getGap( YGGutterColumn ), "isnan"  );
    FLEXPANEL_SetIfNotDefault( ret, "gapRow", _node.getGap( YGGutterRow ), "isnan"  );
    FLEXPANEL_SetIfNotDefault( ret, "gap", _node.getGap( YGGutterAll ), "isnan"  );
    FLEXPANEL_SetIfNotDefault( ret, "justifyContent", _node.getJustifyContent(), YGJustifyFlexStart, g_justifyType  );
    FLEXPANEL_SetIfNotDefault( ret, "direction", context.direction, undefined, g_directionType  );
    FLEXPANEL_SetIfNotDefaultV( ret, "marginLeft", _node.getMargin( YGEdgeLeft ), "isnan"  );
    FLEXPANEL_SetIfNotDefaultV( ret, "marginRight", _node.getMargin( YGEdgeRight ), "isnan"  );
    FLEXPANEL_SetIfNotDefaultV( ret, "marginTop", _node.getMargin( YGEdgeTop ), "isnan"  );
    FLEXPANEL_SetIfNotDefaultV( ret, "marginBottom", _node.getMargin( YGEdgeBottom ), "isnan"  );
    FLEXPANEL_SetIfNotDefaultV( ret, "marginStart", _node.getMargin( YGEdgeStart ), "isnan"  );
    FLEXPANEL_SetIfNotDefaultV( ret, "marginEnd", _node.getMargin( YGEdgeEnd ), "isnan"  );
    FLEXPANEL_SetIfNotDefaultV( ret, "marginHorizontal", _node.getMargin( YGEdgeHorizontal ), "isnan"  );
    FLEXPANEL_SetIfNotDefaultV( ret, "marginVertical", _node.getMargin( YGEdgeVertical ), "isnan"  );
    FLEXPANEL_SetIfNotDefaultV( ret, "margin", _node.getMargin( YGEdgeAll ), "isnan"  );
    FLEXPANEL_SetIfNotDefaultV( ret, "paddingLeft", _node.getPadding( YGEdgeLeft ), "isnan"  );
    FLEXPANEL_SetIfNotDefaultV( ret, "paddingRight", _node.getPadding( YGEdgeRight ), "isnan"  );
    FLEXPANEL_SetIfNotDefaultV( ret, "paddingTop", _node.getPadding( YGEdgeTop ), "isnan"  );
    FLEXPANEL_SetIfNotDefaultV( ret, "paddingBottom", _node.getPadding( YGEdgeBottom ), "isnan"  );
    FLEXPANEL_SetIfNotDefaultV( ret, "paddingStart", _node.getPadding( YGEdgeStart ), "isnan"  );
    FLEXPANEL_SetIfNotDefaultV( ret, "paddingEnd", _node.getPadding( YGEdgeEnd ), "isnan"  );
    FLEXPANEL_SetIfNotDefaultV( ret, "paddingHorizontal", _node.getPadding( YGEdgeHorizontal ), "isnan"  );
    FLEXPANEL_SetIfNotDefaultV( ret, "paddingVertical", _node.getPadding( YGEdgeVertical ), "isnan"  );
    FLEXPANEL_SetIfNotDefaultV( ret, "padding", _node.getPadding( YGEdgeAll ), "isnan"  );
    FLEXPANEL_SetIfNotDefault( ret, "borderLeft", _node.getBorder( YGEdgeLeft ), "isnan"  );
    FLEXPANEL_SetIfNotDefault( ret, "borderRight", _node.getBorder( YGEdgeRight ), "isnan"  );
    FLEXPANEL_SetIfNotDefault( ret, "borderTop", _node.getBorder( YGEdgeTop ), "isnan"  );
    FLEXPANEL_SetIfNotDefault( ret, "borderBottom", _node.getBorder( YGEdgeBottom ), "isnan"  );
    FLEXPANEL_SetIfNotDefault( ret, "borderStart", _node.getBorder( YGEdgeStart ), "isnan"  );
    FLEXPANEL_SetIfNotDefault( ret, "borderEnd", _node.getBorder( YGEdgeEnd ), "isnan"  );
    FLEXPANEL_SetIfNotDefault( ret, "borderHorizontal", _node.getBorder( YGEdgeHorizontal ), "isnan"  );
    FLEXPANEL_SetIfNotDefault( ret, "borderVertical", _node.getBorder( YGEdgeVertical ), "isnan"  );
    FLEXPANEL_SetIfNotDefault( ret, "border", _node.getBorder( YGEdgeAll ), "isnan"  );
    FLEXPANEL_SetIfNotDefaultV( ret, "left", _node.getPosition( YGEdgeLeft ), "isnan"  );
    FLEXPANEL_SetIfNotDefaultV( ret, "right", _node.getPosition( YGEdgeRight ), "isnan"  );
    FLEXPANEL_SetIfNotDefaultV( ret, "top", _node.getPosition( YGEdgeTop ), "isnan"  );
    FLEXPANEL_SetIfNotDefaultV( ret, "bottom", _node.getPosition( YGEdgeBottom ), "isnan"  );
    FLEXPANEL_SetIfNotDefaultV( ret, "start", _node.getPosition( YGEdgeStart ), "isnan"  );
    FLEXPANEL_SetIfNotDefaultV( ret, "end", _node.getPosition( YGEdgeEnd ), "isnan"  );
    FLEXPANEL_SetIfNotDefaultV( ret, "horizontal", _node.getPosition( YGEdgeHorizontal ), "isnan"  );
    FLEXPANEL_SetIfNotDefaultV( ret, "vertical", _node.getPosition( YGEdgeVertical ), "isnan"  );
    FLEXPANEL_SetIfNotDefault( ret, "positionType", _node.getPositionType(), YGPositionTypeRelative, g_positionType  );
    FLEXPANEL_SetIfNotDefaultV( ret, "minWidth", _node.getMinWidth(), "isnan"  );
    FLEXPANEL_SetIfNotDefaultV( ret, "maxWidth", _node.getMaxWidth(), "isnan"  );
    FLEXPANEL_SetIfNotDefaultV( ret, "minHeight", _node.getMinHeight(), "isnan"  );
    FLEXPANEL_SetIfNotDefaultV( ret, "maxHeight", _node.getMaxHeight(), "isnan"  );
    FLEXPANEL_SetIfNotDefaultV( ret, "width", _node.getWidth(), "isnan"  );
    FLEXPANEL_SetIfNotDefaultV( ret, "height", _node.getHeight(), "isnan"  );
    FLEXPANEL_SetIfNotDefault( ret, "name", context.name, undefined  );
    FLEXPANEL_SetIfNotDefault( ret, "data", context.data, undefined  );

	var numChildren = _node.getChildCount();
	if (numChildren > 0) {
		var nodes = new Array(numChildren);
		for( var n=0; n<numChildren; ++n) {
			var child = _node.getChild(n);
			var childStruct = flexpanel_node_get_struct(child);
			nodes[n] = childStruct;
		} // end for
    	variable_struct_set(ret, "nodes", nodes);		
	} // end if

	if(context.elements !== undefined && context.elements.length > 0)
	{
		var layerElements = new Array(context.elements.length);

		for(var i = 0; i < context.elements.length; ++i)
		{
			layerElements[i] = context.elements[i].serialise();
		}

		variable_struct_set(ret, "layerElements", layerElements);
	}

    return ret;
}

// #######################################################################################
function flexpanel_calculate_layout( _node, _width, _height, _direction)
{	

	if(typeof(_width) != "undefined")
		_width = yyGetReal(_width);

	if(typeof(_height) != "undefined")
		_height = yyGetReal(_height);

	_node.calculateLayout( _width, _height, _direction );
}

// #######################################################################################
function flexpanel_node_layout_get_position( _node, _relative )
{	
	var x = 0;
	var y = 0;
	_relative ??= true;
	_relative = yyGetBool(_relative);
	if (!_relative) {
		var curr = _node.getParent();
		while( curr != undefined ) {

			x += curr.getComputedLeft();
			y += curr.getComputedTop();

			curr = curr.getParent();
		} // end while
	} // end if
	var ret = {};
    ret.__yyIsGMLObject = true;	
    var left = _node.getComputedLeft();
    var right = _node.getComputedRight();
    var bottom = _node.getComputedBottom();
    var top = _node.getComputedTop();
    var width = _node.getComputedWidth();
    var height = _node.getComputedHeight();
    variable_struct_set(ret, "left", left + x);
    variable_struct_set(ret, "top", top + y);
    variable_struct_set(ret, "width", width);
    variable_struct_set(ret, "height", height);
    variable_struct_set(ret, "bottom", bottom + y);
    variable_struct_set(ret, "right", right + x);

	return ret;
}

function flexpanel_set_rounding_scale( _scaleFactor )
{
	var roundingScale = yyGetReal(_scaleFactor);
	if (roundingScale < 0 || !isFinite(roundingScale)) {
		yyError("rounding scale factor must be a finite non-negative number");
		return;
	}

    g_yogaConfig.setPointScaleFactor(roundingScale);
}

function flexpanel_get_rounding_scale()
{
	return g_yogaConfig.getPointScaleFactor();
}

// #######################################################################################
function FLEXPANEL_CreateValueResult( _v )
{
	var ret = {};
    ret.__yyIsGMLObject = true;	
    variable_struct_set(ret, "unit", _v.unit);
    variable_struct_set(ret, "value", _v.value);
	return ret;
}


// #######################################################################################
function flexpanel_node_style_get_align_content(_node) 
{
	return _node.getAlignContent();
}

// #######################################################################################
function flexpanel_node_style_get_align_items( _node )
{
	return _node.getAlignItems();
}

// #######################################################################################
function flexpanel_node_style_get_align_self(_node )
{
	return _node.getAlignSelf();
}

// #######################################################################################
function flexpanel_node_style_get_aspect_ratio( _node )
{
	return _node.getAspecRatio();
}

// #######################################################################################
function flexpanel_node_style_get_display( _node )
{
	return _node.getDisplay();
}

// #######################################################################################
function flexpanel_node_style_get_flex( _node )
{
	var context = FLEXPANEL_GetContext(_node);
	return context.flex;
}

// #######################################################################################
function flexpanel_node_style_get_flex_grow( _node )
{
	return _node.getFlexGrow();
}

// #######################################################################################
function flexpanel_node_style_get_flex_shrink( _node )
{
	return _node.getFlexShrink();
}

// #######################################################################################
function flexpanel_node_style_get_flex_basis( _node )
{
	return FLEXPANEL_CreateValueResult(_node.getFlexBasis());
}

// #######################################################################################
function flexpanel_node_style_get_flex_direction( _node )
{
	return _node.getFlexDirection();
}

// #######################################################################################
function flexpanel_node_style_get_flex_wrap( _node )
{
	return _node.getFlexWrap();
}

// #######################################################################################
function flexpanel_node_style_get_gap( _node, _gutter )
{
	return _node.getGap( _gutter );
}

// #######################################################################################
function flexpanel_node_style_get_position( _node, _edge )
{
	return FLEXPANEL_CreateValueResult(_node.getPosition(_edge));
}

// #######################################################################################
function flexpanel_node_style_get_justify_content( _node, _justify )
{
	return _node.getJustifyContent( _justify );
}

// #######################################################################################
function flexpanel_node_style_get_direction( _node )
{
	var context = FLEXPANEL_GetContext(_node);
	return context.direction;
}

// #######################################################################################
function flexpanel_node_style_get_margin( _node, _edge )
{
	return FLEXPANEL_CreateValueResult(_node.getMargin(_edge));
}

// #######################################################################################
function flexpanel_node_style_get_padding( _node, _edge )
{
	return FLEXPANEL_CreateValueResult(_node.getPadding(_edge));
}

// #######################################################################################
function flexpanel_node_style_get_border( _node, _edge )
{
	return _node.getBorder(_edge);
}

// #######################################################################################
function flexpanel_node_style_get_position_type( _node )
{
	return _node.getPositionType();
}

// #######################################################################################
function flexpanel_node_style_get_min_width( _node )
{
	return FLEXPANEL_CreateValueResult(_node.getMinWidth());
}

// #######################################################################################
function flexpanel_node_style_get_max_width( _node )
{
	return FLEXPANEL_CreateValueResult(_node.getMaxWidth());
}

// #######################################################################################
function flexpanel_node_style_get_min_height( _node )
{
	return FLEXPANEL_CreateValueResult(_node.getMinHeight());
}

// #######################################################################################
function flexpanel_node_style_get_max_height( _node )
{
	return FLEXPANEL_CreateValueResult(_node.getMaxHeight());
}

// #######################################################################################
function flexpanel_node_style_get_width( _node )
{
	return FLEXPANEL_CreateValueResult(_node.getWidth());
}

// #######################################################################################
function flexpanel_node_style_get_height( _node )
{
	return FLEXPANEL_CreateValueResult(_node.getHeight());
}

// #######################################################################################
function flexpanel_node_style_set_align_content(_node, _value)
{
	_node.setAlignContent( yyGetInt32(_value) )	;
}

// #######################################################################################
function flexpanel_node_style_set_align_items(_node, _value)
{	
	_node.setAlignItems( yyGetInt32(_value) );
}

// #######################################################################################
function flexpanel_node_style_set_align_self(_node, _value)
{	
	_node.setAlignSelf( yyGetInt32(_value) );
}

// #######################################################################################
function flexpanel_node_style_set_aspect_ratio(_node, _value)
{	
	_node.setAspectRatio(yyGetReal(_value));
}

// #######################################################################################
function flexpanel_node_style_set_display(_node, _value)
{	
	_node.setDisplay( yyGetInt32(_value) );
}

// #######################################################################################
function flexpanel_node_style_set_flex(_node, _value)
{
	var context = FLEXPANEL_GetContext(_node);
	_value = yyGetReal(_value);
	_node.setFlex( _value );
	context.flex = _value;
}

// #######################################################################################
function flexpanel_node_style_set_flex_grow(_node, _value)
{	
	_node.setFlexGrow( yyGetReal(_value) );
}

// #######################################################################################
function flexpanel_node_style_set_flex_shrink(_node, _value)
{	
	_node.setFlexShrink( yyGetReal(_value) );
}

// #######################################################################################
function flexpanel_node_style_set_flex_basis(_node, _unit, _value)
{	
	switch( _unit )
	{
	case YGUnitAuto:
		_node.setFlexBasisAuto();
		break;
	case YGUnitPoint:
		_node.setFlexBasis( yyGetReal(_value) );
		break;
	case YGUnitPercent:
		_node.setFlexBasisPercent( yyGetReal(_value) );
		break;
	} // end switch
}

// #######################################################################################
function flexpanel_node_style_set_flex_direction(_node, _value)
{
	_node.setFlexDirection( yyGetInt32(_value) );
}

// #######################################################################################
function flexpanel_node_style_set_flex_wrap(_node, _value)
{	
	_node.setFlexWrap( yyGetInt32(_value) );
}

// #######################################################################################
function flexpanel_node_style_set_gap(_node, _gutter, _value)
{
	_node.setGap( _gutter, yyGetReal(_value) );
}

// #######################################################################################
function flexpanel_node_style_set_position(_node, _edge, _value, _unit)
{	

	if(_unit==undefined)
	{
		_node.setPositionUndefined();
		return;
	}

	switch( _unit )
	{
	case YGUnitUndefined:
		_node.setPositionUndefined();
		break;
	case YGUnitPoint:
		_node.setPosition( _edge, yyGetReal(_value) );
		break;
	case YGUnitPercent:
		_node.setPositionPercent( _edge, yyGetReal(_value) );
		break;
	} // end switch
}

// #######################################################################################
function flexpanel_node_style_set_justify_content(_node, _value)
{
	_node.setJustifyContent( yyGetInt32(_value) );
}

// #######################################################################################
function flexpanel_node_style_set_direction(_node, _value)
{	
	var context = FLEXPANEL_GetContext(_node);
	context.direction = yyGetInt32(_value);	
}

// #######################################################################################
function flexpanel_node_style_set_margin(_node, _edge, _value, _unit)
{
	if(_unit === undefined)
	{
		_unit = YGUnitPoint;
	}

	switch(_unit)
	{
		case YGUnitPoint:
			_node.setMargin( yyGetInt32(_edge), yyGetReal(_value));
			break;

		case YGUnitPercent:
			_node.setMarginPercent( yyGetInt32(_edge), yyGetReal(_value));
			break;

		case YGUnitAuto:
			_node.setMarginAuto( yyGetInt32(_edge));
			break;
	}
}

// #######################################################################################
function flexpanel_node_style_set_padding(_node, _edge, _value, _unit)
{
	if(_unit === undefined)
	{
		_unit = YGUnitPoint;
	}

	switch(_unit)
	{
		case YGUnitPoint:
			_node.setPadding( yyGetInt32(_edge), yyGetReal(_value));
			break;

		case YGUnitPercent:
			_node.setPaddingPercent( yyGetInt32(_edge), yyGetReal(_value));
			break;
	}
}

// #######################################################################################
function flexpanel_node_style_set_border(_node, _edge, _value)
{	
	_node.setBorder( yyGetInt32(_edge), yyGetReal(_value));
}

// #######################################################################################
function flexpanel_node_style_set_position_type(_node, _value)
{	
	_node.setPositionType(yyGetInt32(_value));

}

// #######################################################################################
function flexpanel_node_style_set_min_width(_node, _value, _unit)
{	
	if(_unit === undefined)
	{
		_node.setMinWidthUndefined();
		return;
	}
	switch( _unit )
	{
	case YGUnitUndefined:
		_node.setMinWidthUndefined();
		break;

	case YGUnitPoint:
		_node.setMinWidth( yyGetReal(_value) );
		break;
	case YGUnitPercent:
		_node.setMinWidthPercent( yyGetReal(_value) );
		break;
	} // end switch
}

// #######################################################################################
function flexpanel_node_style_set_max_width(_node, _value, _unit)
{	
	if(_unit === undefined)
	{
		_node.setMaxWidthUndefined();
		return;
	}

	switch( _unit )
	{
	case YGUnitUndefined:
		_node.setMaxWidthUndefined();
		break;
	case YGUnitPoint:
		_node.setMaxWidth( yyGetReal(_value) );
		break;
	case YGUnitPercent:
		_node.setMaxWidthPercent( yyGetReal(_value) );
		break;
	} // end switch
}

// #######################################################################################
function flexpanel_node_style_set_min_height(_node, _value, _unit)
{	
	if(_unit === undefined)
	{
		_node.setMinHeightUndefined();
		return;
	}
	switch( _unit )
	{
	case YGUnitUndefined:
		_node.setMinHeightUndefined();
		break;
	case YGUnitPoint:
		_node.setMinHeight( yyGetReal(_value) );
		break;
	case YGUnitPercent:
		_node.setMinHeightPercent( yyGetReal(_value) );
		break;
	} // end switch
}

// #######################################################################################
function flexpanel_node_style_set_max_height(_node, _value, _unit)
{	

	if(_unit === undefined)
	{
		_node.setMaxHeightUndefined();
		return;
	}

	switch( _unit )
	{
	case YGUnitUndefined:
		_node.setMaxHeightUndefined();
		break;
	case YGUnitPoint:
		_node.setMaxHeight( yyGetReal(_value) );
		break;
	case YGUnitPercent:
		_node.setMaxHeightPercent( yyGetReal(_value) );
		break;
	} // end switch
}

// #######################################################################################
function flexpanel_node_style_set_width(_node, _value, _unit)
{	
	switch( _unit )
	{
	case YGUnitAuto:
		_node.setWidthAuto();
		break;
	case YGUnitPoint:
		_node.setWidth( yyGetReal(_value) );
		break;
	case YGUnitPercent:
		_node.setWidthPercent( yyGetReal(_value) );
		break;
	} // end switch
}

// #######################################################################################
function flexpanel_node_style_set_height(_node, _value, _unit)
{	
	switch( _unit )
	{
	case YGUnitAuto:
		_node.setHeightAuto();
		break;
	case YGUnitPoint:
		_node.setHeight( yyGetReal(_value) );
		break;
	case YGUnitPercent:
		_node.setHeightPercent( yyGetReal(_value) );
		break;
	} // end switch
}

// #######################################################################################
function flexpanel_node_set_measure_function( _selfinst, _node, _func )
{
	
	if((_node.getChildCount() == 0) && _func===undefined)
	{

		_node.setMeasureFunc( null);
		_node.markDirty();
		return;
	}


	var func = getFunction(_func, 1);
	if ((_node.getChildCount() == 0) && (typeof(func) == "function")) {
		
		var context = FLEXPANEL_GetContext(_node);
		context.measureFunc = func;
		var obj = func.boundObject ?? _selfinst;

		var flexpanel_node_MeasureCallbackWrapper = g_yoga.MeasureCallback.extend("MeasureCallback", {
			__construct: function(node, obj, func) {
				this.__parent.__construct.call(this);
				this.node = node;
				this.obj = obj;
				this.func = func;
			},

			measure: function(width, widthMode, height, heightMode)
			{
				var s = this.func( this.obj, this.obj, width, widthMode, height, heightMode);
				var ret =  { "width" : variable_struct_get( s, "width" ),  "height" : variable_struct_get( s, "height") };
				return ret;
			},
		});		
		_node.setMeasureFunc( new flexpanel_node_MeasureCallbackWrapper( _node, obj, func));
		_node.markDirty();
	} // end if
	else {
		yyError( "Unable to set measure function on flexpanel node" );
	} // end else
}


// #######################################################################################
function flexpanel_node_get_measure_function( _node )
{
	var context = FLEXPANEL_GetContext(_node);
	return context.measureFunc;
}
// @endif

function UILayers_Create()
{
	if(g_UILayers !== null)
	{
		return;
	}

	g_UILayers = [];

	var gui_rect = Calc_GUI_Matrices_And_Rect();
	var view_rect = UILayers_Calculate_Initial_View_Rect();

	for(var i = 0; i < g_pGMFile.GMUILayers.length; ++i)
	{
		var layer_data = g_pGMFile.GMUILayers[i];

		var layer_type;
		if(layer_data.drawSpace === "GUI")
		{
			layer_type = eLAYER_GUI_IN_GUI;
		}
		else if(layer_data.drawSpace === "VIEW")
		{
			layer_type = eLAYER_GUI_IN_VIEW;
		}

		var node = g_yoga["Node"]["createWithConfig"](g_yogaConfig);
		FLEXPANEL_CreateContext(node);
		FLEXPANEL_Handle_Struct(node, layer_data, true);

		var layer = g_pLayerManager.AddLayer(g_RunRoom, i, flexpanel_node_get_name(node), layer_type);
		layer.m_visible = layer_data.visible;

		g_UILayers.push({
			node: node,
			layer: layer,

 			layout_rect :new YYRECT(0,0,0,0),
			layout_mask:0,


			x_offset: 0.0,
			y_offset: 0.0,
		});

		/* Disallow deletion of this node via flexpanel_delete_node(). */
		var node_context = FLEXPANEL_GetContext(node);
		node_context.IsUILayerRoot = true;

		UILayers_Create_node_elements(node, layer, false);

		if(layer_data.drawSpace === "GUI")
		{
			UILayers_Layout_layer(g_UILayers[g_UILayers.length-1], gui_rect, layer_type);
		}
		else
			UILayers_Layout_layer(g_UILayers[g_UILayers.length-1], view_rect, layer_type);
	}
}

function UILayers_Create_node_elements(node, layer, run_instance_create_events)
{
	var context = FLEXPANEL_GetContext(node);

	if(context.elements !== undefined)
	{
		for(var i = 0; i < context.elements.length; ++i)
		{
			var element = context.elements[i];
			element.create_element(layer, run_instance_create_events);
		}
	}

	for(var i = 0; i < node.getChildCount(); ++i)
	{
		var child = node.getChild(i);
		UILayers_Create_node_elements(child, layer, run_instance_create_events);
	}
}

function UILayers_Destroy()
{
	if(g_UILayers !== null)
	{
		for(var i = 0; i < g_UILayers.length; ++i)
		{
			UILayers_Destroy_node_elements(g_UILayers[i].node);
		}

		g_UILayers = null;
		g_UILayersInit = false;
	}
}

function UILayers_Destroy_node_elements(node)
{
	var context = FLEXPANEL_GetContext(node);

	if(context.elements !== undefined)
	{
		for(var i = 0; i < context.elements.length; ++i)
		{
			var element = context.elements[i];
			element.destroy_element();
		}
	}

	for(var i = 0; i < node.getChildCount(); ++i)
	{
		var child = node.getChild(i);
		UILayers_Destroy_node_elements(child);
	}
}


function UILayer_UpdateLayout(ui_layer)
{
	if(ui_layer)
		UILayers_Layout_layer(ui_layer,ui_layer.layout_rect,ui_layer.layout_mask);
}

function UILayers_Layout(rect, gui_mask)
{
	for(var i = 0; i < g_UILayers.length; ++i)
	{
		var ui_layer = g_UILayers[i];
		UILayers_Layout_layer(ui_layer, rect, gui_mask);
	}

	/// The very first mouse-event callback can fire before the UI layers have been
	/// laid out. At that moment every element still reports its position as
	/// (0, 0) — which happens to be the mouse's initial position — so every instance
	/// would falsely receive “mouse-enter / mouse-leave” events.
	/// This global variable post-pones the execution of mouse events on UILayers
	/// up until the first layout phase is finished. 
	g_UILayersInit = true;
}

function UILayers_Layout_layer(ui_layer, rect, gui_mask) {

	if(!(ui_layer.layer.m_visible) || (ui_layer.layer.m_gui_layer & gui_mask) == 0)
	{
		return;
	}

	ui_layer.layout_rect = rect;
	ui_layer.layout_mask = gui_mask;

	/* Mark leaf nodes dirty so Yoga will rediscover their sizes. */
	UILayers_Layout_node_prepare(ui_layer.node);

	var direction = flexpanel_node_style_get_direction(ui_layer.node);
	ui_layer.node.calculateLayout((rect.right - rect.left), (rect.bottom - rect.top), direction);

	var offset_rect = new YYRECT();
	offset_rect.Copy(rect);

	offset_rect.left += ui_layer.x_offset;
	offset_rect.right += ui_layer.x_offset;

	offset_rect.top += ui_layer.y_offset;
	offset_rect.bottom += ui_layer.y_offset;

	UILayers_Layout_node_position(ui_layer.node, offset_rect, offset_rect, false);
}

function UILayers_Layout_node_prepare(node)
{
	var is_leaf_node = true;

	for(var i = 0; i < node.getChildCount(); ++i)
	{
		var child = node.getChild(i);
		UILayers_Layout_node_prepare(child);

		is_leaf_node = false;
	}

	/* We only supply a measure function for nodes which contain no nested flex panels. */
	if (is_leaf_node)
	{
		// TODO: Can we rely on g_yoga in global scope to only define this once?
		var UILayers_MeasureCallbackWrapper = g_yoga.MeasureCallback.extend("MeasureCallback", {
			__construct: function(node) {
				this.__parent.__construct.call(this);
				this.node = node;
			},

			measure: function(width, widthMode, height, heightMode)
			{
				return UILayers_Layout_measure_node(this.node, width, widthMode, height, heightMode);
			},
		});

		node.setMeasureFunc(new UILayers_MeasureCallbackWrapper(node));
		node.markDirty();
	}
	else {
		node.unsetMeasureFunc();
	}
}

function UILayers_Layout_measure_node(node, width, widthMode, height, heightMode)
{
	var context = FLEXPANEL_GetContext(node);

	var max_width_constraint;
	var max_height_constraint;

	switch (widthMode)
	{
	case YGMeasureModeUndefined:
		max_width_constraint = Number.MAX_VALUE;
		break;

	case YGMeasureModeAtMost:
	case YGMeasureModeExactly:
		max_width_constraint = width;
		break;
	}

	switch (heightMode)
	{
	case YGMeasureModeUndefined:
		max_height_constraint = Number.MAX_VALUE;
		break;

	case YGMeasureModeAtMost:
	case YGMeasureModeExactly:
		max_height_constraint = height;
		break;
	}

	var max_w = 0.0;
	var max_h = 0.0;

	if(context.elements !== undefined)
	{
		for (var i = 0; i < context.elements.length; ++i)
		{
			var item_size = context.elements[i].measure_item(node, max_width_constraint, max_height_constraint);

			max_w = Math.max(max_w, item_size.width);
			max_h = Math.max(max_h, item_size.height);
		}
	}

	var computed_size = { width: undefined, height: undefined };

	switch (widthMode)
	{
		case YGMeasureModeUndefined:
			computed_size.width = max_w;
			break;

		case YGMeasureModeAtMost:
			computed_size.width = Math.min(max_w, width);
			break;

		case YGMeasureModeExactly:
			computed_size.width = width;
			break;
	}

	switch (heightMode)
	{
	case YGMeasureModeUndefined:
		computed_size.height = max_h;
		break;

	case YGMeasureModeAtMost:
		computed_size.height = Math.min(max_h, height);
		break;

	case YGMeasureModeExactly:
		computed_size.height = height;
		break;
	}

	return computed_size;
}

function UILayers_Layout_node_position(node, outer_rect, clipping_rect, set_clipping_rect)
{
	var context = FLEXPANEL_GetContext(node);

	local_x = node.getComputedLeft();
	local_y = node.getComputedTop();
	local_w = node.getComputedWidth();
	local_h = node.getComputedHeight();

	// Compute absolute bounding box for the current container
	var container = new YYRECT();
	container.left = outer_rect.left + local_x;
	container.top = outer_rect.top + local_y;
	container.right = container.left + local_w - 1;
	container.bottom = container.top + local_h - 1;

	// Update clipping rectangle if the current context enforces clipping
	if (context.clip_content) {
		set_clipping_rect = true;
		clipping_rect = YYRECT.prototype.Intersection(container, clipping_rect);
	}

	// Traverse each child, passing down the current effective clip.
    var childCount = node.getChildCount();
	for(var i = 0; i < childCount; ++i) {
		var child = node.getChild(i);
		UILayers_Layout_node_position(child, container, clipping_rect, set_clipping_rect);
	}

	// Traverse this hacked in elements, passing down the current effective clip.
	if (context.elements !== undefined) {
		for(var i = 0; i < context.elements.length; ++i) {
			var element = context.elements[i];
			element.position(container, clipping_rect, set_clipping_rect);
		}
	}
}

function UILayers_Get_By_Name(layer_name)
{
	if(g_UILayers === null)
	{
		return null;
	}

	for(var i = 0; i < g_UILayers.length; ++i)
	{
		if(g_UILayers[i].layer.m_pName === layer_name)
		{
			return g_UILayers[i];
		}
	}

	return null;
}

function UILayers_Calculate_Initial_View_Rect()
{
	if (g_RunRoom.m_enableviews)
	{
		/* Views are enabled in this room, search for the first enabled viewport. */
		var pViews =  g_RunRoom.m_Views;
		for (var i = 0; i < pViews.length; i++) 
		{
			var view = pViews[i];
			if (!view.visible) continue;

			var viewWidth, viewHeight;

			if (view.surface_id != -1 && GR_Surface_Exists(view.surface_id))
			{
				//drawing view to surface-ignore the views port settings, as we just want to fill the surface with the view
				
				viewWidth = surface_get_width(view.surface_id);
				viewHeight = surface_get_height(view.surface_id);

			}
			else
			{
				viewWidth = view.portw;
				viewHeight = view.porth;
			}


		    var pCam = g_pCameraManager.GetCamera(view.cameraID);
			if (pCam )
			{
				viewWidth = pCam.GetViewWidth();
				viewHeight = pCam.GetViewHeight();
			}

			var r = new YYRECT();
			r.left = 0;
			r.top = 0;
			r.right = viewWidth;
			r.bottom = viewHeight;

			return r;
		}
	}

	/* Fallback to the room width/height if no views are enabled. */

	var r = new YYRECT();
	r.left = 0;
	r.top = 0;
	r.right = g_RunRoom.GetWidth();
	r.bottom = g_RunRoom.GetHeight();

	return r;
}


function UILayers_Get_By_Node(node)
{
	if(g_UILayers === null)
	{
		return null;
	}

	for(var i = 0; i < g_UILayers.length; ++i)
	{
		if(FLEXPANEL_AreNodeRefsEqual(g_UILayers[i].node, node))
		{
			return g_UILayers[i];
		}
	}

	return null;
}

function UILayers_node_get_max_element_order(node)
{
	var context = FLEXPANEL_GetContext(node);
	var ret = 0;

	if(context.elements !== undefined)
	{
		for(var i = 0; i < context.elements.length; ++i)
		{
			if(context.elements[i].elementOrder > ret)
			{
				ret = context.elements[i].elementOrder;
			}
		}
	}

	return ret;
}

function UILayers_node_get_max_element_order_recursive(node)
{
	var ret = UILayers_node_get_max_element_order(node);

	for(var i = 0; i < node.getChildCount(); ++i)
	{
		var child = node.getChild(i);

		var child_ret = UILayers_node_get_max_element_order_recursive(child);
		if(child_ret > ret)
		{
			ret = child_ret;
		}
	}

	return ret;
}

function UILayers_stretch_element(element_size, container_size, stretch_width, stretch_height, preserve_aspect)
{
	var aspect = element_size[0] / element_size[1];

	var stretched_width = element_size[0];
	var stretched_height = element_size[1];

	if (stretch_width)
	{
		stretched_width = container_size[0];
	}

	if (stretch_height)
	{
		stretched_height = container_size[1];
	}

	if (preserve_aspect)
	{
		var corrected_width = stretched_height * aspect;
		var corrected_height = stretched_width / aspect;

		if (stretch_height && stretch_width)
		{
			if (corrected_width < stretched_width)
			{
				stretched_width = corrected_width;
			}
			else {
				stretched_height = corrected_height;
			}
		}
		else if(stretch_width)
		{
			stretched_height = corrected_height;
		}
		else if (stretch_height)
		{
			stretched_width = corrected_width;
		}
	}

	return [ stretched_width, stretched_height ];
}

function UILayers_translate_element_position(container, x, y, anchor)
{
	var origin_x = 0.0;
	var origin_y = 0.0;

	switch (anchor)
	{
	case "TopLeft":
	case "MiddleLeft":
	case "BottomLeft":
		origin_x = container.left;
		break;

	case "TopCentre":
	case "MiddleCentre":
	case "BottomCentre":
	{
		var container_w = container.right - container.left + 1.0;
		origin_x = container.left + (container_w / 2.0);
		break;
	}

	case "TopRight":
	case "MiddleRight":
	case "BottomRight":
		origin_x = container.right;
		break;

	default:
		break;
	}

	switch (anchor)
	{
	case "TopLeft":
	case "TopCentre":
	case "TopRight":
		origin_y = container.top;
		break;

	case "MiddleLeft":
	case "MiddleCentre":
	case "MiddleRight":
	{
		var container_h = container.bottom - container.top + 1.0;
		origin_y = container.top + (container_h / 2.0);
		break;
	}

	case "BottomLeft":
	case "BottomCentre":
	case "BottomRight":
		origin_y = container.bottom;
		break;

	default:
		break;
	}

	var translated_x = origin_x + x;
	var translated_y = origin_y + y;

	return [ translated_x, translated_y ];
}

var g_UILayerInstanceElementsFromWAD = {};

function UILayerInstanceElement(element_data, from_wad)
{
	if(from_wad)
	{
		this.elementOrder        = element_data.elementOrder;
		this.instanceObjectIndex = element_data.instanceObjectIndex;
		this.instanceVariables   = undefined;
		this.instanceOffsetX     = element_data.instanceOffsetX;
		this.instanceOffsetY     = element_data.instanceOffsetY;
		this.instanceScaleX      = element_data.instanceScaleX;
		this.instanceScaleY      = element_data.instanceScaleY;
		this.instanceImageSpeed  = element_data.instanceImageSpeed;
		this.instanceImageIndex  = element_data.instanceImageIndex;
		this.instanceColour      = element_data.instanceColour;
		this.instanceAngle       = element_data.instanceAngle;

		this.flexVisible    = element_data.flexVisible;
		this.flexAnchor     = element_data.flexAnchor;
		this.stretchWidth   = element_data.stretchWidth;
		this.stretchHeight  = element_data.stretchHeight;
		this.keepAspect     = element_data.keepAspect;

		this.instanceId          = element_data.instanceId;
		this.instanceCreate      = element_data.instanceCreate;
		this.instancePreCreate   = element_data.instancePreCreate;

		g_UILayerInstanceElementsFromWAD[this.instanceId] = this;
	}
	else{
		this.elementOrder        = yyGetReal(variable_struct_get(element_data, "elementOrder"));
		this.instanceObjectIndex = yyGetRef(variable_struct_get(element_data, "instanceObjectIndex"), REFID_OBJECT, undefined, undefined, true);
		this.instanceVariables   = undefined;
		this.instanceOffsetX     = yyGetReal(variable_struct_get(element_data, "instanceOffsetX"));
		this.instanceOffsetY     = yyGetReal(variable_struct_get(element_data, "instanceOffsetY"));
		this.instanceScaleX      = yyGetReal(variable_struct_get(element_data, "instanceScaleX"));
		this.instanceScaleY      = yyGetReal(variable_struct_get(element_data, "instanceScaleY"));
		this.instanceImageSpeed  = yyGetReal(variable_struct_get(element_data, "instanceImageSpeed"));
		this.instanceImageIndex  = yyGetRef(variable_struct_get(element_data, "instanceImageIndex"));
		this.instanceColour      = yyGetInt32(variable_struct_get(element_data, "instanceColour"));
		this.instanceAngle       = yyGetReal(variable_struct_get(element_data, "instanceAngle"));

		var v = variable_struct_get(element_data, "instanceVariables");
		for (var vkey in v)
		{
			if (vkey.startsWith("gml") && v.hasOwnProperty(vkey))
			{
				if (this.instanceVariables === undefined)
				{
					this.instanceVariables = {};
					this.instanceVariables.__yyIsGMLObject = true;
				}

				this.instanceVariables[vkey] = v[vkey];
			}
		}

		this.flexVisible    = yyGetBool(variable_struct_get(element_data, "flexVisible"));
		this.flexAnchor     = yyGetString(variable_struct_get(element_data, "flexAnchor"));
		this.stretchWidth   = yyGetBool(variable_struct_get(element_data, "stretchWidth"));
		this.stretchHeight  = yyGetBool(variable_struct_get(element_data, "stretchHeight"));
		this.keepAspect     = yyGetBool(variable_struct_get(element_data, "keepAspect"));

		this.instanceId          = undefined;
		this.instanceCreate      = undefined;
		this.instancePreCreate   = undefined;
	}

	this.m_element_id = undefined;
}

UILayerInstanceElement.prototype.create_element = function(target_layer, run_instance_create_events)
{
	if(this.m_element_id !== undefined)
	{
		/* Element has already been created. */
		return;
	}

	/* Instances created from the WAD have a fixed ID, ones created from a GML structure get the
	 * next free one as if created by instance_create_depth() etc.
	*/
	var new_instance_id = this.instanceId !== undefined
		? this.instanceId
		: g_room_maxid++;

	var instance = new yyInstance(0.0, 0.0, new_instance_id, this.instanceObjectIndex, true);
	instance.createdone = false;

	// pI->SetInitCode(Code_GetEntry(m_params.m_init_code_slot));
	// pI->SetPreCreateCode(Code_GetEntry(m_params.m_pre_create_code_slot));
	instance.image_xscale = this.instanceScaleX;
	instance.image_yscale = this.instanceScaleY;
	instance.image_speed = this.instanceImageSpeed;
	instance.image_index = this.instanceImageIndex;
	instance.sequence_pos = instance.last_sequence_pos = this.instanceImageIndex;
	instance.image_blend = ConvertGMColour(this.instanceColour & 0xffffff);
	instance.image_alpha = ((this.instanceColour >> 24) & 0xff) / 255.0;
	instance.image_angle = this.instanceAngle;

	instance.m_uiNode = this;
	// Current_Object = pI->GetObjectIndex();
	// pI->CreatePhysicsBody(Run_Room);

	if (this.stretchWidth || this.stretchHeight)
	{
		instance.image_angle = 0.0;
	}


	instance.SetInGUISpace(target_layer.IsGUISpaceLayer());

	this.m_element_id = g_pLayerManager.AddInstanceToLayer(g_RunRoom, target_layer, instance, this.elementOrder);

	g_RunRoom.m_Active.Add(instance);
	g_pInstanceManager.Add(instance);

	if(run_instance_create_events)
	{
		instance.PerformEvent(EVENT_PRE_CREATE, 0, instance, instance);

		if(this.instanceVariables !== undefined)
		{
			/* Assign instance variables from node created at runtime with a GML structure. */

			for (var vkey in this.instanceVariables)
			{
				if (vkey.startsWith("gml") && this.instanceVariables.hasOwnProperty(vkey))
				{
					instance[vkey] = this.instanceVariables[vkey];
				}
			}
		}

		instance.createdone = true;
		instance.PerformEvent(EVENT_CREATE, 0, instance, instance);
	}

	if(!target_layer.m_visible)
		g_RunRoom.DeactivateInstance(instance);
};

UILayerInstanceElement.prototype.destroy_element = function()
{
	if(this.m_element_id === undefined)
	{
		/* Element hasn't been created yet. */
		return;
	}

	var element = g_pLayerManager.GetElementFromID(g_RunRoom, this.m_element_id);
	if(element !== null)
	{
		DoDestroy(element.m_pInstance, true);
		this.m_element_id = undefined;
	}
};

UILayerInstanceElement.prototype.position = function(container, clipping_rect, set_clipping_rect)
{
	if(this.m_element_id === undefined)
	{
		/* Element hasn't been created yet. */
		return;
	}

	var element = g_pLayerManager.GetElementFromID(g_RunRoom, this.m_element_id);
	if(element !== null)
	{
		var instance = element.m_pInstance;

		var translated_position = UILayers_translate_element_position(container, this.instanceOffsetX, this.instanceOffsetY, this.flexAnchor);

		instance.x = translated_position[0];
		instance.y = translated_position[1];

		instance.Maybe_Compute_BoundingBox();

		/* Size of the instance with no scaling applied. */
		var base_size = [
			((instance.bbox.right - instance.bbox.left) / instance.image_xscale),
			((instance.bbox.bottom - instance.bbox.top) / instance.image_yscale),
		];

		/* Size of the instance with scaling from the flexpanel element properties applied. */
		var stretched_base_size = [
			(base_size[0] * this.instanceScaleX),
			(base_size[1] * this.instanceScaleY),
		];

		/* Size of the flexpanel to fit within. */
		var container_size = [
			(container.right - container.left),
			(container.bottom - container.top),
		];

		/* Calculate the desired width/height of the instance. */
		var stretched_size = UILayers_stretch_element(stretched_base_size, container_size, this.stretchWidth, this.stretchHeight, this.keepAspect);

		/* Derive the scales to get the instance to the desired size. */
		instance.image_xscale = stretched_size[0] / base_size[0];
		instance.image_yscale = stretched_size[1] / base_size[1];

		if (set_clipping_rect)
		{
			if (element.m_clippingRect == null)
			{
				element.m_clippingRect = new YYRECT();
			}
		
			element.m_clippingRect.Copy(clipping_rect);
		}
	}
};

UILayerInstanceElement.prototype.measure_item = function(node, max_width, max_height)
{
	if(this.m_element_id === undefined)
	{
		/* Element hasn't been created yet. */
		var ret = { width: 0.0, height: 0.0 };
		return ret;
	}

	var element = g_pLayerManager.GetElementFromID(g_RunRoom, this.m_element_id);
	if(element !== null)
	{
		var instance = element.m_pInstance;

		instance.Maybe_Compute_BoundingBox();

		var ret ={
			width: (((instance.bbox.right - instance.bbox.left) / instance.image_xscale) * this.instanceScaleX),
			height: (((instance.bbox.bottom - instance.bbox.top) / instance.image_yscale) * this.instanceScaleY),
		};
		return ret;
	}
	else{
		var ret = { width: 0.0, height: 0.0 };
		return ret;
	}
};

UILayerInstanceElement.prototype.serialise = function()
{
	var ret = {};
	ret.__yyIsGMLObject = true;

	variable_struct_set(ret, "type", "Instance");

	variable_struct_set(ret, "elementOrder",        this.elementOrder);
	variable_struct_set(ret, "instanceObjectIndex", MAKE_REF(REFID_OBJECT, this.instanceObjectIndex));
	variable_struct_set(ret, "instanceOffsetX",     this.instanceOffsetX);
	variable_struct_set(ret, "instanceOffsetY",     this.instanceOffsetY);
	variable_struct_set(ret, "instanceScaleX",      this.instanceScaleX);
	variable_struct_set(ret, "instanceScaleY",      this.instanceScaleY);
	variable_struct_set(ret, "instanceImageSpeed",  this.instanceImageSpeed);
	variable_struct_set(ret, "instanceImageIndex",  MAKE_REF(REFID_SPRITE, this.instanceImageIndex));
	variable_struct_set(ret, "instanceColour",      this.instanceColour);
	variable_struct_set(ret, "instanceAngle",       this.instanceAngle);

	if(this.instanceVariables !== undefined)
	{
		/* This was created from a GML structure, copy the (initial) variables. */

		var variables = JSON.parse(JSON.stringify(this.instanceVariables));
		variable_struct_set(ret, "instanceVariables", variables);
	}
	else if(this.instancePreCreate !== undefined)
	{
		/* This was created from the WAD, execute pre-create code to recreate the IDE variables. */

		var variables = {};
		variables.__yyIsGMLObject = true;

		this.instancePreCreate(variables, variables);

		variable_struct_set(ret, "instanceVariables", variables);
	}

	variable_struct_set(ret, "flexVisible",   this.flexVisible);
	variable_struct_set(ret, "flexAnchor",    this.flexAnchor);
	variable_struct_set(ret, "stretchWidth",  this.stretchWidth);
	variable_struct_set(ret, "stretchHeight", this.stretchHeight);
	variable_struct_set(ret, "keepAspect",    this.keepAspect);

	var element;
	if(this.m_element_id !== undefined && (element = g_pLayerManager.GetElementFromID(g_RunRoom, this.m_element_id)) !== null)
	{
		variable_struct_set(ret, "instanceId", element.m_instanceID);
	}
	else{
		variable_struct_set(ret, "instanceId", -1);
	}

	variable_struct_set(ret, "elementId", this.m_element_id);

	return ret;
};

function UILayerSequenceElement(element_data, from_wad)
{
	if(from_wad)
	{
		this.elementOrder         = element_data.elementOrder;
		this.sequenceIndex        = element_data.sequenceIndex;
		this.sequenceOffsetX      = element_data.sequenceOffsetX;
		this.sequenceOffsetY      = element_data.sequenceOffsetY;
		this.sequenceScaleX       = element_data.sequenceScaleX;
		this.sequenceScaleY       = element_data.sequenceScaleY;
		this.sequenceColour       = element_data.sequenceColour;
		this.sequenceImageSpeed   = element_data.sequenceImageSpeed;
		this.sequenceSpeedType    = element_data.sequenceSpeedType;
		this.sequenceHeadPosition = element_data.sequenceHeadPosition;
		this.sequenceAngle        = element_data.sequenceAngle;
		this.sequenceName         = element_data.sequenceName;

		this.flexVisible    = element_data.flexVisible;
		this.flexAnchor     = element_data.flexAnchor;
		this.stretchWidth   = element_data.stretchWidth;
		this.stretchHeight  = element_data.stretchHeight;
		this.tileHorizontal = element_data.tileHorizontal;
		this.tileVertical   = element_data.tileVertical;
		this.keepAspect     = element_data.keepAspect;
	}
	else{
		this.elementOrder         = yyGetReal(variable_struct_get(element_data, "elementOrder"));
		this.sequenceIndex        = yyGetRef(variable_struct_get(element_data, "sequenceIndex"), REFID_SPRITE, g_pSequenceManager.Sequences.length, g_pSequenceManager.Sequences);
		this.sequenceOffsetX      = yyGetReal(variable_struct_get(element_data, "sequenceOffsetX"));
		this.sequenceOffsetY      = yyGetReal(variable_struct_get(element_data, "sequenceOffsetY"));
		this.sequenceScaleX       = yyGetReal(variable_struct_get(element_data, "sequenceScaleX"));
		this.sequenceScaleY       = yyGetReal(variable_struct_get(element_data, "sequenceScaleY"));
		this.sequenceColour       = yyGetInt32(variable_struct_get(element_data, "sequenceColour"));
		this.sequenceImageSpeed   = yyGetReal(variable_struct_get(element_data, "sequenceImageSpeed"));
		this.sequenceSpeedType    = yyGetReal(variable_struct_get(element_data, "sequenceSpeedType"));
		this.sequenceHeadPosition = yyGetReal(variable_struct_get(element_data, "sequenceHeadPosition"));
		this.sequenceAngle        = yyGetReal(variable_struct_get(element_data, "sequenceAngle"));
		this.sequenceName         = undefined;

		this.flexVisible    = yyGetBool(variable_struct_get(element_data, "flexVisible"));
		this.flexAnchor     = yyGetString(variable_struct_get(element_data, "flexAnchor"));
		this.stretchWidth   = yyGetBool(variable_struct_get(element_data, "stretchWidth"));
		this.stretchHeight  = yyGetBool(variable_struct_get(element_data, "stretchHeight"));
		this.tileHorizontal = yyGetBool(variable_struct_get(element_data, "tileHorizontal"));
		this.tileVertical   = yyGetBool(variable_struct_get(element_data, "tileVertical"));
		this.keepAspect     = yyGetBool(variable_struct_get(element_data, "keepAspect"));
	}

	this.m_element_id = undefined;
}

UILayerSequenceElement.prototype.create_element = function(target_layer, run_instance_create_events)
{
	if(this.m_element_id !== undefined)
	{
		/* Element has already been created. */
		return;
	}

	/* Copied from LayerManager.BuildRoomLayers */

	var NewSequence = new CLayerSequenceElement();

	NewSequence.m_sequenceIndex = this.sequenceIndex;
	NewSequence.m_headPosition = this.sequenceHeadPosition;
	NewSequence.m_imageBlend = ConvertGMColour(this.sequenceColour & 0xffffff);
	NewSequence.m_imageAlpha = ((this.sequenceColour >> 24) & 0xff) / 255.0;
	NewSequence.m_angle = this.sequenceAngle;
	NewSequence.m_imageSpeed = this.sequenceImageSpeed;
	NewSequence.m_playbackSpeedType = this.sequenceSpeedType;
	NewSequence.m_order = this.elementOrder;
	NewSequence.m_uiNode = this;

	if(this.sequenceName !== undefined)
	{
		NewSequence.m_name = this.sequenceName;
	}

	if (this.stretchWidth || this.stretchHeight)
	{
		NewSequence.m_angle = 0.0;
	}

	this.m_element_id = g_pLayerManager.AddNewElement(g_RunRoom, target_layer, NewSequence, true);
};

UILayerSequenceElement.prototype.destroy_element = function()
{
	if(this.m_element_id === undefined)
	{
		/* Element hasn't been created yet. */
		return;
	}

	var element = g_pLayerManager.GetElementFromID(g_RunRoom, this.m_element_id);
	if(element !== null)
	{
		g_pLayerManager.RemoveElementFromLayer(g_RunRoom, element, element.m_layer, false, true);
		this.m_element_id = undefined;
	}
};

UILayerSequenceElement.prototype.position = function(container, clipping_rect, set_clipping_rect)
{
	var element = g_pLayerManager.GetElementFromID(g_RunRoom, this.m_element_id);
	if(element !== null)
	{
		var translated_position = UILayers_translate_element_position(container, this.sequenceOffsetX, this.sequenceOffsetY, this.flexAnchor);

		element.m_x = translated_position[0];
		element.m_y = translated_position[1];

		var sequence = g_pSequenceManager.GetSequenceFromID(this.sequenceIndex);

		if(sequence !== undefined && sequence.m_width !== undefined && sequence.m_height !== undefined)
		{
			/* Size of the sequence with no scaling applied. */
			var base_size = [
				sequence.m_width,
				sequence.m_height,
			];

			/* Size of the sequence with scaling from the flexpanel element properties applied. */
			var scaled_base_size = [
				(base_size[0] * this.sequenceScaleX),
				(base_size[1] * this.sequenceScaleY),
			];

			/* Size of the flexpanel to fit within. */
			var container_size = [
				(container.right - container.left),
				(container.bottom - container.top),
			];

			/* Calculate the desired width/height of the sequence. */
			var stretched_size = UILayers_stretch_element(scaled_base_size, container_size, this.stretchWidth, this.stretchHeight, this.keepAspect);

			/* Derive the scales to get the sequence to the desired size. */
			element.m_scaleX = stretched_size[0] / base_size[0];
			element.m_scaleY = stretched_size[1] / base_size[1];
		}

		if (set_clipping_rect)
		{
			if (element.m_clippingRect == null)
			{
				element.m_clippingRect = new YYRECT();
			}
		
			element.m_clippingRect.Copy(clipping_rect);
		}
	}
};

UILayerSequenceElement.prototype.measure_item = function(node, max_width, max_height)
{
	var sequence = g_pSequenceManager.GetSequenceFromID(this.sequenceIndex);

	if(sequence !== undefined && sequence.m_width !== undefined && sequence.m_height !== undefined)
	{
		/* Sequence width/height (at t=0) is calculated by the IDE for us. */
		var ret = { width: sequence.m_width, height: sequence.m_height };
		return ret;
	}

	var ret =  { width: 0.0, height: 0.0 };
	return ret;
};

UILayerSequenceElement.prototype.serialise = function()
{
	var ret = {};
	ret.__yyIsGMLObject = true;

	variable_struct_set(ret, "type", "Sequence");

	variable_struct_set(ret, "elementOrder",         this.elementOrder);
	variable_struct_set(ret, "sequenceIndex",        MAKE_REF(REFID_SEQUENCE, this.sequenceIndex));
	variable_struct_set(ret, "sequenceOffsetX",      this.sequenceOffsetX);
	variable_struct_set(ret, "sequenceOffsetY",      this.sequenceOffsetY);
	variable_struct_set(ret, "sequenceScaleX",       this.sequenceScaleX);
	variable_struct_set(ret, "sequenceScaleY",       this.sequenceScaleY);
	variable_struct_set(ret, "sequenceColour",       this.sequenceColour);
	variable_struct_set(ret, "sequenceImageSpeed",   this.sequenceImageSpeed);
	variable_struct_set(ret, "sequenceSpeedType",    this.sequenceSpeedType);
	variable_struct_set(ret, "sequenceHeadPosition", this.sequenceHeadPosition);
	variable_struct_set(ret, "sequenceAngle",        this.sequenceAngle);

	variable_struct_set(ret, "flexVisible",    this.flexVisible);
	variable_struct_set(ret, "flexAnchor",     this.flexAnchor);
	variable_struct_set(ret, "stretchWidth",   this.stretchWidth);
	variable_struct_set(ret, "stretchHeight",  this.stretchHeight);
	variable_struct_set(ret, "tileHorizontal", this.tileHorizontal);
	variable_struct_set(ret, "tileVertical",   this.tileVertical);
	variable_struct_set(ret, "keepAspect",     this.keepAspect);
	variable_struct_set(ret, "elementId",      this.m_element_id);

	return ret;
};

function UILayerSpriteElement(element_data, from_wad)
{
	if(from_wad)
	{
		this.elementOrder     = element_data.elementOrder;
		this.spriteIndex      = element_data.spriteIndex;
		this.spriteOffsetX    = element_data.spriteOffsetX;
		this.spriteOffsetY    = element_data.spriteOffsetY;
		this.spriteScaleX     = element_data.spriteScaleX;
		this.spriteScaleY     = element_data.spriteScaleY;
		this.spriteColour     = element_data.spriteColour;
		this.spriteImageSpeed = element_data.spriteImageSpeed;
		this.spriteSpeedType  = element_data.spriteSpeedType;
		this.spriteImageIndex = element_data.spriteImageIndex;
		this.spriteAngle      = element_data.spriteAngle;
		this.spriteName       = element_data.spriteName;

		this.flexVisible    = element_data.flexVisible;
		this.flexAnchor     = element_data.flexAnchor;
		this.stretchWidth   = element_data.stretchWidth;
		this.stretchHeight  = element_data.stretchHeight;
		this.tileHorizontal = element_data.tileHorizontal;
		this.tileVertical   = element_data.tileVertical;
		this.keepAspect     = element_data.keepAspect;
	}
	else{
		this.elementOrder     = yyGetReal(variable_struct_get(element_data, "elementOrder"));
		this.spriteIndex      = yyGetRef(variable_struct_get(element_data, "spriteIndex"), REFID_SPRITE, g_pSpriteManager.Sprites.length, g_pSpriteManager.Sprites);
		this.spriteOffsetX    = yyGetReal(variable_struct_get(element_data, "spriteOffsetX"));
		this.spriteOffsetY    = yyGetReal(variable_struct_get(element_data, "spriteOffsetY"));
		this.spriteScaleX     = yyGetReal(variable_struct_get(element_data, "spriteScaleX"));
		this.spriteScaleY     = yyGetReal(variable_struct_get(element_data, "spriteScaleY"));
		this.spriteColour     = yyGetInt32(variable_struct_get(element_data, "spriteColour"));
		this.spriteImageSpeed = yyGetReal(variable_struct_get(element_data, "spriteImageSpeed"));
		this.spriteSpeedType  = yyGetReal(variable_struct_get(element_data, "spriteSpeedType"));
		this.spriteImageIndex = yyGetReal(variable_struct_get(element_data, "spriteImageIndex"));
		this.spriteAngle      = yyGetReal(variable_struct_get(element_data, "spriteAngle"));
		this.spriteName       = undefined;

		this.flexVisible    = yyGetBool(variable_struct_get(element_data, "flexVisible"));
		this.flexAnchor     = yyGetString(variable_struct_get(element_data, "flexAnchor"));
		this.stretchWidth   = yyGetBool(variable_struct_get(element_data, "stretchWidth"));
		this.stretchHeight  = yyGetBool(variable_struct_get(element_data, "stretchHeight"));
		this.tileHorizontal = yyGetBool(variable_struct_get(element_data, "tileHorizontal"));
		this.tileVertical   = yyGetBool(variable_struct_get(element_data, "tileVertical"));
		this.keepAspect     = yyGetBool(variable_struct_get(element_data, "keepAspect"));
	}

	this.m_element_id = undefined;
}

UILayerSpriteElement.prototype.create_element = function(target_layer, run_instance_create_events)
{
	if(this.m_element_id !== undefined)
	{
		/* Element has already been created. */
		return;
	}

	/* Copied from LayerManager.BuildRoomLayers */

	var NewSprite = new CLayerSpriteElement();
	NewSprite.m_spriteIndex = this.spriteIndex;
	NewSprite.m_sequencePos = this.spriteImageIndex;
	NewSprite.m_sequenceDir = 1.0;

	NewSprite.m_imageSpeed = this.spriteImageSpeed;
	NewSprite.m_playbackspeedtype = this.spriteSpeedType;
	NewSprite.m_imageIndex = this.spriteImageIndex;
	NewSprite.m_imageScaleX = this.spriteScaleX;
	NewSprite.m_imageScaleY = this.spriteScaleY;
	NewSprite.m_imageAngle = this.spriteAngle;
	NewSprite.m_imageBlend = ConvertGMColour(this.spriteColour & 0xffffff);
	NewSprite.m_imageAlpha = ((this.spriteColour >> 24)&0xff) / 255.0;
	NewSprite.m_order = this.elementOrder;
	NewSprite.m_uiNode = this;

	if(this.spriteName !== undefined)
	{
		NewSprite.m_name = this.spriteName;
	}

	if (this.stretchWidth || this.stretchHeight)
	{
		NewSprite.m_imageAngle = 0.0;
	}

	this.m_element_id = g_pLayerManager.AddNewElement(g_RunRoom, target_layer, NewSprite, true);
};

UILayerSpriteElement.prototype.destroy_element = function()
{
	if(this.m_element_id === undefined)
	{
		/* Element hasn't been created yet. */
		return;
	}

	var element = g_pLayerManager.GetElementFromID(g_RunRoom, this.m_element_id);
	if(element !== null)
	{
		g_pLayerManager.RemoveElementFromLayer(g_RunRoom, element, element.m_layer, false, true);
		this.m_element_id = undefined;
	}
};

UILayerSpriteElement.prototype.position = function(container, clipping_rect, set_clipping_rect)
{
	if(this.m_element_id === undefined)
	{
		/* Element hasn't been created yet. */
		return;
	}

	var element = g_pLayerManager.GetElementFromID(g_RunRoom, this.m_element_id);
	if(element !== null)
	{
		var translated_position = UILayers_translate_element_position(container, this.spriteOffsetX, this.spriteOffsetY, this.flexAnchor);

		element.m_x = translated_position[0];
		element.m_y = translated_position[1];

		var sprite = g_pSpriteManager.Get(element.m_spriteIndex);
		if(sprite !== null)
		{
			/* Size of the sprite with no scaling applied. */
			var base_size = [
				sprite.GetWidth(),
				sprite.GetHeight(),
			];

			/* Size of the sprite with scaling from the flexpanel element properties applied. */
			var stretched_base_size = [
				(base_size[0] * this.spriteScaleX),
				(base_size[1] * this.spriteScaleY),
			];

			/* Size of the flexpanel to fit within. */
			var container_size = [
				(container.right - container.left + 1),
				(container.bottom - container.top + 1),
			];

			/* Calculate the desired width/height of the sprite. */
			var stretched_size = UILayers_stretch_element(stretched_base_size, container_size, this.stretchWidth, this.stretchHeight, this.keepAspect);

			/* Derive the scales to get the sprite to the desired size. */
			element.m_imageScaleX = stretched_size[0] / base_size[0];
			element.m_imageScaleY = stretched_size[1] / base_size[1];

			/* Check if we need to tile the sprite */
			element.m_htile = this.tileHorizontal;
			element.m_vtile = this.tileVertical;
			if (element.m_htile || element.m_vtile)
			{
				/* Set properties only if tile is enabled */
				element.m_tile_xr = container.left;
				element.m_tile_yr = container.top;
				element.m_tile_wr = container.right - container.left;
				element.m_tile_hr = container.bottom - container.top;
			}
		}

		if (set_clipping_rect)
		{
			if (element.m_clippingRect == null)
			{
				element.m_clippingRect = new YYRECT();
			}
		
			element.m_clippingRect.Copy(clipping_rect);
		}

		if (set_clipping_rect)
		{
			/* Further reduce the clipping rectangle to the container bounds as required if tiling. */
		
			if (element.m_htile)
			{
				element.m_clippingRect.left = max(clipping_rect.left, container.left);
				element.m_clippingRect.right = min(clipping_rect.right, container.right);
			}
		
			if (element.m_vtile)
			{
				element.m_clippingRect.top = max(clipping_rect.top, container.top);
				element.m_clippingRect.bottom = min(clipping_rect.bottom, container.bottom);
			}
		}
		else if(element.m_htile || element.m_vtile)
		{
			/* Set the clipping rectangle to the container bounds on tiling axes. */
		
			if (element.m_clippingRect == null)
			{
				element.m_clippingRect = new YYRECT();
			}
		
			if (element.m_htile)
			{
				element.m_clippingRect.left = container.left;
				element.m_clippingRect.right = container.right;
			}
			else {
				element.m_clippingRect.left = clipping_rect.left;
				element.m_clippingRect.right = clipping_rect.right;
			}
		
			if (element.m_vtile)
			{
				element.m_clippingRect.top = container.top;
				element.m_clippingRect.bottom = container.bottom;
			}
			else {
				element.m_clippingRect.top = clipping_rect.top;
				element.m_clippingRect.bottom = clipping_rect.bottom;
			}
		}
	}
};

UILayerSpriteElement.prototype.measure_item = function(node, max_width, max_height)
{
	var sprite = g_pSpriteManager.Get(this.spriteIndex);
	var ret;
	if(sprite !== null)
	{
		/* Get the size of the base sprite, applying the scale of the layer element. */
		var sprite_width = sprite.GetWidth() * this.spriteScaleX;
		var sprite_height = sprite.GetHeight() * this.spriteScaleY;

		/* Skip rotation if angle is zero. */
		if(Math.abs(this.spriteAngle) > g_GMLMathEpsilon)
		{
			/* Rotate each corner around the scaled origin to get the total bounds of the sprite with rotation. */

			var scaled_origin_x = sprite.GetXOrigin() * this.spriteScaleX;
			var scaled_origin_y = sprite.GetYOrigin() * this.spriteScaleY;

			var p1 = [ 0.0, 0.0 ];
			var p2 = [ sprite_width, 0.0 ];
			var p3 = [ 0.0, sprite_height ];
			var p4 = [ sprite_width, sprite_height ];

			var rot_matrix = new yyRotationMatrix(-this.spriteAngle);

			p1 = RotatePointAroundOrigin(p1, [ scaled_origin_x, scaled_origin_y ], rot_matrix);
			p2 = RotatePointAroundOrigin(p2, [ scaled_origin_x, scaled_origin_y ], rot_matrix);
			p3 = RotatePointAroundOrigin(p3, [ scaled_origin_x, scaled_origin_y ], rot_matrix);
			p4 = RotatePointAroundOrigin(p4, [ scaled_origin_x, scaled_origin_y ], rot_matrix);

			/* Use the min/max points to make a bounding rect of the rotated sprite. */

			var extent_left = Math.min(p1[0], Math.min(p2[0], Math.min(p3[0], p4[0])));
			var extent_top = Math.min(p1[1], Math.min(p2[1], Math.min(p3[1], p4[1])));
			var extent_right = Math.max(p1[0], Math.max(p2[0], Math.max(p3[0], p4[0])));
			var extent_bottom = Math.max(p1[1], Math.max(p2[1], Math.max(p3[1], p4[1])));

			sprite_width = (extent_right - extent_left) + 1.0;
			sprite_height = (extent_bottom - extent_top) + 1.0;
		}

		ret = { width: sprite_width, height: sprite_height };
		return ret;
	}
	else{
		ret =  { width: 0.0, height: 0.0 };
		return ret;
	}
};

UILayerSpriteElement.prototype.serialise = function()
{
	var ret = {};
	ret.__yyIsGMLObject = true;

	variable_struct_set(ret, "type", "Sprite");

	variable_struct_set(ret, "elementOrder",     this.elementOrder);
	variable_struct_set(ret, "spriteIndex",      MAKE_REF(REFID_SPRITE, this.spriteIndex));
	variable_struct_set(ret, "spriteOffsetX",    this.spriteOffsetX);
	variable_struct_set(ret, "spriteOffsetY",    this.spriteOffsetY);
	variable_struct_set(ret, "spriteScaleX",     this.spriteScaleX);
	variable_struct_set(ret, "spriteScaleY",     this.spriteScaleY);
	variable_struct_set(ret, "spriteColour",     this.spriteColour);
	variable_struct_set(ret, "spriteImageSpeed", this.spriteImageSpeed);
	variable_struct_set(ret, "spriteSpeedType",  this.spriteSpeedType);
	variable_struct_set(ret, "spriteImageIndex", this.spriteImageIndex);
	variable_struct_set(ret, "spriteAngle",      this.spriteAngle);

	variable_struct_set(ret, "flexVisible",    this.flexVisible);
	variable_struct_set(ret, "flexAnchor",     this.flexAnchor);
	variable_struct_set(ret, "stretchWidth",   this.stretchWidth);
	variable_struct_set(ret, "stretchHeight",  this.stretchHeight);
	variable_struct_set(ret, "tileHorizontal", this.tileHorizontal);
	variable_struct_set(ret, "tileVertical",   this.tileVertical);
	variable_struct_set(ret, "keepAspect",     this.keepAspect);
	variable_struct_set(ret, "elementId", 	   this.m_element_id);

	return ret;
};

function UILayerTextElement(element_data, from_wad)
{
	if(from_wad)
	{
		this.elementOrder         = element_data.elementOrder;
		this.textFontIndex        = element_data.textFontIndex;
		this.textOffsetX          = element_data.textOffsetX;
		this.textOffsetY          = element_data.textOffsetY;
		this.textScaleX           = element_data.textScaleX;
		this.textScaleY           = element_data.textScaleY;
		this.textAngle            = element_data.textAngle;
		this.textColour           = element_data.textColour;
		this.textOriginX          = element_data.textOriginX;
		this.textOriginY          = element_data.textOriginY;
		this.textOrigin			  = element_data.textOrigin;
		this.textText             = element_data.textText;
		this.textAlignment        = element_data.textAlignment;
		this.textCharacterSpacing = element_data.textCharacterSpacing;
		this.textLineSpacing      = element_data.textLineSpacing;
		this.textParagraphSpacing = element_data.textParagraphSpacing;
		this.textFrameWidth       = element_data.textFrameWidth;
		this.textFrameHeight      = element_data.textFrameHeight;
		this.textWrap			  = element_data.textWrap;
		this.textWrapMode		  =	element_data.textWrapMode;
		this.textName             = element_data.textName;

		this.flexVisible    = element_data.flexVisible;
		this.flexAnchor     = element_data.flexAnchor;
		this.stretchWidth   = element_data.stretchWidth;
		this.stretchHeight  = element_data.stretchHeight;
		this.keepAspect     = element_data.keepAspect;
	}
	else{
		this.elementOrder         = yyGetReal(variable_struct_get(element_data, "elementOrder"));
		this.textFontIndex        = yyGetRef(variable_struct_get(element_data, "textFontIndex"), REFID_FONT, g_pFontManager.Fonts.length, g_pFontManager.Fonts);
		this.textOffsetX          = yyGetReal(variable_struct_get(element_data, "textOffsetX"));
		this.textOffsetY          = yyGetReal(variable_struct_get(element_data, "textOffsetY"));
		this.textScaleX           = yyGetReal(variable_struct_get(element_data, "textScaleX"));
		this.textScaleY           = yyGetReal(variable_struct_get(element_data, "textScaleY"));
		this.textAngle            = yyGetReal(variable_struct_get(element_data, "textAngle"));
		this.textColour           = yyGetInt32(variable_struct_get(element_data, "textColour"));
		this.textOriginX          = yyGetReal(variable_struct_get(element_data, "textOriginX"));
		this.textOriginY		  = yyGetReal(variable_struct_get(element_data, "textOriginY"));
		this.textOrigin			  = yyGetInt32(variable_struct_get(element_data, "textOrigin"));
		this.textText             = yyGetString(variable_struct_get(element_data, "textText"));
		this.textAlignment        = yyGetReal(variable_struct_get(element_data, "textAlignment"));
		this.textCharacterSpacing = yyGetReal(variable_struct_get(element_data, "textCharacterSpacing"));
		this.textLineSpacing      = yyGetReal(variable_struct_get(element_data, "textLineSpacing"));
		this.textParagraphSpacing = yyGetReal(variable_struct_get(element_data, "textParagraphSpacing"));
		this.textFrameWidth       = yyGetReal(variable_struct_get(element_data, "textFrameWidth"));
		this.textFrameHeight      = yyGetReal(variable_struct_get(element_data, "textFrameHeight"));
		this.textWrap			  = yyGetBool(variable_struct_get(element_data, "textWrap"));
		this.textWrapMode		  = yyGetInt32(variable_struct_get(element_data, "textWrapMode"));
		this.textName             = undefined;

		this.flexVisible    = yyGetBool(variable_struct_get(element_data, "flexVisible"));
		this.flexAnchor     = yyGetString(variable_struct_get(element_data, "flexAnchor"));
		this.stretchWidth   = yyGetBool(variable_struct_get(element_data, "stretchWidth"));
		this.stretchHeight  = yyGetBool(variable_struct_get(element_data, "stretchHeight"));
		this.keepAspect     = yyGetBool(variable_struct_get(element_data, "keepAspect"));
	}

	this.m_element_id = undefined;
}

UILayerTextElement.prototype.create_element = function(target_layer, run_instance_create_events)
{
	if(this.m_element_id !== undefined)
	{
		/* Element has already been created. */
		return;
	}

	/* Copied from LayerManager.BuildRoomLayers */

	var NewTextItem = new CLayerTextElement();
	NewTextItem.m_fontIndex = this.textFontIndex;
	NewTextItem.m_angle = this.textAngle;
	NewTextItem.m_blend = ConvertGMColour(this.textColour & 0xffffff);
	NewTextItem.m_alpha = ((this.textColour >> 24) & 0xff) / 255.0;
	NewTextItem.m_scaleX = this.textScaleX;
	NewTextItem.m_scaleY = this.textScaleY;
	NewTextItem.m_originX = this.textOriginX;
	NewTextItem.m_originY = this.textOriginY;
	NewTextItem.m_origin = this.textOrigin;
	NewTextItem.m_text = this.textText;
	NewTextItem.m_alignment = this.textAlignment;
	NewTextItem.m_charSpacing = this.textCharacterSpacing;
	NewTextItem.m_lineSpacing = this.textLineSpacing;
	NewTextItem.m_paragraphSpacing = this.textParagraphSpacing;
	NewTextItem.m_frameW = this.textFrameWidth;
	NewTextItem.m_frameH = this.textFrameHeight;
	NewTextItem.m_wrap = this.textWrap;
	NewTextItem.m_wrapMode = this.textWrapMode;
	NewTextItem.m_order = this.elementOrder;
	NewTextItem.m_uiNode = this;

	if(this.textName !== undefined)
	{
		NewTextItem.m_name = this.textName;
	}

	this.m_element_id = g_pLayerManager.AddNewElement(g_RunRoom, target_layer, NewTextItem, true);
};

UILayerTextElement.prototype.destroy_element = function()
{
	if(this.m_element_id === undefined)
	{
		/* Element hasn't been created yet. */
		return;
	}

	var element = g_pLayerManager.GetElementFromID(g_RunRoom, this.m_element_id);
	if(element !== null)
	{
		g_pLayerManager.RemoveElementFromLayer(g_RunRoom, element, element.m_layer, false, true);
		this.m_element_id = undefined;
	}
};

UILayerTextElement.prototype.position = function(container, clipping_rect, set_clipping_rect)
{
	if(this.m_element_id === undefined)
	{
		/* Element hasn't been created yet. */
		return;
	}

	var element = g_pLayerManager.GetElementFromID(g_RunRoom, this.m_element_id);
	var font = g_pFontManager.Get(this.textFontIndex);

	if(element !== null && font !== null)
	{
		var translated_position = UILayers_translate_element_position(container, this.textOffsetX, this.textOffsetY, this.flexAnchor);

		element.m_x = translated_position[0];
		element.m_y = translated_position[1];

		if(!(element.m_wrap) && (this.stretchWidth || this.stretchHeight))
		{
			var base_text_size = this._calc_base_text_size(element, font, (container.right - container.left));

			/* Size of the text with scaling from the flexpanel element properties applied. */
			var scaled_text_size = [
				(base_text_size.width * this.textScaleX),
				(base_text_size.height * this.textScaleY),
			];

			/* Size of the flexpanel to fit within. */
			var container_size = [
				(container.right - container.left),
				(container.bottom - container.top),
			];

			/* Calculate the desired width/height of the text. */
			var stretched_size = UILayers_stretch_element(scaled_text_size, container_size, this.stretchWidth, this.stretchHeight, this.keepAspect);

			if (this.stretchWidth || this.keepAspect)
			{
				element.m_scaleX = stretched_size[0] / base_text_size.width;
			}

			if (this.stretchHeight || this.keepAspect)
			{
				element.m_scaleY = (stretched_size[1] * this.textScaleY) / base_text_size.height;
			}
		}
		else {
			element.m_scaleX = this.textScaleX;
			element.m_scaleY = this.textScaleY;
		}

		if(this.stretchWidth)
		{
			element.m_frameW = (container.GetWidth() + 1) / element.m_scaleX;
		}
		else{
			element.m_frameW = this.textFrameWidth;
		}

		if(this.stretchHeight)
		{
			element.m_frameH = (container.GetHeight() + 1) / element.m_scaleY;
		}
		else{
			element.m_frameH = this.textFrameHeight;
		}

		if (set_clipping_rect)
		{
			if (element.m_clippingRect == null)
			{
				element.m_clippingRect = new YYRECT();
			}
		
			element.m_clippingRect.Copy(clipping_rect);
		}
	}
};

UILayerTextElement.prototype.measure_item = function(node, max_width, max_height)
{
	var ret;
	if(this.m_element_id === undefined)
	{
		/* Element hasn't been created yet. */
		ret = { width: 0, height: 0 };
		return ret;
	}

	var element = g_pLayerManager.GetElementFromID(g_RunRoom, this.m_element_id);
	var font = g_pFontManager.Get(this.textFontIndex);

	if(element === null || font === null)
	{
		ret= { width: 0, height: 0 };
		return ret;
	}

	var size = this._calc_base_text_size(element, font, max_width);

	/* When stretch and keep aspect is enabled, we allow the text to grow to fit a fixed-size
	 * container in one dimension and then grow the other (auto sized) dimension to fit via the
	 * measure function...
	 *
	 * This logic is copied from RoomItemHelper.MeasureItemSize() in the IDE.
	*/

	if ((!element.m_wrap) && this.keepAspect && (this.stretchWidth || this.stretchHeight))
	{
		var node_width = node.getWidth();
		var node_height = node.getHeight();

		var autoW = node_width.unit == YGUnitAuto;
		var autoH = node_height.unit == YGUnitAuto;
		var parentW = (autoW) ? size.width : max_width; //parent width = item width, when auto sized
		var parentH = (autoH) ? size.height : max_height;
		var contentAspect = size.width / size.height;
		var adjustHeight = true;
		if (autoW && autoH)
		{
			var parentAspect = parentW / parentH; //parent size = item size in both dimensions
			adjustHeight = (contentAspect > parentAspect);
		}
		else if (autoW)
		{
			size.width = Math.abs(max_height * contentAspect); //we cannot adjust fixed height
		}
		else if (autoH)
		{
			size.height = Math.abs(max_width / contentAspect); //we cannot adjust fixed width
		}

		if (adjustHeight)
			size.height = Math.abs(parentW / contentAspect);
		else
			size.width = Math.abs(parentH * contentAspect);
	}

	return size;
};

UILayerTextElement.prototype._calc_base_text_size = function(element, font, max_container_width)
{
	var fontId = this.textFontIndex;
	var computed_width = 0;
	var computed_height = 0;
	if (element.m_wrap) {
		var boundsWidth;
		if (this.stretchWidth) {
			boundsWidth = max_container_width; //Element size is the extent of the text wrapped within the maximum available panel size.
			if (this.textScaleX != 0)
				boundsWidth /= this.textScaleX;
		}
		else {
			boundsWidth = element.m_frameW; //Element size is the extent of the text wrapped within the defined frame width
		}
		g_pFontManager.GR_Text_Measure_IDEStyleW(element.m_text, fontId, boundsWidth, element.m_wrap, element.m_wrapMode, element.m_charSpacing, element.m_lineSpacing, element.m_paragraphSpacing);
	}
	else
	{
		g_pFontManager.GR_Text_Measure_IDEStyle(element.m_text, fontId, element.m_charSpacing, element.m_lineSpacing, element.m_paragraphSpacing);
	}
	computed_width = g_ActualTextWidth * this.textScaleX;
	computed_height = g_ActualTextHeight * this.textScaleY;

	var ret = { width: computed_width, height: computed_height };
	return ret;
};

UILayerTextElement.prototype.serialise = function()
{
	var ret = {};
	ret.__yyIsGMLObject = true;

	variable_struct_set(ret, "type", "Text");

	variable_struct_set(ret, "elementOrder",         this.elementOrder);
	variable_struct_set(ret, "textFontIndex",        MAKE_REF(REFID_FONT, this.textFontIndex));
	variable_struct_set(ret, "textOffsetX",          this.textOffsetX);
	variable_struct_set(ret, "textOffsetY",          this.textOffsetY);
	variable_struct_set(ret, "textScaleX",           this.textScaleX);
	variable_struct_set(ret, "textScaleY",           this.textScaleY);
	variable_struct_set(ret, "textAngle",            this.textAngle);
	variable_struct_set(ret, "textColour",           this.textColour);
	variable_struct_set(ret, "textOriginX",          this.textOriginX);
	variable_struct_set(ret, "textOriginY",			 this.textOriginY);
	variable_struct_set(ret, "textOrigin",			 this.textOrigin);
	variable_struct_set(ret, "textText",             this.textText);
	variable_struct_set(ret, "textAlignment",        this.textAlignment);
	variable_struct_set(ret, "textCharacterSpacing", this.textCharacterSpacing);
	variable_struct_set(ret, "textLineSpacing",      this.textLineSpacing);
	variable_struct_set(ret, "textParagraphSpacing", this.textParagraphSpacing);
	variable_struct_set(ret, "textFrameWidth",       this.textFrameWidth);
	variable_struct_set(ret, "textFrameHeight",      this.textFrameHeight);
	variable_struct_set(ret, "textWrap",			 this.textWrap);
	variable_struct_set(ret, "textWrapMode",		 this.textWrapMode);

	variable_struct_set(ret, "flexVisible",   this.flexVisible);
	variable_struct_set(ret, "flexAnchor",    this.flexAnchor);
	variable_struct_set(ret, "stretchWidth",  this.stretchWidth);
	variable_struct_set(ret, "stretchHeight", this.stretchHeight);
	variable_struct_set(ret, "keepAspect",    this.keepAspect);
	variable_struct_set(ret, "elementId",     this.m_element_id);

	return ret;
};
