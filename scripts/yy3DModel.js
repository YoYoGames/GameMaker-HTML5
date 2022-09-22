var M_PRIMITIVE_BEGIN = 0,
	M_PRIMITIVE_END = 1,
	M_VERTEX = 2,
	M_VERTEX_COLOR = 3,
	M_VERTEX_TEX = 4,
	M_VERTEX_TEX_COLOR = 5,
	M_VERTEX_N = 6,
	M_VERTEX_N_COLOR = 7,
	M_VERTEX_N_TEX = 8,
	M_VERTEX_N_TEX_COLOR = 9,
	M_SHAPE_BLOCK = 10,
	M_SHAPE_CYLINDER = 11,
	M_SHAPE_CONE = 12,
	M_SHAPE_ELLIPSOID = 13,
	M_SHAPE_WALL = 14,
	M_SHAPE_FLOOR = 15;
	
// #############################################################################################
/// Function:<summary>
///             3DModel Constructor
///          </summary>
// #############################################################################################
/** @constructor */
function yy3DModel() {

    this.Clear();
}

// #############################################################################################
/// Function:<summary>
///             Reset the model's data
///          </summary>
// #############################################################################################
yy3DModel.prototype.Clear = function() {

    // Command list set
    this.CmdList = [];    
    this.Cached = [];
};

// #############################################################################################
/// Function:<summary>
///             Generates the model data used for saving
///          </summary>
// #############################################################################################
yy3DModel.prototype.BuildModelData = function() {

    // Write version number
    var outputData = "100\n";
    
    // Write number of commands
    outputData += this.CmdList.length.toString() + "\n";    
    for (var i = 0; i < this.CmdList.length; i++) {
    
        // To stay compatible with the C++, all lines should have 10 floats of data
        var cmd = this.CmdList[i];
        outputData += cmd.Command.toString() + " ";
        switch (cmd.Command) {
            case M_PRIMITIVE_END:
                break;
                
            case M_PRIMITIVE_BEGIN:     
                outputData += cmd.PrimType.toString();
                break;
                
	        case M_VERTEX:
	            outputData += cmd.x.toString() + " ";
	            outputData += cmd.y.toString() + " ";
	            outputData += cmd.z.toString() + " ";
	            outputData += "0.0 0.0 0.0 0.0 0.0 0.0 0.0\n";
	            break;
	            
	        case M_VERTEX_COLOR:
	            outputData += cmd.x.toString() + " ";
	            outputData += cmd.y.toString() + " ";
	            outputData += cmd.z.toString() + " ";
	            outputData += (cmd.color * 1.0).toString() + " ";
	            outputData += cmd.alpha.toString() + " ";
	            outputData += "0.0 0.0 0.0 0.0 0.0\n";
	            break;
	            
	        case M_VERTEX_TEX:
	            outputData += cmd.x.toString() + " ";
	            outputData += cmd.y.toString() + " ";
	            outputData += cmd.z.toString() + " ";
	            outputData += cmd.u.toString() + " ";
	            outputData += cmd.v.toString() + " ";
	            outputData += "0.0 0.0 0.0 0.0 0.0\n";
	            break;
	            
	        case M_VERTEX_TEX_COLOR:    
	            outputData += cmd.x.toString() + " ";
	            outputData += cmd.y.toString() + " ";
	            outputData += cmd.z.toString() + " ";
	            outputData += cmd.u.toString() + " ";
	            outputData += cmd.v.toString() + " ";
	            outputData += (cmd.color * 1.0).toString() + " ";
	            outputData += cmd.alpha.toString() + " ";
	            outputData += "0.0 0.0 0.0\n";
	            break;
	            
	        case M_VERTEX_N:
	            outputData += cmd.x.toString() + " ";
	            outputData += cmd.y.toString() + " ";
	            outputData += cmd.z.toString() + " ";
	            outputData += cmd.nx.toString() + " ";
	            outputData += cmd.ny.toString() + " ";
	            outputData += cmd.nz.toString() + " ";
	            outputData += "0.0 0.0 0.0 0.0\n";
	        	break;
	        	
	        case M_VERTEX_N_COLOR:
	            outputData += cmd.x.toString() + " ";
	            outputData += cmd.y.toString() + " ";
	            outputData += cmd.z.toString() + " ";
	            outputData += cmd.nx.toString() + " ";
	            outputData += cmd.ny.toString() + " ";
	            outputData += cmd.nz.toString() + " ";
	            outputData += (cmd.color * 1.0).toString() + " ";
	            outputData += cmd.alpha.toString() + " ";
	            outputData += "0.0 0.0\n";
	            break;
	            
	        case M_VERTEX_N_TEX:
	            outputData += cmd.x.toString() + " ";
	            outputData += cmd.y.toString() + " ";
	            outputData += cmd.z.toString() + " ";
	            outputData += cmd.nx.toString() + " ";
	            outputData += cmd.ny.toString() + " ";
	            outputData += cmd.nz.toString() + " ";
	            outputData += cmd.u.toString() + " ";
	            outputData += cmd.v.toString() + " ";
	            outputData += "0.0 0.0\n";
	            break;
	            
	        case M_VERTEX_N_TEX_COLOR:
	            outputData += cmd.x.toString() + " ";
	            outputData += cmd.y.toString() + " ";
	            outputData += cmd.z.toString() + " ";
	            outputData += cmd.nx.toString() + " ";
	            outputData += cmd.ny.toString() + " ";
	            outputData += cmd.nz.toString() + " ";
	            outputData += cmd.u.toString() + " ";
	            outputData += cmd.v.toString() + " ";
	            outputData += (cmd.color * 1.0).toString() + " ";
	            outputData += cmd.alpha.toString() + " ";
	            outputData += "\n";
	            break;
	            
	        case M_SHAPE_BLOCK:
	        case M_SHAPE_WALL:
	        case M_SHAPE_FLOOR:
	            outputData += cmd.x1.toString() + " ";
	            outputData += cmd.y1.toString() + " ";
	            outputData += cmd.z1.toString() + " ";
                outputData += cmd.x2.toString() + " ";
                outputData += cmd.y2.toString() + " ";
                outputData += cmd.z2.toString() + " ";
                outputData += (cmd.hrep ? 1.0 : 0.0).toString() + " ";
                outputData += (cmd.vrep ? 1.0 : 0.0).toString() + " ";
                outputData += "0.0 0.0\n";
	            break;
	            
	        case M_SHAPE_ELLIPSOID:
	            outputData += cmd.x1.toString() + " ";
	            outputData += cmd.y1.toString() + " ";
	            outputData += cmd.z1.toString() + " ";
                outputData += cmd.x2.toString() + " ";
                outputData += cmd.y2.toString() + " ";
                outputData += cmd.z2.toString() + " ";
                outputData += (cmd.hrep ? 1.0 : 0.0).toString() + " ";
                outputData += (cmd.vrep ? 1.0 : 0.0).toString() + " ";
                outputData += (cmd.steps * 1.0).toString() + " ";
                outputData += "0.0\n";
	            break;
	            
	        case M_SHAPE_CYLINDER:      
	        case M_SHAPE_CONE:
	            outputData += cmd.x1.toString() + " ";
	            outputData += cmd.y1.toString() + " ";
	            outputData += cmd.z1.toString() + " ";
                outputData += cmd.x2.toString() + " ";
                outputData += cmd.y2.toString() + " ";
                outputData += cmd.z2.toString() + " ";
                outputData += (cmd.hrep ? 1.0 : 0.0).toString() + " ";
                outputData += (cmd.vrep ? 1.0 : 0.0).toString() + " ";
                outputData += (cmd.closed ? 1.0 : 0.0).toString() + " ";
                outputData += (cmd.steps * 1.0).toString() + " ";
                outputData += "\n";
	            break;	            
        }        
    }
    return outputData;
};

// #############################################################################################
/// Function:<summary>
///             Store 3D model to a buffer and save to the given file
///          </summary>
// #############################################################################################
yy3DModel.prototype.Save = function(_fname) {
            
    if (g_SupportsLocalStorage === true) {
    
        var modelData = this.BuildModelData();
        var fileid = file_text_open_write(_fname);
        file_text_write_string(fileid, modelData);
        file_text_close(fileid);
    }
    else {
        debug("d3d_model_save() browser does not support local storage\n");
    }    
};

// #############################################################################################
/// Function:<summary>
//             Used when loading a 3D model since we can't use regular expressions
///          </summary>
// #############################################################################################
yy3DModel.prototype.StripExtraneousSpaces = function(_lineData) {

    var destLineData = "";
    var space = false;
    for (var i = 0; i < _lineData.length; i++) {
    
        var currChar = _lineData.charAt(i);    
        if (currChar == ' ') {
            if (!space) {
                destLineData = destLineData + currChar;
            }
            space = true;
        }
        else {
            space = false;
            destLineData = destLineData + currChar;
        }
    }
    return destLineData;
};

// #############################################################################################
/// Function:<summary>
///             Load 3D model from the given file
///          </summary>
// #############################################################################################
yy3DModel.prototype.ParseModelData = function(_modelData) {

    var lineDataArray = _modelData.split("\n");
    
    var version = parseInt(lineDataArray[0]);
    if (version == 100) {        
    
        var modelEntries = parseInt(lineDataArray[1]);
        for (var i = 2; i < lineDataArray.length; i++) {
    
            var cmd = {};
        
            var lineData = this.StripExtraneousSpaces(lineDataArray[i]);            
            var lineElements = lineData.split(" ");
            
            cmd.Command = parseInt(lineElements[0]);
            switch (cmd.Command) {
            
                case M_PRIMITIVE_END:       
                    break;

                case M_PRIMITIVE_BEGIN:
                    {
                        cmd.PrimType = parseInt(lineElements[1]);
                        break;
                    }                    
                    
	            case M_VERTEX:
	                {
	                    cmd.x = parseFloat(lineElements[1]);
	                    cmd.y = parseFloat(lineElements[2]);
	                    cmd.z = parseFloat(lineElements[3]);
	                    break;
	                }
	                
	            case M_VERTEX_COLOR:
	                {
	                    cmd.x = parseFloat(lineElements[1]);
	                    cmd.y = parseFloat(lineElements[2]);
	                    cmd.z = parseFloat(lineElements[3]);
	                    cmd.color = parseInt(lineElements[4]);
	                    cmd.alpha = parseFloat(lineElements[5]);
	                    break;
	                }
	                
	            case M_VERTEX_TEX:
	                {
	                    cmd.x = parseFloat(lineElements[1]);
	                    cmd.y = parseFloat(lineElements[2]);
	                    cmd.z = parseFloat(lineElements[3]);
	                    cmd.u = parseFloat(lineElements[4]);
	                    cmd.v = parseFloat(lineElements[5]);
	                    break;
	                }
	                
	            case M_VERTEX_TEX_COLOR:
	                {
	                    cmd.x = parseFloat(lineElements[1]);
	                    cmd.y = parseFloat(lineElements[2]);
	                    cmd.z = parseFloat(lineElements[3]);
	                    cmd.u = parseFloat(lineElements[4]);
	                    cmd.v = parseFloat(lineElements[5]);	                    	                    	                
	                    cmd.color = parseInt(lineElements[6]);
	                    cmd.alpha = parseFloat(lineElements[7]);
	                    break;
	                }
	                
	            case M_VERTEX_N:
	                {
	                    cmd.x = parseFloat(lineElements[1]);
	                    cmd.y = parseFloat(lineElements[2]);
	                    cmd.z = parseFloat(lineElements[3]);
	                    cmd.nx = parseFloat(lineElements[4]);
	                    cmd.ny = parseFloat(lineElements[5]);
	                    cmd.nz = parseFloat(lineElements[6]);
	            	    break;
	            	}
	            	
	            case M_VERTEX_N_COLOR:
	                {
	                    cmd.x = parseFloat(lineElements[1]);
	                    cmd.y = parseFloat(lineElements[2]);
	                    cmd.z = parseFloat(lineElements[3]);
	                    cmd.nx = parseFloat(lineElements[4]);
	                    cmd.ny = parseFloat(lineElements[5]);
	                    cmd.nz = parseFloat(lineElements[6]);	                    	                    	                    
	                    cmd.color = parseInt(lineElements[7]);
	                    cmd.alpha = parseFloat(lineElements[8]);
	                    break;
	                }
	                
	            case M_VERTEX_N_TEX:
	                {
	                    cmd.x = parseFloat(lineElements[1]);
	                    cmd.y = parseFloat(lineElements[2]);
	                    cmd.z = parseFloat(lineElements[3]);
	                    cmd.nx = parseFloat(lineElements[4]);
	                    cmd.ny = parseFloat(lineElements[5]);
	                    cmd.nz = parseFloat(lineElements[6]);
	                    cmd.u = parseFloat(lineElements[7]);
	                    cmd.v = parseFloat(lineElements[8]);
	                    break;
	                }
	                
	            case M_VERTEX_N_TEX_COLOR:
	                {
	                    cmd.x = parseFloat(lineElements[1]);
	                    cmd.y = parseFloat(lineElements[2]);
	                    cmd.z = parseFloat(lineElements[3]);
	                    cmd.nx = parseFloat(lineElements[4]);
	                    cmd.ny = parseFloat(lineElements[5]);
	                    cmd.nz = parseFloat(lineElements[6]);
	                    cmd.u = parseFloat(lineElements[7]);
	                    cmd.v = parseFloat(lineElements[8]);                
	                    cmd.color = parseInt(lineElements[9]);
	                    cmd.alpha = parseFloat(lineElements[10]);
	                    break;
	                }
	                
	            case M_SHAPE_BLOCK:
	            case M_SHAPE_WALL:
	            case M_SHAPE_FLOOR:
	                {
	                    cmd.x1 = parseFloat(lineElements[1]);
	                    cmd.y1 = parseFloat(lineElements[2]);
	                    cmd.z1 = parseFloat(lineElements[3]);
                        cmd.x2 = parseFloat(lineElements[4]);
                        cmd.y2 = parseFloat(lineElements[5]);
                        cmd.z2 = parseFloat(lineElements[6]);
                        cmd.hrep = (parseFloat(lineElements[7]) >= 0.5) ? true : false;
                        cmd.vrep = (parseFloat(lineElements[8]) >= 0.5) ? true : false;
	                    break;
	                }
	                
	            case M_SHAPE_ELLIPSOID:
	                {
	                    cmd.x1 = parseFloat(lineElements[1]);
	                    cmd.y1 = parseFloat(lineElements[2]);
	                    cmd.z1 = parseFloat(lineElements[3]);
                        cmd.x2 = parseFloat(lineElements[4]);
                        cmd.y2 = parseFloat(lineElements[5]);
                        cmd.z2 = parseFloat(lineElements[6]);
                        cmd.hrep = (parseFloat(lineElements[7]) >= 0.5) ? true : false;
                        cmd.vrep = (parseFloat(lineElements[8]) >= 0.5) ? true : false;
                        cmd.steps = ~~parseFloat(lineElements[9]);
	                    break;
	                }

	            case M_SHAPE_CYLINDER:
	            case M_SHAPE_CONE:
	                {
	                    cmd.x1 = parseFloat(lineElements[1]);
	                    cmd.y1 = parseFloat(lineElements[2]);
	                    cmd.z1 = parseFloat(lineElements[3]);
                        cmd.x2 = parseFloat(lineElements[4]);
                        cmd.y2 = parseFloat(lineElements[5]);
                        cmd.z2 = parseFloat(lineElements[6]);
                        cmd.hrep = (parseFloat(lineElements[7]) >= 0.5) ? true : false;
                        cmd.vrep = (parseFloat(lineElements[8]) >= 0.5) ? true : false;
                        cmd.closed = (parseFloat(lineElements[9]) >= 0.5) ? true : false;
                        cmd.steps = ~~parseFloat(lineElements[10]);
	                    break;
	                }
            }
            this.CmdList.push(cmd);            
        }
    }
};


// #############################################################################################
/// Function:<summary>
///             Load 3D model from the given file
///          </summary>
// #############################################################################################
yy3DModel.prototype.Load = function(_fname) {    

    // Check for local storage version
    var pTextFile = LoadTextFile_Block(_fname, true);
    if (pTextFile !== null && pTextFile !== undefined) {
        this.ParseModelData(pTextFile);
    }
	else {
	    // Attempt to load it remotely
	    var fname = CheckWorkingDirectory(_fname);    
  
        var self = this;              
        var modelXhr = new XMLHttpRequest();
        modelXhr.open("GET", fname, false); // synchronous
        modelXhr.onload = function() {
            if (modelXhr.readyState==4 && modelXhr.status==200) {
                self.ParseModelData(modelXhr.responseText);
            }
        };
        modelXhr.send(null); 
	}
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yy3DModel.prototype.Begin = function (kind) {

    this.CmdList.push({ 
        Command: M_PRIMITIVE_BEGIN,     
        PrimType: kind
    });
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yy3DModel.prototype.End = function () {

    this.CmdList.push({ 
        Command: M_PRIMITIVE_END
    });
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yy3DModel.prototype.Vertex = function (x,y,z) {

    this.CmdList.push({ 
        Command: M_VERTEX,
        x: x,
        y: y,
        z: z
    });
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yy3DModel.prototype.VertexColor = function (x,y,z,col,alpha) {

    this.CmdList.push({ 
        Command: M_VERTEX_COLOR,
        x: x,
        y: y,
        z: z,
        color: col,
        alpha: alpha
    });
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yy3DModel.prototype.VertexTexture = function (x,y,z,xtex,ytex) {

    this.CmdList.push({ 
        Command: M_VERTEX_TEX,
        x: x,
        y: y,
        z: z,
        u: xtex,
        v: ytex
    });
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yy3DModel.prototype.VertexTextureColor = function (x,y,z,xtex,ytex,col,alpha) {

    this.CmdList.push({ 
        Command: M_VERTEX_TEX_COLOR,
        x: x,
        y: y,
        z: z,
        u: xtex,
        v: ytex,
        color: col,
        alpha: alpha
    });
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yy3DModel.prototype.VertexNormal = function (x,y,z,nx,ny,nz) {

    this.CmdList.push({ 
        Command: M_VERTEX_N,
        x: x,
        y: y,
        z: z,
        nx: nx,
        ny: ny,
        nz: nz
    });
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yy3DModel.prototype.VertexNormalColor = function (x,y,z,nx,ny,nz,col,alpha) {

    this.CmdList.push({ 
        Command: M_VERTEX_N_COLOR,
        x: x,
        y: y,
        z: z,
        nx: nx,
        ny: ny,
        nz: nz,
        color: col,
        alpha: alpha
    });
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yy3DModel.prototype.VertexNormalTexture = function (x,y,z,nx,ny,nz,xtex,ytex) {

    this.CmdList.push({ 
        Command: M_VERTEX_N_TEX,
        x: x,
        y: y,
        z: z,
        nx: nx,
        ny: ny,
        nz: nz,
        u: xtex,
        v: ytex
    });
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yy3DModel.prototype.VertexNormalTextureColor = function (x,y,z,nx,ny,nz,xtex,ytex,col,alpha) {

    this.CmdList.push({ 
        Command: M_VERTEX_N_TEX_COLOR,
        x: x,
        y: y,
        z: z,
        nx: nx,
        ny: ny,
        nz: nz,
        u: xtex,
        v: ytex,
        color: col,
        alpha: alpha
    });
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yy3DModel.prototype.Block = function (x1,y1,z1,x2,y2,z2,hrepeat,vrepeat) {

    this.CmdList.push({ 
        Command: M_SHAPE_BLOCK,
        x1: x1,
        y1: y1,
        z1: z1,
        x2: x2,
        y2: y2,
        z2: z2,
        hrep: hrepeat,
        vrep: vrepeat
    });
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yy3DModel.prototype.Cylinder = function (x1,y1,z1,x2,y2,z2,hrepeat,vrepeat,closed,steps) {

    this.CmdList.push({ 
        Command: M_SHAPE_CYLINDER,
        x1: x1,
        y1: y1,
        z1: z1,
        x2: x2,
        y2: y2,
        z2: z2,
        hrep: hrepeat,
        vrep: vrepeat,
        closed: closed,
        steps: steps
    });
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yy3DModel.prototype.Cone = function (x1,y1,z1,x2,y2,z2,hrepeat,vrepeat,closed,steps) {

    this.CmdList.push({ 
        Command: M_SHAPE_CONE,
        x1: x1,
        y1: y1,
        z1: z1,
        x2: x2,
        y2: y2,
        z2: z2,
        hrep: hrepeat,
        vrep: vrepeat,
        closed: closed,
        steps: steps
    });
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yy3DModel.prototype.Ellipsoid = function (x1,y1,z1,x2,y2,z2,hrepeat,vrepeat,steps) {

    this.CmdList.push({ 
        Command: M_SHAPE_ELLIPSOID,
        x1: x1,
        y1: y1,
        z1: z1,
        x2: x2,
        y2: y2,
        z2: z2,
        hrep: hrepeat,
        vrep: vrepeat,        
        steps: steps
    });
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yy3DModel.prototype.Wall = function (x1,y1,z1,x2,y2,z2,hrepeat,vrepeat) {

    this.CmdList.push({ 
        Command: M_SHAPE_WALL,
        x1: x1,
        y1: y1,
        z1: z1,
        x2: x2,
        y2: y2,
        z2: z2,
        hrep: hrepeat,
        vrep: vrepeat
    });
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yy3DModel.prototype.Floor = function (x1,y1,z1,x2,y2,z2,hrepeat,vrepeat) {

    this.CmdList.push({ 
        Command: M_SHAPE_FLOOR,
        x1: x1,
        y1: y1,
        z1: z1,
        x2: x2,
        y2: y2,
        z2: z2,
        hrep: hrepeat,
        vrep: vrepeat
    });
};

// #############################################################################################
/// Function:<summary>
///             If the primtype changes or they're using a triangle fan, we need a new vbuffer.
///             This routine lets us create a new one consistently
///          </summary>
// #############################################################################################
yy3DModel.prototype.CreateNewVBuffer = function () {

    this.vbufferCache = new yyVBuffer(DEFAULT_VB_SIZE, g_webGL.GetVertexFormat(g_webGL.VERTEX_FORMAT_3D), false);
    // Fudge in a store of the prim type
    this.vbufferCache.PrimType = -1;
    this.vbufferCache.PrimTexture = null;    
};

// #############################################################################################
/// Function:<summary>
///             Certain prim types can't share a vbuffer, so test if they can
///          </summary>
// #############################################################################################
yy3DModel.prototype.CanConcatPrimType = function (_prim) {

    switch (_prim) {
        case PrimType_POINTLIST:
	    case PrimType_LINELIST:
	    case PrimType_TRILIST:
	        return true;
    }
    return false;	    
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yy3DModel.prototype.CachePrimData = function (_cache) {

    var vbuff = this.vbufferCache;
    if ((vbuff.PrimType != -1) &&
        ((g_PrimType != vbuff.PrimType) ||
         (g_PrimTexture != vbuff.PrimTexture) ||
         (this.CanConcatPrimType(vbuff.PrimType) === false)))
    {        
        vbuff.Freeze();    
        _cache.push({
            PrimType: WebGL_translate_primitive_builder_type(vbuff.PrimType),
            PrimTexture: vbuff.PrimTexture,
            PrimVBuffer: vbuff
        });
            
        // Create a new vbuffer for the next lot of data
        this.CreateNewVBuffer();
        vbuff = this.vbufferCache;
    }
    vbuff.Concat(g_PrimVBuffer);
    vbuff.PrimType = g_PrimType;
    vbuff.PrimTexture = g_PrimTexture;
    
    primitive_builder_clear();
};

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
yy3DModel.prototype.FinalisePrimDataCache = function (_cache) {
    
    var vbuff = this.vbufferCache;
    vbuff.Freeze();    
    _cache.push({
        PrimType: WebGL_translate_primitive_builder_type(vbuff.PrimType),
        PrimTexture: vbuff.PrimTexture,
        PrimVBuffer: vbuff
    });            
    primitive_builder_clear();
};

// #############################################################################################
/// Function:<summary>
///             Dispatch and record the shape being drawn
///          </summary>
// #############################################################################################
yy3DModel.prototype.DrawShape = function (cmd, tex, _cache) {
    
    // Allow us to record multiple primitive blocks
    var fn_d3d_primitive_end = d3d_primitive_end;
    var self = this;
    d3d_primitive_end = function () {
            
        self.CachePrimData(_cache);
    };
    
    switch (cmd.Command) {
        case M_SHAPE_BLOCK:         d3d_draw_block(cmd.x1, cmd.y1, cmd.z1, cmd.x2, cmd.y2, cmd.z2, tex, cmd.hrep, cmd.vrep);
	                                break;
	    case M_SHAPE_CYLINDER:      d3d_draw_cylinder(cmd.x1, cmd.y1, cmd.z1, cmd.x2, cmd.y2, cmd.z2, tex, cmd.hrep, cmd.vrep, cmd.closed, cmd.steps);
	                                break;
	    case M_SHAPE_CONE:          d3d_draw_cone(cmd.x1, cmd.y1, cmd.z1, cmd.x2, cmd.y2, cmd.z2, tex, cmd.hrep, cmd.vrep, cmd.closed, cmd.steps);	                                
	                                break;
	    case M_SHAPE_ELLIPSOID:     d3d_draw_ellipsoid(cmd.x1, cmd.y1, cmd.z1, cmd.x2, cmd.y2, cmd.z2, tex, cmd.hrep, cmd.vrep, cmd.steps);
	                                break;
	    case M_SHAPE_WALL:          d3d_draw_wall(cmd.x1, cmd.y1, cmd.z1, cmd.x2, cmd.y2, cmd.z2, tex, cmd.hrep, cmd.vrep);
	                                break;
	    case M_SHAPE_FLOOR:         d3d_draw_floor(cmd.x1, cmd.y1, cmd.z1, cmd.x2, cmd.y2, cmd.z2, tex, cmd.hrep, cmd.vrep);
	                                break;   
    }    
    d3d_primitive_end = fn_d3d_primitive_end;
};

// #############################################################################################
/// Function:<summary>
///             Dispatch the model's draw data
///          </summary>
// #############################################################################################
yy3DModel.prototype.Draw = function(x, y, z, tex) {

    // Set the world transform for the data    
    var i,mt = new Matrix();
    mt.SetTranslation(x, y, z);	
    
	var mo = WebGL_GetMatrix(MATRIX_WORLD);	
    var m = new Matrix();
    m.Multiply(mt, mo);
    
	WebGL_SetMatrix(MATRIX_WORLD, m);

	var colour = ((g_GlobalAlpha * 255.0) << 24) | (g_GlobalColour & 0x00ffffff);
	var texCache = this.Cached[colour];
	if (texCache === undefined) {
		texCache = [];
		this.Cached[colour] = texCache;
	} // end if

    if (texCache[tex] === undefined) {    
    
        // They may be multiple sets of primitive data within this model
        texCache[tex] = [];
        var cache = texCache[tex];
        
        // As long as the prim type doesn't change we can store all data in one big vbuffer
        this.CreateNewVBuffer();        
    
        // Dispatch the set of commands        
        for (var i = 0; i < this.CmdList.length; i++) {
        
            var cmd = this.CmdList[i];
            switch (cmd.Command) {
            
                case M_PRIMITIVE_BEGIN:     
                    d3d_primitive_begin_texture(cmd.PrimType, tex);
                    break;
	            case M_PRIMITIVE_END:       	                
	                this.CachePrimData(cache);                                            
	                break;
	            case M_VERTEX:              
	                d3d_vertex(cmd.x, cmd.y, cmd.z);
	                break;
	            case M_VERTEX_COLOR:        
	                d3d_vertex_color(cmd.x, cmd.y, cmd.z, cmd.color, cmd.alpha);
	                break;
	            case M_VERTEX_TEX:          
	                d3d_vertex_texture(cmd.x, cmd.y, cmd.z, cmd.u, cmd.v);
	                break;
	            case M_VERTEX_TEX_COLOR:    
	                d3d_vertex_texture_color(cmd.x, cmd.y, cmd.z, cmd.u, cmd.v, cmd.color, cmd.alpha);
	                break;
	            case M_VERTEX_N:            
	                d3d_vertex_normal(cmd.x, cmd.y, cmd.z, cmd.nx, cmd.ny, cmd.nz);
	            	break;
	            case M_VERTEX_N_COLOR:      
	                d3d_vertex_normal_color(cmd.x, cmd.y, cmd.z, cmd.nx, cmd.ny, cmd.nz, cmd.color, cmd.alpha);
	                break;
	            case M_VERTEX_N_TEX:        
	                d3d_vertex_normal_texture(cmd.x, cmd.y, cmd.z, cmd.nx, cmd.ny, cmd.nz, cmd.u, cmd.v);
	                break;
	            case M_VERTEX_N_TEX_COLOR:  
    	            d3d_vertex_normal_texture_color(cmd.x, cmd.y, cmd.z, cmd.nx, cmd.ny, cmd.nz, cmd.u, cmd.v, cmd.color, cmd.alpha);
	                break;
	            case M_SHAPE_BLOCK:
	            case M_SHAPE_CYLINDER:
	            case M_SHAPE_CONE:
	            case M_SHAPE_ELLIPSOID:
	            case M_SHAPE_WALL:
	            case M_SHAPE_FLOOR:         
	                this.DrawShape(cmd, tex, cache);
	                break;
            }
        }
        this.FinalisePrimDataCache(cache);        
        this.vbufferCache = null;
    }
    
    // Always draw the cached model (since we don't dispatch on primitive end now)
    var cachedArray = texCache[tex];        
    for (i = 0; i < cachedArray.length; i++) {

        var cachedData = cachedArray[i];
        var glTexture = cachedData.PrimTexture ? cachedData.PrimTexture.webgl_textureid : null;
        g_webGL.DispatchVBuffer(cachedData.PrimType, glTexture, cachedData.PrimVBuffer, 0);            
    }
    
    // Restore world matrix
    WebGL_SetMatrix(MATRIX_WORLD, mo);
};