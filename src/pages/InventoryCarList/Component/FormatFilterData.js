
/**
 * 更多筛选数据格式化
 * @param {*} data 
 * data: {
        carTag: [{ label: '全部', value: 'all' }],
        libraryAge: [{ label: '全部', value: 'all' }],
        price: [{ label: '全部', value: 'all' }],
        interestholiday: [{ label: '全部', value: 'all' }]
    }
 */
function formatFilterDataFn(data){
    const { carTag,interestholiday,libraryAge,price } = data
    let obj = {
        invStatusName:'',//在库，在途，
        isLock:'',//订单锁定 1
        overdueInventory:'',//超期库存 1
        financialStatus:'',//融资车，现金车
        invWarning:'',//库存预警1

        libraryAgeSeach:'',//库龄标签 全部传空 
        financialSource:'',//资金来源
        exInterestBearingDate:'',//免息截止日期
    }
    //库存标签
    let invStatusNameList = []
    let financialStatusList = []
    carTag.map(item => {
        item.value == '3' && (obj.isLock = '1');
        (item.value == '1' || item.value == '2') &&  invStatusNameList.push(item.label);
        item.value == '4' && (obj.overdueInventory = '1');
        (item.value == '5' || item.value == '6') &&  financialStatusList.push(item.label);
        item.value == '7' && (obj.invWarning = '1');

        
    })
    obj.invStatusName = invStatusNameList.join(',');
    obj.financialStatus = financialStatusList.join(',');
    //库龄
    let libraryAgeList = Object
    .keys(libraryAge || {})
    .map(key => libraryAge[key].value)

    obj.libraryAgeSeach = libraryAgeList.join(',') == 'all'? '':libraryAgeList.join(',')

    //资金来源
    let financialSourceList = Object
    .keys(price || {})
    .map(key => price[key].label)

    obj.financialSource = financialSourceList.join(',') == '全部'? '':financialSourceList.join(',')

    //免息截止日期
    let exInterestBearingDateList = Object
    .keys(interestholiday || {})
    .map(key => interestholiday[key].label)

    obj.exInterestBearingDate = exInterestBearingDateList.join(',') == '全部'? '':exInterestBearingDateList.join(',')

    return obj
}

/**
 * 数量查询条件，包括库龄，资金来源，免息截止日期
 * @param {*} data 
 */
function formatFilterCarNoDataFn(data){
    const { interestholiday,libraryAge,price } = data
    let obj = {
        libraryAgeSeach:'',//库龄标签 全部传空 
        financialSource:'',//资金来源
        exInterestBearingDate:'',//免息截止日期
    }
  
    //库龄
    let libraryAgeList = Object
    .keys(libraryAge || {})
    .map(key => libraryAge[key].value)

    obj.libraryAgeSeach = libraryAgeList.join(',') == 'all'? '':libraryAgeList.join(',')

    //资金来源 
    let financialSourceList = Object
    .keys(price || {})
    .map(key => price[key].label)

    obj.financialSource = financialSourceList.join(',') == '全部'? '':financialSourceList.join(',')

    //免息截止日期
    let exInterestBearingDateList = Object
    .keys(interestholiday || {})
    .map(key => interestholiday[key].label)

    obj.exInterestBearingDate = exInterestBearingDateList.join(',') == '全部'? '':exInterestBearingDateList.join(',')

    return obj
}

export {
    formatFilterDataFn,
    formatFilterCarNoDataFn
}