function Layout(data) {
    const numPoints = data.length;
    const numCols = Math.ceil(Math.sqrt(numPoints));
    const numRows = numCols;
    const TAGS = ["work","life","love","social"];
  
    for (let i = 0; i < numPoints; i++) {
      let datum = data[i];      
      let colIndex = TAGS.indexOf(datum.tag)
      // map time to z
      // const row = datum[i].time;
      // let y = datum[i].emotion;
      

      datum.x = colIndex * 3;
      datum.z = i*3;
      datum.y = 2;
    }
  }
  function timeline(){
      
  }
  export { Layout };