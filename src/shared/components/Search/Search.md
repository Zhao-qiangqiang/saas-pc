---
category: Components   
type: Data Entry   
title: Search   
subtitle: 搜索   
---

## 代码演示

```jsx
this.state = {
    selectedGroup: 'xc',
    searchHistory: ['福特福克斯', '马自达6', '大众朗逸', '斯柯达明锐', '宝马']
};
<View>
    <Search
        placeholder={'搜索'}
        focusPlaceholder={'请输入品牌/车系'}
        searchHistory={this.state.history}
        clearHistory={()=>{this.setState({searchHistory: []})}}
        searchRecommend={['起亚K2', '黑金刚', '速腾', '斯卡达明锐']}
        matchKeywords={['宝马1宝马b', '奔驰', '宝马X1', '奥迪A4', '宝马X5', '宝马X6', '华晨宝马']}
        groups={[
            {label: '新车', value: 'xc'},
            {label: '二手车', value: 'esc'},
            {label: '店铺', value: 'dp'},
        ]}
        selectedGroup={this.state.selectedGroup}
        onGroupChange={(e)=>{this.setState({selectedGroup: e.value})}}
    />
    // 搜索推荐是自定义组件
    <Search
        placeholder={'searchRecommend是组件'}
        focusPlaceholder={'请输入品牌/车系'}
        searchRecommend={this.mockComponent()}
        onSearch={this.onSearch.bind(this)}
        onValueChange={this.onValueChange.bind(this)}
    />
</View>
mockComponent(){
    return (
        <View>
            <View style={{flexDirection: 'row', height: 40, alignItems: 'center', paddingLeft: 12, borderBottomColor: Color.G2, borderBottomWidth: 1}}>
                <Text style={{fontSize: 16, color: Color.G1}}>车型推荐</Text>
            </View>
            <TouchableWithoutFeedback onPressIn={this._onPressIn.bind(this, 0)} onPressOut={this._onPressOut.bind(this, 0)}>
                <View ref={com => {this[0] = com}} style={{flexDirection: 'row', height: 70, alignItems: 'center', paddingLeft: 12, borderBottomColor: Color.G2, borderBottomWidth: 1}}>
                    <Image style={{width: 60, height: 45, marginRight: 20}} source={{uri: 'https://car3.autoimg.cn/cardfs/product/g17/M09/74/35/1024x0_1_q87_autohomecar__wKgH2Fj-3iWAfbLYAAHUridaw14357.jpg'}}/>
                    <Text style={{fontSize: 16}}>领克01</Text>
                </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPressIn={this._onPressIn.bind(this, 1)} onPressOut={this._onPressOut.bind(this, 1)}>
                <View ref={com => {this[1] = com}} style={{flexDirection: 'row', height: 70, alignItems: 'center', paddingLeft: 12, borderBottomColor: Color.G2, borderBottomWidth: 1}}>
                    <Image style={{width: 60, height: 45, marginRight: 20}} source={{uri: 'https://car3.autoimg.cn/cardfs/product/g17/M09/74/35/1024x0_1_q87_autohomecar__wKgH2Fj-3iWAfbLYAAHUridaw14357.jpg'}}/>
                    <Text style={{fontSize: 16}}>领克01</Text>
                </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPressIn={this._onPressIn.bind(this, 2)} onPressOut={this._onPressOut.bind(this, 2)}>
                <View ref={com => {this[2] = com}} style={{flexDirection: 'row', height: 70, alignItems: 'center', paddingLeft: 12, borderBottomColor: Color.G2, borderBottomWidth: 1}}>
                    <Image style={{width: 60, height: 45, marginRight: 20}} source={{uri: 'https://car3.autoimg.cn/cardfs/product/g17/M09/74/35/1024x0_1_q87_autohomecar__wKgH2Fj-3iWAfbLYAAHUridaw14357.jpg'}}/>
                    <Text style={{fontSize: 16}}>领克01</Text>
                </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPressIn={this._onPressIn.bind(this, 3)} onPressOut={this._onPressOut.bind(this, 3)}>
                <View ref={com => {this[3] = com}} style={{flexDirection: 'row', height: 70, alignItems: 'center', paddingLeft: 12, borderBottomColor: Color.G2, borderBottomWidth: 1}}>
                    <Image style={{width: 60, height: 45, marginRight: 20}} source={{uri: 'https://car3.autoimg.cn/cardfs/product/g17/M09/74/35/1024x0_1_q87_autohomecar__wKgH2Fj-3iWAfbLYAAHUridaw14357.jpg'}}/>
                    <Text style={{fontSize: 16}}>领克01</Text>
                </View>
            </TouchableWithoutFeedback>
        </View>
    );
}
```

## API

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---- | ---- | ---- | ---- | ---- |
| placeholder | 搜索框的占位字符 | string | - | - |
| focusPlaceholder | 搜索框获得焦点后但是还没有输入值时的占位符，默认与 placeholder 一致 | string | - | - |
| searchHistory | 搜索历史记录 | string[] / React.Component | - | [] |
| clearHistory | 点击清空历史Icon时的回调函数 | void | - | - |
| searchRecommend | 搜索推荐 | string[] / React.Component | - | [] |
| matchKeywords | 提供模糊匹配的候选词 | string[] | - | [] |
| groups | 拓展型搜索框左侧下拉列表候选词 | string[] | - | [] |
| selectedGroup | 拓展型搜索框左侧选中词 | string | - | '' |
| onSearch | 触发搜索操作时的回调函数 | (keyword) void | - | - |
| onGroupChange | 拓展型左侧选中词改变时的回调函数 | (e) void | - | - |
| onValueChange | 输入框值变化时的回调函数 | (keyword) void | - | - |

## 实现时需要注意的地方

1. ```onSearch``` 触发搜索的方式：   
(1) 点击键盘搜索按钮   
(2) 点击搜索历史   
(3) 点击搜索推荐   
(4) 点击模糊匹配    
参数 keyword 说明：当方式(1)触发搜索时，keyword 是输入框里面的值；当方式(2)(3)(4)触发搜索时，key 是点击的值   
   
2. ```groups``` 的格式 ```[{label: '', value: ''}, {label: '', value: ''}, ...]``` 
   
3. ```onGroupChange``` 的参数 e 是对象 ```{label: '', value: ''}```
   
4. ```searchHistory, searchRecommend``` 的类型可以是字符串数组或者 ```React.Component```。当类型为 ```React.Component```时,对应的 ```onPress``` 事件回调需要自己提供,组件不主动触发搜索事件;搜索关键词高亮也需要在 ```React.Component``` 中自己拼好，组件内部不实现自定义推荐的高亮。
           
![Search 组件视觉稿](./Search.png)