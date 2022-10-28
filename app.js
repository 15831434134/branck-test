const chalk = require('chalk');
const log = console.log;
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const options = {
    encoding: 'utf-8'
};
const pkgInfo = JSON.parse(fs.readFileSync(`${resolve('package.json')}`, 'utf-8'));
function resolve(dir) {
    return path.join(__dirname, `./${dir}`);
}
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
        const checkMaster = await execFileSync('git', ['checkout', 'main'], { ...options });
        log(chalk.green(`${pkgInfo.name}==>master分支检出完毕${checkMaster}`));
        const versionList = await JSON.parse(
            execFileSync('npm.cmd', ['info', 'branck-test', 'versions', '--json'], { ...options })
        );
        const version = versionList.pop();
        if (!version) version = '1.0.0';
        log(chalk.green(`${pkgInfo.name}==>最新的版本号${chalk.blue.underline.bold(version)}`));
        const new_version = dumpVersion(version);
        log(chalk.green(`${pkgInfo.name}==>版本号更新完毕${chalk.blue.underline.bold(new_version)}`));
        const updateV = await execFileSync('yarn.cmd', ['version', '--new-version', new_version], { ...options });
        log(chalk.green(updateV));
        const tag1 = execFileSync('git', ['push', '--tags'], { ...options });
        log(chalk.green(`${pkgInfo.name}==>tag创建完毕${tag1}`));
        const tag2 = execFileSync('git', ['push', '--follow-tags'], { ...options });
        log(chalk.green(`${pkgInfo.name}项目==>follow-tags创建完毕${tag2}`));
        const publish = execFileSync('npm.cmd', ['publish'], { ...options });
        log(chalk.green(`${pkgInfo.name}项目==>包发布完毕${publish}`));
        // Todo 是否执行安装依赖
    } catch (error) {
        console.log(error);
    }
})();
