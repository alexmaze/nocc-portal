#!/bin/bash

user=alex
root=/home/alex/website
host=alexyan.xyz
path=nocc-portal


echo '  - 构建中...'
npm run build
echo '  - 清除服务器数据...'
ssh -l ${user} ${host} -p 27055 > /dev/null 2>&1 << eeooff
cd ${root}
rm -rf ${path}/
exit
eeooff
echo '  - 部署中...'
scp -P 27055 -r ./dist ${user}@${host}:${root}/${path}

echo '# 部署完成'

# docker run -it -p 5555:5000 -v /home/qboxserver/websites/ecloud.opdev.qiniu.io/mockapi:/root/mockapi --name jinghao node bash
# PHANTOMJS_CDNURL=https://npm.taobao.org/dist/phantomjs  npm install --registry=https://registry.npm.taobao.org --disturl=https://npm.taobao.org/dist
