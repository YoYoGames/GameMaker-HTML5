// **********************************************************************************************************************
//
// Copyright (c)2011, YoYo Games Ltd. All Rights reserved.
//
// File:            yyPhysicsDebugRender.js
// Created:         16/02/2011
// Author:          Mike
// Project:         HTML5
// Description:
//
// **********************************************************************************************************************

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
function translateBox2DColour(color)
{
	return (((color.r * 255) & 0xff) << 0) | 
	       (((color.g * 255) & 0xff) << 8) | 
	       (((color.b * 255) & 0xff) << 16);
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
/** @this {yyPhysicsDebugDraw} */
function yyBox2DDrawPolygon(vertices, vertexCount, color) {

    draw_set_color(translateBox2DColour(color));

	var scale = 1.0 / this.m_pWorld.m_pixelToMetreScale;
	for (var n = 0; n < vertexCount; ++n) 
	{
		var posA = vertices[n];
		var posB = vertices[(n + 1) % vertexCount];		
		draw_line(posA.x * scale, posA.y * scale, posB.x * scale, posB.y * scale);
	}
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
/** @this {yyPhysicsDebugDraw} */
function yyBox2DDrawSolidPolygon(vertices, vertexCount, color) {

    draw_set_color(translateBox2DColour(color));

	// Draw a triangle fan in pieces
	var scale = 1.0 / this.m_pWorld.m_pixelToMetreScale;

	var posA = vertices[0];
	for (var n = 2; n < vertexCount; ++n) 
	{
		var posB = vertices[n - 1];
		var posC = vertices[n];
		draw_triangle(
			posA.x * scale, 
			posA.y * scale,
			posB.x * scale, 
			posB.y * scale,
			posC.x * scale, 
			posC.y * scale,
			false);
	}
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
/** @this {yyPhysicsDebugDraw} */
function yyBox2DDrawCircle(center, radius, color) {	
	
	draw_set_color(translateBox2DColour(color));

	var scale = 1.0 / this.m_pWorld.m_pixelToMetreScale;
	draw_ellipse((center.x - radius) * scale, 
				 (center.y - radius) * scale, 
				 (center.x + radius) * scale, 
				 (center.y + radius) * scale, 
				 true);
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
/** @this {yyPhysicsDebugDraw} */
function yyBox2DDrawSolidCircle(center, radius, axis, color) {

    draw_set_color(translateBox2DColour(color));

	var scale = 1.0 / this.m_pWorld.m_pixelToMetreScale;
	draw_ellipse((center.x - radius) * scale,
				 (center.y - radius) * scale,
				 (center.x + radius) * scale,
				 (center.y + radius) * scale,
				 false);
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
/** @this {yyPhysicsDebugDraw} */
function yyBox2DDrawSegment(p1, p2, color) {

    draw_set_color(translateBox2DColour(color));

	var scale = 1.0 / this.m_pWorld.m_pixelToMetreScale;
	draw_line(p1.x * scale, p1.y * scale, p2.x * scale, p2.y * scale);
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
/** @this {yyPhysicsDebugDraw} */
function yyBox2DDrawTransform(xf) {	        

    var k_axisScale = 0.4;
	var scale = 1.0 / this.m_pWorld.m_pixelToMetreScale;

	var p1 = xf.p, 
	    p2 = new yyBox2D.Vec2();
	p2.x = p1.x + k_axisScale * xf.q.GetXAxis().x;
	p2.y = p1.y + k_axisScale * xf.q.GetXAxis().y;
	draw_set_color(clRed);	
	draw_line(p1.x * scale, p1.y * scale, p2.x * scale, p2.y * scale);	
	
	p2.x = p1.x + k_axisScale * xf.q.GetYAxis().x;
	p2.y = p1.y + k_axisScale * xf.q.GetYAxis().y;
	draw_set_color(clBlue);	
	draw_line(p1.x * scale, p1.y * scale, p2.x * scale, p2.y * scale);	
}

// #############################################################################################
/// Function:<summary>
///          </summary>
// #############################################################################################
/** @this {yyPhysicsDebugDraw} */
function yyBox2DDrawParticles(centers, radius, colors, count) {	        

    for (var n = 0; n < count; n++)
	{
		var scale = 1.0 / this.m_pWorld.m_pixelToMetreScale;
		
		draw_set_color(((colors[n].r & 0xff) << 0) | ((colors[n].g & 0xff) << 8) | ((colors[n].b & 0xff) << 16));
		draw_ellipse(
					(centers[n].x - radius) * scale, 
					(centers[n].y - radius) * scale, 
					(centers[n].x + radius) * scale, 
					(centers[n].y + radius) * scale, 
					true);
	}
}

