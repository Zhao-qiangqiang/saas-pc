/**
 * 根据下标替换隐藏*
 * @param {String} str 
 * @param {Number} startIndex 
 * @param {Number} endIndex 
 */
function HideVinNum(str, startIndex, endIndex) {
    //*号按需隐藏 str.length - endIndex
    let star = '';
    for(let i=0; i<(str.length - endIndex); i++ ){
        star+= '*'
    }
    let strRet = ''
    str && (strRet = str.slice(startIndex,endIndex).concat(star) )
    return  strRet || ''
}
export default HideVinNum