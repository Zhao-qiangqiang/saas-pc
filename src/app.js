import { SRNApp, SRNConfig } from '@souche-f2e/srn-framework';
import SRNNative from '@souche-f2e/srn-native';
import NavHelper from '@souche-f2e/srn-navigator';
/*
 * [SRNConfig 配置管理] http://fedoc.sqaproxy.souche.com/#/rn/framework/framework_SRNConfig
 */
/**
 * 加载default中的默认配置与环境中除host外的配置
 */
SRNConfig.load({
  default: require('./config/default.config').default,
  dev: require('./config/dev.config').default,
  prepub: require('./config/prepub.config').default,
  prod: require('./config/prod.config').default
});

/**
 * 加载本地开发/调试所需的host（选择其一：统一配置管理方式 / RN 环境配置方式）
 */

SRNConfig.hostConfig({ host: require('./config/host.config').default }); //统一配置管理方式

// SRNConfig.hostConfig({ host: require('./config/host.config').default },{useEnvHost: true});      //RN 环境配置方式

/*
 * [SRNApp 应用入口] http://fedoc.sqaproxy.souche.com/#/rn/framework/framework_SRNApp
 */
// 初始化实例
var app = new SRNApp();
var routes = require('./route_config').default;
// 初始化路由设置8
app.init(routes, '/InventoryHome');
// app.init(routes, '/AccountManagement');

app.setNavigation({ leftArrowStyle: { tintColor: '#1A1D33' } });

// 初始化 Sentry
// app.initSentry(SRNConfig.sentry.version, SRNConfig.sentry.dsn);
