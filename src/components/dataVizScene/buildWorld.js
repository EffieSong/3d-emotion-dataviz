//Draw frame lines and create dates as 3d text elements.
import * as THREE from 'three';
import {
    FontLoader
} from 'three/examples/jsm/loaders/FontLoader.js'


export default (
    dataViz, // :DataViz,
    scene, // :THREE.Scene,
    camera
) => {
    let frameGroup = new THREE.Group();
    frameGroup.name = "frameGroup";

    // Draw lines (create Geometry) with Vertices and group them

    frameGroup = createLines_Col(
        dataViz.bars, //number,
        dataViz.colSpace, //number,
        frameGroup, //THREE.Group
    );
    frameGroup = createLines_Row(
        5, //number,
        dataViz.rowSpace, //number,
        dataViz.colSpace, //number,
        frameGroup, //THREE.Group
    );

    // Create date text elements as 3D object and place them at the left 

    createTags(dataViz);

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
        colSpace,
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

    function createText(
        font,
        size,
        textString, //:string
        position = {
            x: 0,
            y: 0,
            z: 0
        }
    ) {
        const color = new THREE.Color("rgb(255,255,255)");

        const mat_font = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.9,
            side: THREE.DoubleSide
        });

        const message = textString;

        const fontShape = font.generateShapes(message, size);

        const geometry = new THREE.ShapeGeometry(fontShape);
        geometry.computeBoundingBox();
        let width = geometry.boundingBox.max.x - geometry.boundingBox.min.x;
        geometry.translate(-width / 2, 0, 0); // put the anchor the the textShape at the center    

        // Create mesh

        const text = new THREE.Mesh(geometry, mat_font);
        text.position.set(position.x, position.y, position.z);
        scene.add(text);

    }

    function createTags(
        dataViz,
    ) {
        // load font
        const loader = new FontLoader();
        //https://threejs.org//examples/fonts/helvetiker_regular.typeface.json
        // '../../assets/fonts/helvetiker_regular.typeface.json'
        loader.load('https://threejs.org//examples/fonts/helvetiker_regular.typeface.json', function (font) {

            let tags = ['Friend', 'Work', 'Life', 'Relationship'];
            tags.forEach((item, index) => {
                createText(font, 0.03 * dataViz.rowSpace, item, {
                    x: -1.5 * dataViz.colSpace + index * dataViz.colSpace,
                    y: -dataViz.colSpace * 0.2,
                    z: 0
                });
            })
        });

    }

   // let timeMesh = createTimeText("time");
   let timeMesh = dcText("04/27/2022", 0.5, 0.5, 80, 0xFFFFFF); 
    timeMesh.position.set(0, 5., camera.position.z -30);
    scene.add(timeMesh);

    // text to canvas to texture to material to mesh

    function dcText(txt, hWorldTxt, hWorldAll, hPxTxt, fgcolor, bgcolor) { // the routine
        // txt is the text.
        // hWorldTxt is world height of text in the plane.
        // hWorldAll is world height of whole rectangle containing the text.
        // hPxTxt is px height of text in the texture canvas; larger gives sharper text.
        // The plane and texture canvas are created wide enough to hold the text.
        // And wider if hWorldAll/hWorldTxt > 1 which indicates padding is desired.
        var kPxToWorld = hWorldTxt/hPxTxt;                // Px to World multplication factor
        // hWorldTxt, hWorldAll, and hPxTxt are given; get hPxAll
        var hPxAll = Math.ceil(hWorldAll/kPxToWorld);     // hPxAll: height of the whole texture canvas
        // create the canvas for the texture
        var txtcanvas = document.createElement("canvas"); // create the canvas for the texture
        var ctx = txtcanvas.getContext("2d");
        ctx.font = hPxTxt + "px sans-serif";        
        // now get the widths
        var wPxTxt = ctx.measureText(txt).width;         // wPxTxt: width of the text in the texture canvas
        var wWorldTxt = wPxTxt*kPxToWorld;               // wWorldTxt: world width of text in the plane
        var wWorldAll = wWorldTxt+(hWorldAll-hWorldTxt); // wWorldAll: world width of the whole plane
        var wPxAll = Math.ceil(wWorldAll/kPxToWorld);    // wPxAll: width of the whole texture canvas
        // next, resize the texture canvas and fill the text
        txtcanvas.width =  wPxAll;
        txtcanvas.height = hPxAll;
        if (bgcolor != undefined) { // fill background if desired (transparent if none)
          ctx.fillStyle = "#" + bgcolor.toString(16).padStart(6, '0');
          ctx.fillRect( 0,0, wPxAll,hPxAll);
        } 
        ctx.textAlign = "center";
        ctx.textBaseline = "middle"; 
        ctx.fillStyle = "#" + fgcolor.toString(16).padStart(6, '0'); // fgcolor
        ctx.font = hPxTxt + "px sans-serif";   // needed after resize
        ctx.fillText(txt, wPxAll/2, hPxAll/2); // the deed is done
        // next, make the texture
        var texture = new THREE.Texture(txtcanvas); // now make texture
        texture.minFilter = THREE.LinearFilter;     // eliminate console message
        texture.needsUpdate = true;                 // duh
        // and make the world plane with the texture
        let geometry = new THREE.PlaneGeometry(wWorldAll, hWorldAll);
        var material = new THREE.MeshBasicMaterial( 
          { side:THREE.DoubleSide, map:texture, transparent:true, opacity:1.0 } );
        // and finally, the mesh
        var mesh = new THREE.Mesh(geometry, material);
        mesh.wWorldTxt = wWorldTxt; // return the width of the text in the plane
        mesh.wWorldAll = wWorldAll; //    and the width of the whole plane
        mesh.wPxTxt = wPxTxt;       //    and the width of the text in the texture canvas
                                    // (the heights of the above items are known)
        mesh.wPxAll = wPxAll;       //    and the width of the whole texture canvas
        mesh.hPxAll = hPxAll;       //    and the height of the whole texture canvas
        mesh.ctx = ctx;             //    and the 2d texture context, for any glitter
        // console.log(wPxTxt, hPxTxt, wPxAll, hPxAll);
        // console.log(wWorldTxt, hWorldTxt, wWorldAll, hWorldAll);
        return mesh;
      }

    scene.add(frameGroup);
    return {
        frameGroup,
        timeMesh
    };
}