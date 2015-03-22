// ==UserScript==
// @name         shipwrightToObj
// @version      0.1
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @description  ship ripper
// @author       You
// @match        http://ship.shapewright.com/*
// @grant        none
// ==/UserScript==

name = $('#name').val();
if (!name){name = "ship";}

Downloadify.create('fb-buttons',{
    filename: name + '.obj',
    data: function(){
        return objExport();
    },
    onComplete: function(){ 
    },
    onCancel: function(){    
    },
    onError: function(){
        alert('Sorry, something went wrong!');     
    },
    transparent: false,
    swf: 'http://ship.shapewright.com/js/downloadify.swf',
    downloadImage: 'https://dl.dropboxusercontent.com/u/249929/downloadObj.png',
    width: 114,
    height: 26,
    transparent: true,
    append: true
});


function safeName(str, nameLst){    
    
    var n = str.replace(/[^A-Z0-9]/ig, "_");    
    if (nameLst.indexOf(n) == -1){
        return n;
    }
    
    for (var i = 1; i < 10; i++){
        n2 = n + "_" + i;
        if (nameLst.indexOf(n2) == -1){
            return n2;
        }
    }
    
    return n + "_"  + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
}

function objExport(){
    
    var output = '';
	var indexVertex = 0;
	var indexVertexUvs = 0;
	var indexNormals = 0;
    
    var vOffset = 0;
    var nOffset = 0;
    var nLst = [];
    var nameLst = [];
   
    modelParent.rotation.x = -(pi * 0.5);  //this doesnt appear to work
    modelParent.rotation.z = 0.0;
    
    console.log('getting',Models.length,'models');
    
    for (var m = 0; m < Models.length; m++ ){
        
      	Model = Models[m];                  
        var partName = safeName(Model.geometry.part.name, nameLst);   
        nameLst.push(partName);
        
        console.log(partName);
        output += 'o ' + partName + '\n';        
        				
		verts = Model.geometry.vertices;
		mat = Model.matrixWorld;
		vLen = verts.length;
        
        Model.geometry.computeVertexNormals();
		
        //verts
		for (var i = 0; i < vLen; i ++ ){		
			p = mat.multiplyVector3(verts[i].position);
			x = roundIsh(p.x);
			y = roundIsh(p.y);
			z = roundIsh(p.z);			
            output += 'v ' + x + ' ' + y + ' ' + z + '\n';
		}
        
        faces = Model.geometry.faces;
		fLen = faces.length;
        
        //normals
        //for (var i = 0; i < fLen; i ++ ){                                   
         //   var normals = faces[i].vertexNormals;            
          //  for ( var j = 0; j < normals.length; j ++ ) {
            //    var normal = normals[ j ];
                //output += 'vn ' + normal.x + ' ' + normal.y + ' ' + normal.z + '\n';                
                //nLst.push(normal);  //record their position
            //}                        
        //}         
        
        //v//vn v//vn v//vn
        
        output += 'g ' + partName + '\n';   
        
        // faces
        for (var i = 0; i < fLen; i ++ ){
		
			face = faces[i];			
			a = face.a+vOffset + 1;
			b = face.b+vOffset + 1;
			c = face.c+vOffset + 1;
			d = face.d+vOffset + 1;
            
            //an = face.vertexNormals[0];
            //bn = face.vertexNormals[1];
            //cn = face.vertexNormals[2];
            //dn = face.vertexNormals[3];
            
            //anPos = nLst.indexOf(an) + 1;            
            //bnPos = nLst.indexOf(bn) + 1;            
            //cnPos = nLst.indexOf(cn) + 1;            
            //dnPos = nLst.indexOf(dn) + 1;            
            
            //output += 'f ' + a + '//' + anPos + ' ' + b + '//' + bnPos + ' ' + c + '//' + cnPos + ' \n';             
            output += 'f ' + a + ' ' + b + ' ' + c + '\n';               
            if(!isNaN(d)){
                output += 'f ' + a + ' ' + c + ' ' + d + '\n';   
                //output += 'f ' + a + '//' + anPos + ' ' + c + '//' + cnPos + ' ' + d + '//' + dnPos + ' \n';             
            }
		}         
        nOffset += fLen;
        vOffset += vLen;        
    }    
    return output;    
}
    















