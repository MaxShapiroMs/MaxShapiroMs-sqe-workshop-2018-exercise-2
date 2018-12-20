import assert from 'assert';
import {symbolizer} from '../src/js/Symbolizer';

describe('The javascript parser', () => {
    it('is parsing an empty function correctly', () => {
        assert.equal(
            JSON.stringify(symbolizer('function func(x,y){}','1,2')),
            '\"function func(x,y){}\\n\"'
        );
    });
});
describe('The javascript parser', () => {
    it('is parsing a simple variable declaration correctly', () => {
        assert.equal(
            JSON.stringify(symbolizer('let a = 1;','')),
            '\"let a =1\\n\"'
        );
    });
});
describe('The javascript parser', () => {
    it('is parsing a simple function correctly', () => {
        assert.equal(
            JSON.stringify(symbolizer('function binarySearch(X, V, n){return 1;}','1,1,1')),
            '\"function binarySearch(X, V, n){return 1;}\\nreturn 1\\n\"'
        );
    });
});
describe('The javascript parser', () => {
    it('is parsing a simple if condition correctly', () => {
        assert.equal(
            JSON.stringify(symbolizer('function func(low,high){\n' +
                'let i=0;\n' +
                'if(i<high){\n' +
                '}\n' +
                '}','1,5')),
            '\"function func(low,high){\\nlet i=0\\nif(0<high){\\n}\\n}\\n\"'
        );
    });
});
describe('The javascript parser', () => {
    it('is parsing a simple if with else condition correctly', () => {
        assert.equal(
            JSON.stringify(symbolizer('function func(low,high){\n' +
                    'let i=0;\n' +
                    'if(i<high){\n' +
                    '}\n' +
                    'else{\n' +
                    '}\n' +
                    '}')),
            '\"function func(low,high){\\nlet i=0\\nif(0<high){\\nelse{\\nelse{\\n}\\n}\\n\"'
        );
    });
});
describe('The javascript parser', () => {
    it('is parsing a example given correctly', () => {
        assert.equal(
            JSON.stringify(symbolizer('function foo(x, y, z){\n' +
                '    let a = x + 1;\n' +
                '    let b = a + y;\n' +
                '    let c = 0;\n' +
                '    \n' +
                '    if (b < z) {\n' +
                '        c = c + 5;\n' +
                '        return x + y + z + c;\n' +
                '    } else if (b < z * 2) {\n' +
                '        c = c + x + 5;\n' +
                '        return x + y + z + c;\n' +
                '    } else {\n' +
                '        c = c + z + 5;\n' +
                '        return x + y + z + c;\n' +
                '    }\n' +
                '}\n')),
            '\"function foo(x, y, z){\\n    let a =x+1\\n    let b =x+1+y\\n    let c =0\\n    \\n    if (x+1+y<z) {\\nc=0+5\\nreturn x+y + (z) + (0+5)\\n    } else if (x+1+y<z*2) {\\nc=0+x + (5)\\nreturn x+y + (z) + (0+x + (5))\\n    } else {\\nc=0+z + (5)\\nreturn x+y + (z) + (0+z + (5))\\n    }\\n}\\n\"'
        );
    });
});
describe('The javascript parser', () => {
    it('is parsing a another example given correctly', () => {
        assert.equal(
            JSON.stringify(symbolizer('function foo(x, y, z){\n' +
                '    let a = x + 1;\n' +
                '    let b = a + y;\n' +
                '    let c = 0;\n' +
                '    \n' +
                '    while (a < z) {\n' +
                '        c = a + b;\n' +
                '        z = c * 2;\n' +
                '    }\n' +
                '    \n' +
                '    return z;\n' +
                '}\n')),
            '\"function foo(x, y, z){\\n    let a =x+1\\n    let b =x+1+y\\n    let c =0\\nc=x+1+x+1+y\\nz=x+1+x+1+y*2\\nreturn z\\n        z = c * 2;\\n    }\\n    \\n    return z;\\n}\\n\"'
        );
    });
});
describe('The javascript parser', () => {
    it('is parsing a simple binaryExpression correctly', () => {
        assert.equal(
            JSON.stringify(symbolizer('let a = 1; a = (1+1)+2;')),
            '[{"Line":1,"Type":"VariableDeclaration","Name":"a","Condition":"","Value":"1"},{"Line":1,"Type":"AssignmentExpression","Name":"a","Condition":"","Value":"(1) + (1) + (2)"}]'
        );
    });
});
describe('The javascript parser', () => {
    it('is parsing a if without else correctly', () => {
        assert.equal(
            JSON.stringify(symbolizer('if (X < V[mid]){}')),
            '[{"Line":1,"Type":"IfStatement","Name":"","Condition":"(X) < (V[mid])","Value":""}]'
        );
    });
});
describe('The javascript parser', () => {
    it('is parsing a binary expression of 2 member expressions in it correctly', () => {
        assert.equal(
            JSON.stringify(symbolizer('let a = 1; a = M[1]+M[2]')),
            '[{"Line":1,"Type":"VariableDeclaration","Name":"a","Condition":"","Value":"1"},{"Line":1,"Type":"AssignmentExpression","Name":"a","Condition":"","Value":"(M[1]) + (M[2])"}]'
        );
    });
});
describe('The javascript parser', () => {
    it('is parsing a binary expression that has a member expression in it correctly', () => {
        assert.equal(
            JSON.stringify(symbolizer('let a = 1; a = (1+1)+M[2];')),
            '[{"Line":1,"Type":"VariableDeclaration","Name":"a","Condition":"","Value":"1"},{"Line":1,"Type":"AssignmentExpression","Name":"a","Condition":"","Value":"(1) + (1) + (M[2])"}]'
        );
    });
});
describe('The javascript parser', () => {
    it('is parsing a complex if correctly', () => {
        assert.equal(
            JSON.stringify(symbolizer('let a = 1; if(a == 1) {a = a + b} else {a = a - b}')),
            '[{"Line":1,"Type":"VariableDeclaration","Name":"a","Condition":"","Value":"1"},{"Line":1,"Type":"IfStatement","Name":"","Condition":"(a) == (1)","Value":""},{"Line":1,"Type":"AssignmentExpression","Name":"a","Condition":"","Value":"(a) + (b)"},{"Line":1,"Type":"AssignmentExpression","Name":"a","Condition":"","Value":"(a) - (b)"}]'
        );
    });
});
