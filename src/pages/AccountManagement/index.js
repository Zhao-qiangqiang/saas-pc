import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  FlatList,
  RefreshControl,
  TextInput
} from 'react-native';
import SRNNative from '@souche-f2e/srn-native';
import AccountManagement from '../../stores/AccountManagement';
import { SRNPage, observer } from '@souche-f2e/srn-framework';
import {
  List,
  Button,
  toast,
  FontSize,
  Input,
  modal,
  theme,
  Modal,
  loading
} from '@souche-ui/srn-ui';
var Buffer = require('buffer').Buffer;
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
@observer
@modal
@toast
@loading
class Index extends SRNPage {
  static navigation = {
    left: {
      showArrow: true
    },
    title: '厂商系统账号管理'
  };

  constructor(props) {
    super(props);
    this.state = {
      modalShow1: false,
      modalShow2: false,
      modalShow3: false,
      refreshing: false,
      title: ''
    };
    //实例化页面的store
    this.store = new AccountManagement();
    this.onPressTest = this.onPressTest.bind(this);
    this._handleRefresh = this._handleRefresh.bind(this);
    this.delete = this.delete.bind(this);
    this.passWordChange = this.passWordChange.bind(this);
    this.accountChange = this.accountChange.bind(this);
    this.handleClose1 = this.handleClose1.bind(this);
    this.handleClose2 = this.handleClose2.bind(this);
    this.handleClose3 = this.handleClose3.bind(this);
    this.beforeClose = this.beforeClose.bind(this);
    this.beforeClose1 = this.beforeClose1.bind(this);
  }

  componentDidMount() {
    this.loading.show('加载中');
    this.store.getAccountList().then(res => {
      this.loading.hide();
    });
    // var rawStr = 'fz123456';
    // var base64Str = new Buffer(rawStr).toString('base64');
    // var b = new Buffer(base64Str, 'base64').toString();
    // console.log(base64Str);
    // console.log(b);
  }
  handleClose1() {
    this.setState({
      modalShow1: false
    });
  }
  handleClose2() {
    this.setState({
      modalShow2: false
    });
  }
  handleClose3() {
    this.setState({
      modalShow3: false
    });
  }
  beforeClose(option, target) {
    if (option.text === '取消') {
      return true;
    } else if (option.text === '确定') {
      if (
        this.store.bindingBusinessVO.account == '' ||
        this.store.bindingBusinessVO.password == ''
      ) {
        target.showToast('请输入账号或密码!', 'top');
      } else {
        this.bind(this.store.bindingBusinessVO);
        return true;
      }
    }
    return false;
  }
  beforeClose1(option, target) {
    if (option.text === '取消') {
      return true;
    } else if (option.text === '确定') {
      if (
        this.store.updataBindingBusinessVO.account == '' ||
        this.store.updataBindingBusinessVO.password == ''
      ) {
        target.showToast('请输入账号或密码!', 'top');
      } else {
        this.updata(this.store.updataBindingBusinessVO);
        return true;
      }
    }
    return false;
  }
  delete = data => {
    this.store.deleteAccount(data).then(res => {
      if (res === 'success') {
        this.toast('解绑成功!', 'top');
        this.store.getAccountList();
      }
    });
  };
  bind = bindingBusinessVO => {
    const newAccount = new Buffer(bindingBusinessVO.account).toString('base64');
    const newPassword = new Buffer(bindingBusinessVO.password).toString('base64');
    const newBindingBusinessVO = {
      ...bindingBusinessVO,
      account: newAccount,
      password: newPassword
    };
    this.store.bindAccount(newBindingBusinessVO).then(res => {
      if (res === 'success') {
        this.toast('绑定成功!', 'top');
        this.store.getAccountList();
      }
    });
  };

  updata = updataBindingBusinessVO => {
    const newAccount = new Buffer(updataBindingBusinessVO.account).toString('base64');
    const newPassword = new Buffer(updataBindingBusinessVO.password).toString('base64');
    const newUpdataBindingBusinessVO = {
      ...updataBindingBusinessVO,
      account: newAccount,
      password: newPassword
    };
    this.store.updateAccount(newUpdataBindingBusinessVO).then(res => {
      if (res === 'success') {
        this.toast('更新成功!', 'top');
        this.store.getAccountList();
      }
    });
  };

  accountChange = value => {
    this.store.assignAccount(value);
  };
  passWordChange = value => {
    this.store.assignPassWord(value);
  };
  accountUpdataChange = value => {
    this.store.assignUpdataAccount(value);
  };
  passUpdataWordChange = value => {
    this.store.assignUpdataPassWord(value);
  };
  onPressTest(item) {
    if (item.buttonText === '去绑定') {
      this.store.clearInterval();
      this.setState({ modalShow1: true, title: '账号绑定' });
      this.store.assignAddOther(item.shopBusinessId, item.systemName, item.systemCode);
    } else if (item.buttonText === '解绑') {
      this.store.rpaAccountMappingIdChange(item.rpaAccountMappingId);
      this.setState({ modalShow2: true, title: '确认解绑' });
    } else if (item.buttonText === '更新') {
      this.setState({ modalShow3: true, title: '账号更新' });
      this.store.updataChange(item.rpaAccountMappingId);
      this.store.getAccount(this.store.getAccountObj);
    }
  }

  //下拉刷新
  _handleRefresh() {
    this.setState({ refreshing: true });
    this.store.getAccountList().then(res => {
      if (res === 'success') {
        const nextState = {
          refreshing: false
        };
        this.setState(nextState);
      } else {
        this.toast('刷新失败', 'top');
      }
    });
  }

  render() {
    return (
      <ScrollView
        // 下拉刷新
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={() => {
              this._handleRefresh();
            }}
          />
        }
        refreshing={this.state.refreshing}
      >
        <List>
          <List.Group>
            <FlatList
              data={this.store.accountList}
              renderItem={({ item }) => (
                <List.Item style={styles.all}>
                  <View style={styles.inMiddle}>
                    <Text style={styles.itemStyFirst}>{item.systemName}</Text>
                    <Text style={styles.itemStySecond}>{item.statusName}</Text>
                  </View>
                  {/* <View style={styles.inMiddle}>
                    <Text style={styles.itemStySecond}>{item.statusName}</Text>
                  </View> */}
                  <View style={styles.buttonWrapper}>
                    <Button
                      inline={true}
                      type='ghost'
                      onPress={this.onPressTest.bind(this, item)}
                      style={styles.itemStyThird}
                    >
                      {item.buttonText}
                    </Button>
                  </View>
                </List.Item>
              )}
            />
          </List.Group>
        </List>
        <Modal
          visible={this.state.modalShow1}
          title={this.state.title}
          message={[
            <View>
              <View style={styles.modalAll}>
                <View style={{ justifyContent: 'center', marginLeft: 10 }}>
                  <Text>账号</Text>
                </View>
                <View style={{ marginLeft: 20, width: 200, height: 36 }}>
                  <View style={styles.inputContainer}>
                    <Input
                      style={styles.input}
                      value={this.store.bindingBusinessVO.account}
                      placeholder='请输入'
                      // required={true}
                      onChange={this.accountChange}
                    />
                  </View>
                </View>
              </View>
              <View style={styles.modalAll}>
                <View style={{ justifyContent: 'center', marginLeft: 10 }}>
                  <Text>密码</Text>
                </View>
                <View style={{ marginLeft: 20, width: 200, height: 36 }}>
                  <View style={styles.inputContainer}>
                    <Input
                      type='password'
                      style={styles.input}
                      placeholder='请输入'
                      value={this.store.bindingBusinessVO.password}
                      // required={true}
                      onChange={this.passWordChange}
                    />
                  </View>
                </View>
              </View>
            </View>
          ]}
          options={[
            { text: '取消' },
            {
              text: '确定'
              // onPress: () => {
              //   this.bind(this.store.bindingBusinessVO);
              // }
            }
          ]}
          beforeClose={this.beforeClose}
          enableToast={true}
          onClose={this.handleClose1}
        />
        <Modal
          visible={this.state.modalShow2}
          title={this.state.title}
          message={'解绑后，将不会向厂商系统同步信息，您确定解绑吗?'}
          options={[
            { text: '取消' },
            {
              text: '确定',
              onPress: () => {
                this.delete(this.store.deleteObj);
              }
            }
          ]}
          onClose={this.handleClose2}
        />
        <Modal
          visible={this.state.modalShow3}
          title={this.state.title}
          message={[
            <View>
              <View style={styles.modalAll}>
                <View style={{ justifyContent: 'center', marginLeft: 10 }}>
                  <Text>账号</Text>
                </View>
                <View style={{ marginLeft: 20, width: 200, height: 36 }}>
                  <View style={styles.inputContainer}>
                    <Input
                      style={styles.input}
                      value={this.store.updataBindingBusinessVO.account}
                      placeholder='请输入'
                      // required={true}
                      onChange={this.accountUpdataChange}
                    />
                  </View>
                </View>
              </View>
              <View style={styles.modalAll}>
                <View style={{ justifyContent: 'center', marginLeft: 10 }}>
                  <Text>密码</Text>
                </View>
                <View style={{ marginLeft: 20, width: 200, height: 36 }}>
                  <View style={styles.inputContainer}>
                    <Input
                      type='password'
                      style={styles.input}
                      placeholder='请输入'
                      value={this.store.updataBindingBusinessVO.password}
                      // required={true}
                      onChange={this.passUpdataWordChange}
                    />
                  </View>
                </View>
              </View>
            </View>
          ]}
          options={[
            { text: '取消' },
            {
              text: '确定'
              // onPress: () => {
              //   this.bind(this.store.bindingBusinessVO);
              // }
            }
          ]}
          beforeClose={this.beforeClose1}
          enableToast={true}
          onClose={this.handleClose3}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  modalAll: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 10
  },
  all: {
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 100
  },
  buttonWrapper: {
    padding: 10,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center'
  },
  inMiddle: {
    height: 100,
    justifyContent: 'center'
  },
  itemSty: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center'
  },
  itemStyFirst: {
    color: 'black',
    fontSize: 20
  },
  itemStySecond: {
    marginTop: 16,
    fontSize: 16,
    color: 'red'
  },
  itemStyThird: {
    borderRadius: 25
  },
  inputContainer: {
    width: 180,
    // marginLeft: 35,
    // alignSelf: 'stretch',
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme('color_text_hint'),
    backgroundColor: theme('color_white')
  },
  input: {
    color: theme('color_text_title'),
    fontSize: FontSize.P2
  }
});

export default Index;
