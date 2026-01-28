# 故障注入系统

系统支持 **14 种**故障模式的实时注入与检测。

---

## 📋 故障面板布局

故障注入面板位于界面右侧，按钮点击后变红表示激活。

### 左发故障 (Engine L)

| 按钮 | ID | 功能 |
|:---|:---:|:---|
| `L-N1S1 Fail` | 0 | 左发 N1 传感器 A 通道失效 |
| `L-N1S2 Fail` | 1 | 左发 N1 传感器 B 通道失效 |
| `L-EGT1 Fail` | 2 | 左发 EGT 传感器 A 通道失效 |
| `L-EGT2 Fail` | 3 | 左发 EGT 传感器 B 通道失效 |
| `L-OverSpd1` | 4 | 左发强制超速 (N1 = 107.5%) |
| `L-OverSpd2` | 5 | 左发严重超速 (N1 = 122.5%) |
| `L-HotStart` | 6 | 左发热启动 (EGT = 960°C) |
| `L-OverHeat` | 7 | 左发超温 (EGT = 1150°C) |

### 右发故障 (Engine R)

| 按钮 | ID | 功能 |
|:---|:---:|:---|
| `R-N1S1 Fail` | 10 | 右发 N1 传感器 A 通道失效 |
| `R-N1S2 Fail` | 11 | 右发 N1 传感器 B 通道失效 |
| `R-EGT1 Fail` | 12 | 右发 EGT 传感器 A 通道失效 |
| `R-EGT2 Fail` | 13 | 右发 EGT 传感器 B 通道失效 |
| `R-OverSpd1` | 14 | 右发强制超速 (N1 = 107.5%) |
| `R-OverSpd2` | 15 | 右发严重超速 (N1 = 122.5%) |
| `R-HotStart` | 16 | 右发热启动 (EGT = 960°C) |
| `R-OverHeat` | 17 | 右发超温 (EGT = 1150°C) |

### 系统故障

| 按钮 | ID | 功能 |
|:---|:---:|:---|
| `FuelS Fail` | 20 | 燃油传感器失效 |
| `Low Fuel` | 21 | 强制低油量 (设为 999 单位) |
| `High Flow` | 22 | 强制高燃油流速 (55 单位/秒) |

---

## 🚨 告警触发逻辑

### 传感器故障告警

| 故障情况 | 告警等级 | 告警信息 |
|:---|:---|:---|
| 单通道失效 | ⬜ 白色 | `L/R N1 SENS A/B FAULT` |
| 单发双通道全失效 | 🟨 琥珀色 | `L/R N1/EGT SENS FAIL (BOTH)` |
| 双发传感器全失效 | 🟥 红色 | `CRITICAL SENS FAIL` + 自动停车 |

### 超限故障告警

| 参数 | 琥珀色阈值 | 红色阈值 | 红色后果 |
|:---|:---|:---|:---|
| **N1 转速** | > 105% | > 120% | 自动停车 |
| **EGT (启动)** | > 850°C | > 1000°C | 自动停车 |
| **EGT (运行)** | > 950°C | > 1100°C | 自动停车 |
| **燃油流速** | > 50 | - | - |

### 燃油系统告警

| 条件 | 告警等级 | 告警信息 |
|:---|:---|:---|
| 燃油传感器失效 | 🟥 红色 | `FUEL SENSOR FAIL` |
| 燃油余量 < 1000 | 🟨 琥珀色 | `FUEL QTY LOW` |
| 燃油耗尽 | 🟥 红色 | `FUEL EXHAUSTED` + 双发停车 |

---

## 🔧 故障注入代码实现

```cpp
// 物理量的强制覆盖 (Logic.cpp)
if (e.state == ST_START || e.state == ST_RUN) {
    if (e.force_Spd_Lvl == 1) e.real_N = 43000.0;  // 107.5%
    if (e.force_Spd_Lvl == 2) e.real_N = 49000.0;  // 122.5%
    if (e.force_Temp_Lvl == 1) e.real_T = 960.0;   // 热启动
    if (e.force_Temp_Lvl == 2) e.real_T = 1150.0;  // 超温
}
```

---

## 🔄 故障重置机制

按下 **STOP** 按钮时，系统会：

```cpp
// 重置该发动机所有故障 (main.cpp)
plane.engines[id].sens_N1_A_Ok = true;
plane.engines[id].sens_N1_B_Ok = true;
plane.engines[id].sens_EGT_A_Ok = true;
plane.engines[id].sens_EGT_B_Ok = true;
plane.engines[id].force_Spd_Lvl = 0;
plane.engines[id].force_Temp_Lvl = 0;
```

同时，当发动机状态变为 `ST_OFF` 时，对应的故障按钮也会自动重置。

::: tip 单点故障容错
即使一个传感器通道失效，系统仍能通过备用通道维持正常运行，仅显示白色 STATUS 提示。
:::
