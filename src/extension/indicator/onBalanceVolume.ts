/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { IndicatorTemplate } from '../../component/Indicator'

interface Obv {
  obv?: number
  maObv?: number
}

/**
 * OBV
 * OBV = REF(OBV) + sign * V
 */
const onBalanceVolume: IndicatorTemplate<Obv, number> = {
  name: 'OBV',
  shortName: 'OBV',
  calcParams: [30],
  figures: [
    { key: 'obv', title: 'OBV: ', type: 'line' },
    { key: 'maObv', title: 'MAOBV: ', type: 'line' }
  ],
  calc: (dataList, indicator) => {
    const params = indicator.calcParams
    let obvSum = 0
    let oldObv = 0
    const obvList: Obv[] = []
    const result: Record<number, Obv> = {}
    dataList.forEach((kLineData, i) => {
      const prevKLineData = dataList[i - 1] ?? kLineData
      if (kLineData.close < prevKLineData.close) {
        oldObv -= (kLineData.volume ?? 0)
      } else if (kLineData.close > prevKLineData.close) {
        oldObv += (kLineData.volume ?? 0)
      }
      const obv: Obv = { obv: oldObv }
      obvSum += oldObv
      if (i >= params[0] - 1) {
        obv.maObv = obvSum / params[0]
        obvSum -= (obvList[i - (params[0] - 1)].obv ?? 0)
      }
      obvList.push(obv)
      result[kLineData.timestamp] = obv
    })
    return result
  }
}

export default onBalanceVolume
