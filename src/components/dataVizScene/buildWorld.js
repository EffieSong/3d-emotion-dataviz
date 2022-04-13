//Draw frame lines and create dates as 3d text elements.
import * as THREE from 'three';
import {
    FontLoader
} from 'three/examples/jsm/loaders/FontLoader.js'


export default (
    dataViz, // :DataViz,
    scene, // :THREE.Scene,
    colSpace, // :number,
    rowSpace
) => {
    let frameGroup = new THREE.Group();
    frameGroup.name = "frameGroup";

    // Draw lines (create Geometry) with Vertices and group them

    frameGroup = createLines_Col(
        dataViz.bars, //number,
        colSpace, //number,
        frameGroup, //THREE.Group
    );
    frameGroup = createLines_Row(
        5, //number,
        rowSpace, //number,
        frameGroup, //THREE.Group
    );

   // Create date text elements as 3D object and place them at the left 

      frameGroup = CreateDateText(
        dataViz,
           5, //number,
           colSpace,
           rowSpace, //number,
           frameGroup, //THREE.Group
      );

    function createLines_Col(
        bars, //number,
        colSpace, //number,
        frameGroup, //THREE.Group
    ) {
        const colLinesGroup = new THREE.Group();
        let x;
        for (let i = 0; i <= bars; i++) {
            x = -(bars * colSpace / 2) + i * colSpace; // calculate placement of bar on x-axis
            const matLine = new THREE.LineBasicMaterial({
                color: new THREE.Color("rgb(205, 250, 220)"),
                linewidth: 1,
                //vertexColors: true,
            });

            const points = [];
            points.push(new THREE.Vector3(
                x,
                0,
                0,
            ));
            points.push(new THREE.Vector3(
                x,
                0,
                -1000
            ));

            const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(
                lineGeometry,
                matLine
            );
            colLinesGroup.add(line); // add to mainScene
        }
        colLinesGroup.name = "colLinesGroup";
        frameGroup.add(colLinesGroup);
        return frameGroup;
    }


    function createLines_Row(
        rowNum, //number,
        rowSpace, //number,
        frameGroup, //THREE.Group
    ) {
        const rowLinesGroup = new THREE.Group();
        let z;
        for (let i = 0; i <= rowNum; i++) {
            z = -i * rowSpace; // calculate placement of bar on x-axis
            const matLine = new THREE.LineBasicMaterial({
                color: new THREE.Color("rgb(205, 250, 220)"),
                linewidth: 1,
                //vertexColors: true,
            });

            const points = [];
            points.push(new THREE.Vector3(
                -colSpace * dataViz.bars / 2 * 1.2,
                0,
                z,
            ));
            points.push(new THREE.Vector3(
                colSpace * dataViz.bars / 2 * 1.2,
                0,
                z
            ));

            const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(
                lineGeometry,
                matLine
            );
            rowLinesGroup.add(line); // add to mainScene
        }
        rowLinesGroup.name = "colLinesGroup";
        frameGroup.add(rowLinesGroup);
        return frameGroup;
    }



    function CreateDateText(
        dataViz,
     //   timelineEndDate: number,
        rowNum, //number,
        colSpace,
        rowSpace, //number,
        frameGroup, //THREE.Group

    ){
        // load font
        const loader = new FontLoader();
        //https://threejs.org//examples/fonts/helvetiker_regular.typeface.json
        // '../../assets/fonts/helvetiker_regular.typeface.json'
        loader.load( 'https://threejs.org//examples/fonts/helvetiker_regular.typeface.json', function ( font ) {
            const color = new THREE.Color("rgb(255,255,255)");

            const mat_font = new THREE.MeshBasicMaterial( {
                color: color,
                transparent: true,
                opacity: 0.8,
                side: THREE.DoubleSide
            } );

            const message = 'testtesttest';

            const fontShape = font.generateShapes( message, 0.1*dataViz.rowSpace );

            const geometry = new THREE.ShapeGeometry( fontShape );
            geometry.computeBoundingBox();
            geometry.translate(-1,2,0);


            // make shape

            const text = new THREE.Mesh( geometry, mat_font );
            text.position.z = - 3;
            scene.add( text );

        })

        
        return frameGroup

    }
    scene.add(frameGroup);
    return frameGroup;
}