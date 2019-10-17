# VERSION 通过 make publish-prod VERSION="0.1.1" 方式传递

SOURCE_FILES=./build/*
REMOTE_SERVER=souche@10.165.13.29

PACKAGE_NAME=$(shell node -p "require('./package.json').name")

DEV_PATH=/home/scdev/dev/souche-f2e/projects/react-native/modules/$(PACKAGE_NAME)/$(VERSION)/
PREPUB_PATH=/home/souche/prepub/souche-f2e/projects/react-native/modules/$(PACKAGE_NAME)/$(VERSION)/
ONLINE_PATH=/home/souche/online/souche-f2e/projects/react-native/modules/$(PACKAGE_NAME)/$(VERSION)/

# 发布到测试环境
publish-dev:
	@ssh $(REMOTE_SERVER) 'mkdir -p $(DEV_PATH)'
	rsync -rvI --progress $(SOURCE_FILES) $(REMOTE_SERVER):$(DEV_PATH)

# 发布到预发环境
publish-prepub:
	@ssh $(REMOTE_SERVER) 'mkdir -p $(PREPUB_PATH)'
	rsync -rvI --progress $(SOURCE_FILES) $(REMOTE_SERVER):$(PREPUB_PATH)

# 发布到线上环境
publish-prod:
	@ssh $(REMOTE_SERVER) 'mkdir -p $(ONLINE_PATH)'
	rsync -rvI --progress $(SOURCE_FILES) $(REMOTE_SERVER):$(ONLINE_PATH)

.PHONY: publish-dev publish-prepub publish-prod
