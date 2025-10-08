import { Color, DoubleSide, MeshPhongMaterial } from "three";

export function getMaterial(color: number = 0x888888, inside: number = 0xffffff) {
    const mat = new MeshPhongMaterial({ color, side: DoubleSide });


    const c1 = new Color().setHex(color), c2 = new Color().setHex(inside);

    console.log(c1, c2)

    // shader magic to make inside different color
    // https://discourse.threejs.org/t/debug-winding-validator/10992/8
    mat.onBeforeCompile = shader => {
        shader.fragmentShader = shader.fragmentShader.replace(
            `#include <fog_fragment>`,
            `#include <fog_fragment>
            if (!gl_FrontFacing) {
                gl_FragColor.rgb = vec3(.25,.25,.25);
            }
            `
        );
    };

    return mat;
}