#!/bin/bash

user=root
root=/root/website
host=nocc.alexyan.xyz
path=portal


echo '  - 构建中...'
npm run build
echo '  - 清除服务器数据...'
ssh -l ${user} ${host} > /dev/null 2>&1 << eeooff
cd ${root}
rm -rf ${path}/
exit
eeooff
echo '  - 部署中...'
scp -r ./dist ${user}@${host}:${root}/${path}

echo '# 部署完成'
