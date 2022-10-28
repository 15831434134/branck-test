const path = require('path');
const { execFileSync } = require('child_process');

function dumpVersion(version, channel = '', maxV = 99) {
    const oldV = version;
    let a = oldV.split('.');
    if (a[a.length - 1] > maxV) {
        a[a.length - 2]++;
        a[a.length - 1] = 0;
    } else {
        a[a.length - 1]++;
    }
    return a.join('.');
}
/**
 * 切换到master分之
 * 得到最新的版本号
 * 将最新的版本号进行更新
 * 发布标签
 * 发布包
 *  */
(async function () {
    try {
        const checkMaster = await execFileSync('git', ['checkout', 'main'], { encoding: 'utf-8' });
        console.log('master分支检出完毕', checkMaster);
        const versionList = await JSON.parse(
            execFileSync('npm.cmd', ['info', 'branck-test', 'versions', '--json'], { encoding: 'utf-8' })
        );
        const version = versionList.pop();
        console.log('最新的版本号', version);
        const new_version = dumpVersion(version);
        console.log('版本号更新完毕', new_version);
        const updateV = await execFileSync('yarn.cmd', ['version', '--new-version', new_version], {
            encoding: 'utf-8'
        });
        console.log(updateV);
        const tag1 = execFileSync('git', ['push', '--tags'], { encoding: 'utf-8' });
        console.log('tag1创建完毕', tag1);
        const tag2 = execFileSync('git', ['push', '--follow-tags'], { encoding: 'utf-8' });
        console.log('tag1创建完毕', tag2);
        const publish = execFileSync('npm.cmd', ['publish'], { encoding: 'utf-8' });
        console.log('包发布完毕', publish);
    } catch (error) {
        console.log(error);
    }
})();
