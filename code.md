# 代码架构详解

<div class="hero-badge">
  <span class="badge badge-blue">C++</span>
  <span class="badge badge-green">EasyX</span>
  <span class="badge badge-amber">MVC 分离</span>
  <span class="badge badge-red">模块化</span>
</div>

<style>
.hero-badge {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin: 1rem 0 2rem;
}
.badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}
.badge-blue { background: linear-gradient(135deg, #0066cc, #0088ff); color: white; }
.badge-green { background: linear-gradient(135deg, #10b981, #34d399); color: white; }
.badge-amber { background: linear-gradient(135deg, #f59e0b, #fbbf24); color: white; }
.badge-red { background: linear-gradient(135deg, #ef4444, #f87171); color: white; }

.class-card {
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  padding: 20px;
  margin: 1rem 0;
  border-left: 4px solid var(--vp-c-brand-1);
}

.class-name {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  margin-bottom: 8px;
}

.class-desc {
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
  line-height: 1.7;
}

.module-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin: 2rem 0;
}

.module-card {
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid var(--vp-c-divider);
  transition: all 0.3s ease;
}

.module-card:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-4px);
}

.module-title {
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-bottom: 8px;
  font-family: monospace;
}

.module-desc {
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
  line-height: 1.6;
}
</style>

本项目采用 **MVC 架构分离**，确保代码的可维护性与可扩展性。

---

## 🏗️ 项目文件结构

<div class="module-grid">
  <div class="module-card">
    <div class="module-title">📁 main.cpp</div>
    <div class="module-desc">主控制器：程序入口、主循环、高精度计时器 (5ms/tick)、鼠标事件处理、故障按钮管理</div>
  </div>
  <div class="module-card">
    <div class="module-title">📁 Logic.cpp</div>
    <div class="module-desc">逻辑层：Engine 物理模型、Aircraft 状态机、传感器数据融合、告警判定、数据记录</div>
  </div>
  <div class="module-card">
    <div class="module-title">📁 UI.cpp</div>
    <div class="module-desc">视图层：仪表盘绘制 (drawGauge)、引擎面板、错误日志显示、按钮渲染</div>
  </div>
  <div class="module-card">
    <div class="module-title">📁 Common.h</div>
    <div class="module-desc">公共定义：窗口常量、颜色宏、枚举类型 (EngState, AlertLevel)、结构体声明</div>
  </div>
</div>

---

## 📦 核心数据结构

### Engine 结构体

<div class="class-card">
  <div class="class-name">struct Engine</div>
  <div class="class-desc">封装单台发动机的所有状态参数，包含物理真值、传感器读数、故障标志和显示值。</div>
</div>

```cpp
struct Engine {
    EngState state;           // 状态: ST_OFF, ST_START, ST_RUN, ST_STOP
    double timer;             // 阶段计时器
    double thrustModifier;    // 推力修正值

    // 物理真值
    double real_N, real_T, real_Flow;

    // 推力调整累计系数
    double thrustN_Factor;
    double thrustT_Factor;

    // 传感器原始读数（带噪声/故障）
    double sens_N_A_Val, sens_N_B_Val;
    double sens_T_A_Val, sens_T_B_Val;

    // 传感器开关与故障注入
    bool sens_N1_A_Ok, sens_N1_B_Ok, sens_EGT_A_Ok, sens_EGT_B_Ok;
    int force_Spd_Lvl, force_Temp_Lvl;  // 0=正常, 1=轻度, 2=严重

    // 最终显示值
    double disp_N1, disp_T;
    bool valid_N, valid_T;

    // 各通道独立显示值（用于仪表盘）
    double disp_N1_A, disp_N1_B;
    double disp_T_A, disp_T_B;

    // 启动/停止时的初始值记录
    double start_stop_N, start_stop_T;
};
```

### Aircraft 结构体

<div class="class-card">
  <div class="class-name">struct Aircraft</div>
  <div class="class-desc">顶层控制器，管理双发动机、燃油系统、告警日志和数据记录器。</div>
</div>

```cpp
struct Aircraft {
    Engine engines[2];        // 左右发动机
    double fuel_Qty;          // 燃油余量 (初始 20000)
    double globalTime;        // 全局运行时间

    bool fuel_Sens_Ok;        // 燃油传感器状态
    bool force_HighFlow;      // 强制高流速故障

    deque<LogEntry> displayLog;  // 显示日志队列
    ofstream errorFile;          // 错误日志文件
    DataLogger dataLogger;       // CSV 数据记录器

    void update(double dt);      // 主更新函数
    void checkSystemChanges();   // 告警检测
    void startEng(int id);
    void stopEng(int id);
    void incThr(int id);
    void decThr(int id);
};
```

### 枚举类型

```cpp
enum EngState { ST_OFF, ST_START, ST_RUN, ST_STOP };
enum AlertLevel { LVL_NONE = 0, LVL_WHITE = 1, LVL_AMBER = 2, LVL_RED = 3 };
```

---

## 🔧 关键算法实现

### 传感器数据融合

系统实现了**多数表决**与**平均值计算**的冗余逻辑：

```cpp
// 计算平均显示值 (Logic.cpp)
double sumN = 0; int cntN = 0;
if (e.sens_N1_A_Ok) { sumN += e.sens_N_A_Val; cntN++; }
if (e.sens_N1_B_Ok) { sumN += e.sens_N_B_Val; cntN++; }
e.disp_N1 = (cntN > 0) ? (sumN / cntN / RATED_N) * 100.0 : 0;
e.valid_N = (cntN > 0);

double sumT = 0; int cntT = 0;
if (e.sens_EGT_A_Ok) { sumT += e.sens_T_A_Val; cntT++; }
if (e.sens_EGT_B_Ok) { sumT += e.sens_T_B_Val; cntT++; }
e.disp_T = (cntT > 0) ? sumT / cntT : 0;
e.valid_T = (cntT > 0);
```

### 启动阶段物理模型

```cpp
if (e.state == ST_START) {
    e.timer += dt;
    double t = e.timer;
    
    if (t < 2.0) {
        // Phase A: 线性建立期
        e.real_Flow = 5.0 * t;
        e.real_N = 10000.0 * t;
        e.real_T = T0 + T0 * (rand() % 31) / 1000.0;
    } else {
        // Phase B: 对数爬升期
        e.real_Flow = 42.0 * log10(t - 1) + 10;
        e.real_N = 23000.0 * log10(t - 1) + 20000;
        e.real_T = 900.0 * log10(t - 1) + T0;
    }
    
    // 达到 95% 切换到运行状态
    if ((e.real_N / RATED_N) * 100 >= 95.0) 
        e.state = ST_RUN;
}
```

### 稳态运行与推力响应

```cpp
if (e.state == ST_RUN) {
    double baseFlow = 23.0 + e.thrustModifier;
    if (force_HighFlow) baseFlow = 55.0;

    double baseN = 38000.0;
    double baseT = 620.0;

    // 应用推力调整累计系数
    double tgtN = baseN * e.thrustN_Factor;
    double tgtT = baseT * e.thrustT_Factor;

    // ±3% 的随机波动
    double mag = (rand() % 61 - 30) / 1000.0;
    e.real_N = tgtN * (1.0 + mag);
    e.real_T = tgtT * (1.0 + mag);
    e.real_Flow = baseFlow * (1.0 + mag);
}
```

### 停车对数衰减

```cpp
if (e.state == ST_STOP) {
    e.timer += dt;
    e.real_Flow = 0;

    // 对数衰减，9秒内归零
    double decay = log(e.timer + 1.0) / log(4.0);
    if (decay > 1.0) decay = 1.0;

    e.real_N = e.start_stop_N * (1.0 - decay);
    e.real_T = (e.start_stop_T - T0) * (1.0 - decay) + T0;

    if (e.timer >= 9.0 || e.real_N < 50) {
        e.state = ST_OFF;
        e.reset();
    }
}
```

### 推力调节实现

```cpp
void Aircraft::incThr(int id) {
    if (engines[id].state == ST_RUN) {
        engines[id].thrustModifier++;  // 燃油流速+1
        // N和T在3%~5%范围内随机增加
        double randN = 0.03 + (rand() % 21) / 1000.0;
        double randT = 0.03 + (rand() % 21) / 1000.0;
        engines[id].thrustN_Factor *= (1.0 + randN);
        engines[id].thrustT_Factor *= (1.0 + randT);
    }
}
```

---

## 🎨 界面绘制

### 仪表盘绘制 (drawGauge)

```cpp
void drawGauge(int x, int y, int r, double val, double maxVal, 
               LPCTSTR title, bool valid, AlertLevel lvl) {
    COLORREF c = C_NORM;
    if (!valid) c = C_INVALID;
    else if (lvl == LVL_AMBER) c = C_AMBER;
    else if (lvl == LVL_RED) c = C_RED;

    // 角度范围: 195° (起始) 到 -15° (终止)，共210°
    double startDeg = 195.0;
    double endDeg = -15.0;
    
    // 绘制背景弧线
    arc(x - r, y - r, x + r, y + r, radEnd, radStart);
    
    // 绘制动态数值弧线
    if (valid && val / maxVal > 0.01) {
        double ratio = val / maxVal;
        double currentDeg = startDeg - (ratio * 210.0);
        arc(x - r, y - r, x + r, y + r, currentRad, radStart);
    }
}
```

---

## ⏱️ 主循环与计时

```cpp
// 高精度计时器 (main.cpp)
LARGE_INTEGER freq, lastTime, currTime;
QueryPerformanceFrequency(&freq);
QueryPerformanceCounter(&lastTime);

const double FIXED_DT = 0.005;  // 固定5ms时间步长
double accumulator = 0.0;

while (true) {
    QueryPerformanceCounter(&currTime);
    double frameTime = (double)(currTime.QuadPart - lastTime.QuadPart) / freq.QuadPart;
    lastTime = currTime;
    
    accumulator += frameTime;
    while (accumulator >= FIXED_DT) {
        plane.update(FIXED_DT);
        accumulator -= FIXED_DT;
    }
    
    // 渲染...
    Sleep(5);
}
```

::: tip 架构优势
- **固定时间步长**：使用累加器确保物理计算稳定
- **逻辑/视图分离**：Logic.cpp 与 UI.cpp 完全解耦
- **数据双记录**：CSV 飞行数据 + TXT 错误日志
:::
