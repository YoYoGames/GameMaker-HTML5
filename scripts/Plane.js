function Plane()
{
    this.Normal = new Vector3(0.0, 0.0, 1.0);

    this.Distance = 0.0;
}

Plane.prototype.Normalise = function ()
{
    var length = this.Normal.Length();
    this.Normal.X /= length;
    this.Normal.Y /= length;
    this.Normal.Z /= length;
    this.Distance /= length;
};
