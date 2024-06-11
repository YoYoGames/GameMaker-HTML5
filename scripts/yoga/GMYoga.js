const Yoga = require('/yoga-wasm-base64-csm.js')
var g_yoga = null;


async function flexpanel_init()
{
	g_yoga = await Yoga();
}
flexpanel_init();

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
}


function FLEXPANEL_Init_From_Struct(_node, _struct)
{
	for( var key in _struct) {
		if (!_struct.hasOwnProperty(key)) continue;

		var value = _struct[key];
		switch( key )
		{
		case "nodes":
			// TODO : need to remove all the children
			for( var n=0; n<value.length; ++n) {

				var child = g_yoga.Node.createDefault();
				_node.insertChild( child, n );

				FLEXPANEL_Init_From_Struct( child, value[n] );

			} // end for
			break;
		case "alignContent":
			_node.setAlignContent( g_alignType[value] );
			break;
		case "alignItems":
			break;
		case "alignSelf":
			break;
		case "aspectRatio":
			break;
		case "display":
			break;
		case "flex":
			break;
		case "flexGrow":
			break;
		case "flexBasis":
			break;
		case "flexShrink":
			break;
		case "flexDirection":
			break;
		case "flexWrap":
			break;
		case "gapColumn":
			break;
		case "gapRow":
		case "rowGap":
			break;
		case "gap":
			break;
		case "justifyContent":
			break;
		case "direction":
			break;
		case "marginLeft":
			break;
		case "marginRight":
			break;
		case "marginTop":
			break;
		case "marginBottom":
			break;
		case "marginStart":
			break;
		case "marginEnd":
			break;
		case "marginHorizontal":
			break;
		case "marginVertical":
			break;
		case "margin":
			break;
		case "marginInline":
			break;
		case "paddingLeft":
			break;
		case "paddingRight":
			break;
		case "paddingTop":
			break;
		case "paddingBottom":
			break;
		case "paddingStart":
			break;
		case "paddingEnd":
			break;
		case "paddingHorizontal":
			break;
		case "paddingVertical":
			break;
		case "padding":
			break;
		case "borderLeft":
			break;
		case "borderRight":
			break;
		case "borderTop":
			break;
		case "borderBottom":
			break;
		case "borderStart":
			break;
		case "borderEnd":
			break;
		case "borderHorizontal":
			break;
		case "borderVertical":
			break;
		case "border":
			break;
		case "left":
			break;
		case "right":
			break;
		case "top":
			break;
		case "bottom":
			break;
		case "start":
			break;
		case "end":
			break;
		case "horizontal":
			break;
		case "vertical":
			break;
		case "position":
		case "positionType":
			break;
		case "minWidth":
			break;
		case "maxWidth":
			break;
		case "minHeight":
			break;
		case "maxHeight":
			break;
		case "width":
			break;
		case "height":
			break;
		case "name":
			break;
		case "data":
			break;
		default:
			console.log( "flexpanel_create_node : unknown struct key " + key );
			break;
		}

	}
}

function FLEXPANEL_Handle_Struct( _node, _struct)
{
	var s = _struct;
	if (typeof(_struct) != "object") {
		s = JSON.parse(_struct)
	} // end if

	FLEXPANEL_Init_From_Struct(_node, s );
}


// #######################################################################################
function flexpanel_create_node( _struct )
{	
	var ret = g_yoga.Node.createDefault();
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
}

// #######################################################################################
function flexpanel_node_remove_child( _node, _child )
{
}

// #######################################################################################
function flexpanel_node_remove_all_children( _node )
{	
}

// #######################################################################################
function flexpanel_node_get_num_children( _node )
{	
}

// #######################################################################################
function flexpanel_node_get_child( _node, _indexOrString )
{	
}

// #######################################################################################
function flexpanel_node_get_child_hash( _node, _indexOrString ) { return flexpanel_node_get_child(_node, _indexOrString ); }

// #######################################################################################
function flexpanel_node_get_parent( _node )
{	
}

// #######################################################################################
function flexpanel_node_get_name( _node )
{	
}

// #######################################################################################
function flexpanel_node_set_name( _node, _name )
{	
}

// #######################################################################################
function flexpanel_node_get_data( _node )
{	
}

// #######################################################################################
function flexpanel_node_set_data( _node, _data )
{	
}

// #######################################################################################
function flexpanel_node_get_struct( _node )
{	
}

// #######################################################################################
function flexpanel_calculate_layout( )
{	
}

// #######################################################################################
function flexpanel_node_layout_get_position( _node, _relative )
{	
}


// #######################################################################################
function flexpanel_node_style_get_align_content(_node) 
{

}

// #######################################################################################
function flexpanel_node_style_get_align_items( _node )
{

}

// #######################################################################################
function flexpanel_node_style_get_align_self(_node )
{

}

// #######################################################################################
function flexpanel_node_style_get_aspect_ratio( _node )
{

}

// #######################################################################################
function flexpanel_node_style_get_display( _node )
{

}

// #######################################################################################
function flexpanel_node_style_get_flex( _node )
{

}

// #######################################################################################
function flexpanel_node_style_get_flex_grow( _node )
{

}

// #######################################################################################
function flexpanel_node_style_get_flex_shrink( _node )
{

}

// #######################################################################################
function flexpanel_node_style_get_flex_basis( _node )
{

}

// #######################################################################################
function flexpanel_node_style_get_flex_direction( _node )
{

}

// #######################################################################################
function flexpanel_node_style_get_flex_wrap( _node )
{

}

// #######################################################################################
function flexpanel_node_style_get_gap( _node )
{

}

// #######################################################################################
function flexpanel_node_style_get_position( _node )
{

}

// #######################################################################################
function flexpanel_node_style_get_justify_content( _node )
{

}

// #######################################################################################
function flexpanel_node_style_get_direction( _node )
{

}

// #######################################################################################
function flexpanel_node_style_get_margin( _node )
{

}

// #######################################################################################
function flexpanel_node_style_get_padding( _node )
{

}

// #######################################################################################
function flexpanel_node_style_get_border( _node )
{

}

// #######################################################################################
function flexpanel_node_style_get_position_type( _node )
{

}

// #######################################################################################
function flexpanel_node_style_get_min_width( _node )
{

}

// #######################################################################################
function flexpanel_node_style_get_max_width( _node )
{

}

// #######################################################################################
function flexpanel_node_style_get_min_height( _node )
{

}

// #######################################################################################
function flexpanel_node_style_get_max_height( _node )
{

}

// #######################################################################################
function flexpanel_node_style_get_width( _node )
{

}

// #######################################################################################
function flexpanel_node_style_get_height( _node )
{

}

// #######################################################################################
function flexpanel_node_style_set_align_content(_node, _value)
{	
}

// #######################################################################################
function flexpanel_node_style_set_align_items(_node, _value)
{	
}

// #######################################################################################
function flexpanel_node_style_set_align_self(_node, _value)
{	
}

// #######################################################################################
function flexpanel_node_style_set_aspect_ratio(_node, _value)
{	
}

// #######################################################################################
function flexpanel_node_style_set_display(_node, _value)
{	
}

// #######################################################################################
function flexpanel_node_style_set_flex(_node, _value)
{	
}

// #######################################################################################
function flexpanel_node_style_set_flex_grow(_node, _value)
{	
}

// #######################################################################################
function flexpanel_node_style_set_flex_shrink(_node, _value)
{	
}

// #######################################################################################
function flexpanel_node_style_set_flex_basis(_node, _value)
{	
}

// #######################################################################################
function flexpanel_node_style_set_flex_direction(_node, _value)
{	
}

// #######################################################################################
function flexpanel_node_style_set_flex_wrap(_node, _value)
{	
}

// #######################################################################################
function flexpanel_node_style_set_gap(_node, _value)
{	
}

// #######################################################################################
function flexpanel_node_style_set_position(_node, _value)
{	
}

// #######################################################################################
function flexpanel_node_style_set_justify_content(_node, _value)
{	
}

// #######################################################################################
function flexpanel_node_style_set_direction(_node, _value)
{	
}

// #######################################################################################
function flexpanel_node_style_set_margin(_node, _value)
{	
}

// #######################################################################################
function flexpanel_node_style_set_padding(_node, _value)
{	
}

// #######################################################################################
function flexpanel_node_style_set_border(_node, _value)
{	
}

// #######################################################################################
function flexpanel_node_style_set_position_type(_node, _value)
{	
}

// #######################################################################################
function flexpanel_node_style_set_min_width(_node, _value)
{	
}

// #######################################################################################
function flexpanel_node_style_set_max_width(_node, _value)
{	
}

// #######################################################################################
function flexpanel_node_style_set_min_height(_node, _value)
{	
}

// #######################################################################################
function flexpanel_node_style_set_max_height(_node, _value)
{	
}

// #######################################################################################
function flexpanel_node_style_set_width(_node, _value)
{	
}

// #######################################################################################
function flexpanel_node_style_set_height(_node, _value)
{	
}



