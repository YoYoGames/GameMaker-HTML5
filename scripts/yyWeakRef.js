// **********************************************************************************************************************
// 
// Copyright (c)2020, YoYo Games Ltd. All Rights reserved.
// 
// File:            yyWeakRef.js
// Created:         24/07/2020
// Author:          MikeR
// Project:         HTML5
// Description:     
// 
// Date				Version		BY		Comment
// ----------------------------------------------------------------------------------------------------------------------
// 24/07/2020		
// 
// **********************************************************************************************************************

// #############################################################################################
/// Function:<summary>
///             Constructor for the yyWeakRef object 
///          </summary>
// #############################################################################################
/** @constructor */
function yyWeakRef()
{    
    this.__yyIsGMLObject = true;
    this.__type = "[weakref]";
    
    this.pWeakRef = null;

    this.IsRefAlive = function ()
    {
        if (this.pWeakRef == null)
        {
            return undefined;
        }
        else if (this.pWeakRef.deref() == undefined)
        {
            return false;
        }        
        
        return true;        
    };

    this.SetReference = function (_pRef)
    {
        if (typeof WeakRef === "undefined")
        {
            this.pWeakRef = null;
        }        
        else
        {
            this.pWeakRef = new WeakRef(_pRef);
        }
        
    };   

    Object.defineProperties(this, {
        gmlref: {
            enumerable: true,
            get: function () { return (this.pWeakRef == null) ? undefined : ((this.pWeakRef.deref() == undefined) ? undefined : this.pWeakRef.deref()); }
        }
    });
}

function weak_ref_create(_pRef)
{
    if (_pRef != undefined)
    {
        if ((typeof (_pRef) == "object") || (typeof (_pRef) == "function"))
        {
            var weakref = new yyWeakRef();
            weakref.SetReference(_pRef);
            return weakref;
        }
        else
        {
            yyError("invalid argument passed to weak_ref_create");
        }
    }
    else
    {
        yyError("incorrect number of arguments to weak_ref_create");
    }
   
    return undefined;
}

function weak_ref_alive(_pWeakRef)
{
    if (_pWeakRef != undefined)
    {
        if ((typeof (_pWeakRef) == "object") && (_pWeakRef.__type != undefined) && (_pWeakRef.__type == "[weakref]"))
        {
            return _pWeakRef.IsRefAlive();
        }
        return undefined;
    }
    else
    {
        yyError("incorrect number of arguments to weak_ref_alive");
    }
}

function weak_ref_any_alive(_array, _index, _length)
{
    if (_array == undefined)
    {
        yyError("incorrect number of arguments to weak_ref_any_alive");
    }
    else if (Array.isArray(_array) == false)
    {
        yyError("first argument to weak_ref_any_alive is not an array");        
    }
    else
    {
        var index = 0;
        var length = _array.length;

        if (_index != undefined)
        {
            index = _index;
        }
        if (_length != undefined)
        {
            length = _length;
        }

        // Clamp values to array size
        if (index < 0)
        {
            length += index;
            index = 0;
        }
        if (index >= _array.length)
        {
            return;
        }
        if ((index + length) >= _array.length)
        {
            length = _array.length - index;
        }
        if (length <= 0)
        {
            return;
        }				

        if (length > 0)
        {
            var res = false;

            var end = index + length;
            for (var i = index; i < end; i++)
            {
                var entry = _array[i];

                if ((typeof (entry) == "object") && (entry.__type != undefined) && (entry.__type == "[weakref]"))
                {
                    var isalive = entry.IsRefAlive();
                    if (isalive == undefined)
                    {
                        return undefined;
                    }
                    else if (entry.IsRefAlive() == true)
                    {
                        res = true;
                    }                    
                }
                else
                {
                    return undefined;
                }                
            }

            return res;
        }
    }

    return undefined;
}