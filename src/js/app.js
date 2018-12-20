import $ from 'jquery';
//import {parseCode} from './code-analyzer';
import {symbolizer,getGreenLines,getRedLines} from './Symbolizer';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = symbolizer(codeToParse,$('#parameterPlaceHolder').val());
        let greenLines=getGreenLines();
        let redLines=getRedLines();
        var newLine,i,j;
        if(greenLines.length>0){i=0;}
        if(redLines.length>0){j=0;}
        for(let line in parsedCode.split('\n')){
            newLine=getColor(greenLines,redLines,line,i,j);
            if(newLine.getAttribute('class')=='greenColor'){i++;}
            else if(newLine.getAttribute('class')=='redColor'){j++;}
            var node=document.createTextNode(parsedCode.split('\n')[line]);
            newLine.appendChild(node);
            document.getElementById('parsedCode').appendChild(newLine);
        }
    });
});
function getColor(green,red,line,i,j){
    let tempLine=document.createElement('P');
    if(line==green[i]-1) {
        tempLine.setAttribute('class', 'greenColor');
        i++;
    }else if(line==red[j]-1) {
        tempLine.setAttribute('class', 'redColor');
        j++;
    }return tempLine;
}