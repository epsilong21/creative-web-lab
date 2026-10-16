/**
 * Campo de partículas: toda la deriva se calcula en el vertex shader,
 * así la CPU solo actualiza un par de uniforms por frame.
 */
export const particlesVertex = /* glsl */ `
uniform float uTime;
uniform float uEnergy;
uniform float uPixelRatio;
uniform float uSize;

attribute float aScale;
attribute float aSeed;

varying float vAlpha;
varying float vTint;

void main() {
  vec3 p = position;
  float t = uTime * (0.08 + aSeed * 0.06);
  float amp = 0.18 + uEnergy * 0.5;
  p.x += sin(t + aSeed * 12.0) * amp;
  p.y += cos(t * 0.8 + aSeed * 7.0) * amp + sin(uTime * 0.05 + aSeed) * 0.3;
  p.z += sin(t * 0.6 + aSeed * 3.0) * amp * 0.5;

  vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  float depth = -mvPosition.z;
  gl_PointSize = uSize * aScale * uPixelRatio * (8.0 / depth);

  // Las partículas muy cercanas o muy lejanas se desvanecen (profundidad de campo).
  vAlpha = smoothstep(1.2, 3.0, depth) * (1.0 - smoothstep(14.0, 22.0, depth));
  // Destello lento e independiente por partícula.
  vAlpha *= 0.55 + 0.45 * sin(uTime * (0.6 + aSeed) + aSeed * 40.0);
  vTint = aSeed;
}
`;

export const particlesFragment = /* glsl */ `
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uIntro;

varying float vAlpha;
varying float vTint;

void main() {
  float d = length(gl_PointCoord - 0.5);
  float disc = smoothstep(0.5, 0.0, d);
  disc *= disc;
  vec3 color = mix(uColorA, uColorB, vTint);
  gl_FragColor = vec4(color, disc * vAlpha * uIntro);
  #include <colorspace_fragment>
}
`;
