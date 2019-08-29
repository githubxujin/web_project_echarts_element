/**
 * 画图工具
 */
var filePath = '../../../static/img/coldTools/';
var ns = 'http://www.w3.org/2000/svg';

var colours = {
    黑: 'Black',
    红: 'Red',
    紫: 'Magenta',
    蓝: 'Blue',
    青: 'Cyan',
    绿: 'Green',
    橙: 'Orange'
};
var names = {
    制冷机: [{ upper: 'CHL-_PWR_PER', lower: 'CHL-_PWR' }],
    冷冻泵: [{ upper: 'CHWP-_FRQ', lower: 'CHWP-_PWR' }],
    冷却泵: [{ upper: 'CWP-_FRQ', lower: 'CWP-_PWR' }],
    冷却塔: [{ upper: 'CT-_FRQ', lower: 'CT-_PWR' }]
};
export default class drawingTools {
    //单组件
    static Text (svg, t, x, y, size) {
        var rect0 = document.createElementNS(ns, 'rect');
        rect0.setAttributeNS(null, 'width', 90); //60
        rect0.setAttributeNS(null, 'height', 18);
        rect0.setAttributeNS(null, 'fill', '#3887E3');
        rect0.setAttributeNS(null, 'x', x);
        rect0.setAttributeNS(null, 'y', y);
        svg.appendChild(rect0);

        var text0 = document.createElementNS(ns, 'text');

        text0.setAttributeNS(null, 'fill', '#ffffff');
        text0.setAttributeNS(null, 'x', parseInt(x) + 3);
        text0.setAttributeNS(null, 'y', parseInt(y) + 12);
        text0.setAttributeNS(null, 'font-size', '13');
        text0.setAttributeNS(null, 'style', 'fill:#ffffff;font-weight:bold;');
        text0.textContent = t;
        svg.appendChild(text0);
    }

    static Img (svg, type, t, x, y, w, h) {
        var path = '';
        var image = document.createElementNS(ns, 'image');
        image.setAttributeNS(null, 'width', w);
        image.setAttributeNS(null, 'height', h);
        image.setAttributeNS(null, 'x', x);
        image.setAttributeNS(null, 'y', y);
        image.setAttributeNS(null, 'href', path);
        svg.appendChild(image);
    }

    static Label (svg, t, x, y, size) {
        var text0 = document.createElementNS(ns, 'text');
        text0.setAttributeNS(null, 'fill', '#3887E3');
        text0.setAttributeNS(null, 'x', parseInt(x) + 3);
        text0.setAttributeNS(null, 'y', parseInt(y) + 12);
        text0.setAttributeNS(null, 'font-size', '13');
        if (size != 0) {
            text0.setAttributeNS(null, 'font-size', size);
        }
        text0.setAttributeNS(null, 'style', 'font-weight:bold;');
        text0.textContent = t;
        svg.appendChild(text0);
    }
    //多组件
    static Chiller (svg, type, t, x, y) {
        var g = document.createElementNS(ns, 'g');
        svg.appendChild(g);
        var title = document.createElementNS(ns, 'title');
        title.textContent = t;
        g.appendChild(title);
      //  console.log(filePath + 'Chiller_172_93.png');
        var path1 = filePath + 'Chiller_172_93.png';
        var image = document.createElementNS(ns, 'image');
        image.setAttributeNS(null, 'width', 172);
        image.setAttributeNS(null, 'height', 93);
        image.setAttributeNS(null, 'x', x);
        image.setAttributeNS(null, 'y', y);
        image.setAttributeNS(null, 'name', t);
        image.setAttributeNS(null, 'href', path1);
        g.appendChild(image);

        var image_text = document.createElementNS(ns, 'text');

        image_text.setAttributeNS(null, 'fill', '#FFFFFF');
        image_text.setAttributeNS(null, 'x', parseInt(x) + 55);
        image_text.setAttributeNS(null, 'y', parseInt(y) + 65);
        image_text.setAttributeNS(null, 'font-size', '17');
        image_text.setAttributeNS(null, 'style', 'font-weight:bold;');

        image_text.textContent = t;
        g.appendChild(image_text);

        var rect0 = document.createElementNS(ns, 'rect');
        rect0.setAttributeNS(null, 'width', 60);
        rect0.setAttributeNS(null, 'height', 18);
        rect0.setAttributeNS(null, 'fill', '#3887E3');
        rect0.setAttributeNS(null, 'x', parseInt(x) + 60);
        rect0.setAttributeNS(null, 'y', parseInt(y) + 80);
        g.appendChild(rect0);

        var text0 = document.createElementNS(ns, 'text');

        text0.setAttributeNS(null, 'fill', '#FFFFFF');
        text0.setAttributeNS(null, 'x', parseInt(x) + 66);
        text0.setAttributeNS(null, 'y', parseInt(y) + 93);
        text0.setAttributeNS(null, 'font-size', '13');
        text0.setAttributeNS(null, 'style', 'font-weight:bold;');
        text0.setAttributeNS(
            null,
            'name',
            names.制冷机[0].upper.replace('-', t.substring(0, 1))
        );
        text0.setAttributeNS(null, 'unit', '%');
        text0.textContent = '0%';
        g.appendChild(text0);

        var rect1 = document.createElementNS(ns, 'rect');
        rect1.setAttributeNS(null, 'width', 60);
        rect1.setAttributeNS(null, 'height', 18);
        rect1.setAttributeNS(null, 'fill', '#3887E3');
        rect1.setAttributeNS(null, 'x', parseInt(x) + 60);
        rect1.setAttributeNS(null, 'y', parseInt(y) + 103);
        g.appendChild(rect1);

        var text1 = document.createElementNS(ns, 'text');

        text1.setAttributeNS(null, 'fill', '#FFFFFF');
        text1.setAttributeNS(null, 'x', parseInt(x) + 66);
        text1.setAttributeNS(null, 'y', parseInt(y) + 115);
        text1.setAttributeNS(null, 'font-size', '13');
        text1.setAttributeNS(null, 'style', 'font-weight:bold;');
        text1.setAttributeNS(
            null,
            'name',
            names.制冷机[0].lower.replace('-', t.substring(0, 1))
        );
        text1.setAttributeNS(null, 'unit', 'kW');
        text1.textContent = '0kW';
        g.appendChild(text1);

        var rect_jd = document.createElementNS(ns, 'rect');
        rect_jd.setAttributeNS(null, 'width', 41);
        rect_jd.setAttributeNS(null, 'height', 18);
        rect_jd.setAttributeNS(null, 'fill', '#D3D3D3');
        rect_jd.setAttributeNS(null, 'x', parseInt(x) + 20);
        rect_jd.setAttributeNS(null, 'y', parseInt(y) - 3);
        rect_jd.setAttributeNS(null, 'style', 'font-weight:600;display: none;');
        rect_jd.setAttributeNS(
            null,
            'name',
            'CHL-_ALM'.replace('-', t.substring(0, 1))
        );

        g.appendChild(rect_jd);

        var text_jd = document.createElementNS(ns, 'text');
        text_jd.setAttributeNS(null, 'fill', '#3887E3');
        text_jd.setAttributeNS(null, 'x', parseInt(x) + 25);
        text_jd.setAttributeNS(null, 'y', parseInt(y) + 12);
        text_jd.setAttributeNS(null, 'font-size', '15');
        text_jd.setAttributeNS(null, 'style', 'font-weight:600;display: none;');
        text_jd.setAttributeNS(
            null,
            'name',
            'CHL-_ALM'.replace('-', t.substring(0, 1))
        );
        text_jd.textContent = '就地';
        g.appendChild(text_jd);
    }
    static Pumps (svg, type, t1, x, y) {
        var g = document.createElementNS(ns, 'g');
        svg.appendChild(g);
        var title = document.createElementNS(ns, 'title');
        title.textContent = t1;
        g.appendChild(title);
        var path1 = filePath + 'Pumps_30_51.png';
        var image = document.createElementNS(ns, 'image');
        image.setAttributeNS(null, 'width', 30);
        image.setAttributeNS(null, 'height', 51);
        image.setAttributeNS(null, 'x', x);
        image.setAttributeNS(null, 'y', y);
        image.setAttributeNS(null, 'name', t1);
        image.setAttributeNS(null, 'href', path1);
        g.appendChild(image);

        var image_text = document.createElementNS(ns, 'text');

        image_text.setAttributeNS(null, 'fill', '#FFFFFF');
        image_text.setAttributeNS(null, 'x', parseInt(x) + 6);
        image_text.setAttributeNS(null, 'y', parseInt(y) + 25);

        image_text.setAttributeNS(null, 'font-size', '15');
        image_text.setAttributeNS(
            null,
            'style',
            'fill:#FFFFFF;font-weight:bold;'
        );
        image_text.textContent = t1.substring(0, 2);

        g.appendChild(image_text);

        var rect0 = document.createElementNS(ns, 'rect');
        rect0.setAttributeNS(null, 'width', 60);
        rect0.setAttributeNS(null, 'height', 18);
        rect0.setAttributeNS(null, 'fill', '#3887E3');
        rect0.setAttributeNS(null, 'x', parseInt(x) - 15);
        rect0.setAttributeNS(null, 'y', parseInt(y) + 55);
        g.appendChild(rect0);

        var text0 = document.createElementNS(ns, 'text');

        text0.setAttributeNS(null, 'fill', '#FFFFFF');
        text0.setAttributeNS(null, 'x', parseInt(x) - 7);
        text0.setAttributeNS(null, 'y', parseInt(y) + 70);
        text0.setAttributeNS(null, 'font-size', '13');
        text0.setAttributeNS(null, 'style', 'fill:#FFFFFF;font-weight:bold;');
        if (t1.indexOf('却') > -1) {
            text0.setAttributeNS(
                null,
                'name',
                names.冷却泵[0].upper.replace('-', t1.substring(0, 1))
            );
        } else {
            text0.setAttributeNS(
                null,
                'name',
                names.冷冻泵[0].upper.replace('-', t1.substring(0, 1))
            );
        }

        text0.setAttributeNS(null, 'unit', 'Hz');
        text0.textContent = '0Hz';
        g.appendChild(text0);

        var rect1 = document.createElementNS(ns, 'rect');
        rect1.setAttributeNS(null, 'width', 60);
        rect1.setAttributeNS(null, 'height', 18);
        rect1.setAttributeNS(null, 'fill', '#3887E3');
        rect1.setAttributeNS(null, 'x', parseInt(x) - 15);
        rect1.setAttributeNS(null, 'y', parseInt(y) + 80);
        g.appendChild(rect1);

        var text1 = document.createElementNS(ns, 'text');

        text1.setAttributeNS(null, 'fill', '#FFFFFF');
        text1.setAttributeNS(null, 'x', parseInt(x) - 7);
        text1.setAttributeNS(null, 'y', parseInt(y) + 95);
        text1.setAttributeNS(null, 'font-size', '13');
        text1.setAttributeNS(null, 'style', 'fill:#FFFFFF;font-weight:bold;');
        if (t1.indexOf('却') > -1) {
            text1.setAttributeNS(
                null,
                'name',
                names.冷却泵[0].lower.replace('-', t1.substring(0, 1))
            );
        } else {
            text1.setAttributeNS(
                null,
                'name',
                names.冷冻泵[0].lower.replace('-', t1.substring(0, 1))
            );
        }
        text1.setAttributeNS(null, 'unit', 'kW');
        text1.textContent = '0kW';
        g.appendChild(text1);

        var rect_jd = document.createElementNS(ns, 'rect');
        rect_jd.setAttributeNS(null, 'width', 41);
        rect_jd.setAttributeNS(null, 'height', 18);
        rect_jd.setAttributeNS(null, 'fill', '#D3D3D3');
        rect_jd.setAttributeNS(null, 'x', parseInt(x) - 40);
        rect_jd.setAttributeNS(null, 'y', parseInt(y) - 3);
        rect_jd.setAttributeNS(null, 'style', 'font-weight:600;display: none;');
        rect_jd.setAttributeNS(
            null,
            'name',
            'CHWP-_VFD_ALM'.replace('-', t1.substring(0, 1))
        );
        var text_jd = document.createElementNS(ns, 'text');
        text_jd.setAttributeNS(null, 'fill', '#3887E3');
        text_jd.setAttributeNS(null, 'x', parseInt(x) - 35);
        text_jd.setAttributeNS(null, 'y', parseInt(y) + 12);
        text_jd.setAttributeNS(null, 'font-size', '15');
        text_jd.setAttributeNS(null, 'style', 'font-weight:600;display: none;');
        text_jd.setAttributeNS(
            null,
            'name',
            'CHWP-_VFD_ALM'.replace('-', t1.substring(0, 1))
        );
        if (t1.indexOf('却') > -1) {
            rect_jd.setAttributeNS(
                null,
                'name',
                'CWP-_VFD_ALM'.replace('-', t1.substring(0, 1))
            );
            text_jd.setAttributeNS(
                null,
                'name',
                'CWP-_VFD_ALM'.replace('-', t1.substring(0, 1))
            );
        } else {
            rect_jd.setAttributeNS(
                null,
                'name',
                'CHWP-_VFD_ALM'.replace('-', t1.substring(0, 1))
            );
            text_jd.setAttributeNS(
                null,
                'name',
                'CHWP-_VFD_ALM'.replace('-', t1.substring(0, 1))
            );
        }
        text_jd.textContent = '就地';
        g.appendChild(rect_jd);
        g.appendChild(text_jd);
    }

    static Tower (svg, type, t1, x, y) {
        var g = document.createElementNS(ns, 'g');
        svg.appendChild(g);
        var title = document.createElementNS(ns, 'title');
        title.textContent = t1;
        g.appendChild(title);

        var path1 = filePath + 'Tower_60_64.png';
        var image = document.createElementNS(ns, 'image');
        image.setAttributeNS(null, 'width', 60);
        image.setAttributeNS(null, 'height', 64);
        image.setAttributeNS(null, 'x', x);
        image.setAttributeNS(null, 'y', y);
        image.setAttributeNS(null, 'name', t1);
        image.setAttributeNS(null, 'href', path1);
        g.appendChild(image);

        var path_fan = filePath + 'fs.gif';
        var image_fan = document.createElementNS(ns, 'image');
        image_fan.setAttributeNS(null, 'width', 15);
        image_fan.setAttributeNS(null, 'height', 15);
        image_fan.setAttributeNS(null, 'x', parseInt(x) + 23);
        image_fan.setAttributeNS(null, 'y', parseInt(y) + 5);
        image_fan.setAttributeNS(null, 'href', path_fan);
        image_fan.setAttributeNS(null, 'style', 'display: none');
        image_fan.setAttributeNS(null, 'name', t1 + 'fs');
        g.appendChild(image_fan);

        var image_text = document.createElementNS(ns, 'text');
        image_text.setAttributeNS(null, 'fill', '#FFFFFF');
        image_text.setAttributeNS(null, 'x', parseInt(x) + 20);
        image_text.setAttributeNS(null, 'y', parseInt(y) + 50);

        image_text.setAttributeNS(null, 'font-size', '15');
        image_text.setAttributeNS(null, 'style', 'font-weight:bold;');
        image_text.textContent = t1.substring(0, 2);

        g.appendChild(image_text);

        var rect0 = document.createElementNS(ns, 'rect');
        rect0.setAttributeNS(null, 'width', 60);
        rect0.setAttributeNS(null, 'height', 18);
        rect0.setAttributeNS(null, 'fill', '#3887E3');
        rect0.setAttributeNS(null, 'x', parseInt(x));
        rect0.setAttributeNS(null, 'y', parseInt(y) + 70);
        g.appendChild(rect0);

        var text0 = document.createElementNS(ns, 'text');

        text0.setAttributeNS(null, 'fill', '#FFFFFF');
        text0.setAttributeNS(null, 'x', parseInt(x) + 6);
        text0.setAttributeNS(null, 'y', parseInt(y) + 82);
        text0.setAttributeNS(null, 'font-size', '13');
        text0.setAttributeNS(null, 'style', 'font-weight:bold;');
        text0.setAttributeNS(
            null,
            'name',
            names.冷却塔[0].upper.replace('-', t1.substring(0, 1))
        );
        text0.setAttributeNS(null, 'unit', 'Hz');
        text0.textContent = '0Hz';
        g.appendChild(text0);

        var rect1 = document.createElementNS(ns, 'rect');
        rect1.setAttributeNS(null, 'width', 60);
        rect1.setAttributeNS(null, 'height', 18);
        rect1.setAttributeNS(null, 'fill', '#3887E3');
        rect1.setAttributeNS(null, 'x', parseInt(x));
        rect1.setAttributeNS(null, 'y', parseInt(y) + 90);
        g.appendChild(rect1);

        var text1 = document.createElementNS(ns, 'text');

        text1.setAttributeNS(null, 'fill', '#FFFFFF');
        text1.setAttributeNS(null, 'x', parseInt(x) + 6);
        text1.setAttributeNS(null, 'y', parseInt(y) + 103);
        text1.setAttributeNS(null, 'font-size', '13');
        text1.setAttributeNS(null, 'style', 'font-weight:bold;');
        text1.setAttributeNS(
            null,
            'name',
            names.冷却塔[0].lower.replace('-', t1.substring(0, 1))
        );
        text1.setAttributeNS(null, 'unit', 'kW');
        text1.textContent = '0kW';
        g.appendChild(text1);
    }

    static Valve (svg, t, x, y) {
        // console.log(x + ';' + y);
        var path1 = filePath + 'Valve_12_17.png';
        var image = document.createElementNS(ns, 'image');
        image.setAttributeNS(null, 'href', path1);
        image.setAttributeNS(null, 'width', 12);
        image.setAttributeNS(null, 'height', 17);
        image.setAttributeNS(null, 'x', x);
        image.setAttributeNS(null, 'y', y);
        image.setAttributeNS(null, 'name', t);
        svg.appendChild(image);
    }
    static Grid (svg, count, x, y, t0, t1, t2) {
        var svg_text = document.createElementNS(ns, 'svg');
        svg_text.setAttributeNS(null, 'width', '80px');
        svg_text.setAttributeNS(null, 'height', '80px');

        svg.appendChild(svg_text);

        var rect0 = document.createElementNS(ns, 'rect');
        rect0.setAttributeNS(null, 'width', 60);
        rect0.setAttributeNS(null, 'height', 18);
        rect0.setAttributeNS(null, 'fill', '#3887E3');
        rect0.setAttributeNS(null, 'x', x);
        rect0.setAttributeNS(null, 'y', y);
        svg_text.appendChild(rect0);

        var text0 = document.createElementNS(ns, 'text');

        text0.setAttributeNS(null, 'fill', '#ffffff');
        text0.setAttributeNS(null, 'x', parseInt(x) + 3);
        text0.setAttributeNS(null, 'y', parseInt(y) + 12);
        text0.setAttributeNS(null, 'font-size', '13');
        text0.setAttributeNS(null, 'style', 'fill:#ffffff;font-weight:bold;');
        text0.textContent = t0;
        svg_text.appendChild(text0);

        var rect1 = document.createElementNS(ns, 'rect');
        rect1.setAttributeNS(null, 'width', 60);
        rect1.setAttributeNS(null, 'height', 18);
        rect1.setAttributeNS(null, 'fill', '#3887E3');
        rect1.setAttributeNS(null, 'x', x);
        rect1.setAttributeNS(null, 'y', parseInt(y) + 20);
        svg_text.appendChild(rect1);

        var text1 = document.createElementNS(ns, 'text');

        text1.setAttributeNS(null, 'fill', '#ffffff');
        text1.setAttributeNS(null, 'x', parseInt(x) + 3);
        text1.setAttributeNS(null, 'y', parseInt(y) + 32);
        text1.setAttributeNS(null, 'font-size', '13');
        text1.setAttributeNS(null, 'style', 'fill:#ffffff;font-weight:bold;');
        text1.textContent = t1;
        svg_text.appendChild(text1);

        var rect2 = document.createElementNS(ns, 'rect');
        rect2.setAttributeNS(null, 'width', 60);
        rect2.setAttributeNS(null, 'height', 18);
        rect2.setAttributeNS(null, 'fill', '#3887E3');
        rect2.setAttributeNS(null, 'x', x);
        rect2.setAttributeNS(null, 'y', parseInt(y) + 40);
        svg_text.appendChild(rect2);

        var text2 = document.createElementNS(ns, 'text');

        text2.setAttributeNS(null, 'fill', '#ffffff');
        text2.setAttributeNS(null, 'x', parseInt(x) + 3);
        text2.setAttributeNS(null, 'y', parseInt(y) + 52);
        text2.setAttributeNS(null, 'font-size', '13');
        text2.setAttributeNS(null, 'style', 'fill:#ffffff;font-weight:bold;');
        text2.textContent = t2;
        svg_text.appendChild(text2);
    }

    static Arrow (svg, type, t, x, y) {
        var text = document.createElementNS(ns, 'text');
        text.setAttributeNS(null, 'x', x);
        text.setAttributeNS(null, 'y', y + 20);
        text.setAttributeNS(null, 'font-size', '17');
        text.setAttributeNS(null, 'style', 'fill:#3887E3;font-weight:bold;');
        text.textContent = t;
        svg.appendChild(text);
        var image = document.createElementNS(ns, 'image');
        type = type.toLowerCase();
        image.setAttributeNS(null, 'href', filePath + type + '.jpg');
        if (type == 'e' || type == 'w') {
            image.setAttributeNS(null, 'width', 45);
            image.setAttributeNS(null, 'height', 13);
            image.setAttributeNS(null, 'x', parseInt(x) - 5);
            image.setAttributeNS(null, 'y', parseInt(y) + 28);
        } else {
            image.setAttributeNS(null, 'width', 13);
            image.setAttributeNS(null, 'height', 45);
            image.setAttributeNS(null, 'x', parseInt(x) + 30);
            image.setAttributeNS(null, 'y', parseInt(y) + 22);
        }
        svg.appendChild(image);
    }
    static IceCan (svg, num, x, y) {
        var image0 = document.createElementNS(ns, 'image');
        image0.setAttributeNS(null, 'href', filePath + '/IceCan.png');
        image0.setAttributeNS(null, 'width', 75);
        image0.setAttributeNS(null, 'height', 132);
        image0.setAttributeNS(null, 'x', x);
        image0.setAttributeNS(null, 'y', y);
        svg.appendChild(image0);
        if (num == 2) {
            var image1 = document.createElementNS(ns, 'image');
            image1.setAttributeNS(null, 'href', filePath + '/IceCan.png');
            image1.setAttributeNS(null, 'width', 75);
            image1.setAttributeNS(null, 'height', 132);
            image1.setAttributeNS(null, 'x', parseInt(x) + 80);
            image1.setAttributeNS(null, 'y', y);
            svg.appendChild(image1);
        }
    }
    static Grid (svg, x, y, read) {
        for (var i = 0; i < read.length; i++) {
            var g = document.createElementNS(ns, 'g');
            svg.appendChild(g);
            var title = document.createElementNS(ns, 'title');
            title.textContent = read[i].text;
            g.appendChild(title);

            var rect = document.createElementNS(ns, 'rect');
            rect.setAttributeNS(null, 'width', 60);
            rect.setAttributeNS(null, 'height', 18);
            rect.setAttributeNS(null, 'fill', '#3887E3');
            rect.setAttributeNS(null, 'x', parseInt(x));
            rect.setAttributeNS(null, 'y', parseInt(y) + i * 20);
            g.appendChild(rect);

            var text = document.createElementNS(ns, 'text');

            text.setAttributeNS(null, 'fill', '#ffffff');
            text.setAttributeNS(null, 'x', parseInt(x) + 3);
            text.setAttributeNS(null, 'y', parseInt(y) + 12 + i * 20);
            text.setAttributeNS(null, 'font-size', '13');
            text.setAttributeNS(null, 'style', 'font-weight:bold;');
            text.setAttributeNS(null, 'name', read[i]._text);
            text.setAttributeNS(null, 'unit', read[i].unit);
            text.innerHTML = 0 + read[i].unit;
            g.appendChild(text);
        }

        //var rect0 = document.createElementNS(ns, 'rect');
        //rect0.setAttributeNS(null, 'width', 60);
        //rect0.setAttributeNS(null, 'height', 18);
        //rect0.setAttributeNS(null, 'fill', '#3887E3');
        //rect0.setAttributeNS(null, 'x', x);
        //rect0.setAttributeNS(null, 'y', y);
        //svg_text.appendChild(rect0);

        //var text0 = document.createElementNS(ns, 'text');

        //text0.setAttributeNS(null, 'fill', '#ffffff');
        //text0.setAttributeNS(null, 'x', parseInt(x) + 3);
        //text0.setAttributeNS(null, 'y', parseInt(y) + 12);
        //text0.setAttributeNS(null, 'font-size', '13');
        //text0.setAttributeNS(null, 'style', 'fill:#ffffff;font-weight:bold;');
        //text0.textContent = t1;
        //svg_text.appendChild(text0);

        //var rect1 = document.createElementNS(ns, 'rect');
        //rect1.setAttributeNS(null, 'width', 60);
        //rect1.setAttributeNS(null, 'height', 18);
        //rect1.setAttributeNS(null, 'fill', '#3887E3');
        //rect1.setAttributeNS(null, 'x', x);
        //rect1.setAttributeNS(null, 'y', parseInt(y) + 20);
        //svg_text.appendChild(rect1);

        //var text1 = document.createElementNS(ns, 'text');

        //text1.setAttributeNS(null, 'fill', '#ffffff');
        //text1.setAttributeNS(null, 'x', parseInt(x) + 3);
        //text1.setAttributeNS(null, 'y', parseInt(y) + 32);
        //text1.setAttributeNS(null, 'font-size', '13');
        //text1.setAttributeNS(null, 'style', 'fill:#ffffff;font-weight:bold;');
        //text1.textContent = t2;
        //svg_text.appendChild(text1);

        //var rect2 = document.createElementNS(ns, 'rect');
        //rect2.setAttributeNS(null, 'width', 60);
        //rect2.setAttributeNS(null, 'height', 18);
        //rect2.setAttributeNS(null, 'fill', '#3887E3');
        //rect2.setAttributeNS(null, 'x', x);
        //rect2.setAttributeNS(null, 'y', parseInt(y) + 40);
        //svg_text.appendChild(rect2);

        //var text2 = document.createElementNS(ns, 'text');

        //text2.setAttributeNS(null, 'fill', '#ffffff');
        //text2.setAttributeNS(null, 'x', parseInt(x) + 3);
        //text2.setAttributeNS(null, 'y', parseInt(y) + 52);
        //text2.setAttributeNS(null, 'font-size', '13');
        //text2.setAttributeNS(null, 'style', 'fill:#ffffff;font-weight:bold;');
        //text2.textContent = t3;
        //svg_text.appendChild(text2);
    }

    static Line (svg, x, y, len, op) {
        // alert(parseInt(y2) + parseInt(len));
        var x2 = 0,
            y2 = 0;

        if (typeof op != 'undefined') {
            if (op.indexOf('竖') > -1) {
                y2 = parseInt(y) + parseInt(len);
                x2 = x;
            } else {
                x2 = parseInt(x) + parseInt(len);
                y2 = y;
            }
        } else {
            x2 = x;
            y2 = parseInt(y) + parseInt(len);
        }

        //if (op.indexOf('竖') > -1) {
        //    y2 = parseInt(y2) + parseInt(len);
        //}
        //else {
        //    x2 = parseInt(x2) + parseInt(len);
        //}

        var line = document.createElementNS(ns, 'line');
        line.setAttributeNS(null, 'x1', x);
        line.setAttributeNS(null, 'y1', y);
        line.setAttributeNS(null, 'x2', x2);
        line.setAttributeNS(null, 'y2', y2);
        line.setAttributeNS(null, 'stroke', '#000');
        line.setAttributeNS(null, 'stroke-width', '1');
        line.setAttributeNS(null, 'stroke-dasharray', '10 5');
        svg.appendChild(line);
    }
    static CabinetFanCoil (svg, id, cid, type, t, name, x, y, lt, ty) {
        var g = document.createElementNS(ns, 'g');
        svg.appendChild(g);
        var title = document.createElementNS(ns, 'title');
        title.textContent = t;
        g.appendChild(title);

        var path1 = '';
        if (type == 0) {
            path1 = filePath + 'jfs.png';
        } else if (type == 1) {
            path1 = filePath + 'zfg.gif';
        } else if (type == 2) {
            path1 = filePath + 'fp.png';
        }

        var image = document.createElementNS(ns, 'image');
        image.setAttributeNS(null, 'width', 107);
        image.setAttributeNS(null, 'height', 41);
        image.setAttributeNS(null, 'x', x);
        image.setAttributeNS(null, 'y', parseInt(y) + 30);
        if (id != '') {
            image.setAttributeNS(null, 'id', id);
        }
        if (cid != '') {
            image.setAttributeNS(null, 'cid', cid);
        }
        image.setAttributeNS(null, 'name', ty + '_' + t.substring(0, 1));
        image.setAttributeNS(null, 'href', path1);
        image.setAttributeNS(null, 'item', lt);
        g.appendChild(image);

        var image_text0 = document.createElementNS(ns, 'text');

        image_text0.setAttributeNS(null, 'fill', '#3887E3');
        image_text0.setAttributeNS(null, 'x', parseInt(x) + 32);
        image_text0.setAttributeNS(null, 'y', parseInt(y) + 27);
        image_text0.setAttributeNS(null, 'font-size', '17');
        image_text0.setAttributeNS(null, 'style', 'font-weight:bold;');

        image_text0.textContent = t;
        g.appendChild(image_text0);

        var image_text1 = document.createElementNS(ns, 'text');

        image_text1.setAttributeNS(null, 'fill', '#3887E3');
        image_text1.setAttributeNS(null, 'x', parseInt(x) + 43);
        image_text1.setAttributeNS(null, 'y', parseInt(y) + 55);
        image_text1.setAttributeNS(null, 'font-size', '16');
        image_text1.setAttributeNS(null, 'style', 'font-weight:bold;');
        if (name != '') {
            image_text1.setAttributeNS(null, 'name', name);
        }
        if (type == 0 || type == 1) {
            image_text1.setAttributeNS(
                null,
                'name',
                'CAB' + t.substring(0, 1) + '_T'
            );
        } else if (type == 2) {
            image_text1.setAttributeNS(
                null,
                'name',
                'FAN' + t.substring(0, 1) + '_AT'
            );
        }

        image_text1.setAttributeNS(null, 'unit', '℃');
        image_text1.textContent = '0℃';
        g.appendChild(image_text1);
    }

    static cab (svg, type, x, y) {
        var image = document.createElementNS(ns, 'image');
        image.setAttributeNS(null, 'href', filePath + 'cab' + type + '.png');
        image.setAttributeNS(null, 'width', 500);
        image.setAttributeNS(null, 'height', 250);
        image.setAttributeNS(null, 'x', x);
        image.setAttributeNS(null, 'y', y);
        svg.appendChild(image);
    }

    static Other (svg, data, x, y) {
        var image = document.createElementNS(ns, 'image');
        image.setAttributeNS(null, 'href', filePath + 'other.png');
        image.setAttributeNS(null, 'width', 192);
        image.setAttributeNS(null, 'height', 188);
        image.setAttributeNS(null, 'id', 'other');
        image.setAttributeNS(null, 'x', x);
        image.setAttributeNS(null, 'y', y);
        svg.appendChild(image);

        for (var i = 0; i < data.item.length; i++) {
            var text = document.createElementNS(ns, 'text');
            text.setAttributeNS(null, 'fill', '#3887E3');

            var text1 = document.createElementNS(ns, 'text');
            if (i == 0) {
                text.setAttributeNS(null, 'x', parseInt(x) + 3);
                text.setAttributeNS(null, 'y', parseInt(y) + 48);
                x = parseInt(x) + 3;
                y = parseInt(y) + 48;
            } else {
                y += 25;
                text.setAttributeNS(null, 'x', parseInt(x));
                text.setAttributeNS(null, 'y', parseInt(y));
            }

            text1.setAttributeNS(null, 'x', parseInt(x) + 70);
            text1.setAttributeNS(null, 'y', parseInt(y));

            text1.setAttributeNS(null, 'font-size', '13');
            text1.setAttributeNS(null, 'style', 'font-weight:bold;');

            text.setAttributeNS(null, 'font-size', '13');
            text.setAttributeNS(null, 'style', 'font-weight:bold;');
            text.textContent = data.item[i].text + ':';
            var a = document.createElementNS(ns, 'a');
            if (data.item[i].hasOwnProperty('read')) {
                text1.textContent = 0 + data.item[i].read.unit;
                text1.setAttributeNS(null, 'name', data.item[i].read._text);
                text1.setAttributeNS(null, 'unit', data.item[i].read.unit);
            } else if (data.item[i].hasOwnProperty('radio')) {
                text1.textContent =
                    data.item[i].radio._text + data.item[i].radio.op;
                text1.setAttributeNS(null, 'name', data.item[i].radio._text);
            } else if (data.item[i].hasOwnProperty('write')) {
                text1.textContent = 0 + data.item[i].write.unit;
                text1.setAttributeNS(null, 'name', data.item[i].write._text);
                text1.setAttributeNS(null, 'unit', data.item[i].write.unit);
            }

            svg.appendChild(text);
            svg.appendChild(text1);
            //svg.appendChild(a);
        }

        //addPanel(svg,x,y);
        //  <text fill="#3887E3" x="171" y="145" font-size="17" style="font-weight:bold;">1#风柜</text>
    }

    static cav (svg, name, type, x, y) {
        var image = document.createElementNS(ns, 'image');
        image.setAttributeNS(null, 'href', filePath + 'cav' + type + '.jpg');
        image.setAttributeNS(null, 'y', y);
        if (type == 'X') {
            image.setAttributeNS(null, 'y', parseInt(y) - 4);
            image.setAttributeNS(null, 'width', 38);
            image.setAttributeNS(null, 'height', 63);
        } else if (type == 'Y') {
            image.setAttributeNS(null, 'width', 61);
            image.setAttributeNS(null, 'height', 33);
        }
        image.setAttributeNS(null, 'name', name);
        image.setAttributeNS(null, 'x', x);
        svg.appendChild(image);
    }

    static Fan (svg, id, cid, type, t, name, x, y) {
        var image = document.createElementNS(ns, 'image');
        image.setAttributeNS(null, 'href', filePath + 'feng.png');
        image.setAttributeNS(null, 'width', 64);
        image.setAttributeNS(null, 'height', 50);
        image.setAttributeNS(null, 'name', name);
        image.setAttributeNS(null, 'x', x);
        image.setAttributeNS(null, 'y', y);
        svg.appendChild(image);
    }
    static HeatEx (svg, w, h, x, y) {
        var image = document.createElementNS(ns, 'image');
        image.setAttributeNS(null, 'href', filePath + 'HeatEx.png');
        image.setAttributeNS(null, 'width', 22);
        image.setAttributeNS(null, 'height', 60);
        image.setAttributeNS(null, 'name', name);
        image.setAttributeNS(null, 'x', x);
        image.setAttributeNS(null, 'y', y);
        svg.appendChild(image);
    }

    static Button (svg, t, x, y, scalex, scaley) {
        var g = document.createElementNS(ns, 'g');
        g.setAttributeNS(null, 'class', 'button');
        g.setAttributeNS(null, 'cursor', 'pointer');
        svg.appendChild(g);
        //var title = document.createElementNS(ns, 'title');
        //title.textContent = t;
        //g.appendChild(title);

        var rect = document.createElementNS(ns, 'rect');
        rect.setAttributeNS(null, 'rx', 5);
        rect.setAttributeNS(null, 'ry', 5);

        rect.setAttributeNS(null, 'x', parseInt(x) * parseInt(scalex));
        rect.setAttributeNS(null, 'y', parseInt(y) * parseInt(scaley));

        rect.setAttributeNS(null, 'width', 65);
        rect.setAttributeNS(null, 'height', 21);
        g.appendChild(rect);

        var text = document.createElementNS(ns, 'text');

        text.setAttributeNS(null, 'x', parseInt(x) * parseInt(scalex) + 3);
        text.setAttributeNS(null, 'y', parseInt(y) * parseInt(scaley) + 14);
        text.setAttributeNS(null, 'font-size', '13');
        text.setAttributeNS(null, 'style', 'fill:#3887E3;font-weight:bold;');
        text.textContent = t;
        g.appendChild(text);
    }
}
