import {
    Layout
} from './Layout.js';
import * as THREE from 'three';


export default class FeelingDataVis {
    constructor(opt) {
        this.data = opt.data;
        this.scene = opt.scene;
        Layout(this.data);
        this.render();
    }
    render() {
        this.data.forEach(item => {
            this.addMesh(item.x, item.y, item.z);
        });

    }
    addMesh(x, y, z) {
        // Material
        let material = new THREE.MeshBasicMaterial({
            color: 0xffaa00,
            transparent: true,
            blending: THREE.AdditiveBlending
        });

        // Mesh
        let geometry = new THREE.SphereGeometry(1, 32, 16);
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(x, y,z);
        console.log(this.mesh);
        this.scene.add(this.mesh);

    }
}