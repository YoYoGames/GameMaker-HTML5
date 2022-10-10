// **********************************************************************************************************************
//
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
//
// File:            Function_Tags.js
// Created:         16/02/2011
// Author:          Mike
// Project:         HTML5
// Description:
//
// **********************************************************************************************************************

/** @constructor */
function TagManager()
{
    this.m_tagList = [];    //array of unique tag strings
    this.m_tagMap = {};     //map of tagString : tagIndex
    this.m_tagIdMap = {};   //map of assetTypeId: array of tag index
};

function MakeTypeId(_assetType, _assetId)
{
    var typeId = (((_assetType & 0xff) << 24) | (_assetId & 0xffffff) );
    return typeId;
};

TagManager.prototype.LoadTags = function( _tagList, _tagIds )
{
    this.m_tagList = _tagList.slice();
    for( var i=0; i < _tagList.length; ++i )
        this.m_tagMap[ _tagList[i] ] = i;
    for( var i=0; i < _tagIds.length; ++i ) 
    {
        var entry = _tagIds[i]; 
        //this.m_tagIdMap[ entry["key"] ] = entry["ids"].slice();
        this.m_tagIdMap[ entry.key ] = entry.ids.slice();
    }
};

//returns array of tagIds for given asset
TagManager.prototype.GetTagIds = function( _assetId, _assetType )
{
    var typeId = MakeTypeId(_assetType, _assetId);
    var tagIdList = this.m_tagIdMap[ typeId ];
    if( tagIdList == undefined )
        return null;
    return tagIdList;
};

//returns array of tag strings for given asset
TagManager.prototype.GetTagStrings = function( _assetId, _assetType )
{
    var tagIds = this.GetTagIds(_assetId, _assetType );
    var tags = [];
    if( tagIds != null ) 
    {
        for( var i=0; i < tagIds.length; ++i )
        {
            var tag = this.m_tagList[ tagIds[i] ];
            if( tag !== undefined)
                tags.push(tag);
        }
    }
    return tags;
};

//return array of tagIds from given array of strings
//adds new tag names when _addNewTags is true
TagManager.prototype.FindTagIds = function( _tags , _addNewTags )
{
    var tagIds = [];
    var tagStrings = Array.isArray(_tags) ? _tags : [ _tags ]; //-> array of strings

    for( var i=0; i < tagStrings.length; ++i )
    {
        var strTag = tagStrings[i];
        var tagId = this.m_tagMap[ strTag ];
        if( tagId === undefined && _addNewTags )
        {
            tagId = this.m_tagList.length;
            this.m_tagMap[ strTag ] = tagId;
            this.m_tagList.push( strTag );
        }
        if( tagId !== undefined)
            tagIds.push( tagId );
    }
    return tagIds;    
};


///returns: true if all/any of input tags match (depending on _allTags)
TagManager.prototype.AssetHasTags = function(_assetId, _assetType, _pTags, _allTags )
{
    var resTags = this.GetTagIds(_assetId, _assetType);
    if( resTags == null )
        return false;

    //!_pTags may be string or array of string
    var testTags = this.FindTagIds( _pTags, false );
    var result = (_allTags) ? true : false;
    
    //check each input tag ptr against  assets tag list
    for( var t=0; t < testTags.length; ++t )
    {
        var bAssetHasTag = false;
        var tag = testTags[t];
        for( var i=0; i < resTags.length; ++i )
        {
            if( resTags[i] === tag ) 
                bAssetHasTag = true;
        }

        if (!_allTags && bAssetHasTag)
			return true; //any tag matched
		if (_allTags && !bAssetHasTag)
			return false; //all tags must match
    }
    return result;
};

//returns: true if any tags added
TagManager.prototype.AddTags = function( _assetId, _assetType, _pTags )
{
    var bAdded = false;
    var typeId = MakeTypeId(_assetType, _assetId);
    var tagIdList = this.m_tagIdMap[ typeId ];

    if( tagIdList == undefined ) {
        tagIdList = [];
        this.m_tagIdMap[ typeId ] = tagIdList; //add a new tagIds entry
    }

    var inputTagIds = this.FindTagIds( _pTags, true );
    for( var i = 0; i < inputTagIds.length; ++i )
    {
        var idToAdd = inputTagIds[i];
        var index = tagIdList.indexOf( idToAdd );
        if( index == -1 ) 
        {
            tagIdList.push( idToAdd );
            bAdded = true;
        }
    }

    return bAdded;
};

//returns: true if tags removed
TagManager.prototype.RemoveTags = function(  _assetId, _assetType, _pTags )
{
    var bRemoved = false;
    var tagIds = this.GetTagIds( _assetId, _assetType );
    if( tagIds != null )
    {
        var inputIds = this.FindTagIds(_pTags, false );
        for( var i=0; i < inputIds.length; ++i )
        {
            var idToRemove = inputIds[ i ];
            var index = tagIds.indexOf( idToRemove );
            if( index !=-1 )
            {
                //shift last tag into this slot
                tagIds[ index ] = tagIds[ tagIds.length-1];
                tagIds.length -=1;
                bRemoved = true;    
            }
        }
    }
    return bRemoved;
};

TagManager.prototype.RemoveAllTags = function(  _assetId, _assetType )
{
    var typeId = MakeTypeId(_assetType, _assetId);
    var tagIdList = this.m_tagIdMap[ typeId ];
    if( tagIdList != null ) {
        tagIdList.length = 0;
        return true;
    }

    return false;
};

//return array of asset names for assets  matching any of input tags
TagManager.prototype.FindAssetNames = function( _pTags )
{
    var names = [];
    var inputTagIds = this.FindTagIds(_pTags, false );
    if( inputTagIds.length == 0 )
        return names;   //none of queried tags exist

    //iterate all keys, compare tag ptrs in list
    for( var key in this.m_tagIdMap )
    {
        if( !this.m_tagIdMap.hasOwnProperty(key))
            continue;
        
        var idList = this.m_tagIdMap[ key ];
        for( var t = 0; t < inputTagIds.length; ++t )
        {
            var index = idList.indexOf( inputTagIds[ t ] );
            if( index !=-1 ) 
            {
                //asset has this tag-  get name from id & type
                var assetId = key & 0xffffff;
                var assetType = (key >> 24) & 0xff;
                var resName = ResourceGetName( assetId, assetType );
                if( resName.length > 0 )
                {
                    names.push( resName );    
                    break;
                }
            }
        }
    }

    return names;
};

TagManager.prototype.FindAssetIds = function( _pTags, _assetType )
{
    var assetIds = [];
    var inputTagIds = this.FindTagIds(_pTags, false );
    if( inputTagIds.length == 0 )
        return assetIds;   //none of queried tags exist

    //iterate all keys, compare tag ptrs in list
    for( var key in this.m_tagIdMap )
    {
        //skip assets not of queried type
        if( _assetType >=0 )
        {
            var type = (key>>24) & 0xff;
            if( type !== _assetType )
                continue;
        }

        var idList = this.m_tagIdMap[ key ];
        for( var t = 0; t < inputTagIds.length; ++t )
        {
            var index = idList.indexOf( inputTagIds[ t ] );
            if( index != -1 )
            {
                //asset has this tag-  add assetId to output
                var assetId = key & 0xffffff;
                assetIds.push( assetId );
                break;
            }
        }
    }

    return assetIds;
};


function GetTypeIdParams( _assetNameId, _assetType, _fnName )
{
    var typeId = { type:-1, id:-1 };
    if( typeof _assetNameId === "string" )
    {
        typeId = ResourceGetTypeIndex( _assetNameId );
    }
    else
    {
        if( _assetType === undefined ) 
            yyError( _fnName + "() - asset type argument is required");
        else
            typeId = { type:_assetType, id:_assetNameId };
    }
    //if(typeId.type == AT_Script && typeId.id >=100000)
    //    typeId.id -= (100000+1); //ughhhh

    return typeId;
}

//gml functions ----------------------------------------

//returns: array of resource ids of asset_type which contain any of queried tags
function tag_get_asset_ids( _tags,_assetType )
{
    var assetIds = g_pTagManager.FindAssetIds( _tags, _assetType);
    return assetIds;
}

//returns: array of resource names of all resources containing any of queried tags
function tag_get_assets( _tags )
{
    var names = g_pTagManager.FindAssetNames( _tags );
    return names;
}

//returns: array of tag strings
function asset_get_tags( _assetNameId, _assetType )
{
    var result = [];
    var typeId = GetTypeIdParams(_assetNameId, _assetType, "asset_get_tags");
    if( typeId.id < 0 )
        return result;
    
    result = g_pTagManager.GetTagStrings( typeId.id, typeId.type );
    return result;
}

//returns: 1 if tags added
function asset_add_tags( _assetNameId, _tags, _assetType )
{
    var typeId = GetTypeIdParams(_assetNameId, _assetType, "asset_add_tags");
    if( typeId.id < 0 )
        return 0;

    var result = g_pTagManager.AddTags( typeId.id, typeId.type, _tags );
    return (result) ? 1 : 0;
}

//returns: 1 if tags removed
function asset_remove_tags( _assetNameId, _tags, _assetType )
{
    var typeId = GetTypeIdParams(_assetNameId, _assetType, "asset_remove_tags");
    if( typeId.id < 0 )
        return 0;

    var result = g_pTagManager.RemoveTags( typeId.id, typeId.type, _tags );
    return (result) ? 1 : 0;
}

//returns: 1 if resource has all of given tags
function asset_has_tags( _assetNameId, _tags, _assetType )
{   
    var typeId = GetTypeIdParams(_assetNameId, _assetType, "asset_has_tags");
    if( typeId.id < 0 )
        return 0;

    var result = g_pTagManager.AssetHasTags( typeId.id, typeId.type, _tags, true );
    return (result) ? 1 : 0;
}

//returns: 1 if resource has any of given tags
function asset_has_any_tag( _assetNameId, _tags, _assetType )
{
    var typeId = GetTypeIdParams(_assetNameId, _assetType, "asset_has_any_tag");
    if( typeId.id < 0 )
        return 0;

    var result = g_pTagManager.AssetHasTags( typeId.id, typeId.type, _tags, false );
    return (result) ? 1 : 0;
}

function asset_clear_tags( _assetNameId, _assetType )
{
    var typeId = GetTypeIdParams(_assetNameId, _assetType, "asset_clear_tags");
    if( typeId.id < 0 )
        return 0;

    var result = g_pTagManager.RemoveAllTags( typeId.id, typeId.type );
    return (result) ? 1 : 0;
}
