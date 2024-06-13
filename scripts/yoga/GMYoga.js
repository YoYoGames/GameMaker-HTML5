const Yoga = require('/yoga-wasm-base64-csm.js')
var g_yoga = null;


async function flexpanel_init()
{
	g_yoga = await Yoga();
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



var g_positionType = {
	"static" : 0,
	"relative" : 1,
	"absolute" : 2,
};

var g_alignType = {
	"auto" : 0,
	"flex-start" : 1,
	"center" : 2,
	"flex-end" : 3,
	"stretch" : 4,
	"baseline" : 5,
	"space-between" : 6,
	"space-around" : 7,
	"space-evenly" : 8,
	"initial" : 4,
};

var g_wrapType = {
	"initial" : 0,
	"no-wrap" : 0,
	"wrap" : 1,
	"wrap-reverse" : 2,
};

var g_displayType = {
	"flex" : 0,
	"none" : 1,
};

var g_flexDirectionType = {
	"column" : 0,
	"column-reverse" : 1,
	"row" : 2,
	"row-reverse" : 3,
};

var g_justifyType = {
	"flex-start" : 0,
	"center" : 1,
	"flex-end" : 2,
	"space-between" : 3,
	"space-around" : 4,
	"space-evenly" : 5,
};

var g_directionType = {
	"ltr" : 1,
	"rtl" : 2,
	"inherit" : 0,
};

var g_contextYoga = new Map();



function FLEXPANEL_StringToEnum( _type, _value)
{
	return _type[ _value ];
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

// #######################################################################################
function FLEXPANEL_Init_From_Struct(_node, _struct)
{
	var context = g_contextYoga.get( _node.M.O );
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

				var child = g_yoga.Node.createDefault();
				g_contextYoga.set( child.M.O, {} )
				_node.insertChild( child, n );

				FLEXPANEL_Init_From_Struct( child, value[n] );

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
			_node.setGap( YGGutterColumn, yyGetReal(value) )
			break;
		case "gapRow":
		case "rowGap":
			_node.setGap( YGGutterRow, yyGetReal(value) )
			break;
		case "gap":
			_node.setGap( YGGutterAll, yyGetReal(value) )
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
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeLeft, function( n, v, e ) { n.setPadding(e, v) }, function( n, v ) { n.setPaddingPercent(e, v) } );
			break;
		case "paddingRight":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeRight, function( n, v, e ) { n.setPadding(e, v) }, function( n, v ) { n.setPaddingPercent(e, v) } );
			break;
		case "paddingTop":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeTop, function( n, v, e ) { n.setPadding(e, v) }, function( n, v ) { n.setPaddingPercent(e, v) } );
			break;
		case "paddingBottom":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeBottom, function( n, v, e ) { n.setPadding(e, v) }, function( n, v ) { n.setPaddingPercent(e, v) } );
			break;
		case "paddingStart":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeStart, function( n, v, e ) { n.setPadding(e, v) }, function( n, v ) { n.setPaddingPercent(e, v) } );
			break;
		case "paddingEnd":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeEnd, function( n, v, e ) { n.setPadding(e, v) }, function( n, v ) { n.setPaddingPercent(e, v) } );
			break;
		case "paddingHorizontal":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeHorizontal, function( n, v, e ) { n.setPadding(e, v) }, function( n, v ) { n.setPaddingPercent(e, v) } );
			break;
		case "paddingVertical":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeVertical, function( n, v, e ) { n.setPadding(e, v) }, function( n, v ) { n.setPaddingPercent(e, v) } );
			break;
		case "padding":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeAll, function( n, v, e ) { n.setPadding(e, v) }, function( n, v ) { n.setPaddingPercent(e, v) } );
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
		case "left":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeLeft, function( n, v, e ) { n.setPosition(e, v) }, function( n, v ) { n.setPositionPercent(e, v) } );
			break;
		case "right":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeRight, function( n, v, e ) { n.setPosition(e, v) }, function( n, v ) { n.setPositionPercent(e, v) } );
			break;
		case "top":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeTop, function( n, v, e ) { n.setPosition(e, v) }, function( n, v ) { n.setPositionPercent(e, v) } );
			break;
		case "bottom":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeBottom, function( n, v, e ) { n.setPosition(e, v) }, function( n, v ) { n.setPositionPercent(e, v) } );
			break;
		case "start":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeStart, function( n, v, e ) { n.setPosition(e, v) }, function( n, v ) { n.setPositionPercent(e, v) } );
			break;
		case "end":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeEnd, function( n, v, e ) { n.setPosition(e, v) }, function( n, v ) { n.setPositionPercent(e, v) } );
			break;
		case "horizontal":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeHorizontal, function( n, v, e ) { n.setPosition(e, v) }, function( n, v ) { n.setPositionPercent(e, v) } );
			break;
		case "vertical":
			FLEXPANEL_SetCSSValueEdge( _node, value, YGEdgeVetical, function( n, v, e ) { n.setPosition(e, v) }, function( n, v ) { n.setPositionPercent(e, v) } );
			break;
		case "position":
		case "positionType":
			_node.setPositionType( FLEXPANEL_StringToEnum(g_positionType, value) );
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
			g_contextYoga.get( _node.M.O ).name = value;
			break;
		case "data":
			g_contextYoga.get( _node.M.O ).data = value;
			break;
		case "__yyIsGMLObject":
		case "__type": break;
		default:
			console.log( "flexpanel_create_node : unknown struct key " + key );
			break;
		}

	}
}

// #######################################################################################
function FLEXPANEL_Handle_Struct( _node, _struct)
{
	var s = _struct;
	if (typeof(_struct) != "object") {
		s = json_parse(_struct)
	} // end if

	FLEXPANEL_Init_From_Struct(_node, s );
}


// #######################################################################################
function flexpanel_create_node( _struct )
{	
	var ret = g_yoga.Node.createDefault();
	g_contextYoga.set( ret.M.O, {} )
	FLEXPANEL_Handle_Struct( ret, _struct);
	return ret;
}

// #######################################################################################
function flexpanel_delete_node( _node )
{	
	g_yoga.Node.destroy(_node);
}

// #######################################################################################
function flexpanel_node_insert_child( _node, _child, _index)
{	
	_node.insertChild( _child, _index );
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
	var context = g_contextYoga.get( _node.M.O );
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
	var context = g_contextYoga.get( _node.M.O );
	return context.name;
}

// #######################################################################################
function flexpanel_node_set_name( _node, _name )
{	
	var context = g_contextYoga.get( _node.M.O );
	context.name = _name;
}

// #######################################################################################
function flexpanel_node_get_data( _node )
{	
	var context = g_contextYoga.get( _node.M.O );
	return context.data;
}

// #######################################################################################
function flexpanel_node_set_data( _node, _data )
{	
	var context = g_contextYoga.get( _node.M.O );
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
	var context = g_contextYoga.get( _node.M.O );
    FLEXPANEL_SetIfNotDefault( ret, "alignContent", _node.getAlignContent(), YGAlignFlexStart );
    FLEXPANEL_SetIfNotDefault( ret, "alignItems", _node.getAlignItems(), YGAlignStretch );
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

    return ret;
}

// #######################################################################################
function flexpanel_calculate_layout( _node, _width, _height, _direction)
{	
	_node.calculateLayout( yyGetReal(_width), yyGetReal(_height), _direction );
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

			x += _node.getComputedLeft();
			y += _node.getComputedTop();

			curr = curr.getParent();
		} // end while
	} // end if
	var ret = {};
    ret.__yyIsGMLObject = true;	
    variable_struct_set(ret, "left", _node.getComputedLeft() + x);
    variable_struct_set(ret, "top", _node.getComputedTop() + y);
    variable_struct_set(ret, "width", _node.getComputedWidth());
    variable_struct_set(ret, "height", _node.getComputedHeight());
    variable_struct_set(ret, "bottom", _node.getComputedBottom() + y);
    variable_struct_set(ret, "right", _node.getComputedRight() + x);

	return ret;
}

// #######################################################################################
function FLEXPANEL_CreateValueResult( _v )
{
	var ret = {};
    ret.__yyIsGMLObject = true;	
    variable_struct_set(ret, "unit", _v.unit);
    variable_struct_set(ret, "value", _v.value);
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
	var context = g_contextYoga.get( _node.M.O );
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
	var context = g_contextYoga.get( _node.M.O );
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
	var context = g_contextYoga.get( _node.M.O );
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
function flexpanel_node_style_set_position(_node, _value)
{	
	switch( _unit )
	{
	case YGUnitPoint:
		_node.setPosition( yyGetReal(_value) );
		break;
	case YGUnitPercent:
		_node.setPositionPercent( yyGetReal(_value) );
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
	var context = g_contextYoga.get( _node.M.O );
	context.direction = yyGetInt32(_value);	
}

// #######################################################################################
function flexpanel_node_style_set_margin(_node, _edge, _value)
{	
	_node.setMargin( yyGetInt32(_edge), yyGetReal(_value));
}

// #######################################################################################
function flexpanel_node_style_set_padding(_node, _value)
{	
	_node.setPadding( yyGetInt32(_edge), yyGetReal(_value));
}

// #######################################################################################
function flexpanel_node_style_set_border(_node, _value)
{	
	_node.setBorder( yyGetInt32(_edge), yyGetReal(_value));
}

// #######################################################################################
function flexpanel_node_style_set_position_type(_node, _value)
{	
	_node.setPositionType(yyGetInt32(_value));

}

// #######################################################################################
function flexpanel_node_style_set_min_width(_node, _value)
{	
	switch( _unit )
	{
	case YGUnitPoint:
		_node.setMinWidth( yyGetReal(_value) );
		break;
	case YGUnitPercent:
		_node.setMinWidthPercent( yyGetReal(_value) );
		break;
	} // end switch
}

// #######################################################################################
function flexpanel_node_style_set_max_width(_node, _value)
{	
	switch( _unit )
	{
	case YGUnitPoint:
		_node.setMaxWidth( yyGetReal(_value) );
		break;
	case YGUnitPercent:
		_node.setMaxWidthPercent( yyGetReal(_value) );
		break;
	} // end switch
}

// #######################################################################################
function flexpanel_node_style_set_min_height(_node, _value)
{	
	switch( _unit )
	{
	case YGUnitPoint:
		_node.setMinHeight( yyGetReal(_value) );
		break;
	case YGUnitPercent:
		_node.setMinHeightPercent( yyGetReal(_value) );
		break;
	} // end switch
}

// #######################################################################################
function flexpanel_node_style_set_max_height(_node, _value)
{	
	switch( _unit )
	{
	case YGUnitPoint:
		_node.setMaxHeight( yyGetReal(_value) );
		break;
	case YGUnitPercent:
		_node.setMaxHeightPercent( yyGetReal(_value) );
		break;
	} // end switch
}

// #######################################################################################
function flexpanel_node_style_set_width(_node, _value)
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
function flexpanel_node_style_set_height(_node, _value)
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



