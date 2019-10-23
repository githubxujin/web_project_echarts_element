/**
 * 冷站
 */
import drawingTools from './drawingTools.js';
var filePath = '../../../static/img/coldTools/';
import $ from "jquery";
let ispolyline = true, runer = '', pipeName = '';
var colours = {
    '黑': 'Black', '红': 'Red', '紫': 'Magenta', '蓝': 'Blue', '青': 'Cyan', '绿': 'Green', '橙': 'Orange'
}
var towerValue = {
    '进A': [{ x: 12, y: 19 }], '进B': [{ x: 55, y: 19 }], '出A': [{ x: 63, y: 56 }], '出B': [{ x: 63, y: 43 }]
}
var chiller = {
    '出A': [{ x: 0, y: 35 }], '进A': [{ x: 0, y: 45 }], '出B': [{ x: 172, y: 52 }], '进A': [{ x: 172, y: 65 }]
}

var pumps = {
    '冷却泵进': [{ x: 0, y: 40 }], '冷却泵出': [{ x: 30, y: 40 }], '冷冻泵出': [{ x: 0, y: 40 }], '冷冻泵进': [{ x: 30, y: 40 }]
}
var tower = {
    '出A': [{ x: 10, y: 20 }], '进A': [{ x: 55, y: 19 }], '出B': [{ x: 60, y: 40 }], '进B': [{ x: 60, y: 50 }]
}

var run = {
    CHL: '制冷机', CHWP: '冷冻泵', CWP: '冷却塔'
}

var position = {
    Chiller: [{ hight: 93, width: 172 }],
    Pumps: [{ hight: 51, width: 30 }],
    Tower: [{ hight: 64, width: 60 }], Valve: [{ hight: 17, width: 12 }]
}

var ns = 'http://www.w3.org/2000/svg';
export default class Cold {
    static createSvg (data, that) {
        that.dialogVisible = true;
        $('#drawing').html("");
        var svg = Snap("#svg");
        var div = document.getElementById('drawing');
        var svg = document.createElementNS(ns, 'svg');
        if (data.controls.hasOwnProperty('size')) {
            svg.setAttributeNS(null, 'width', data.controls.size.split(',')[0] + 'px');
            svg.setAttributeNS(null, 'height', data.controls.size.split(',')[1] + 'px');
        } else {
            svg.setAttributeNS(null, 'width', '1200px');
            svg.setAttributeNS(null, 'height', '800px');
        }
        div.appendChild(svg);
        if (data.controls.hasOwnProperty('device')) {
            for (var i = 0; i < data.controls.device.length; i++) {
                switch (data.controls.device[i].type) {
                    case 'C.Pumps': case 'Pumps':
                        drawingTools.Pumps(svg, 0, data.controls.device[i].text, data.controls.device[i].X_Y.split(',')[0], data.controls.device[i].X_Y.split(',')[1]);
                        break;
                    case 'C.Chiller': case 'Chiller':
                        drawingTools.Chiller(svg, 0, data.controls.device[i].text, data.controls.device[i].X_Y.split(',')[0], data.controls.device[i].X_Y.split(',')[1]);
                        break;
                    case 'C.Tower': case 'Tower':
                        drawingTools.Tower(svg, 0, data.controls.device[i].text, data.controls.device[i].X_Y.split(',')[0], data.controls.device[i].X_Y.split(',')[1]);
                        break;
                    case 'C.Valve': case 'Valve':
                        drawingTools.Valve(svg, data.controls.device[i].text, data.controls.device[i].X_Y.split(',')[0], data.controls.device[i].X_Y.split(',')[1]);
                        break;
                    default:
                        console.log(data.controls.device[i].type);
                        break;
                }
                // if (GroupCtSt.indexOf(data.controls.device[i].text) == -1) {
                //     GroupCtSt += data.controls.device[i].text + ";";
                // }
            }
        }
        if (data.controls.hasOwnProperty('label')) {
            for (var i = 0; i < data.controls.label.length; i++) {
                drawingTools.Label(svg, data.controls.label[i].text, data.controls.label[i].X_Y.split(',')[0], data.controls.label[i].X_Y.split(',')[1], data.controls.label[i].size);
            }
        }
        if (data.controls.hasOwnProperty('arrow')) {
            for (var i = 0; i < data.controls.arrow.length; i++) {
                drawingTools.Arrow(svg, data.controls.arrow[i].direction, '', data.controls.arrow[i].X_Y.split(',')[0], data.controls.arrow[i].X_Y.split(',')[1]);
            }
        }
        if (data.controls.hasOwnProperty('grid')) {
            for (var i = 0; i < data.controls.grid.length; i++) {
                drawingTools.Grid(svg, data.controls.grid[i].X_Y.split(',')[0], data.controls.grid[i].X_Y.split(',')[1], data.controls.grid[i].read);
            }
        }
        if (data.controls.hasOwnProperty('line')) {
            for (var i = 0; i < data.controls.line.length; i++) {
                drawingTools.Line(svg, data.controls.line[i].X_Y.split(',')[0], data.controls.line[i].X_Y.split(',')[1], data.controls.line[i].len, data.controls.line[i].op);
            }
        }

        //if (!data.controls.hasOwnProperty('line') || !data.controls.hasOwnProperty('device') || !data.controls.hasOwnProperty('label') || !data.controls.hasOwnProperty('arrow') || !data.controls.hasOwnProperty('grid')) {
        //    console.log(b_id + '_' + data.controls);
        //}
        if (data.controls.hasOwnProperty('pipe')) {
            var pipes = data.controls.pipe;
            for (var i = 0; i < pipes.length; i++) {
                //debugger
                if (pipes[i].hasOwnProperty('io')) {//pipes[i].pt != '' &&
                    var points = '';
                    var io = pipes[i].io;
                    var pipe_text = pipes[i].text;
                    Cold.pipeNames(pipe_text);
                    //console.log(io);
                    for (var n = 0; n < pipes.length; n++) {
                        if (pipes[i].pt == pipes[n].text) {
                            Cold.connectPipe(svg, pipes, i, n);
                        }
                    }
                    if (io == '开' || io == '关') { continue; }
                    else {
                        var ptx = 0, pty = 0;
                    }
                    for (var j = 0; j < io.split(',').length; j++) {
                        var add = io.split(',')[j];
                        var name = add.substring(0, 5);

                        var x = $("image[name='" + name + "']").attr("x");
                        var y = $("image[name='" + name + "']").attr("y");
                        if (j != 0 && pipes[i].op.indexOf('竖') > -1 && (name.indexOf('冷却泵') > -1 || name.indexOf('冷冻泵') > -1)) {
                            points += (pipes[i].X_Y.split(',')[0] + ' ' + (parseInt(y) + 40) + ',');
                        }
                        else if (j != 0 && name.indexOf('制冷机') > -1 && add.indexOf('进A') > -1) {
                            points += (pipes[i].X_Y.split(',')[0] + ' ' + (parseInt($("image[name='" + (j + 1) + "#冷机冷却水阀']").attr("y")) + 10) + ',');//10
                        }
                        else if (j != 0 && name.indexOf('制冷机') > -1 && add.indexOf('进B') > -1) {  //
                            points += (pipes[i].X_Y.split(',')[0] + ' ' + (parseInt($("image[name='" + (j + 1) + "#冷机冷却水阀']").attr("y")) + 30) + ',');//10
                        }
                        else if (j != 0 && name.indexOf('冷却塔') > -1) {
                            if (add.indexOf('出B') > -1) {
                                points += (pipes[i].X_Y.split(',')[0] + ' ' + (parseInt(y) + 55) + ',');
                            }
                            else if (add.indexOf('出A') > -1) {
                                points += (pipes[i].X_Y.split(',')[0] + ' ' + (parseInt(y) + 40) + ',');
                            }
                            else if (add.indexOf('进A') > -1) {
                                points += (pipes[i].X_Y.split(',')[0] + ' ' + (parseInt(y) + 20) + ',');
                            }
                        }
                        else if (j != 0 && name.indexOf('制冷机') > -1 && add.indexOf('出B') > -1) {
                            points += (pipes[i].X_Y.split(',')[0] + ' ' + (parseInt($("image[name='" + (j + 1) + "#制冷机']").attr("y")) + chiller.出B[0].y) + ',');//10
                        }
                        else if (j != 0 && name.indexOf('制冷机') > -1 && add.indexOf('出A') > -1) {
                            points += (pipes[i].X_Y.split(',')[0] + ' ' + (parseInt($("image[name='" + (j + 1) + "#制冷机']").attr("y")) + chiller.出A[0].y) + ',');
                        }
                        var pipex = 0, pipey = 0;
                        if (name.indexOf('制冷机') > -1) {
                            if (add.indexOf('进A') > -1) {
                                pipey = parseInt($("image[name='" + (j + 1) + "#冷机冷却水阀']").attr("y")) + 10;
                                pipex = parseInt($("image[name='" + (j + 1) + "#冷机冷却水阀']").attr("x")) + 20;
                            }
                            else if (add.indexOf('进B') > -1) {
                                pipey = parseInt($("image[name='" + (j + 1) + "#冷机冷冻水阀']").attr("y")) + 10;
                                pipex = parseInt($("image[name='" + (j + 1) + "#冷机冷冻水阀']").attr("x")) - 5;
                            }
                            else if (add.indexOf('出B') > -1) {
                                pipex = parseInt($("image[name='" + (j + 1) + "#制冷机']").attr("x")) + chiller.出B[0].x;
                                pipey = parseInt($("image[name='" + (j + 1) + "#制冷机']").attr("y")) + chiller.出B[0].y;
                            }
                            else if (add.indexOf('出A') > -1) {
                                pipex = parseInt($("image[name='" + (j + 1) + "#制冷机']").attr("x")) + chiller.出A[0].x;
                                pipey = parseInt($("image[name='" + (j + 1) + "#制冷机']").attr("y")) + chiller.出A[0].y;
                            }
                        }
                        else if (name.indexOf('冷却泵') > -1) {
                            if (add.indexOf('进') > -1) {
                                pipex = parseInt(x);
                            }
                            else {
                                pipex = parseInt(x) + 30;
                            }
                            pipey = parseInt(y) + 40;
                        }
                        else if (name.indexOf('冷冻泵') > -1) {
                            if (add.indexOf('进') > -1) {
                                pipex = parseInt(x) + 30;
                            }
                            else {
                                pipex = parseInt(x);
                            }
                            pipey = parseInt(y) + 40;
                        }
                        else if (name.indexOf('冷却塔') > -1) {
                            if (add.indexOf('出A') > -1) {
                                pipex = parseInt(x) + 60;
                                pipey = parseInt(y) + 40;
                            } else if (add.indexOf('出B') > -1) {
                                pipex = parseInt(x) + 60;
                                pipey = parseInt(y) + 55;
                            }
                            else if (add.indexOf('进A') > -1) {
                                pipex = parseInt(x) + 10
                                pipey = parseInt(y) + 18;
                            }
                        }
                        else { continue; }
                        if (!pipex || !pipey) {
                            //  alert(pipey + ';' + j);
                        }
                        points += (pipex + ' ' + pipey + ',')
                        if (pipes[i].op.indexOf('竖') > -1) {
                            points += (pipes[i].X_Y.split(',')[0] + ' ' + pipey + ',');
                        } else {
                            points += (pipes[i].X_Y.split(',')[0] + ' ' + (parseInt(pipey) - 15) + ',');
                        }
                    }
                    var colour = pipes[i].op.substring(0, 1);
                    switch (colour) {
                        case '红':
                            colour = colours.红;
                            break;
                        case '紫':
                            colour = colours.紫;
                            break;
                        case '蓝':
                            colour = colours.蓝;
                            break;
                        case '青':
                            colour = colours.青;
                            break;
                        case '绿':
                            colour = colours.绿;
                            break;
                        case '橙':
                            colour = colours.橙;
                            break;
                        default: colour = colours.黑; break;
                    }
                    points = points.substring(0, points.length - 1);

                    var polyline = document.createElementNS(ns, 'polyline');
                    polyline.setAttributeNS(null, 'points', points);
                    polyline.setAttributeNS(null, 'name', pipe_text);
                    if (ispolyline) {
                        polyline.setAttributeNS(null, 'class', "runing");
                    }
                    // if (pipes[i].text.indexOf('冷却泵进') > -1) {
                    //     polyline.setAttributeNS(null, 'class', "runing");
                    // }
                    // polyline.setAttributeNS(null, 'name', "runing");
                    polyline.setAttributeNS(null, 'style', 'fill:white;stroke:' + colour + ';stroke-width:2.5;fill-opacity:0');
                    svg.appendChild(polyline);
                }
            }
        }
        if (data.controls.hasOwnProperty('device')) {
            for (var i = 0; i < data.controls.device.length; i++) {
                switch (data.controls.device[i].type) {
                    case 'C.Pumps': case 'Pumps':

                        drawingTools.Pumps(svg, 0, data.controls.device[i].text, data.controls.device[i].X_Y.split(',')[0], data.controls.device[i].X_Y.split(',')[1]);
                        break;
                    case 'C.Chiller': case 'Chiller':
                        drawingTools.Chiller(svg, 0, data.controls.device[i].text, data.controls.device[i].X_Y.split(',')[0], data.controls.device[i].X_Y.split(',')[1]);
                        break;
                    case 'C.Tower': case 'Tower':
                        drawingTools.Tower(svg, 0, data.controls.device[i].text, data.controls.device[i].X_Y.split(',')[0], data.controls.device[i].X_Y.split(',')[1]);
                        break;
                    case 'C.Valve': case 'Valve':
                        drawingTools.Valve(svg, data.controls.device[i].text, data.controls.device[i].X_Y.split(',')[0], data.controls.device[i].X_Y.split(',')[1]);
                        break;
                    default:
                        console.log(data.controls.device[i].type);
                        break;
                }
                // if (GroupCtSt.indexOf(data.controls.device[i].text) == -1) {
                //     GroupCtSt += data.controls.device[i].text + ";";
                // }
            }
        }
        // if (data.controls.hasOwnProperty('label')) {
        //     for (var i = 0; i < data.controls.label.length; i++) {
        //         drawingTools.Label(svg, data.controls.label[i].text, data.controls.label[i].X_Y.split(',')[0], data.controls.label[i].X_Y.split(',')[1], data.controls.label[i].size);
        //     }
        // }
        // if (data.controls.hasOwnProperty('arrow')) {
        //     for (var i = 0; i < data.controls.arrow.length; i++) {
        //         drawingTools.Arrow(svg, data.controls.arrow[i].direction, '', data.controls.arrow[i].X_Y.split(',')[0], data.controls.arrow[i].X_Y.split(',')[1]);
        //     }
        // }
        // if (data.controls.hasOwnProperty('grid')) {
        //     for (var i = 0; i < data.controls.grid.length; i++) {
        //         drawingTools.Grid(svg, data.controls.grid[i].X_Y.split(',')[0], data.controls.grid[i].X_Y.split(',')[1], data.controls.grid[i].read);
        //     }
        // }
        // if (data.controls.hasOwnProperty('line')) {
        //     for (var i = 0; i < data.controls.line.length; i++) {
        //         drawingTools.Line(svg, data.controls.line[i].X_Y.split(',')[0], data.controls.line[i].X_Y.split(',')[1], data.controls.line[i].len, data.controls.line[i].op);
        //     }
        // }
    }
    static connectPipe (svg, pipes, i, n) {
        let pipesa = pipes[i];
        let pipesb = pipes[n];
        var points = '', colour = pipesa.op.substring(0, 1);
        if (pipesa.io == '开' || pipesa.io == '关') {
            points += (pipesa.X_Y.split(',')[0] + ' ' + pipesb.X_Y.split(',')[1] + ',');
            var x1 = pipesa.X_Y.split(',')[0];
            var y1 = pipesa.X_Y.split(',')[1];
            var x2 = pipesb.X_Y.split(',')[0];
            var y2 = pipesb.X_Y.split(',')[1];
            if (pipesa.op.indexOf('横') > -1) {
                y1 = y2;
                points += (x2 + ' ' + y1 + ',');
            }
        }
        else {
            if (pipesa.op.indexOf('竖') > -1) {
                var y = 0, x = 0;
                var x1 = pipesa.X_Y.split(',')[0], y1 = pipesa.X_Y.split(',')[1], x2 = pipesb.X_Y.split(',')[0], y2 = pipesb.X_Y.split(',')[1];
                if (parseInt(y1) < parseInt(y2)) {
                    y = y1;
                } else {
                    y = y2;
                }
                if (pipesa.pt != "" && pipesa.text == '制冷机出A') {

                    points += (x1 + ' ' + (parseInt($("image[name='" + pipesa.io.split(',')[0].substring(0, 5) + "']").attr("y")) + chiller.出A[0].y) + ',');
                }
                if (parseInt(x1) > parseInt(x2)) {
                    points = points += (x1 + ' ' + y + ',');
                    points = points += (x2 + ' ' + y + ',');
                }
                else {
                    points = points += (x2 + ' ' + y + ',');
                    points = points += (x1 + ' ' + y + ',');
                }
                var yf = $("image[name='" + pipesa.io.split(',')[0].substring(0, 5) + "']").attr("y");
                var ye = $("image[name='" + pipesa.io.split(',')[pipesa.io.split(',').length - 1].substring(0, 5) + "']").attr("y");
                yf = parseInt(ye) + tower.进A[0].y;
                if (parseInt(x1) > parseInt(x2)) {
                    points += (x2 + ' ' + yf + ',');
                } else {
                    points += (x1 + ' ' + yf + ',');
                }
            }
            else if (pipesa.op.indexOf('竖') > -1) {
            }
        }
        switch (colour) {
            case '红':
                colour = colours.红;
                break;
            case '紫':
                colour = colours.紫;
                break;
            case '蓝':
                colour = colours.蓝;
                break;
            case '青':
                colour = colours.青;
                break;
            case '绿':
                colour = colours.绿;
                break;
            case '橙':
                colour = colours.橙;
                break;
            default: colour = colours.黑;
                break;
        }
        points = points.substring(0, points.length - 1);
        var ns = 'http://www.w3.org/2000/svg';
        var polyline = document.createElementNS(ns, 'polyline');
        polyline.setAttributeNS(null, 'points', points);
        if (ispolyline) {
            polyline.setAttributeNS(null, 'class', "runing");
        }
        //   if (pipes[i].text.indexOf('冷却泵进') > -1) {
        //       polyline.setAttributeNS(null, 'class', "runing");
        //   }
        polyline.setAttributeNS(null, 'style', 'fill:white;stroke:' + colour + ';stroke-width:2.5;fill-opacity:0');
        svg.appendChild(polyline);

    }

    static setNameVal (obj) {
        let pz = 'CHL1_START';
        let CHWP_VFD_PWR = 0, CWP_VFD_PWR = 0, CT_VFD_PWR = 0, ZFH = 0, CHW_TD = 0, CHW_FLOW = 0, LFH = 0, CHL_PWR = 0, ZGL = 0, CHW_ST = 0, CHW_RT = 0;
        let address, v;
        for (var i = 0; i < obj.length; i++) {
            address = obj[i].Address.replace("/","_");
            // console.log("测试："+address)
            // if (address=="CHL1_PWR"){
            //     debugger
            // }
            if(!address){continue;}
            v = obj[i].val;
            let unit = $("text[name=" + address + "]").attr("unit");
           // console.log("Address："+ address +";unit："+unit);
            if (typeof ($("text[name=" + address + "]").attr("unit")) != "undefined") {
                $("text[name='" + address + "']").html(v + unit);
            }
            // if ((address.indexOf('PWR') > -1 || address.indexOf('COP') > -1)&&address) {
            //     continue;
            // }
            if (address.substring(0, 3).indexOf('CHL') > -1) {
                if (address.indexOf('_ALM') > -1 && v != 0) {
                    $('text[name=CHL' + address.substring(3, 4) + '_ALM]').show();
                    $('rect[name=CHL' + address.substring(3, 4) + '_ALM]').show();
                }
                if(address.indexOf('_PWR') > -1 && v > 0 && address.length >= 8){
                $("image[name='" + address.substring(3, 4) + "#制冷机']").attr('href', filePath + 'Chl1.png');
                Cold.runers(address.substring(3, 4) + "#制冷机");}
            }
            if (address.substring(0, 4).indexOf('CHWP') > -1&&address.indexOf('_PWR') > -1 && v > 0 && address.length >= 9) {
                $("image[name='" + address.substring(4, 5) + "#冷冻泵']").attr('href', filePath + 'Cwp1.png');
                Cold.runers(address.substring(4, 5) + "#冷冻泵");
            }
            else if (address.substring(0, 3).indexOf('CWP') > -1 && address.indexOf('_PWR') > -1 && v > 0 && address.length >= 8) {
                $("image[name='" + address.substring(3, 4) + "#冷却泵']").attr('href', filePath + 'Cwp1.png');
                Cold.runers(address.substring(3, 4) + "#冷却泵");
            }
            else if (address.substring(0, 2).indexOf('CT') > -1&& address.indexOf('_PWR') > -1 && v > 0 && address.length >= 7) {
                $("image[name='" + address.substring(2, 3) + "#冷却塔']").attr('href', filePath + 'Ct1.png');
                $("image[name='" + address.substring(2, 3) + "#冷却塔fs']").show();
                Cold.runers(address.substring(2, 3) + "#冷却塔");
            }
            continue;
            // if (d[i].Address.indexOf('CHW_TD') > -1) { CHW_TD = v; }
            if (tobj.Address.indexOf('CHW_FLOW') > -1) { CHW_FLOW = v; }
            if (tobj.Address == 'CHW_ST') { CHW_ST = v; }
            if (tobj.Address.indexOf('CHW_RT') > -1) { CHW_RT = v; }
            if (CHW_RT != 0 && CHW_ST != 0 && CHW_FLOW != 0 && LFH == 0) {
                LFH = (parseInt(CHW_RT) - parseInt(CHW_ST)) * parseInt(CHW_FLOW) * 1.167;
                // console.log("CHW_RT:" + CHW_RT + ";CHW_FLOW:" + CHW_FLOW + "CHW_ST:" + CHW_ST);
                $('a[name=LFH]').html(LFH);
                //$('a[name=CHW_TD]').html(parseInt(CHW_RT) - parseInt(CHW_ST));
            }
            if (tobj.Address.indexOf('_PWR') > -1) {
                if (tobj.Address.indexOf('CHWP') > -1) { CHWP_VFD_PWR += parseInt(v); $('a[name=CHWP_VFD_PWR]').html(CHWP_VFD_PWR); }

                else if (tobj.Address.indexOf('CWP') > -1) {
                    CWP_VFD_PWR += parseInt(v); $('a[name=CWP_VFD_PWR]').html(CWP_VFD_PWR);
                }
                else if (tobj.Address.indexOf('CT') > -1) {
                    CT_VFD_PWR += parseInt(v); $('a[name=CT_VFD_PWR]').html(CT_VFD_PWR);
                }
                else if (tobj.Address.indexOf('CHL') > -1) {
                    CHL_PWR += parseInt(v); $('a[name=CHL_PWR]').html(CHL_PWR);
                }
                if (CHL_PWR != 0 && CHWP_VFD_PWR != 0 && CWP_VFD_PWR != 0 && CT_VFD_PWR != 0) {
                    ZGL = (CHL_PWR + CHWP_VFD_PWR + CWP_VFD_PWR + CT_VFD_PWR);
                    $('a[name=ZGL]').html(ZGL);
                    if (LFH != 0) {
                        $('a[name=CHL_PWR_COP]').html((LFH / CHL_PWR).toFixed(2) - 0);
                        $('a[name=CHWP_VFD_PWR_COP]').html((LFH / CHWP_VFD_PWR).toFixed(2) - 0);
                        $('a[name=CWP_VFD_PWR_COP]').html((LFH / CWP_VFD_PWR).toFixed(2) - 0);
                        $('a[name=CT_VFD_PWR_COP]').html((LFH / CT_VFD_PWR).toFixed(2) - 0);
                    }
                }
                if (LFH != 0 && ZGL != 0) {
                    //  console.log("ZGL:" + ZGL + ",LFH:" + LFH);
                    option.series[0].data[0].value = ((1 - (ZGL / LFH)) * 100).toFixed(2) - 0;
                    myChart.setOption(option, true);
                }
            }
            else if ($("text[name='" + tobj.Address + "']").length == 0 || $("a[name='" + tobj.Address + "']").length == 1) {
                //  $scope.showData(tobj.Address , v);
                console.log(d[i].Address + ';' + v);
                // continue;
            }
            //是否就地---
            if (d[i].Address.indexOf('CHWP') > -1 && d[i].Address.indexOf('_VFD_ALM') > -1) {
                $('rect[name=' + tobj.Address + ']').show();
                $('text[name=' + tobj.Address + ']').show();
                if (v == 1) {
                    $('text[name=' + tobj.Address + ']').html('报警');
                    $("image[name='" + tobj.Address.substring(4, 5) + "#冷冻泵']").attr('href', filePath + 'Cwp2.png');
                }
                else { $('text[name=' + tobj.Address + ']').html('就地'); }
            }
            else if (tobj.Address.indexOf('CWP') > -1 && tobj.Address.indexOf('_VFD_ALM') > -1) {
                $('rect[name=' + tobj.Address + ']').show();
                $('text[name=' + tobj.Address + ']').show();
                if (v == 1) { $('text[name=' + tobj.Address + ']').html('报警'); }
                else { $('text[name=' + tobj.Address + ']').html('就地'); }
            }
            //---
            if (tobj.Address.indexOf('RUN_MODE') > -1) {
                console.log(tobj.Address + ';' + v);
            }
        }
    }



    static runers (v) {

        if (runer.indexOf(v) == -1) {
            runer += (v + ';');
            // console.log('runer:'+runer);
        }
    }

    static pipeNames (v) {

        if (pipeName.indexOf(v) == -1) {
            pipeName += (v + ';');
            // console.log('pipeName:'+pipeName);
        }
    }

    static getRuners () {
        return runer;
    }
}
