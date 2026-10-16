import { simplexNoise3D } from "./noise";

/**
 * Espécimen: esfera deformada con ruido en la GPU y una película
 * iridiscente cuyo tono depende del ángulo de visión (fresnel).
 * Las normales se recalculan tras la deformación para que la luz sea
 * coherente con la superficie desplazada.
 */
export const specimenVertex = /* glsl */ `
uniform float uTime;
uniform float uEnergy;

varying vec3 vNormal;
varying vec3 vViewPos;
varying float vDisp;

${simplexNoise3D}

float displacement(vec3 p) {
  float t = uTime * (0.18 + uEnergy * 0.35);
  // Capa amplia y lenta + capa fina que aparece con la energía.
  float broad = snoise(p * 1.1 + vec3(t, t * 0.6, -t * 0.4));
  float fine  = snoise(p * 3.2 - vec3(t * 1.7));
  return broad * (0.12 + uEnergy * 0.22) + fine * uEnergy * 0.06;
}

vec3 displaced(vec3 p, vec3 n) {
  return p + n * displacement(p);
}

void main() {
  vec3 n = normalize(normal);
  vec3 helper = abs(n.y) > 0.99 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);
  vec3 tangent = normalize(cross(n, helper));
  vec3 bitangent = normalize(cross(n, tangent));

  float eps = 0.01;
  vec3 p0 = displaced(position, n);
  vec3 p1 = displaced(position + tangent * eps, n);
  vec3 p2 = displaced(position + bitangent * eps, n);
  vec3 newNormal = normalize(cross(p1 - p0, p2 - p0));
  // Garantiza que la normal apunte hacia fuera.
  newNormal *= sign(dot(newNormal, n));

  vDisp = displacement(position);
  vec4 mvPosition = modelViewMatrix * vec4(p0, 1.0);
  vViewPos = mvPosition.xyz;
  vNormal = normalize(normalMatrix * newNormal);
  gl_Position = projectionMatrix * mvPosition;
}
`;

export const specimenFragment = /* glsl */ `
uniform float uHue;
uniform float uEnergy;
uniform float uIntro;
uniform vec3 uBody;
uniform vec3 uFilmA;
uniform vec3 uFilmB;
uniform vec3 uFilmC;

varying vec3 vNormal;
varying vec3 vViewPos;
varying float vDisp;

// Gradiente cíclico de tres tonos: A → B → C → A.
vec3 film(float t) {
  t = fract(t) * 3.0;
  vec3 c = mix(uFilmA, uFilmB, smoothstep(0.0, 1.0, t));
  c = mix(c, uFilmC, smoothstep(1.0, 2.0, t));
  return mix(c, uFilmA, smoothstep(2.0, 3.0, t));
}

void main() {
  vec3 N = normalize(vNormal);
  vec3 V = normalize(-vViewPos);
  float ndv = clamp(dot(N, V), 0.0, 1.0);
  float fresnel = pow(1.0 - ndv, 2.4);

  vec3 filmColor = film(fresnel * 0.85 + vDisp * 1.4 + uHue);

  // Luz principal (arriba-izquierda) y contraluz suave.
  vec3 L = normalize(vec3(-0.5, 0.8, 0.6));
  vec3 H = normalize(L + V);
  float diffuse = max(dot(N, L), 0.0);
  float spec = pow(max(dot(N, H), 0.0), 90.0);
  float back = pow(max(dot(N, normalize(vec3(0.6, -0.4, -0.7))), 0.0), 2.0);

  vec3 color = uBody * (0.35 + diffuse * 0.65);
  color = mix(color, filmColor, 0.18 + fresnel * 0.82);
  color += filmColor * back * 0.25;
  color += vec3(1.0) * spec * (0.55 + uEnergy * 0.3);

  gl_FragColor = vec4(color * uIntro, 1.0);
  #include <colorspace_fragment>
}
`;
