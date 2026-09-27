import { useLoader, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useRef, useMemo, useEffect } from "react";
const coverUVGlsl = `vec2 coverUV(vec2 uv, float imgA, float viewA) { vec2 scale = viewA > imgA ? vec2(1.0, imgA / viewA) : vec2(viewA / imgA, 1.0); return (uv - 0.5) * scale + 0.5; }`;
const fgVert = `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`;
const fgFrag = `
${coverUVGlsl}
uniform sampler2D uTexture;
uniform sampler2D uDepthMap;
uniform vec2 uMouse;
uniform vec2 uThreshold;
uniform float uFgAspect;
uniform float uViewportAspect;
uniform float uBlurStrength;
varying vec2 vUv;

void main() {
  vec2 base = coverUV(vUv, uFgAspect, uViewportAspect);
  vec4 depth = texture2D(uDepthMap, base);
  vec2 displacement = -uMouse * depth.r * uThreshold;
  vec2 uv = base + displacement;

  // Mipmap-based depth blur:
  // depth.r high = foreground (sharp), depth.r low = background (blurry)
  float blurLod = (1.0 - depth.r) * uBlurStrength;

  // texture2D with 3rd arg = LOD bias — samples from blurrier mipmap levels
  gl_FragColor = texture2D(uTexture, uv, blurLod);
}
`;

export default function ThreeImage({
  mouse,
  onReady,
  cameraZ,
  hovering,
  image,
}: {
  image?: { img: string; depth: string };
  mouse: React.MutableRefObject<[number, number]>;
  onReady: () => void;
  cameraZ?: React.MutableRefObject<{ value: number }>;
  hovering?: React.MutableRefObject<boolean>;
}) {
  const { viewport, size } = useThree();

  // Store the initial viewport dimensions on mount so they do not reactively scale
  // and neutralize the camera Z-axis animation.
  const initialViewport = useMemo(
    () => ({
      width: viewport.width,
      height: viewport.height,
    }),
    [],
  );

  const imgSrc = image?.img || "/ecom.jpg";
  const depthSrc = image?.depth || "/Assets/Depth-maps/ecom-depth.png";

  const [tex, depthTex] = useLoader(THREE.TextureLoader, [imgSrc, depthSrc]);

  // Force mipmaps on the main texture so LOD-based blur works
  useEffect(() => {
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.needsUpdate = true;
  }, [tex]);

  const frameCount = useRef(0);
  const uniforms = useMemo(
    () => ({
      uTexture: { value: tex },
      uDepthMap: { value: depthTex },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uThreshold: { value: new THREE.Vector2(0.007, 0.005) },
      uFgAspect: { value: tex.image.width / tex.image.height },
      uViewportAspect: { value: size.width / size.height },
      uBlurStrength: { value: hovering ? 0.0 : 5.0 },
    }),
    [tex, depthTex],
  );
  useFrame(({ camera }) => {
    if (hovering) {
      const targetZ = hovering.current ? 5.2 : 6.0;
      if (cameraZ?.current) {
        cameraZ.current.value += (targetZ - cameraZ.current.value) * 0.06;
      }
    }

    if (cameraZ?.current) {
      camera.position.z = cameraZ.current.value;
      camera.updateProjectionMatrix();
    }

    uniforms.uViewportAspect.value = size.width / size.height;
    // Animate blur: 0 → 5 on hover, 5 → 0 on leave
    if (hovering) {
      const targetBlur = hovering.current ? 5.0 : 0.0;
      uniforms.uBlurStrength.value +=
        (targetBlur - uniforms.uBlurStrength.value) * 0.06;
    }
    uniforms.uMouse.value.x +=
      (mouse.current[0] - uniforms.uMouse.value.x) * 0.06;
    uniforms.uMouse.value.y +=
      (mouse.current[1] - uniforms.uMouse.value.y) * 0.06;
    if (frameCount.current < 2) {
      frameCount.current++;
      if (frameCount.current === 2) {
        onReady();
      }
    }
  });
  return (
    <mesh>
      <planeGeometry args={[initialViewport.width, initialViewport.height]} />
      <shaderMaterial
        vertexShader={fgVert}
        fragmentShader={fgFrag}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
}
