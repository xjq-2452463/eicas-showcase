---
layout: home

hero:
  name: "EICAS"
  text: "发动机指示与机组警告系统"
  tagline: 徐佳琪 2452463 同济大学 国豪书院高级语言程序设计(进阶)课程作业 - 2025年秋季
  image:
    src: /demo.png
    alt: EICAS 仿真系统运行截图
  actions:
    - theme: brand
      text: 📺 观看演示视频
      link: /overview#-功能演示-demo
    - theme: alt
      text: 📘 阅读文档
      link: /overview
    - theme: alt
      text: GitHub
      link: https://github.com/xjq-2452463/Virtual_engine_detection_module

features:
  - icon: 📈
    title: 高保真物理模型
    details: 基于航空热力学的非线性数学建模。使用对数函数拟合涡扇发动机启动曲线，实现转速、温度、燃油流速的真实惯性响应，支持 ±3% 高斯噪声模拟传感器抖动。
    link: /physics
    linkText: 查看物理模型 →
    
  - icon: ⚠️
    title: 14+ 故障注入模式
    details: 专业级故障测试面板，支持传感器断路、EGT超温、热启动(Hot Start)、N1超速、燃油泄漏等真实故障场景的实时注入与检测，完整复刻航电告警逻辑。
    link: /faults
    linkText: 了解故障系统 →
    
  - icon: 🛡️
    title: 双通道冗余设计
    details: 模拟真实航电 A/B 通道交叉比对机制。每个关键参数均由双传感器采集，实现信号容错、自动切换与多数表决算法，确保单点故障不影响系统运行。
    link: /physics#-传感器冗余算法
    linkText: 查看冗余逻辑 →
    
  - icon: 💾
    title: 飞行数据记录器
    details: 内置 FDR 黑匣子功能，以 200Hz 频率实时记录全周期参数至 CSV 文件。支持导入 Excel/MATLAB 进行飞行包线分析，故障事件自动写入 Error Log。
    link: /overview#4-数据黑匣子-data-logger
    linkText: 了解更多 →
    
  - icon: 🎨
    title: 拟物化仪表界面
    details: 标准航空仪表盘设计，0°~210° 扇形指示与数字读数。集成 START/RUN 状态灯、四色告警系统（白/琥珀/红/灰），视觉呈现专业航电风格。
    link: /manual
    linkText: 操作手册 →
    
  - icon: ⚡
    title: 实时交互控制
    details: 支持双发独立启动/停车、推力手柄实时调节。STOP 紧急按钮具有最高优先级，可强制切断燃油并重置故障状态，模拟真实驾驶舱操作逻辑。
    link: /manual#驾驶舱控制
    linkText: 查看控制指南 →
---

<style>
.poster-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 24px;
}

.section-title {
  text-align: center;
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #0066cc, #00aaff);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.section-subtitle {
  text-align: center;
  color: var(--vp-c-text-2);
  margin-bottom: 3rem;
  font-size: 1.1rem;
}

.poster-image {
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  transition: transform 0.4s ease, box-shadow 0.4s ease;
  width: 100%;
  max-width: 100%;
}

.poster-image:hover {
  transform: translateY(-8px);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.2);
}

.tech-stack {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 40px;
}

.tech-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  transition: all 0.3s ease;
}

.tech-item:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateX(4px);
}

.tech-icon {
  font-size: 1.5rem;
}

.tech-info h4 {
  margin: 0;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.tech-info p {
  margin: 4px 0 0;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}
</style>

<div class="poster-section">
  <h2 class="section-title">🛠️ 技术栈</h2>
  <p class="section-subtitle">构建高保真仿真系统的核心技术</p>
  
  <div class="tech-stack">
    <div class="tech-item">
      <span class="tech-icon">💻</span>
      <div class="tech-info">
        <h4>C++</h4>
        <p>Visual Studio 2022 开发环境</p>
      </div>
    </div>
    <div class="tech-item">
      <span class="tech-icon">🎨</span>
      <div class="tech-info">
        <h4>EasyX Graphics</h4>
        <p>基于 Windows GDI 的图形引擎</p>
      </div>
    </div>
    <div class="tech-item">
      <span class="tech-icon">📐</span>
      <div class="tech-info">
        <h4>数学建模</h4>
        <p>对数函数 / 高斯噪声 / 指数衰减</p>
      </div>
    </div>
    <div class="tech-item">
      <span class="tech-icon">🖱️</span>
      <div class="tech-info">
        <h4>交互系统</h4>
        <p>鼠标事件驱动 / 碰撞检测</p>
      </div>
    </div>
  </div>
</div>

<div class="poster-section">
  <h2 class="section-title">🖼️ 项目海报</h2>
  <p class="section-subtitle">一图了解 EICAS 仿真系统全貌</p>
  
  <img src="/poster.png" alt="EICAS 项目海报" class="poster-image" />
</div>
