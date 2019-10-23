/* eslint-disable */
require('script-loader!file-saver') //保存文件用
require('script-loader!@/vendor/Blob') //转二进制用
require('script-loader!xlsx/dist/xlsx.core.min') //xlsx核心
import { branchParamsDesc } from './Enum'
function generateArray(table) {
    var out = []
    var rows = table.querySelectorAll('tr')
    var ranges = []
    for (var R = 0; R < rows.length; ++R) {
        var outRow = []
        var row = rows[R]
        var columns = row.querySelectorAll('td')
        for (var C = 0; C < columns.length; ++C) {
            var cell = columns[C]
            var colspan = cell.getAttribute('colspan')
            var rowspan = cell.getAttribute('rowspan')
            var cellValue = cell.innerText
            if (cellValue !== '' && cellValue == +cellValue)
                cellValue = +cellValue

            //Skip ranges
            ranges.forEach(function(range) {
                if (
                    R >= range.s.r &&
                    R <= range.e.r &&
                    outRow.length >= range.s.c &&
                    outRow.length <= range.e.c
                ) {
                    for (var i = 0; i <= range.e.c - range.s.c; ++i)
                        outRow.push(null)
                }
            })

            //Handle Row Span
            if (rowspan || colspan) {
                rowspan = rowspan || 1
                colspan = colspan || 1
                ranges.push({
                    s: { r: R, c: outRow.length },
                    e: { r: R + rowspan - 1, c: outRow.length + colspan - 1 }
                })
            }
            //Handle Value
            outRow.push(cellValue !== '' ? cellValue : null)

            //Handle Colspan
            if (colspan) for (var k = 0; k < colspan - 1; ++k) outRow.push(null)
        }
        out.push(outRow)
    }
    return [out, ranges]
}

function datenum(v, date1904) {
    if (date1904) v += 1462
    var epoch = Date.parse(v)
    return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000)
}

function sheet_from_array_of_arrays(data, opts) {
    var ws = {}
    var range = { s: { c: 10000000, r: 10000000 }, e: { c: 0, r: 0 } }
    for (var R = 0; R != data.length; ++R) {
        for (var C = 0; C != data[R].length; ++C) {
            if (range.s.r > R) range.s.r = R
            if (range.s.c > C) range.s.c = C
            if (range.e.r < R) range.e.r = R
            if (range.e.c < C) range.e.c = C
            var cell = { v: data[R][C] }
            if (cell.v == null) continue
            var cell_ref = XLSX.utils.encode_cell({ c: C, r: R })

            if (typeof cell.v === 'number') cell.t = 'n'
            else if (typeof cell.v === 'boolean') cell.t = 'b'
            else if (cell.v instanceof Date) {
                cell.t = 'n'
                cell.z = XLSX.SSF._table[14]
                cell.v = datenum(cell.v)
            } else cell.t = 's'

            ws[cell_ref] = cell
        }
    }
    if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range)
    return ws
}

function Workbook() {
    if (!(this instanceof Workbook)) return new Workbook()
    this.SheetNames = []
    this.Sheets = {}
}

function s2ab(s) {
    var buf = new ArrayBuffer(s.length)
    var view = new Uint8Array(buf)
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
    return buf
}

export function export_table_to_excel(id) {
    var theTable = document.getElementById(id)
    console.log('a')
    var oo = generateArray(theTable)
    var ranges = oo[1]

    /* original data */
    var data = oo[0]
    var ws_name = 'SheetJS'
    console.log(data)

    var wb = new Workbook(),
        ws = sheet_from_array_of_arrays(data)

    /* add ranges to worksheet */
    // ws['!cols'] = ['apple', 'banan'];
    ws['!merges'] = ranges

    /* add worksheet to workbook */
    wb.SheetNames.push(ws_name)
    wb.Sheets[ws_name] = ws

    var wbout = XLSX.write(wb, {
        bookType: 'xlsx',
        bookSST: false,
        type: 'binary'
    })

    saveAs(
        new Blob([s2ab(wbout)], { type: 'application/octet-stream' }),
        'test.xlsx'
    )
}

function formatJson(jsonData) {
    console.log(jsonData)
}
export function export_json_to_excel(th, jsonData, defaultTitle) {
    /* original data */
    var data = jsonData
    data.unshift(th)
    var ws_name = 'SheetJS'

    var wb = new Workbook(),
        ws = sheet_from_array_of_arrays(data)
    /* add worksheet to workbook */
    wb.SheetNames.push('SheetJS1')
    wb.Sheets['SheetJS1'] = ws
    wb.SheetNames.push('SheetJS2')
    wb.Sheets['SheetJS2'] = ws
    var wbout = XLSX.write(wb, {
        bookType: 'xlsx',
        bookSST: false,
        type: 'binary'
    })
    var title = defaultTitle || '列表'
    saveAs(
        new Blob([s2ab(wbout)], { type: 'application/octet-stream' }),
        title + '.xlsx'
    )
}
export function export_json_to_excel_all(th, jsonData, defaultTitle) {
    /* original data */
    let ws_name_list = [
        '变压器导入',
        '采集器管理',
        '支路导入',
        '分项信息',
        '视频监控导入',
        '给排水设备',
        '冷站设备',
        '电梯设备',
        '给排水参数',
        '配电参数',
        '冷站参数',
        '用户配置',
        '保养标准',
        '巡检标准',
        '备品配件',
        '录入说明'
    ]
    var wb = new Workbook()
    jsonData.forEach((list, i) => {
        if (list.length) {
            var ws_name = ws_name_list[i]
            let data = list
            let headers = Object.keys(branchParamsDesc[i])
            let infos = []
            data.forEach(item => {
                let current = []
                headers.forEach(key => {
                    current.push(item[key] || '')
                })
                current.push(item['errMsg'])
                current.unshift('')
                infos.push(current)
            })
            headers = headers.map(k => branchParamsDesc[i][k])
            headers.unshift('')
            headers = headers.concat(['错误信息'])
            infos.unshift(headers)
            infos.unshift([])
            wb.SheetNames.push(ws_name)
            wb.Sheets[ws_name] = sheet_from_array_of_arrays(infos)
        }
    })
    /* add worksheet to workbook */

    var wbout = XLSX.write(wb, {
        bookType: 'xlsx',
        bookSST: false,
        type: 'binary'
    })
    var title = defaultTitle || '列表'
    saveAs(
        new Blob([s2ab(wbout)], { type: 'application/octet-stream' }),
        title + '.xlsx'
    )
}
