//Draw frame lines and create dates as 3d text elements.
import * as THREE from 'three';
import {
    FontLoader
} from 'three/examples/jsm/loaders/FontLoader.js'

import DiaryObj from "../diaryData/diaryObj";
import DataViz from '../../DataViz'

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

    //   frameGroup = CreateDateText(
    //     dataViz,
    //        5, //number,
    //        colSpace,
    //        rowSpace, //number,
    //        frameGroup, //THREE.Group
    //   );

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
                color: new THREE.Color("rgb(255, 255, 0)"),
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
                color: new THREE.Color("rgb(255, 255, 0)"),
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



    // function CreateDateText(
    //     dataViz,
    //  //   timelineEndDate: number,
    //     rowNum, //number,
    //     colSpace,
    //     rowSpace, //number,
    //     frameGroup, //THREE.Group

    // ){
    //     // load font
    //     const loader = new FontLoader();
    //     //https://threejs.org//examples/fonts/helvetiker_regular.typeface.json
    //     loader.load( '../../assets/fonts/helvetiker_regular.typeface.json',  ( font ) =>{
    //             const matLite = new THREE.MeshBasicMaterial({
    //               color: color,
    //               transparent: true,
    //               side: THREE.DoubleSide,
    //             });

    //             let dateTextPosition = 0;
    //             let date = 0;
    //             let days = 20;
    //             for (let i = 0; i <= days / 100 + 8; i++) {

    //               const pastDate = date * -1;
    //               const pastDateTextPosition = dateTextPosition * -1;
    //               let message = date.toString();
    //               let shapes = font.generateShapes(message, 1.5 * dataViz.scale, 0);
    //               let geometry = new THREE.ShapeBufferGeometry(shapes);
    //               geometry.computeBoundingBox();

    //               // make shape left ( N.B. edge view not visible )
    //               let dateText = new THREE.Mesh(geometry, matLite);
    //               dateText.position.y = dataViz.scale / 3 + 0.4;
    //               dateText.position.x = -(dataViz.bars + 1) * (colSpace / 2);
    //               dateText.position.z = dateTextPosition;

    //               frameGroup.add(dateText);
    //               dateTextPosition -= rowSpace;
    //               date += 100;
    //             }

    //     } ); 
    //     return frameGroup;


    // }
    scene.add(frameGroup);
    return frameGroup;
}