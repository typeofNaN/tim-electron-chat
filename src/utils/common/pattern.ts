/**
 * @description 策略模式
 * @param { Common.StrategyAction[] } actions 每一种可能执行的操作
 */
export function exeStrategyActions(actions: Common.StrategyAction[]) {
  actions.some(item => {
    const [flag, action] = item
    if (flag) {
      action()
    }
    return flag
  })
}
