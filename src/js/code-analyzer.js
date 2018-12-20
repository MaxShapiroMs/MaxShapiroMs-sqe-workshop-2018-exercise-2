import * as esprima from 'esprima';
let token;
const parseCode = (codeToParse) => {
    token=new Array();
    let parsedCode = esprima.parseScript(codeToParse,{ loc : true });
    parseData(parsedCode.body);
    return token;
};

const parseDataType = {
    'FunctionDeclaration': parseFunction,
    'VariableDeclaration': parseVariable,
    'ExpressionStatement': parseExpression,
    'ReturnStatement': parseReturn,
    'WhileStatement': parseWhile,
    'ForStatement': parseFor,
    'IfStatement': parseIf,
    'UpdateExpression': parseUpdate,
    'AssignmentExpression': parseAssignment,
    'BinaryExpression':parseBinaryExpression,
    'MemberExpression':parseMemberExpression,
    'Literal': parseLiteral,
    'Identifier': parseIdentifierExpression,
    'UnaryExpression': parseUnaryExpression,
    'BlockStatement': blockExpression

};

function parseData(data)
{
    for(let i=0;i<data.length;i++) {
        parseDataType[data[i].type](data[i]);
    }
}

function parseFunction(data){
    token.push({'Line':data.loc.start.line , 'Type': data.type , 'Name': data.id.name , 'Condition':'' , 'Value':''});
    for(let i=0;i<data.params.length;i++)
        token.push({'Line':data.loc.start.line , 'Type': 'FunctionDeclaration' , 'Name': data.params[i].name , 'Condition':'' , 'Value':''});

    blockExpression(data.body);
}
function parseVariable(data){
    for(let i=0;i<data.declarations.length;i++)
    {
        if(data.declarations[i].init==null)
            token.push({'Line':data.loc.start.line , 'Type': 'VariableDeclaration' , 'Name': data.declarations[i].id.name , 'Condition':'' , 'Value':'null'});
        else
            token.push({'Line':data.loc.start.line , 'Type': 'VariableDeclaration' , 'Name': data.declarations[i].id.name , 'Condition':'' , 'Value':data.declarations[i].init.raw});
    }
}
function parseExpression(data){
    parseDataType[data.expression.type](data.expression);
}
function parseReturn(data){
    token.push({'Line':data.loc.start.line, 'Type':data.type,'Name':'','Condition':'', 'Value':parseDataType[data.argument.type](data.argument)});
}
function parseWhile(data){
    token.push({'Line':data.loc.start.line , 'Type': data.type , 'Name': '' , 'Condition':parseDataType[data.test.type](data.test) , 'Value':''});
    blockExpression(data.body);
}
function parseFor(data){
    token.push({'Line':data.loc.start.line , 'Type': data.type , 'Name': '' , 'Condition':parseDataType[data.test.type](data.test) , 'Value':''});
    parseDataType[data.init.type](data.init);
    parseDataType[data.test.type](data.test);
    parseDataType[data.update.type](data.update);
    blockExpression(data.body);
}
function parseIf(data){
    token.push({'Line':data.loc.start.line , 'Type': data.type , 'Name': '' , 'Condition':parseDataType[data.test.type](data.test) , 'Value':''});
    parseDataType[data.consequent.type](data.consequent);
    if(data.alternate!=null)
        parseDataType[data.alternate.type](data.alternate);
}
function parseUpdate(data){
    return data;
}
function parseAssignment(data){
    token.push({'Line':data.loc.start.line, 'Type':data.type,'Name':parseDataType[data.left.type](data.left),'Condition':'', 'Value':parseDataType[data.right.type](data.right)});
}
////
function parseBinaryExpression(data){
    if(bracesTester(data.left.type))
    {
        return '('+parseDataType[data.left.type](data.left)+') '+data.operator+' ('+parseDataType[data.right.type](data.right)+')';
    }
    else
    {
        return parseDataType[data.left.type](data.left)+' '+data.operator+' ('+parseDataType[data.right.type](data.right)+')';
    }
}
function bracesTester(data){
    if(data=='Identifier')
        return 1;
    else if(data=='Literal')
        return 1;
    else if(data=='MemberExpression')
        return 1;
    return 0;
}
function parseMemberExpression(data){
    return data.object.name+'['+parseDataType[data.property.type](data.property)+']';
}
function parseLiteral(data){
    return data.raw;
}
function parseIdentifierExpression(data){
    return data.name;
}
function parseUnaryExpression(data){
    return '-'+parseDataType[data.argument.type](data.argument);
}
function blockExpression(data)
{
    for(let i=0;i<data.body.length;i++)
    {
        parseDataType[data.body[i].type](data.body[i]);
    }
}

export {parseCode};
