
    uniform float uTime;
    uniform vec2 uResolution;
    uniform float uSpeed;
    uniform float uScale;
    uniform float uIntensity;
    uniform float uAspectRatio;
    uniform vec2 uBorderRect;
    uniform float uCornerRadius;

    varying vec2 vUv;

    float rand(vec2 n) {
        return fract(sin(dot(n, vec2(12.9898,12.1414))) * 83758.5453);
    }

    float noise(vec2 n) {
        const vec2 d = vec2(0.0, 1.0);
        vec2 b = floor(n);
        vec2 f = mix(vec2(0.0), vec2(1.0), fract(n));
        return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
    }

    vec3 ramp(float t) {
	    return t <= .5 ? vec3( 1. - t * 1.4, .2, 1.05 ) / t : vec3( .3 * (1. - t) * 2., .2, 1.05 ) / t;
    }

    float fire(vec2 n) {
        return noise(n) + noise(n * 2.1) * .6 + noise(n * 5.4) * .42;
    }

    vec3 getLine(vec3 col, vec2 fc, vec2 res, mat2 mtx, float shift){
        float t = uTime * uSpeed;
        vec2 uv = (fc / res) * mtx;
        
        uv.x += uv.y < .5 ? 23.0 + t * .35 : -11.0 + t * .3;    
        uv.y = abs(uv.y - shift);
        uv *= uScale;
        
        float q = fire(uv - t * .013) / 2.0;
        vec2 r = vec2(fire(uv + q / 2.0 + t - uv.x - uv.y), fire(uv + q - t));
        vec3 color = vec3(1.0 / (pow(vec3(0.5, 0.0, .1) + 1.61, vec3(4.0))));
        
        float grad = pow((r.y + r.y) * max(.0, uv.y) + .1, uIntensity);
        color = ramp(grad);
        color /= (1.50 + max(vec3(0), color));
        
        if(color.b < .00000005)
            color = vec3(.0);
        
        return mix(col, color, color.b);
    }

    float sdRoundedBox( in vec2 p, in vec2 b, in float r ) {
      vec2 q = abs(p)-b+r;
      return min(max(q.x,q.y),0.0) + length(max(q,0.0)) - r;
    }

    void main() {
        vec2 p = gl_FragCoord.xy - uResolution.xy / 2.0;
        vec2 b = uBorderRect.xy / 2.0;
        float d = sdRoundedBox(p, b, uCornerRadius);
        
        float border_width = 30.0;
        float alpha = smoothstep(border_width, border_width - 2.0, abs(d));

        if (alpha < 0.01) {
            gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
            return;
        }

        vec2 fragCoord = gl_FragCoord.xy;
        mat2 mtx1 = mat2(1., 1., 0., 1.);
        mat2 mtx2 = mat2(1., 1., 1., 0.);

        vec3 horizontal_color = vec3(0.0);
        horizontal_color = getLine(horizontal_color, fragCoord, uResolution, mtx1, 1.02);
        horizontal_color = getLine(horizontal_color, fragCoord, uResolution, mtx2, 1.02);
        horizontal_color = getLine(horizontal_color, fragCoord, uResolution, mtx1, -0.02);
        horizontal_color = getLine(horizontal_color, fragCoord, uResolution, mtx2, -0.02);

        vec3 vertical_color = vec3(0.0);
        vertical_color = getLine(vertical_color, fragCoord.yx, uResolution.yx, mtx1, 1.02);
        vertical_color = getLine(vertical_color, fragCoord.yx, uResolution.yx, mtx2, 1.02);
        vertical_color = getLine(vertical_color, fragCoord.yx, uResolution.yx, mtx1, -0.02);
        vertical_color = getLine(vertical_color, fragCoord.yx, uResolution.yx, mtx2, -0.02);
        
        vec3 final_color = horizontal_color + vertical_color;
        gl_FragColor = vec4(final_color, alpha);
    }