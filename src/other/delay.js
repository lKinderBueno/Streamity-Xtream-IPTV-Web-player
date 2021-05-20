function sleep(delayInms) {
    return new Promise(resolve => {
        setTimeout(() => {
          resolve(2);
        }, delayInms);
      });
}

exports.delay = sleep;
exports.sleep = sleep;