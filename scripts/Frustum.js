var FRUSTUM_PLANE_LEFT   = 0;
var FRUSTUM_PLANE_RIGHT  = 1;
var FRUSTUM_PLANE_TOP    = 2;
var FRUSTUM_PLANE_BOTTOM = 3;
var FRUSTUM_PLANE_NEAR   = 4;
var FRUSTUM_PLANE_FAR    = 5;

function Frustum()
{
    this.Planes = [
        new Plane(),
        new Plane(),
        new Plane(),
        new Plane(),
        new Plane(),
        new Plane(),
    ];
}

/**
 * Initializes frustum planes from a view-projection matrix.
 * 
 * @param {Matrix} vp The view-projection matrix.
 */
Frustum.prototype.FromViewProjMat = function (vp)
{
    var col1 = new Vector3(vp.m[0], vp.m[4], vp.m[ 8]);
    var col2 = new Vector3(vp.m[1], vp.m[5], vp.m[ 9]);
    var col3 = new Vector3(vp.m[2], vp.m[6], vp.m[10]);
    var col4 = new Vector3(vp.m[3], vp.m[7], vp.m[11]);

    // Find plane magnitudes
    this.Planes[FRUSTUM_PLANE_LEFT].Normal = col4.Add(col1);
    this.Planes[FRUSTUM_PLANE_RIGHT].Normal = col4.Sub(col1);
    this.Planes[FRUSTUM_PLANE_BOTTOM].Normal = col4.Add(col2);
    this.Planes[FRUSTUM_PLANE_TOP].Normal = col4.Sub(col2);
    this.Planes[FRUSTUM_PLANE_NEAR].Normal = /*_col4.Add(*/col3/*)*/;
    this.Planes[FRUSTUM_PLANE_FAR].Normal = col4.Sub(col3);

    // Find plane distances
    var _vp12 = vp.m[12];
    var _vp13 = vp.m[13];
    var _vp14 = vp.m[14];
    var _vp15 = vp.m[15];

    this.Planes[FRUSTUM_PLANE_LEFT].Distance = _vp15 + _vp12;
    this.Planes[FRUSTUM_PLANE_RIGHT].Distance = _vp15 - _vp12;
    this.Planes[FRUSTUM_PLANE_BOTTOM].Distance = _vp15 + _vp13;
    this.Planes[FRUSTUM_PLANE_TOP].Distance = _vp15 - _vp13;
    this.Planes[FRUSTUM_PLANE_NEAR].Distance = /*_vp15 +*/ _vp14;
    this.Planes[FRUSTUM_PLANE_FAR].Distance = _vp15 - _vp14;

    // Normalize all 6 planes
    for (var i = 0; i < 6; ++i)
    {
        this.Planes[i].Normalise();
    }
};

/**
 * Tests whether a sphere intersects with the frustum.
 * @param {Vector3} position The origin of the sphere.
 * @param {Number} radius The sphere's radius.
 * @returns True if the sphere intersects with the frustum.
 */
Frustum.prototype.IntersectsSphere = function (position, radius)
{
    for (var i = 0; i < 6; ++i)
    {
        var plane = this.Planes[i];
        var dist = (position.Dot(plane.Normal)) + plane.Distance;
        if (dist < -radius)
        {
            return false;
        }
    }
    return true;
};
