// **********************************************************************************************************************
// Copyright (C) 2019, YoYo Games Ltd. All Rights reserved.
// **********************************************************************************************************************

function extension_get_option_value(_extension_name, _option_name)
{
    try {
        if( g_pGMFile.ExtensionOptions !== undefined ) 
        {
            if (g_pGMFile.ExtensionOptions[_extension_name] !== undefined)
            {
                return g_pGMFile.ExtensionOptions[_extension_name][_option_name];
            }
        }
    } catch( _ex ) {
        show_debug_message( "caught unhandled exception " + _ex.message );
    } // end catch

    return undefined;
}

function extension_get_option_count(_extension_name)
{
    try {
        if( g_pGMFile.ExtensionOptions !== undefined ) 
        {
            if (g_pGMFile.ExtensionOptions[_extension_name] !== undefined)
            {
                return Object.keys(g_pGMFile.ExtensionOptions[_extension_name]).length;
            }
        }
    } catch( _ex ) {
        show_debug_message( "caught unhandled exception " + _ex.message );
    } // end catch

    return 0;
}

function extension_get_option_names(_extension_name)
{
    try {
        if( g_pGMFile.ExtensionOptions !== undefined ) 
        {
            if (g_pGMFile.ExtensionOptions[_extension_name] !== undefined)
            {
                return Object.keys(g_pGMFile.ExtensionOptions[_extension_name]);
            }
        }
    } catch( _ex ) {
        show_debug_message( "caught unhandled exception " + _ex.message );
    } // end catch

    return [];
}

function extension_get_options(_extension_name)
{
    try {
        if( g_pGMFile.ExtensionOptions !== undefined ) 
        {
            if (g_pGMFile.ExtensionOptions[_extension_name] !== undefined)
            {
                var data = g_pGMFile.ExtensionOptions[_extension_name];
                var optionData = new GMLObject();
                Object.keys(data).forEach(element => {
                    variable_struct_set(optionData, element, data[element])
                });

                return optionData;
            }
        }
    } catch( _ex ) {
        show_debug_message( "caught unhandled exception " + _ex.message );
    } // end catch

    return {};
}

function gc_collect()
{

}

function gc_enable(_enable)
{

}

function gc_is_enabled()
{
    return true;
}

function gc_get_stats()
{
    var resobj = new Object();
    resobj.__yyIsGMLObject = true;

    Object.defineProperties(resobj, {
        gmlobjects_touched: { enumerable: true, get: function () { return 0; } },        
        gmlobjects_collected: { enumerable: true, get: function () { return 0; } },
        gmltraversal_time: { enumerable: true, get: function () { return 0; } },
        gmlcollection_time: { enumerable: true, get: function () { return 0; } },
        gmlgeneration_collected: { enumerable: true, get: function () { return 0; } },
        gmlgc_frame: { enumerable: true, get: function () { return 0; } },
        gmlnum_generations: { enumerable: true, get: function () { return 0; } },
        gmlnum_objects_in_generation: { enumerable: true, get: function () { var temp = []; return temp; } },
    });

    return resobj;
}